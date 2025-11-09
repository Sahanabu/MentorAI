from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
from ..models.enhanced_models import ml_models

router = APIRouter()

class StudentFeatures(BaseModel):
    attendance: float
    internal_marks: float
    assignment_marks: float
    behavior_score: float
    previous_cgpa: float
    backlog_count: int
    semester: int
    study_hours: float = 6.0
    family_income: int = 3
    extracurricular: int = 0

class BatchPredictionRequest(BaseModel):
    students: List[Dict[str, Any]]

@router.post("/predict/comprehensive")
async def predict_comprehensive(features: StudentFeatures):
    """Comprehensive prediction for student performance and risk"""
    try:
        # Convert to feature array
        feature_array = [
            features.attendance,
            features.internal_marks,
            features.assignment_marks,
            features.behavior_score,
            features.previous_cgpa,
            features.backlog_count,
            features.semester,
            features.study_hours,
            features.family_income,
            features.extracurricular,
            features.attendance + np.random.normal(0, 2),  # attendance_trend
            1 - (abs(features.internal_marks - features.assignment_marks) / 20)  # consistency
        ]
        
        # Get predictions
        risk_prediction = ml_models.predict_risk(feature_array)
        performance_prediction = ml_models.predict_performance(feature_array)
        
        # Generate insights
        insights = generate_insights(features, risk_prediction, performance_prediction)
        
        return {
            "success": True,
            "risk_assessment": risk_prediction,
            "performance_prediction": performance_prediction,
            "insights": insights,
            "model_version": "v2.0"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/batch")
async def predict_batch(request: BatchPredictionRequest):
    """Batch prediction for multiple students"""
    try:
        results = []
        
        for student_data in request.students:
            features = StudentFeatures(**student_data)
            
            feature_array = [
                features.attendance,
                features.internal_marks,
                features.assignment_marks,
                features.behavior_score,
                features.previous_cgpa,
                features.backlog_count,
                features.semester,
                features.study_hours,
                features.family_income,
                features.extracurricular,
                features.attendance + np.random.normal(0, 2),
                1 - (abs(features.internal_marks - features.assignment_marks) / 20)
            ]
            
            risk_pred = ml_models.predict_risk(feature_array)
            perf_pred = ml_models.predict_performance(feature_array)
            
            results.append({
                "student_id": student_data.get("student_id"),
                "risk_assessment": risk_pred,
                "performance_prediction": perf_pred
            })
            
        return {
            "success": True,
            "predictions": results,
            "total_processed": len(results)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/department/{department}")
async def get_department_analytics(department: str):
    """Get comprehensive department analytics"""
    try:
        # Simulate department-wide analytics
        analytics = {
            "department": department,
            "risk_distribution": {
                "SAFE": np.random.randint(60, 80),
                "NEEDS_ATTENTION": np.random.randint(15, 25),
                "AT_RISK": np.random.randint(5, 15)
            },
            "performance_metrics": {
                "average_predicted_score": float(np.random.normal(75, 10)),
                "pass_rate_prediction": float(np.random.normal(85, 5)),
                "improvement_rate": float(np.random.normal(12, 3))
            },
            "trends": [
                {"month": f"Month {i}", "avg_score": float(np.random.normal(75, 5))}
                for i in range(1, 7)
            ],
            "feature_importance": ml_models.get_feature_importance()
        }
        
        return {
            "success": True,
            "analytics": analytics
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model/retrain")
async def retrain_models():
    """Retrain ML models with latest data"""
    try:
        ml_models.train_models()
        return {
            "success": True,
            "message": "Models retrained successfully",
            "model_version": "v2.0"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_insights(features: StudentFeatures, risk_pred: dict, perf_pred: dict) -> List[dict]:
    """Generate personalized insights based on predictions"""
    insights = []
    
    # Attendance insights
    if features.attendance < 75:
        insights.append({
            "type": "warning",
            "title": "Low Attendance Alert",
            "description": f"Attendance is {features.attendance:.1f}%, below the required 75%",
            "recommendation": "Focus on improving attendance to boost performance",
            "priority": "high"
        })
    elif features.attendance > 90:
        insights.append({
            "type": "success",
            "title": "Excellent Attendance",
            "description": f"Outstanding attendance of {features.attendance:.1f}%",
            "recommendation": "Keep maintaining this excellent attendance record",
            "priority": "low"
        })
    
    # Performance insights
    if features.internal_marks < 12:
        insights.append({
            "type": "warning",
            "title": "Internal Assessment Concern",
            "description": "Internal marks are below average",
            "recommendation": "Focus on regular study and assignment completion",
            "priority": "medium"
        })
    
    # Backlog insights
    if features.backlog_count > 0:
        insights.append({
            "type": "critical",
            "title": "Active Backlogs",
            "description": f"{features.backlog_count} subject(s) pending clearance",
            "recommendation": "Prioritize clearing backlogs this semester",
            "priority": "high"
        })
    
    # Risk-based insights
    if risk_pred["risk_level"] == "AT_RISK":
        insights.append({
            "type": "critical",
            "title": "High Risk Student",
            "description": "Multiple factors indicate academic risk",
            "recommendation": "Immediate mentor intervention recommended",
            "priority": "critical"
        })
    
    return insights