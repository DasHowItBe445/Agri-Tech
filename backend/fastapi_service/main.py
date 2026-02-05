from fastapi import FastAPI
from routers import analyze, health

app = FastAPI(title="Krishi Pramaan AI Service")

app.include_router(analyze.router)
app.include_router(health.router)

@app.get("/")
async def root():
    return {"message": "Krishi Pramaan AI Service is running"}
