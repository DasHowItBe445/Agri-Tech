from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.gemini_analyzer import ProduceAnalyzer
from utils.quality_grader import grade_produce
import shutil
import os
import uuid

router = APIRouter()
produce_analyzer = ProduceAnalyzer()

@router.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # Use unique filename to avoid conflicts during high-concurrency testing
    unique_filename = f"temp_{uuid.uuid4()}_{file.filename}"
    temp_path = unique_filename
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        print(f"--- DEBUG: Analyzing image {file.filename} ---")
        with open(temp_path, "rb") as f:
            image_bytes = f.read()
            
        # Analysis using Gemini Produce Analyzer (Vision)
        result = produce_analyzer.analyze_produce(image_bytes)
        print(f"--- DEBUG: Analysis Result for {file.filename}: {result['grade']} ---")
        
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return result
    except Exception as e:
        print(f"--- DEBUG: ERROR in analyze_image: {str(e)} ---")
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))
