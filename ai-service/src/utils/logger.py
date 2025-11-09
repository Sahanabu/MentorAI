import logging
import sys
from pathlib import Path
from loguru import logger
import os

def setup_logger():
    """Setup loguru logger with custom configuration"""
    
    # Remove default handler
    logger.remove()
    
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Console handler
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level="INFO" if os.getenv("DEBUG") != "true" else "DEBUG",
        colorize=True
    )
    
    # File handler for all logs
    logger.add(
        log_dir / "ai_service.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level="INFO",
        rotation="10 MB",
        retention="7 days",
        compression="zip"
    )
    
    # File handler for errors only
    logger.add(
        log_dir / "errors.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level="ERROR",
        rotation="5 MB",
        retention="30 days",
        compression="zip"
    )
    
    return logger

def get_logger(name: str = None):
    """Get logger instance"""
    if name:
        return logger.bind(name=name)
    return logger

# Initialize logger
setup_logger()