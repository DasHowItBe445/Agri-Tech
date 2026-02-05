from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.image_processor import process_image
from utils.ai_inference import get_inference
from utils.freshness_calculator import calculate_freshness
from utils.quality_grader import grade_produce
import shutil
import os

router = APIRouter()

@router.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # Create temp file
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Preprocessing (OpenCV)
        processed_data = process_image(temp_path)
        
        # Inference (TensorFlow)
        inference_results = get_inference(temp_path)
        
        # Freshness calculation
        freshness = calculate_freshness(processed_data, inference_results)
        
        # Grading
        grade_info = grade_produce(inference_results, freshness)
        
        # Clean up
        os.remove(temp_path)
        
        return {
            "grade": grade_info['grade'],
            "confidence_score": inference_results['confidence'],
            "freshness_score": freshness,
            "color_saturation": processed_data['saturation'],
            "surface_defects": processed_data['defects']
        }
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))
