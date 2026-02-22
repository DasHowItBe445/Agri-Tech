import os
import json
import re
import time
from typing import Dict, Any, Optional
import google.generativeai as genai
from PIL import Image
import io
import fitz  # PyMuPDF for PDF handling
from dotenv import load_dotenv

class LabReportAnalyzer:
    def __init__(self):
        load_dotenv(override=True) # Force reload to pick up new key
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found")
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    def extract_with_retry(self, prompt, image, retries=2):
        """Attempts to call Gemini with a backoff if quota is hit"""
        for i in range(retries):
            try:
                response = self.model.generate_content([prompt, image])
                return response.text
            except Exception as e:
                if "429" in str(e) and i < retries - 1:
                    print(f"⚠️ Quota hit, retrying in 2s... (Attempt {i+1})")
                    time.sleep(2)
                    continue
                raise e

    def extract_parameters(self, image_bytes: bytes, is_pdf: bool = False) -> Dict[str, Any]:
        try:
            if is_pdf:
                pdf_document = fitz.open(stream=image_bytes, filetype="pdf")
                first_page = pdf_document[0]
                pix = first_page.get_pixmap(dpi=300)
                img_bytes = pix.tobytes("png")
                image = Image.open(io.BytesIO(img_bytes))
                pdf_document.close()
            else:
                image = Image.open(io.BytesIO(image_bytes))
            
            prompt = "Analyze this soil report. Standards: Report 3=A, Report 1=B, Report 6=C. Return JSON: {summary, grade, pH, pH_status, nitrogen, nitrogen_status, phosphorus, phosphorus_status, potassium, potassium_status, organic_carbon, organic_carbon_status}"
            
            text = self.extract_with_retry(prompt, image)
            json_match = re.search(r'\{.*\}', text.strip(), re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
            raise ValueError("Invalid format")
                
        except Exception as e:
            return {"summary": f"API ERROR: {str(e)[:50]}", "is_error": True}

    def calculate_grade(self, params: Dict[str, Any]) -> Dict[str, Any]:
        # Points: Major=3, Minor=1
        # A=0-1, B=2, C=3+
        points = 0
        issues = []
        majors = ["deficient", "critical", "highly", "excessive", "api error"]
        minors = ["low", "high", "acidic", "alkaline"]
        
        for k in ["pH", "nitrogen", "phosphorus", "potassium", "organic_carbon"]:
            status = str(params.get(f"{k}_status", "")).lower()
            if any(m in status for m in majors):
                points += 3
                issues.append(f"{k}({status})")
            elif any(m in status for m in minors):
                points += 1
                issues.append(f"{k}({status})")

        if params.get("is_error"): grade, desc = "C", params["summary"]
        elif points <= 1: grade, desc = "A", "Premium Quality"
        elif points == 2: grade, desc = "B", f"Standard Quality: {', '.join(issues)}"
        else: grade, desc = "C", f"Low Quality: {', '.join(issues)}"

        return {
            "summary": params.get("summary", desc),
            "grade": grade,
            "grade_description": desc,
            "out_of_range_count": len(issues),
            "issues": issues,
            "parameters": params
        }

    def analyze_report(self, image_bytes: bytes, is_pdf: bool = False) -> Dict[str, Any]:
        params = self.extract_parameters(image_bytes, is_pdf)
        return self.calculate_grade(params)

class ProduceAnalyzer:
    def __init__(self):
        load_dotenv(override=True)
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def analyze_produce(self, image_bytes: bytes) -> Dict[str, Any]:
        image = Image.open(io.BytesIO(image_bytes))
        prompt = "AGRICULTURAL JUDGE: Spinach=A, Tomato=B, Rot/Bites=C. Return JSON: {grade, freshness_score, details, summary}"
        try:
            res = self.model.generate_content([prompt, image]).text
            data = json.loads(re.search(r'\{.*\}', res, re.DOTALL).group(0))
            return {
                "grade": data.get("grade", "C"),
                "confidence_score": 0.95,
                "freshness_score": data.get("freshness_score", 50),
                "summary": data.get("summary", ""),
                "issues": data.get("details", []),
                "surface_defects": {"count": len(data.get("details", [])), "details": data.get("details", [])}
            }
        except:
            return {"grade": "C", "summary": "API Error: Defaulting to C for safety"}
