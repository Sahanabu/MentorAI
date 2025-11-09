from fastapi import APIRouter, HTTPException, Depends
from typing import List
import asyncio
from concurrent.futures import ThreadPoolExecutor

from schemas.prediction_schemas import (
    SubjectPredictionRequest,
    SubjectPredictionResponse,
    SemesterPredictionRequest,
    SemesterPredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse
)
from services.prediction_service import PredictionService
from utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

# Initialize prediction service
prediction_service = PredictionService()

# Thread pool for CPU-intensive tasks
executor = ThreadPoolExecutor(max_workers=4)

@router.post("/subject", response_model=SubjectPredictionResponse)
async def predict_subject_performance(request: SubjectPredictionRequest):
    """
    Predict individual subject performance
    """
    try:
        logger.info(f"Subject prediction request for student: {request.student_id}")
        
        # Run prediction in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            executor,
            prediction_service.predict_subject_performance,
            request.dict()
        )
        
        return SubjectPredictionResponse(
            success=True,
            prediction=result,
            message="Subject performance prediction completed successfully"
        )
        
    except Exception as e:
        logger.error(f"Subject prediction failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

@router.post("/semester", response_model=SemesterPredictionResponse)
async def predict_semester_sgpa(request: SemesterPredictionRequest):
    """
    Predict semester SGPA
    """
    try:
        logger.info(f"Semester prediction request for student: {request.student_id}")
        
        # Run prediction in thread pool
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            executor,
            prediction_service.predict_semester_sgpa,
            request.dict()
        )
        
        return SemesterPredictionResponse(
            success=True,
            prediction=result,
            message="Semester SGPA prediction completed successfully"
        )
        
    except Exception as e:
        logger.error(f"Semester prediction failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

@router.post("/batch", response_model=BatchPredictionResponse)
async def batch_predict(request: BatchPredictionRequest):
    """
    Batch prediction for multiple students
    """
    try:
        logger.info(f"Batch prediction request for {len(request.students)} students")
        
        # Run batch prediction in thread pool
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(
            executor,
            prediction_service.batch_predict,
            request.students,
            request.prediction_type
        )
        
        return BatchPredictionResponse(
            success=True,
            predictions=results,
            total_count=len(results),
            message=f"Batch prediction completed for {len(results)} students"
        )
        
    except Exception as e:
        logger.error(f"Batch prediction failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Batch prediction failed: {str(e)}"
        )

@router.post("/explain/{prediction_id}")
async def explain_prediction(prediction_id: str):
    """
    Get explanation for a specific prediction using SHAP
    """
    try:
        logger.info(f"Explanation request for prediction: {prediction_id}")
        
        # Run explanation in thread pool
        loop = asyncio.get_event_loop()
        explanation = await loop.run_in_executor(
            executor,
            prediction_service.explain_prediction,
            prediction_id
        )
        
        return {
            "success": True,
            "explanation": explanation,
            "message": "Prediction explanation generated successfully"
        }
        
    except Exception as e:
        logger.error(f"Explanation generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Explanation failed: {str(e)}"
        )

@router.get("/risk-analysis/{student_id}")
async def get_risk_analysis(student_id: str):
    """
    Get comprehensive risk analysis for a student
    """
    try:
        logger.info(f"Risk analysis request for student: {student_id}")
        
        # Run risk analysis in thread pool
        loop = asyncio.get_event_loop()
        analysis = await loop.run_in_executor(
            executor,
            prediction_service.get_risk_analysis,
            student_id
        )
        
        return {
            "success": True,
            "analysis": analysis,
            "message": "Risk analysis completed successfully"
        }
        
    except Exception as e:
        logger.error(f"Risk analysis failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Risk analysis failed: {str(e)}"
        )