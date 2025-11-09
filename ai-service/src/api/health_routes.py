from fastapi import APIRouter
from datetime import datetime
import os
import psutil

router = APIRouter()

@router.get("/")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "MentorTrack AI Service",
        "version": "1.0.0"
    }

@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check with system information"""
    try:
        # Get system information
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "service": "MentorTrack AI Service",
            "version": "1.0.0",
            "system": {
                "cpu_usage": f"{cpu_percent}%",
                "memory_usage": f"{memory.percent}%",
                "memory_available": f"{memory.available / (1024**3):.2f} GB",
                "disk_usage": f"{disk.percent}%",
                "disk_free": f"{disk.free / (1024**3):.2f} GB"
            },
            "environment": {
                "python_version": os.sys.version,
                "model_path": os.getenv("MODEL_PATH", "./data/models"),
                "debug_mode": os.getenv("DEBUG", "false")
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }

@router.get("/ready")
async def readiness_check():
    """Readiness check for Kubernetes"""
    try:
        # Check if models are loaded
        model_path = os.getenv("MODEL_PATH", "./data/models")
        models_exist = os.path.exists(model_path)
        
        if models_exist:
            return {
                "status": "ready",
                "timestamp": datetime.utcnow().isoformat(),
                "models_loaded": True
            }
        else:
            return {
                "status": "not_ready",
                "timestamp": datetime.utcnow().isoformat(),
                "models_loaded": False,
                "message": "Models not found"
            }
    except Exception as e:
        return {
            "status": "not_ready",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }

@router.get("/live")
async def liveness_check():
    """Liveness check for Kubernetes"""
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat()
    }