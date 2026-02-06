from pydantic import BaseModel
from typing import List, Dict, Optional

class AnalysisResult(BaseModel):
    grade: str
    confidence_score: float
    freshness_score: float
    color_saturation: float
    surface_defects: Dict
