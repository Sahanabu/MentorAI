from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv

from api.prediction_routes import router as prediction_router
from api.model_routes import router as model_router
from api.health_routes import router as health_router
from utils.logger import setup_logger

# Load environment variables
load_dotenv()

# Setup logging
logger = setup_logger()

# Create FastAPI app
app = FastAPI(
    title="MentorTrack AI Service",
    description="AI-powered academic performance prediction service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "error": str(exc) if os.getenv("DEBUG") == "true" else "Something went wrong"
        }
    )

# Include routers
app.include_router(health_router, prefix="/health", tags=["Health"])
app.include_router(prediction_router, prefix="/predict", tags=["Predictions"])
app.include_router(model_router, prefix="/models", tags=["Models"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "service": "MentorTrack AI Service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("DEBUG") == "true" else False,
        log_level="info"
    )