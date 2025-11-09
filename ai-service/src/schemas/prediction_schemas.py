from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class RiskLevel(str, Enum):
    SAFE = "SAFE"
    NEEDS_ATTENTION = "NEEDS_ATTENTION"
    AT_RISK = "AT_RISK"

class PredictionType(str, Enum):
    SUBJECT = "SUBJECT"
    SEMESTER = "SEMESTER"

# Subject Prediction Schemas
class SubjectFeatures(BaseModel):
    attendance_percentage: float = Field(..., ge=0, le=100, description="Attendance percentage")
    best_of_two_internals: float = Field(..., ge=0, le=25, description="Best of two internal marks")
    assignment_marks: float = Field(..., ge=0, le=20, description="Assignment marks")
    behavior_score: float = Field(..., ge=0, le=10, description="Behavior score")

class SubjectPredictionRequest(BaseModel):
    student_id: str = Field(..., description="Student ID")
    subject_id: Optional[str] = Field(None, description="Subject ID")
    features: SubjectFeatures

class SubjectPredictionResult(BaseModel):
    predicted_score: float = Field(..., description="Predicted final score")
    confidence: float = Field(..., ge=0, le=1, description="Prediction confidence")
    risk_level: RiskLevel = Field(..., description="Risk assessment level")
    model_version: str = Field(..., description="Model version used")

class SubjectPredictionResponse(BaseModel):
    success: bool = Field(True, description="Request success status")
    prediction: SubjectPredictionResult
    message: str = Field("Prediction completed successfully", description="Response message")

# Semester Prediction Schemas
class SemesterFeatures(BaseModel):
    mean_subject_prediction: float = Field(..., ge=0, le=100, description="Mean of subject predictions")
    active_backlog_count: int = Field(..., ge=0, description="Number of active backlogs")
    previous_sgpa: Optional[float] = Field(None, ge=0, le=10, description="Previous semester SGPA")
    attendance_average: float = Field(..., ge=0, le=100, description="Average attendance across subjects")

class SemesterPredictionRequest(BaseModel):
    student_id: str = Field(..., description="Student ID")
    semester: int = Field(..., ge=1, le=8, description="Semester number")
    features: SemesterFeatures

class SemesterPredictionResult(BaseModel):
    predicted_sgpa: float = Field(..., ge=0, le=10, description="Predicted SGPA")
    confidence: float = Field(..., ge=0, le=1, description="Prediction confidence")
    risk_level: RiskLevel = Field(..., description="Risk assessment level")
    model_version: str = Field(..., description="Model version used")

class SemesterPredictionResponse(BaseModel):
    success: bool = Field(True, description="Request success status")
    prediction: SemesterPredictionResult
    message: str = Field("Prediction completed successfully", description="Response message")

# Batch Prediction Schemas
class BatchStudentData(BaseModel):
    student_id: str = Field(..., description="Student ID")
    features: Dict[str, Any] = Field(..., description="Student features")

class BatchPredictionRequest(BaseModel):
    students: List[BatchStudentData] = Field(..., description="List of students for batch prediction")
    prediction_type: PredictionType = Field(..., description="Type of prediction")

class BatchPredictionResult(BaseModel):
    student_id: str = Field(..., description="Student ID")
    success: bool = Field(..., description="Prediction success status")
    prediction: Optional[Dict[str, Any]] = Field(None, description="Prediction result")
    error: Optional[str] = Field(None, description="Error message if prediction failed")

class BatchPredictionResponse(BaseModel):
    success: bool = Field(True, description="Request success status")
    predictions: List[BatchPredictionResult] = Field(..., description="Batch prediction results")
    total_count: int = Field(..., description="Total number of predictions")
    message: str = Field("Batch prediction completed", description="Response message")

# Explanation Schemas
class FeatureExplanation(BaseModel):
    feature: str = Field(..., description="Feature name")
    impact: float = Field(..., description="Feature impact score")
    description: str = Field(..., description="Human-readable explanation")

class PredictionExplanation(BaseModel):
    prediction_id: str = Field(..., description="Prediction ID")
    top_features: List[FeatureExplanation] = Field(..., description="Top influential features")
    explanation_method: str = Field("SHAP", description="Explanation method used")

# Error Response Schema
class ErrorResponse(BaseModel):
    success: bool = Field(False, description="Request success status")
    message: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Error code")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")