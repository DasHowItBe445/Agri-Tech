from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import sys
import os

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.gemini_analyzer import LabReportAnalyzer

router = APIRouter(prefix="/api/lab-report", tags=["lab-report"])

analyzer = LabReportAnalyzer()

@router.post("/analyze")
async def analyze_lab_report(file: UploadFile = File(...)):
    """
    Analyze uploaded lab report (PDF or image) using Gemini API
    Returns extracted parameters and calculated grade
    """
    
    # Accept both images and PDFs
    allowed_types = ['image/', 'application/pdf']
    if not any(file.content_type.startswith(t) for t in allowed_types):
        raise HTTPException(status_code=400, detail="File must be an image or PDF")
    
    # Analyze using Gemini
    try:
        print(f"Received file: {file.filename}, type: {file.content_type}")
        
        # Read file bytes
        file_bytes = await file.read()
        
        # Check if it's a PDF
        is_pdf = file.content_type == 'application/pdf'
        
        print(f"Starting Gemini analysis (PDF: {is_pdf})...")
        # Analyze using Gemini
        result = analyzer.analyze_report(file_bytes, is_pdf)
        print("Analysis completed successfully")
        
        return JSONResponse(content=result, status_code=200)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
