import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, mean_squared_error
import joblib
import os

class EnhancedMLModels:
    def __init__(self):
        self.risk_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.performance_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def generate_training_data(self, n_samples=1000):
        """Generate comprehensive training data for all scenarios"""
        np.random.seed(42)
        
        # Generate diverse student profiles
        data = []
        for i in range(n_samples):
            # Basic features
            attendance = np.random.normal(80, 15)
            attendance = np.clip(attendance, 0, 100)
            
            internal_marks = np.random.normal(16, 4)
            internal_marks = np.clip(internal_marks, 0, 20)
            
            assignment_marks = np.random.normal(15, 3)
            assignment_marks = np.clip(assignment_marks, 0, 20)
            
            behavior_score = np.random.normal(8, 1.5)
            behavior_score = np.clip(behavior_score, 1, 10)
            
            previous_cgpa = np.random.normal(7.5, 1.2)
            previous_cgpa = np.clip(previous_cgpa, 4.0, 10.0)
            
            backlog_count = np.random.poisson(0.3)
            backlog_count = min(backlog_count, 5)
            
            semester = np.random.choice([5, 6, 7, 8])
            
            # Advanced features
            study_hours = np.random.normal(6, 2)
            study_hours = np.clip(study_hours, 1, 12)
            
            family_income = np.random.choice([1, 2, 3, 4, 5])  # 1=Low, 5=High
            
            extracurricular = np.random.choice([0, 1], p=[0.6, 0.4])
            
            # Calculate derived features
            attendance_trend = attendance + np.random.normal(0, 5)
            performance_consistency = 1 - (np.std([internal_marks, assignment_marks]) / 20)
            
            # Calculate target variables
            # Risk level based on multiple factors
            risk_score = (
                (100 - attendance) * 0.3 +
                (20 - internal_marks) * 0.25 +
                (20 - assignment_marks) * 0.2 +
                backlog_count * 10 +
                (10 - behavior_score) * 5 +
                (10 - previous_cgpa) * 3
            )
            
            if risk_score < 20:
                risk_level = 0  # SAFE
            elif risk_score < 40:
                risk_level = 1  # NEEDS_ATTENTION
            else:
                risk_level = 2  # AT_RISK
                
            # Performance prediction
            performance_score = (
                attendance * 0.3 +
                internal_marks * 2.5 +
                assignment_marks * 2.5 +
                behavior_score * 5 +
                previous_cgpa * 5 +
                study_hours * 2 -
                backlog_count * 5 +
                family_income * 2 +
                extracurricular * 5
            )
            performance_score = np.clip(performance_score, 0, 100)
            
            data.append({
                'attendance': attendance,
                'internal_marks': internal_marks,
                'assignment_marks': assignment_marks,
                'behavior_score': behavior_score,
                'previous_cgpa': previous_cgpa,
                'backlog_count': backlog_count,
                'semester': semester,
                'study_hours': study_hours,
                'family_income': family_income,
                'extracurricular': extracurricular,
                'attendance_trend': attendance_trend,
                'performance_consistency': performance_consistency,
                'risk_level': risk_level,
                'performance_score': performance_score
            })
            
        return pd.DataFrame(data)
    
    def train_models(self):
        """Train all ML models with comprehensive data"""
        print("Generating training data...")
        df = self.generate_training_data(2000)
        
        # Prepare features
        feature_columns = [
            'attendance', 'internal_marks', 'assignment_marks', 'behavior_score',
            'previous_cgpa', 'backlog_count', 'semester', 'study_hours',
            'family_income', 'extracurricular', 'attendance_trend', 'performance_consistency'
        ]
        
        X = df[feature_columns]
        y_risk = df['risk_level']
        y_performance = df['performance_score']
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_risk_train, y_risk_test = train_test_split(
            X_scaled, y_risk, test_size=0.2, random_state=42
        )
        _, _, y_perf_train, y_perf_test = train_test_split(
            X_scaled, y_performance, test_size=0.2, random_state=42
        )
        
        # Train risk model
        print("Training risk assessment model...")
        self.risk_model.fit(X_train, y_risk_train)
        risk_accuracy = accuracy_score(y_risk_test, self.risk_model.predict(X_test))
        print(f"Risk model accuracy: {risk_accuracy:.3f}")
        
        # Train performance model
        print("Training performance prediction model...")
        self.performance_model.fit(X_train, y_perf_train)
        perf_mse = mean_squared_error(y_perf_test, self.performance_model.predict(X_test))
        print(f"Performance model MSE: {perf_mse:.3f}")
        
        self.is_trained = True
        self.save_models()
        
    def save_models(self):
        """Save trained models"""
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.risk_model, 'models/risk_model.pkl')
        joblib.dump(self.performance_model, 'models/performance_model.pkl')
        joblib.dump(self.scaler, 'models/scaler.pkl')
        print("Models saved successfully!")
        
    def load_models(self):
        """Load pre-trained models"""
        try:
            self.risk_model = joblib.load('models/risk_model.pkl')
            self.performance_model = joblib.load('models/performance_model.pkl')
            self.scaler = joblib.load('models/scaler.pkl')
            self.is_trained = True
            print("Models loaded successfully!")
        except FileNotFoundError:
            print("No pre-trained models found. Training new models...")
            self.train_models()
            
    def predict_risk(self, features):
        """Predict student risk level"""
        if not self.is_trained:
            self.load_models()
            
        features_scaled = self.scaler.transform([features])
        risk_prob = self.risk_model.predict_proba(features_scaled)[0]
        risk_level = self.risk_model.predict(features_scaled)[0]
        
        risk_labels = ['SAFE', 'NEEDS_ATTENTION', 'AT_RISK']
        
        return {
            'risk_level': risk_labels[risk_level],
            'confidence': float(max(risk_prob)),
            'probabilities': {
                'SAFE': float(risk_prob[0]),
                'NEEDS_ATTENTION': float(risk_prob[1]),
                'AT_RISK': float(risk_prob[2])
            }
        }
        
    def predict_performance(self, features):
        """Predict student performance score"""
        if not self.is_trained:
            self.load_models()
            
        features_scaled = self.scaler.transform([features])
        performance_score = self.performance_model.predict(features_scaled)[0]
        
        return {
            'predicted_score': float(performance_score),
            'predicted_grade': self._score_to_grade(performance_score),
            'confidence': 0.85  # Model confidence
        }
        
    def _score_to_grade(self, score):
        """Convert score to grade"""
        if score >= 90: return 'A+'
        elif score >= 80: return 'A'
        elif score >= 70: return 'B+'
        elif score >= 60: return 'B'
        elif score >= 50: return 'C'
        else: return 'F'
        
    def get_feature_importance(self):
        """Get feature importance for model explainability"""
        if not self.is_trained:
            self.load_models()
            
        feature_names = [
            'attendance', 'internal_marks', 'assignment_marks', 'behavior_score',
            'previous_cgpa', 'backlog_count', 'semester', 'study_hours',
            'family_income', 'extracurricular', 'attendance_trend', 'performance_consistency'
        ]
        
        risk_importance = dict(zip(feature_names, self.risk_model.feature_importances_))
        perf_importance = dict(zip(feature_names, self.performance_model.feature_importances_))
        
        return {
            'risk_model': risk_importance,
            'performance_model': perf_importance
        }

# Initialize global model instance
ml_models = EnhancedMLModels()