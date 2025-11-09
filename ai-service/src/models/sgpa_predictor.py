import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os
from typing import Dict, List, Tuple, Optional
from .base_model import BaseModel

class SGPAPredictor(BaseModel):
    """
    Semester SGPA Predictor (Model O)
    Predicts semester SGPA based on:
    - Mean subject prediction scores
    - Active backlog count
    - Previous semester SGPA
    - Average attendance across subjects
    """
    
    def __init__(self, model_path: Optional[str] = None):
        super().__init__("sgpa_predictor", model_path)
        self.model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.feature_names = [
            'mean_subject_prediction',
            'active_backlog_count',
            'previous_sgpa',
            'attendance_average'
        ]
        
    def prepare_features(self, data: Dict) -> np.ndarray:
        """Prepare features for prediction"""
        features = []
        for feature_name in self.feature_names:
            if feature_name not in data:
                # Handle missing features with defaults
                if feature_name == 'previous_sgpa':
                    features.append(7.0)  # Default SGPA
                elif feature_name == 'active_backlog_count':
                    features.append(0)
                else:
                    raise ValueError(f"Missing required feature: {feature_name}")
            else:
                features.append(data[feature_name])
        
        return np.array(features).reshape(1, -1)
    
    def train(self, training_data: pd.DataFrame) -> Dict:
        """Train the SGPA predictor model"""
        try:
            # Prepare features and target
            X = training_data[self.feature_names]
            y = training_data['sgpa']  # Target variable
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train model
            self.model.fit(X_train_scaled, y_train)
            
            # Evaluate
            train_pred = self.model.predict(X_train_scaled)
            test_pred = self.model.predict(X_test_scaled)
            
            metrics = {
                'train_rmse': np.sqrt(mean_squared_error(y_train, train_pred)),
                'test_rmse': np.sqrt(mean_squared_error(y_test, test_pred)),
                'train_r2': r2_score(y_train, train_pred),
                'test_r2': r2_score(y_test, test_pred),
                'feature_importance': dict(zip(
                    self.feature_names,
                    self.model.feature_importances_
                ))
            }
            
            self.is_trained = True
            return metrics
            
        except Exception as e:
            raise Exception(f"Training failed: {str(e)}")
    
    def predict(self, features: Dict) -> Dict:
        """Make prediction for semester SGPA"""
        if not self.is_trained:
            raise Exception("Model not trained. Please train the model first.")
        
        try:
            # Prepare features
            X = self.prepare_features(features)
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            predicted_sgpa = self.model.predict(X_scaled)[0]
            
            # Clamp SGPA to valid range (0-10)
            predicted_sgpa = max(0.0, min(10.0, predicted_sgpa))
            
            # Calculate confidence based on feature values
            confidence = self._calculate_confidence(features, predicted_sgpa)
            
            # Determine risk level
            risk_level = self._determine_risk_level(predicted_sgpa, features)
            
            return {
                'predicted_sgpa': round(predicted_sgpa, 2),
                'confidence': round(confidence, 3),
                'risk_level': risk_level,
                'model_version': self.version
            }
            
        except Exception as e:
            raise Exception(f"Prediction failed: {str(e)}")
    
    def batch_predict(self, features_list: List[Dict]) -> List[Dict]:
        """Make batch predictions"""
        predictions = []
        for features in features_list:
            try:
                prediction = self.predict(features)
                predictions.append({
                    'success': True,
                    'prediction': prediction
                })
            except Exception as e:
                predictions.append({
                    'success': False,
                    'error': str(e)
                })
        
        return predictions
    
    def _calculate_confidence(self, features: Dict, predicted_sgpa: float) -> float:
        """Calculate prediction confidence based on feature quality"""
        confidence = 1.0
        
        # Reduce confidence for extreme predictions
        if predicted_sgpa < 4.0 or predicted_sgpa > 9.5:
            confidence *= 0.8
        
        # Reduce confidence for high backlog count
        backlog_count = features.get('active_backlog_count', 0)
        if backlog_count > 3:
            confidence *= 0.7
        
        # Reduce confidence for low attendance
        attendance = features.get('attendance_average', 100)
        if attendance < 70:
            confidence *= 0.8
        
        # Reduce confidence if no previous SGPA available
        if 'previous_sgpa' not in features or features['previous_sgpa'] is None:
            confidence *= 0.9
        
        return max(0.1, confidence)
    
    def _determine_risk_level(self, predicted_sgpa: float, features: Dict) -> str:
        """Determine risk level based on predicted SGPA and features"""
        backlog_count = features.get('active_backlog_count', 0)
        attendance = features.get('attendance_average', 100)
        
        # High risk conditions
        if predicted_sgpa < 6.0 or backlog_count > 2 or attendance < 70:
            return 'AT_RISK'
        
        # Medium risk conditions
        if predicted_sgpa < 7.5 or backlog_count > 0 or attendance < 80:
            return 'NEEDS_ATTENTION'
        
        # Low risk
        return 'SAFE'
    
    def get_feature_importance(self) -> Dict:
        """Get feature importance scores"""
        if not self.is_trained:
            raise Exception("Model not trained")
        
        return dict(zip(self.feature_names, self.model.feature_importances_))
    
    def save_model(self, path: str = None) -> str:
        """Save the trained model"""
        if not self.is_trained:
            raise Exception("No trained model to save")
        
        if path is None:
            path = os.path.join(self.model_path, f"{self.model_name}_v{self.version}.pkl")
        
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'version': self.version,
            'is_trained': self.is_trained
        }
        
        joblib.dump(model_data, path)
        return path
    
    def load_model(self, path: str = None) -> bool:
        """Load a trained model"""
        if path is None:
            path = os.path.join(self.model_path, f"{self.model_name}_v{self.version}.pkl")
        
        if not os.path.exists(path):
            return False
        
        try:
            model_data = joblib.load(path)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            self.version = model_data['version']
            self.is_trained = model_data['is_trained']
            return True
        except Exception as e:
            print(f"Failed to load model: {str(e)}")
            return False