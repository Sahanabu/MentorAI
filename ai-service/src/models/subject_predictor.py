import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os
from typing import Dict, List, Tuple, Optional
from .base_model import BaseModel

class SubjectPredictor(BaseModel):
    """
    Subject Performance Predictor (Model S)
    Predicts individual subject performance based on:
    - Attendance percentage
    - Best of two internals
    - Assignment marks
    - Behavior score
    """
    
    def __init__(self, model_path: Optional[str] = None):
        super().__init__("subject_predictor", model_path)
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.scaler = StandardScaler()
        self.feature_names = [
            'attendance_percentage',
            'best_of_two_internals',
            'assignment_marks',
            'behavior_score'
        ]
        
    def prepare_features(self, data: Dict) -> np.ndarray:
        """Prepare features for prediction"""
        features = []
        for feature_name in self.feature_names:
            if feature_name not in data:
                raise ValueError(f"Missing feature: {feature_name}")
            features.append(data[feature_name])
        
        return np.array(features).reshape(1, -1)
    
    def train(self, training_data: pd.DataFrame) -> Dict:
        """Train the subject predictor model"""
        try:
            # Prepare features and target
            X = training_data[self.feature_names]
            y = training_data['final_marks']  # Target variable
            
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
        """Make prediction for subject performance"""
        if not self.is_trained:
            raise Exception("Model not trained. Please train the model first.")
        
        try:
            # Prepare features
            X = self.prepare_features(features)
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            predicted_score = self.model.predict(X_scaled)[0]
            
            # Calculate confidence (based on prediction variance)
            # For RandomForest, we can use the standard deviation of tree predictions
            tree_predictions = np.array([
                tree.predict(X_scaled)[0] for tree in self.model.estimators_
            ])
            confidence = 1.0 - (np.std(tree_predictions) / 100.0)  # Normalize to 0-1
            confidence = max(0.0, min(1.0, confidence))  # Clamp to [0,1]
            
            # Determine risk level
            risk_level = self._determine_risk_level(predicted_score, features)
            
            return {
                'predicted_score': round(predicted_score, 2),
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
    
    def _determine_risk_level(self, predicted_score: float, features: Dict) -> str:
        """Determine risk level based on predicted score and features"""
        # Risk thresholds
        if predicted_score >= 70 and features.get('attendance_percentage', 0) >= 80:
            return 'SAFE'
        elif predicted_score >= 50 and features.get('attendance_percentage', 0) >= 70:
            return 'NEEDS_ATTENTION'
        else:
            return 'AT_RISK'
    
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