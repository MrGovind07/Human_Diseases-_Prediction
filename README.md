# 🩺 HealthAI: AI-Powered Disease Prediction & Clinical Decision-Support System

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Framework](https://img.shields.io/badge/Streamlit-1.30%2B-FF4B4B.svg)](https://streamlit.io/)
[![Frontend](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![Engine](https://img.shields.io/badge/ML%20Engine-Calibrated%20XGBoost-06B6D4.svg)](https://xgboost.readthedocs.io/)
[![Test Suite](https://img.shields.io/badge/Tests-17%20Passed-10B981.svg)](tests/)

An enterprise-grade, evidence-grounded clinical decision-support platform designed to assess patient cardiometabolic disease risks through calibrated machine learning, physiological biomarker contextualization, and transparent multi-model diagnostics.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Original Project Audit & Weaknesses](#-original-project-audit--weaknesses)
3. [Machine Learning Pipeline & Methodology](#-machine-learning-pipeline--methodology)
4. [Before & After Model Comparison](#-before--after-model-comparison)
5. [System Architecture & Directory Structure](#-system-architecture--directory-structure)
6. [Installation & Setup](#-installation--setup)
7. [Running the Applications](#-running-the-applications)
   - [Option A: Streamlit Production Dashboard](#option-a-streamlit-production-dashboard)
   - [Option B: React + Tailwind Modern Web Application](#option-b-react--tailwind-modern-web-application)
   - [Option C: FastAPI Backend Server](#option-c-fastapi-backend-server)
8. [Automated Verification & Testing](#-automated-verification--testing)
9. [Clinical Safety & Ethical AI Principles](#-clinical-safety--ethical-ai-principles)

---

## 🔬 Project Overview

The **HealthAI Disease Prediction System** transforms simplistic, black-box health checklists into a scientifically validated decision-support tool. It correlates multi-dimensional vitals, metabolic labs, demographics, and lifestyle factors against established **WHO, AHA, and ADA** clinical guidelines to provide:
- **Calibrated Disease Probability:** Using Platt Sigmoid calibration over 5-fold cross-validation.
- **Biomarker Risk Stratification:** Categorization into *Low*, *Mild*, *Moderate*, and *High* risk tiers.
- **Explainable Driver Attribution:** Transparent feature importance highlighting individual risk drivers (e.g., fasting glucose, blood pressure, smoking).
- **Dual Interface:** Choose between a rich **Streamlit Clinical Dashboard** and a modern **React + Tailwind** dark-mode health-tech web application.

---

## 🔍 Original Project Audit & Weaknesses

During the Phase 1 audit of the initial project, several critical methodological and software architecture issues were uncovered:

| Weakness Identified | Impact in Medical Context | Solution Implemented |
|---|---|---|
| **Data Leakage in Notebook** (`X_test = scaler.fit_transform(X_test)`) | Data leakage: Test set statistics leaked into scaling, invalidating offline evaluation. | Encapsulated all transformations into strict `Pipeline` objects fitted only on training data. |
| **Suboptimal Classifier (KNN, $k=6$)** | KNN with even $k$ causes tie breaks; achieved only 87.0% accuracy and missed **12.5% of sick patients** (Recall: 87.5%). | Evaluated 8 algorithms; upgraded to **Calibrated XGBoost** with 96.0% accuracy and **96.32% Recall**. |
| **Misleading "Confidence" Calculation** | Used raw neighbor fraction (`np.max(predict_proba)`) as "confidence", fabricating 100% scores without calibration. | Implemented **Brier-score verified probability calibration** (`CalibratedClassifierCV`). |
| **Unvalidated Feature Mapping** | Inputs were packed into untyped raw arrays; fragile to column order changes or corrupt inputs. | Built schema validation (`preprocessing.py`) with physiological bounds and type enforcement. |
| **Monolithic Minimalist Interface** | Basic two-column inputs with generic advice regardless of patient lab severity. | Built a **Health-Tech SaaS Dashboard** with interactive risk gauges, guideline tables, and custom precautions. |

---

## 📊 Before & After Model Comparison

All models were evaluated on the **exact same held-out test split of 200 cases** using stratified sampling:

| Model Candidate | 5-Fold CV Acc | Test Accuracy | Precision | Recall (Sensitivity) | F1 Score | Area Under ROC |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Baseline (Dummy - Most Frequent)** | 67.8% | 68.0% | 68.0% | 100.0% | 0.8095 | 0.5000 |
| **Original System (KNN, $k=6$)** | 83.1% | 87.0% | 93.0% | 87.5% | 0.9015 | 0.9432 |
| **Logistic Regression (L2, Balanced)** | 85.1% | 85.0% | 90.2% | 87.5% | 0.8881 | 0.9384 |
| **Gaussian Naive Bayes** | 85.0% | 87.0% | 86.7% | 95.6% | 0.9091 | 0.9405 |
| **Decision Tree (Pruned)** | 76.9% | 78.0% | 92.6% | 73.5% | 0.8197 | 0.8926 |
| **Random Forest Ensemble** | 90.8% | 92.5% | 92.9% | 96.3% | 0.9458 | 0.9789 |
| **Gradient Boosting Classifier** | 94.8% | 95.0% | 96.3% | 96.3% | 0.9632 | 0.9921 |
| **🏆 Upgraded Production Model (Calibrated XGBoost)** | **96.8%** | **96.0%** | **97.8%** | **96.3%** | **0.9704** | **0.9961** |

> **Key Clinical Improvement:** False negatives dropped by over **64%**, ensuring patients with active disease risk are reliably identified while preserving high specificity (95.3%).

---

## 📂 System Architecture & Directory Structure

```text
Disease_Prediction/
├── app.py                      # Primary Streamlit Clinical Dashboard (Dark Health-Tech Theme)
├── api.py                      # FastAPI Backend Server (Serves API + React frontend)
├── train_model.py              # Reproducible Pipeline Training & Benchmark Sweep
├── model_utils.py              # Inference, Probability Calibration & Report Generation
├── preprocessing.py            # Input Validation, Feature Schemas & Clinical Guidelines
├── evaluation.py               # Comprehensive ML Metrics (ROC, Brier, Confusion Matrix)
├── disease_prediction_dataset.csv # Physiological Dataset (1,000 cases, 10 attributes)
├── requirements.txt            # Python Dependencies
├── README.md                   # Complete Documentation
├── assets/
│   └── style.css               # Luxury Dark Health-Tech SaaS Design System (#0d131d)
├── models/
│   ├── disease_prediction_pipeline.pkl # Calibrated Production Model Pipeline
│   ├── base_pipeline.pkl               # Uncalibrated Base Model Pipeline
│   ├── model_metadata.json             # Complete Training Specs, Metrics & Timestamps
│   └── candidate_comparison.json       # Benchmark Data Across All 8 Candidate Models
├── tests/
│   ├── test_preprocessing.py   # Unit tests for input validation & reference ranges
│   ├── test_model.py           # Unit tests for model loading & deterministic inference
│   ├── test_pipeline.py        # Integration tests for end-to-end report generation
│   └── run_tests.py            # Zero-dependency Automated Test Runner
└── frontend/                   # Modern React + Vite + Tailwind CSS Application
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.jsx             # Comprehensive 5-Screen Interactive React Application
        ├── main.jsx
        └── index.css
```

---

## 💻 Installation & Setup

### 1. Clone or Open Workspace
```bash
cd c:\Users\hp\Desktop\Disease_Prediction
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. (Optional) Re-train the Model Pipeline
The repository comes pre-bundled with trained artifacts in `models/`. To execute a clean training sweep and regenerate all benchmark metrics:
```bash
python train_model.py
```

---

## 🚀 Running the Applications

### Option A: Streamlit Production Dashboard
Launch the full interactive Streamlit dashboard:
```bash
streamlit run app.py
```
*Access in browser at:* `http://localhost:8501`

### Option B: React + Tailwind Modern Web Application
To run the high-performance React frontend in development mode:
```bash
cd frontend
npm run dev
```
*Access in browser at:* `http://localhost:3000`

### Option C: FastAPI Backend Server
Serves the REST API endpoints and hosts the production React build on a single unified port:
```bash
python api.py
```
*Access API Docs at:* `http://localhost:8000/docs`  
*Access Web App at:* `http://localhost:8000/`

---

## ✅ Automated Verification & Testing

The project includes an automated test suite verifying input schemas, out-of-bounds handling, deterministic predictions, probability calibration, and report formatting.

Run the test suite:
```bash
python tests/run_tests.py
```

Expected output:
```text
=================================================================
  RUNNING AUTOMATED TEST SUITE
=================================================================
 [PASS] test_feature_names_list
 [PASS] test_valid_input_passes
 [PASS] test_missing_field_fails
 [PASS] test_out_of_bounds_input_fails
 [PASS] test_invalid_type_fails
 [PASS] test_prepare_feature_dataframe
 [PASS] test_clinical_indicators_evaluation
 [PASS] test_all_demo_profiles_valid
 [PASS] test_model_artifact_exists
 [PASS] test_load_model_succeeds
 [PASS] test_load_metadata
 [PASS] test_candidate_benchmarks
 [PASS] test_predict_patient_risk_low_risk
 [PASS] test_predict_patient_risk_high_risk
 [PASS] test_deterministic_predictions
 [PASS] test_end_to_end_flow_and_report_generation
 [PASS] test_report_generation_handles_errors
=================================================================
 Total Tests: 17 | Passed: 17 | Failed: 0
=================================================================
```

---

## 🛡️ Clinical Safety & Ethical AI Principles

1. **Decision Support, Not Autonomous Diagnosis:** HealthAI is strictly engineered as a preliminary triage and risk assessment tool. It does not replace physical examination, clinical lab assays, or licensed medical oversight.
2. **False Negative Mitigation:** In healthcare diagnostics, failing to detect an at-risk individual (Type II error) carries significantly higher clinical risk than a false alarm. The production XGBoost classifier was specifically tuned to achieve a **96.32% sensitivity rate**.
3. **Calibrated Probabilities:** Machine learning confidence values are calibrated using Platt Sigmoid scaling, ensuring that an 80% risk score corresponds to an empirical 80% incidence rate on validation data.
4. **Data Privacy by Design:** The system executes 100% local client-side and server-side inference. No patient data or protected health information (PHI) is persisted or shared externally.
