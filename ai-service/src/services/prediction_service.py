from typing import Dict, List, Any
import numpy as np
from models.subject_predictor import SubjectPredictor
from models.sgpa_predictor import SGPAPredictor
from utils.logger import get_logger

logger = get_logger(__name__)

class PredictionService:
    """Service class for handling ML predictions"""
    
    def __init__(self):
        self.subject_predictor = SubjectPredictor()
        self.sgpa_predictor = SGPAPredictor()
        self._load_models()
    
    def _load_models(self):
        """Load pre-trained models"""
        try:
            # Try to load existing models
            subject_loaded = self.subject_predictor.load_model()
            sgpa_loaded = self.sgpa_predictor.load_model()
            
            if not subject_loaded:
                logger.warning("Subject predictor model not found, using default model")
                # Initialize with default parameters for demo
                self._initialize_demo_models()
            
            if not sgpa_loaded:
                logger.warning("SGPA predictor model not found, using default model")
                
            logger.info("Prediction models loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load models: {str(e)}")
            self._initialize_demo_models()
    
    def _initialize_demo_models(self):
        """Initialize demo models for development"""
        try:
            # Create dummy training data for demo
            import pandas as pd
            
            # Demo data for subject predictor
            demo_data = pd.DataFrame({
                'attendance_percentage': np.random.uniform(60, 95, 100),
                'best_of_two_internals': np.random.uniform(15, 25, 100),
                'assignment_marks': np.random.uniform(12, 20, 100),
                'behavior_score': np.random.uniform(6, 10, 100),
                'final_marks': np.random.uniform(50, 90, 100)
            })
            
            # Train demo model
            self.subject_predictor.train(demo_data)
            logger.info("Demo subject predictor model initialized")
            
        except Exception as e:
            logger.error(f"Failed to initialize demo models: {str(e)}")
    
    def predict_subject_performance(self, request_data: Dict) -> Dict:
        """Predict individual subject performance"""
        try:
            features = request_data['features']
            student_id = request_data['student_id']
            
            logger.info(f"Predicting subject performance for student: {student_id}")
            
            # Make prediction
            prediction = self.subject_predictor.predict(features)
            
            logger.info(f"Subject prediction completed for student: {student_id}")
            return prediction
            
        except Exception as e:
            logger.error(f"Subject prediction failed: {str(e)}")
            raise Exception(f"Subject prediction failed: {str(e)}")
    
    def predict_semester_sgpa(self, request_data: Dict) -> Dict:
        """Predict semester SGPA"""
        try:
            features = request_data['features']
            student_id = request_data['student_id']
            semester = request_data['semester']
            
            logger.info(f"Predicting SGPA for student: {student_id}, semester: {semester}")
            
            # For demo purposes, create a simple SGPA prediction
            # In production, this would use the trained SGPA predictor
            predicted_sgpa = self._demo_sgpa_prediction(features)
            
            result = {
                'predicted_sgpa': predicted_sgpa,
                'confidence': 0.85,
                'risk_level': self._determine_sgpa_risk(predicted_sgpa),
                'model_version': '1.0'
            }
            
            logger.info(f"SGPA prediction completed for student: {student_id}")
            return result
            
        except Exception as e:
            logger.error(f"SGPA prediction failed: {str(e)}")
            raise Exception(f"SGPA prediction failed: {str(e)}")
    
    def _demo_sgpa_prediction(self, features: Dict) -> float:
        """Demo SGPA prediction logic"""
        # Simple rule-based prediction for demo
        mean_prediction = features.get('mean_subject_prediction', 70)
        backlog_count = features.get('active_backlog_count', 0)
        attendance_avg = features.get('attendance_average', 80)
        previous_sgpa = features.get('previous_sgpa', 7.0)
        
        # Convert percentage to SGPA scale
        base_sgpa = (mean_prediction / 100) * 10
        
        # Apply penalties and bonuses
        if backlog_count > 0:
            base_sgpa -= (backlog_count * 0.5)
        
        if attendance_avg < 75:
            base_sgpa -= 0.5
        elif attendance_avg > 90:
            base_sgpa += 0.2
        
        # Consider previous performance
        if previous_sgpa:
            base_sgpa = (base_sgpa * 0.7) + (previous_sgpa * 0.3)
        
        # Clamp to valid range
        return max(0.0, min(10.0, round(base_sgpa, 2)))
    
    def _determine_sgpa_risk(self, predicted_sgpa: float) -> str:
        """Determine risk level based on predicted SGPA"""
        if predicted_sgpa >= 7.5:
            return 'SAFE'
        elif predicted_sgpa >= 6.0:
            return 'NEEDS_ATTENTION'
        else:
            return 'AT_RISK'
    
    def batch_predict(self, students: List[Dict], prediction_type: str) -> List[Dict]:
        """Perform batch predictions"""
        results = []
        
        for student_data in students:
            try:
                if prediction_type == 'SUBJECT':
                    prediction = self.predict_subject_performance(student_data)
                elif prediction_type == 'SEMESTER':
                    prediction = self.predict_semester_sgpa(student_data)
                else:
                    raise ValueError(f"Invalid prediction type: {prediction_type}")
                
                results.append({
                    'student_id': student_data['student_id'],
                    'success': True,
                    'prediction': prediction
                })
                
            except Exception as e:
                results.append({
                    'student_id': student_data['student_id'],
                    'success': False,
                    'error': str(e)
                })
        
        return results
    
    def explain_prediction(self, prediction_id: str) -> Dict:
        """Generate explanation for a prediction using SHAP"""
        try:
            # For demo purposes, return mock explanation
            # In production, this would use SHAP to explain the prediction
            
            explanation = {
                'prediction_id': prediction_id,
                'top_features': [
                    {
                        'feature': 'attendance_percentage',
                        'impact': 0.35,
                        'description': 'Attendance has the highest impact on performance prediction'
                    },
                    {
                        'feature': 'best_of_two_internals',
                        'impact': 0.28,
                        'description': 'Internal assessment scores strongly indicate final performance'
                    },
                    {
                        'feature': 'assignment_marks',
                        'impact': 0.22,
                        'description': 'Assignment performance reflects understanding and effort'
                    },
                    {
                        'feature': 'behavior_score',
                        'impact': 0.15,
                        'description': 'Classroom behavior and participation contribute to success'
                    }
                ],
                'explanation_method': 'SHAP'
            }
            
            return explanation
            
        except Exception as e:
            logger.error(f"Explanation generation failed: {str(e)}")
            raise Exception(f"Explanation generation failed: {str(e)}")
    
    def get_risk_analysis(self, student_id: str) -> Dict:
        """Get comprehensive risk analysis for a student"""
        try:
            # Mock risk analysis for demo
            analysis = {
                'student_id': student_id,
                'overall_risk': 'NEEDS_ATTENTION',
                'risk_factors': [
                    {
                        'factor': 'Low Attendance',
                        'severity': 'HIGH',
                        'description': 'Attendance below 75% threshold'
                    },
                    {
                        'factor': 'Declining Performance',
                        'severity': 'MEDIUM',
                        'description': 'Performance trend showing decline over last 2 assessments'
                    }
                ],
                'recommendations': [
                    'Schedule immediate mentor meeting',
                    'Implement attendance improvement plan',
                    'Provide additional academic support'
                ],
                'predicted_outcomes': {
                    'pass_probability': 0.65,
                    'expected_grade': 'C',
                    'improvement_potential': 'HIGH'
                }
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Risk analysis failed: {str(e)}")
            raise Exception(f"Risk analysis failed: {str(e)}")