from fastapi import FastAPI
from routers import analyze, health, lab_report

app = FastAPI(title="Krishi Pramaan AI Service")

app.include_router(analyze.router)
app.include_router(health.router)
app.include_router(lab_report.router)

@app.get("/")
async def root():
    return {"message": "Krishi Pramaan AI Service is running"}
