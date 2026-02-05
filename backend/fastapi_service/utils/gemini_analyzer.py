import os
import json
from typing import Dict, Any, Optional
import google.generativeai as genai
from PIL import Image
import io
import fitz  # PyMuPDF for PDF handling

class LabReportAnalyzer:
    """Analyzes soil lab reports using Gemini API and applies grading logic"""
    
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def extract_parameters(self, image_bytes: bytes, is_pdf: bool = False) -> Dict[str, Any]:
        """Extract soil parameters from lab report image or PDF using Gemini Vision"""
        
        # Convert PDF to image if needed
        if is_pdf:
            # Open PDF and convert first page to image
            pdf_document = fitz.open(stream=image_bytes, filetype="pdf")
            first_page = pdf_document[0]
            pix = first_page.get_pixmap(dpi=300)
            img_bytes = pix.tobytes("png")
            image = Image.open(io.BytesIO(img_bytes))
            pdf_document.close()
        else:
            image = Image.open(io.BytesIO(image_bytes))
        
        prompt = """
        Analyze this soil testing lab report and extract the following parameters in JSON format:
        
        {
            "pH": <value as float>,
            "pH_status": "<Normal/Acidic/Alkaline>",
            "nitrogen": <value as float>,
            "nitrogen_status": "<Low/Normal/Adequate/High>",
            "phosphorus": <value as float>,
            "phosphorus_status": "<Low/Normal/Adequate/High>",
            "potassium": <value as float>,
            "potassium_status": "<Low/Normal/Adequate/High>",
            "organic_carbon": <value as float or null if not present>,
            "organic_carbon_status": "<Low/Normal/Adequate/High or null>",
            "report_date": "<date in YYYY-MM-DD format>",
            "lab_name": "<name of testing lab>",
            "sample_id": "<sample ID if present>"
        }
        
        Extract only the values shown in the report. If a parameter is not present, use null.
        Return ONLY valid JSON, no additional text.
        """
        
        response = self.model.generate_content([prompt, image])
        
        # Parse JSON from response
        try:
            # Clean response text
            text = response.text.strip()
            # Remove markdown code blocks if present
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            
            data = json.loads(text)
            return data
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse Gemini response as JSON: {e}\nResponse: {response.text}")
    
    def calculate_grade(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Apply grading logic based on soil parameters:
        - Grade A: All parameters Normal/Adequate/Good
        - Grade B: 1 parameter slightly Low or High, rest Normal/Adequate
        - Grade C: 2+ parameters out of range OR pH problematic + nutrient imbalance
        """
        
        # Count parameters out of normal range
        out_of_range_count = 0
        issues = []
        
        # Check pH
        ph_status = parameters.get("pH_status", "").lower()
        if ph_status in ["acidic", "alkaline"]:
            out_of_range_count += 1
            issues.append(f"pH is {ph_status}")
        
        # Check Nitrogen
        n_status = parameters.get("nitrogen_status", "").lower()
        if n_status in ["low", "high"]:
            out_of_range_count += 1
            issues.append(f"Nitrogen is {n_status}")
        
        # Check Phosphorus
        p_status = parameters.get("phosphorus_status", "").lower()
        if p_status in ["low", "high"]:
            out_of_range_count += 1
            issues.append(f"Phosphorus is {p_status}")
        
        # Check Potassium
        k_status = parameters.get("potassium_status", "").lower()
        if k_status in ["low", "high"]:
            out_of_range_count += 1
            issues.append(f"Potassium is {k_status}")
        
        # Check Organic Carbon if present
        oc_status = parameters.get("organic_carbon_status")
        if oc_status and oc_status.lower() in ["low", "high"]:
            out_of_range_count += 1
            issues.append(f"Organic Carbon is {oc_status.lower()}")
        
        # Determine grade
        if out_of_range_count == 0:
            grade = "A"
            grade_description = "Top Quality - All parameters within normal range"
        elif out_of_range_count == 1:
            grade = "B"
            grade_description = "Medium/Fresh - One parameter needs attention"
        else:
            grade = "C"
            grade_description = "Needs Improvement - Multiple parameters out of range"
        
        return {
            "grade": grade,
            "grade_description": grade_description,
            "out_of_range_count": out_of_range_count,
            "issues": issues,
            "parameters": parameters
        }
    
    def analyze_report(self, image_bytes: bytes, is_pdf: bool = False) -> Dict[str, Any]:
        """Complete analysis pipeline: extract parameters and calculate grade"""
        
        # Extract parameters from image or PDF
        parameters = self.extract_parameters(image_bytes, is_pdf)
        
        # Calculate grade
        result = self.calculate_grade(parameters)
        
        return result
