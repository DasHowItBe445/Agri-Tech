# Lab Report Analysis Setup Guide

## Overview
This system analyzes soil lab reports using Gemini AI and applies a grading system based on soil parameters (pH, N, P, K, Organic Carbon).

## Grading Logic

### Grade A - Top Quality
- All parameters within Normal/Adequate/Good range
- No Low, High, or Alkaline/Acidic remarks

### Grade B - Medium/Fresh
- 1 parameter slightly Low or High
- Rest are Normal/Adequate

### Grade C - Needs Improvement
- 2+ parameters out of range
- OR pH problematic (Alkaline/Acidic) + nutrient imbalance

## Setup Instructions

### 1. Install Dependencies

**FastAPI Service:**
```bash
cd backend/fastapi_service
pip install -r requirements.txt
```

**Django Service:**
```bash
cd backend/django_service
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Environment files have been created with your Gemini API key:
- `backend/django_service/.env`
- `backend/fastapi_service/.env`
- `frontend/.env.local`

### 3. Run Database Migrations

```bash
cd backend/django_service
python manage.py migrate
```

### 4. Start Services

**Terminal 1 - Django (Port 8000):**
```bash
cd backend/django_service
python manage.py runserver
```

**Terminal 2 - FastAPI (Port 8001):**
```bash
cd backend/fastapi_service
uvicorn main:app --reload --port 8001
```

**Terminal 3 - Frontend (Port 3000):**
```bash
cd frontend
npm run dev
```

## API Endpoints

### Lab Report Analysis

**POST** `/api/lab-reports/analyze`
- Upload lab report image
- Returns: Extracted parameters + Grade (A/B/C)
- Saves to PostgreSQL database

**GET** `/api/lab-reports/`
- List all analyzed reports

**GET** `/api/lab-reports/{id}/`
- Get specific report details

**GET** `/api/lab-reports/{id}/passport`
- Get digital passport view for report

## Data Flow

```
1. User uploads lab report image (PDF/JPG/PNG)
   ↓
2. FastAPI receives image → Gemini API extracts parameters
   ↓
3. Grading logic applied (A/B/C)
   ↓
4. Django saves to PostgreSQL
   ↓
5. Response returned with grade + parameters
   ↓
6. (Future) Data transferred to blockchain
   ↓
7. (Future) Digital passport displayed
```

## Database Schema

### LabReport Model
- `report_image`: Uploaded image file
- `sample_id`, `lab_name`, `report_date`: Metadata
- `ph_value`, `ph_status`: pH measurements
- `nitrogen_value`, `nitrogen_status`: Nitrogen levels
- `phosphorus_value`, `phosphorus_status`: Phosphorus levels
- `potassium_value`, `potassium_status`: Potassium levels
- `organic_carbon_value`, `organic_carbon_status`: Organic carbon
- `grade`: A/B/C grade
- `grade_description`: Human-readable description
- `out_of_range_count`: Number of parameters out of range
- `issues`: JSON array of identified issues
- `blockchain_hash`: (Future) Blockchain transaction hash
- `on_chain_status`: (Future) Whether stored on blockchain

## Testing

### Test with cURL:
```bash
curl -X POST http://localhost:8000/api/lab-reports/analyze \
  -F "report_image=@/path/to/lab_report.pdf"
```

### Expected Response:
```json
{
  "id": 1,
  "grade": "A",
  "grade_description": "Top Quality - All parameters within normal range",
  "ph_value": 6.8,
  "ph_status": "Normal",
  "nitrogen_value": 280,
  "nitrogen_status": "Adequate",
  "phosphorus_value": 45,
  "phosphorus_status": "Adequate",
  "potassium_value": 320,
  "potassium_status": "Adequate",
  "out_of_range_count": 0,
  "issues": [],
  "created_at": "2026-02-06T10:30:00Z"
}
```

## Next Steps (Future Implementation)

1. **Blockchain Integration**: Transfer graded data to blockchain
2. **Digital Passport**: Display AI analysis on passport page
3. **Multi-language Support**: Add translation for website content
4. **Frontend Upload Form**: Create UI for lab report upload

## Files Created/Modified

### New Files:
- `backend/django_service/.env`
- `backend/fastapi_service/.env`
- `frontend/.env.local`
- `backend/fastapi_service/utils/gemini_analyzer.py`
- `backend/fastapi_service/routers/lab_report.py`
- `backend/django_service/api/migrations/0002_labreport.py`

### Modified Files:
- `backend/django_service/api/models.py` - Added LabReport model
- `backend/django_service/api/serializers.py` - Added LabReportSerializer
- `backend/django_service/api/views.py` - Added LabReportViewSet
- `backend/django_service/api/urls.py` - Added lab report routes
- `backend/django_service/config/settings.py` - Added env loading
- `backend/fastapi_service/main.py` - Added lab_report router
- `backend/fastapi_service/requirements.txt` - Added google-generativeai
- `backend/django_service/requirements.txt` - Added python-dotenv, pillow
