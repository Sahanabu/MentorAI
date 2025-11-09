from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import os
from datetime import datetime

from services.prediction_service import PredictionService
from utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

# Initialize prediction service
prediction_service = PredictionService()

@router.get("/info")
async def get_models_info():
    """Get information about available models"""
    try:
        models_info = {
            "subject_predictor": {
                "name": "Subject Performance Predictor",
                "version": "1.0",
                "description": "Predicts individual subject performance based on attendance, internals, assignments, and behavior",
                "features": [
                    "attendance_percentage",
                    "best_of_two_internals", 
                    "assignment_marks",
                    "behavior_score"
                ],
                "output": "predicted_score, confidence, risk_level"
            },
            "sgpa_predictor": {
                "name": "Semester SGPA Predictor", 
                "version": "1.0",
                "description": "Predicts semester SGPA based on subject predictions, backlogs, and attendance",
                "features": [
                    "mean_subject_prediction",
                    "active_backlog_count",
                    "previous_sgpa",
                    "attendance_average"
                ],
                "output": "predicted_sgpa, confidence, risk_level"
            }
        }
        
        return {
            "success": True,
            "models": models_info,
            "total_models": len(models_info)
        }
        
    except Exception as e:
        logger.error(f"Failed to get models info: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/performance")
async def get_model_performance():
    """Get model performance metrics"""
    try:
        # Mock performance metrics for demo
        performance_metrics = {
            "subject_predictor": {
                "accuracy": 0.87,
                "precision": 0.85,
                "recall": 0.89,
                "f1_score": 0.87,
                "rmse": 8.2,
                "r2_score": 0.78,
                "last_trained": "2024-01-15T10:30:00Z",
                "training_samples": 5000
            },
            "sgpa_predictor": {
                "accuracy": 0.82,
                "precision": 0.80,
                "recall": 0.84,
                "f1_score": 0.82,
                "rmse": 0.65,
                "r2_score": 0.73,
                "last_trained": "2024-01-15T10:30:00Z",
                "training_samples": 3000
            }
        }
        
        return {
            "success": True,
            "performance": performance_metrics,
            "evaluation_date": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get model performance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feature-importance/{model_name}")
async def get_feature_importance(model_name: str):
    """Get feature importance for a specific model"""
    try:
        if model_name == "subject_predictor":
            importance = prediction_service.subject_predictor.get_feature_importance()
        elif model_name == "sgpa_predictor":
            # Mock feature importance for SGPA predictor
            importance = {
                "mean_subject_prediction": 0.45,
                "active_backlog_count": 0.25,
                "previous_sgpa": 0.20,
                "attendance_average": 0.10
            }
        else:
            raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")
        
        # Sort by importance
        sorted_importance = dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
        
        return {
            "success": True,
            "model_name": model_name,
            "feature_importance": sorted_importance,
            "total_features": len(sorted_importance)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get feature importance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/retrain/{model_name}")
async def retrain_model(model_name: str, training_config: Dict[str, Any] = None):
    """Retrain a specific model (placeholder for future implementation)"""
    try:
        # This would be implemented in production to retrain models
        # with new data
        
        if model_name not in ["subject_predictor", "sgpa_predictor"]:
            raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")
        
        # Mock retraining response
        return {
            "success": True,
            "message": f"Model '{model_name}' retraining initiated",
            "model_name": model_name,
            "training_started": datetime.utcnow().isoformat(),
            "estimated_completion": "30 minutes",
            "status": "in_progress"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to retrain model: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_models_status():
    """Get current status of all models"""
    try:
        status = {
            "subject_predictor": {
                "status": "ready",
                "loaded": True,
                "last_prediction": datetime.utcnow().isoformat(),
                "total_predictions": 1250,
                "average_response_time": "120ms"
            },
            "sgpa_predictor": {
                "status": "ready", 
                "loaded": True,
                "last_prediction": datetime.utcnow().isoformat(),
                "total_predictions": 890,
                "average_response_time": "95ms"
            }
        }
        
        return {
            "success": True,
            "models_status": status,
            "system_status": "healthy",
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get models status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/config/{model_name}")
async def get_model_config(model_name: str):
    """Get configuration for a specific model"""
    try:
        if model_name == "subject_predictor":
            config = {
                "model_type": "RandomForestRegressor",
                "n_estimators": 100,
                "max_depth": 10,
                "random_state": 42,
                "features": [
                    "attendance_percentage",
                    "best_of_two_internals",
                    "assignment_marks", 
                    "behavior_score"
                ],
                "target": "final_marks",
                "preprocessing": {
                    "scaler": "StandardScaler",
                    "feature_selection": None
                }
            }
        elif model_name == "sgpa_predictor":
            config = {
                "model_type": "GradientBoostingRegressor",
                "n_estimators": 100,
                "learning_rate": 0.1,
                "max_depth": 6,
                "random_state": 42,
                "features": [
                    "mean_subject_prediction",
                    "active_backlog_count",
                    "previous_sgpa",
                    "attendance_average"
                ],
                "target": "sgpa",
                "preprocessing": {
                    "scaler": "StandardScaler",
                    "feature_selection": None
                }
            }
        else:
            raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")
        
        return {
            "success": True,
            "model_name": model_name,
            "configuration": config
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get model config: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))