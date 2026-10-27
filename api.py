"""
FastAPI Server for AI-Powered Disease Prediction System
Serves prediction APIs, model benchmark metrics, and mounts the React frontend bundle.
"""

import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from model_utils import (
    load_model,
    load_model_metadata,
    load_candidate_benchmarks,
    predict_patient_risk,
    generate_text_report
)
from preprocessing import FEATURE_SPECS, DEMO_PROFILES

app = FastAPI(
    title="HealthAI Prediction API",
    description="Production Machine Learning Decision-Support Engine for Disease Prediction",
    version="2.4.0"
)

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once on startup
try:
    model = load_model()
    metadata = load_model_metadata()
    benchmarks = load_candidate_benchmarks()
    model_ready = True
except Exception as e:
    model = None
    metadata = {}
    benchmarks = []
    model_ready = False
    load_err = str(e)


class PatientInput(BaseModel):
    Age: int = Field(45, ge=18, le=120)
    BMI: float = Field(24.5, ge=10.0, le=60.0)
    Blood_Pressure: int = Field(120, ge=60, le=250)
    Glucose_Level: int = Field(95, ge=50, le=400)
    Cholesterol: int = Field(185, ge=100, le=500)
    Heart_Rate: int = Field(72, ge=40, le=220)
    Smoking: int = Field(0, ge=0, le=1)
    Alcohol: int = Field(0, ge=0, le=1)
    Physical_Activity: float = Field(4.0, ge=0.0, le=40.0)
    Family_History: int = Field(0, ge=0, le=1)


class SymptomAssessmentInput(BaseModel):
    symptoms: List[str]
    patient_vitals: Optional[PatientInput] = None


@app.get("/api/health")
def health_check():
    return {
        "status": "online" if model_ready else "error",
        "engine": "Calibrated XGBoost Classifier (v2.4.0)",
        "features_loaded": len(FEATURE_SPECS),
        "model_loaded": model_ready
    }


@app.get("/api/benchmarks")
def get_benchmarks():
    if not benchmarks:
        raise HTTPException(status_code=404, detail="Benchmark metrics not found.")
    return benchmarks


@app.get("/api/metadata")
def get_metadata():
    if not metadata:
        raise HTTPException(status_code=404, detail="Model metadata not found.")
    return metadata


@app.get("/api/presets")
def get_presets():
    return DEMO_PROFILES


@app.post("/api/predict")
def predict_risk(input_data: PatientInput):
    if not model_ready:
        raise HTTPException(status_code=500, detail=f"Model unavailable: {load_err}")

    raw_dict = input_data.model_dump()
    result = predict_patient_risk(model, raw_dict)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("errors", ["Prediction failed."]))

    return result


@app.post("/api/report")
def export_report(input_data: PatientInput):
    if not model_ready:
        raise HTTPException(status_code=500, detail="Model unavailable")

    raw_dict = input_data.model_dump()
    result = predict_patient_risk(model, raw_dict)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail="Invalid parameters")

    report_text = generate_text_report(result, metadata)
    return {"report": report_text}


# Mount built React assets if available
dist_dir = os.path.join(os.path.dirname(__file__), "frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
