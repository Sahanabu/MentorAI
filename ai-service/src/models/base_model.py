import os
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import joblib

class BaseModel(ABC):
    """Base class for all ML models"""
    
    def __init__(self, model_name: str, model_path: Optional[str] = None):
        self.model_name = model_name
        self.model_path = model_path or os.getenv('MODEL_PATH', './data/models')
        self.version = "1.0"
        self.is_trained = False
        
        # Ensure model directory exists
        os.makedirs(self.model_path, exist_ok=True)
    
    @abstractmethod
    def train(self, training_data: Any) -> Dict:
        """Train the model"""
        pass
    
    @abstractmethod
    def predict(self, features: Dict) -> Dict:
        """Make a single prediction"""
        pass
    
    @abstractmethod
    def save_model(self, path: str = None) -> str:
        """Save the trained model"""
        pass
    
    @abstractmethod
    def load_model(self, path: str = None) -> bool:
        """Load a trained model"""
        pass
    
    def get_model_info(self) -> Dict:
        """Get model information"""
        return {
            'name': self.model_name,
            'version': self.version,
            'is_trained': self.is_trained,
            'model_path': self.model_path
        }
    
    def validate_features(self, features: Dict, required_features: list) -> bool:
        """Validate that all required features are present"""
        missing_features = [f for f in required_features if f not in features]
        if missing_features:
            raise ValueError(f"Missing required features: {missing_features}")
        return True