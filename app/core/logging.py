import logging
import json
from datetime import datetime
from typing import Any, Dict
from .config import settings

class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "context": {
                "request_id": getattr(record, "request_id", None),
                "user_id": getattr(record, "user_id", None),
                "endpoint": getattr(record, "endpoint", None),
                "duration_ms": getattr(record, "duration_ms", None)
            }
        }
        
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_data)

def setup_logging():
    logger = logging.getLogger("soundmatch")
    logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(JSONFormatter())
    logger.addHandler(console_handler)
    
    # File handler
    file_handler = logging.FileHandler("app.log")
    file_handler.setFormatter(JSONFormatter())
    logger.addHandler(file_handler)
    
    return logger

# Create global logger
logger = setup_logging() 