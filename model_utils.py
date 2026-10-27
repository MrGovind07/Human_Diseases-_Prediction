"""
Disease Prediction System - Model Utilities & Inference Module
Handles safe pipeline loading, probabilistic risk scoring, clinical risk tiering,
evidence-based recommendation generation, and downloadable report synthesis.
"""

import os
import json
import pickle
from typing import Dict, Any, Tuple, Optional
import numpy as np
import pandas as pd

from preprocessing import (
    FEATURE_NAMES,
    validate_inputs,
    prepare_feature_dataframe,
    evaluate_clinical_indicators
)


def get_model_path() -> str:
    """Returns the primary pipeline file path or fallback."""
    primary = os.path.join("models", "disease_prediction_pipeline.pkl")
    if os.path.exists(primary):
        return primary
    fallback = "disease_model.pkl"
    if os.path.exists(fallback):
        return fallback
    raise FileNotFoundError("No trained model artifact found in 'models/' or workspace root.")


def load_model():
    """Loads and deserializes the champion trained pipeline."""
    path = get_model_path()
    with open(path, "rb") as f:
        model = pickle.load(f)
    return model


def load_model_metadata() -> Dict[str, Any]:
    """Loads saved model metadata and evaluation statistics."""
    meta_path = os.path.join("models", "model_metadata.json")
    if os.path.exists(meta_path):
        with open(meta_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def load_candidate_benchmarks() -> list:
    """Loads candidate model benchmarking comparisons."""
    comp_path = os.path.join("models", "candidate_comparison.json")
    if os.path.exists(comp_path):
        with open(comp_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def determine_risk_tier(probability: float) -> Tuple[str, str, str]:
    """
    Categorizes calibrated disease probability into clinical risk tiers.
    Returns: (tier_name, color_theme, badge_style)
    """
    if probability < 0.25:
        return "Low Risk (Optimal)", "emerald", "success"
    elif probability < 0.50:
        return "Mild / Guarded Risk", "blue", "info"
    elif probability < 0.75:
        return "Moderate Elevated Risk", "amber", "warning"
    else:
        return "High / Significant Risk", "rose", "danger"


def generate_clinical_recommendations(
    data: Dict[str, Any],
    probability: float
) -> list:
    """
    Produces evidence-grounded clinical precautions based on out-of-range biomarkers.
    """
    recommendations = []

    # Blood Pressure recommendations
    bp = data.get('Blood_Pressure', 120)
    if bp >= 140:
        recommendations.append({
            'biomarker': 'Blood Pressure',
            'severity': 'high',
            'title': 'Stage 2 Hypertension Guidance',
            'action': 'Consult a physician promptly for ambulatory blood pressure monitoring and evaluation of anti-hypertensive therapy.',
            'lifestyle': 'Limit dietary sodium to < 1,500 mg/day (DASH diet) and monitor morning/evening readings.'
        })
    elif bp >= 130:
        recommendations.append({
            'biomarker': 'Blood Pressure',
            'severity': 'medium',
            'title': 'Stage 1 Hypertension Guidance',
            'action': 'Schedule a routine cardiovascular checkup and repeat BP assessment within 2-4 weeks.',
            'lifestyle': 'Adopt the DASH diet, practice stress reduction, and track BP weekly.'
        })

    # Glucose recommendations
    glucose = data.get('Glucose_Level', 95)
    if glucose >= 126:
        recommendations.append({
            'biomarker': 'Fasting Glucose',
            'severity': 'high',
            'title': 'Diabetic Range Glucose Follow-up',
            'action': 'Obtain a confirmatory diagnostic laboratory test (Fasting Plasma Glucose & Glycated Hemoglobin / HbA1c).',
            'lifestyle': 'Engage in medical nutrition therapy focusing on low glycemic index foods and post-meal walking.'
        })
    elif glucose >= 100:
        recommendations.append({
            'biomarker': 'Fasting Glucose',
            'severity': 'medium',
            'title': 'Pre-diabetes Risk Protocol',
            'action': 'Schedule an annual diabetes screening including an oral glucose tolerance test or HbA1c.',
            'lifestyle': 'Moderate refined carbohydrates and simple sugars; aim for 5-7% intentional body weight management.'
        })

    # Cholesterol recommendations
    chol = data.get('Cholesterol', 185)
    if chol >= 240:
        recommendations.append({
            'biomarker': 'Total Cholesterol',
            'severity': 'high',
            'title': 'Hyperlipidemia Management',
            'action': 'Order a comprehensive fasting lipid panel (LDL-C, HDL-C, Triglycerides) and assess 10-year ASCVD risk.',
            'lifestyle': 'Minimize saturated and trans fats; increase soluble fiber intake (oats, legumes, psyllium).'
        })
    elif chol >= 200:
        recommendations.append({
            'biomarker': 'Total Cholesterol',
            'severity': 'medium',
            'title': 'Borderline Elevated Cholesterol',
            'action': 'Recheck lipid profile at your next wellness checkup.',
            'lifestyle': 'Incorporate heart-healthy unsaturated fats (olive oil, avocados, nuts).'
        })

    # BMI recommendations
    bmi = data.get('BMI', 24.5)
    if bmi >= 30.0:
        recommendations.append({
            'biomarker': 'BMI',
            'severity': 'medium',
            'title': 'Weight Management Strategy',
            'action': 'Discuss metabolic health and sustainable nutritional interventions with a healthcare provider.',
            'lifestyle': 'Target a balanced calorie deficit with high protein density and regular strength training.'
        })

    # Smoking
    if data.get('Smoking', 0) == 1:
        recommendations.append({
            'biomarker': 'Smoking',
            'severity': 'high',
            'title': 'Smoking Cessation Protocol',
            'action': 'Inquire about evidence-based cessation aids (nicotine replacement therapy, behavioral coaching).',
            'lifestyle': 'Smoking acts as a multiplicative risk multiplier when combined with hypertension or dyslipidemia.'
        })

    # Alcohol
    if data.get('Alcohol', 0) == 1:
        recommendations.append({
            'biomarker': 'Alcohol',
            'severity': 'medium',
            'title': 'Alcohol Intake Moderation',
            'action': 'Review weekly intake with your clinician.',
            'lifestyle': 'Limit intake to moderate limits (≤ 1 drink/day for women, ≤ 2 drinks/day for men) or consider cessation.'
        })

    # Physical Activity
    pa = data.get('Physical_Activity', 4.0)
    if pa < 2.5:
        recommendations.append({
            'biomarker': 'Physical Activity',
            'severity': 'medium',
            'title': 'Aerobic Activity Enhancement',
            'action': 'Progressively increase daily activity toward the WHO baseline of 150 minutes/week moderate activity.',
            'lifestyle': 'Start with 25-30 minute brisk walks 5 days/week plus 2 days of muscle-strengthening exercises.'
        })

    # If no high risk markers, provide wellness maintenance
    if not recommendations:
        recommendations.append({
            'biomarker': 'General Wellness',
            'severity': 'low',
            'title': 'Preventive Wellness Maintenance',
            'action': 'Continue regular annual preventive health checkups.',
            'lifestyle': 'Maintain balanced nutrition, regular hydration, 7-9 hours of restorative sleep, and routine physical activity.'
        })

    return recommendations


def predict_patient_risk(model: Any, input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes full inference pipeline: validation, feature ordering,
    probabilistic prediction, clinical tiering, biomarker analysis, and report generation.
    """
    is_valid, sanitized, errors = validate_inputs(input_data)
    if not is_valid:
        return {
            'success': False,
            'errors': errors
        }

    # Prepare DataFrame
    df_features = prepare_feature_dataframe(sanitized)

    # Predict class & probability
    raw_pred = int(model.predict(df_features)[0])

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(df_features)[0]
        prob_disease = float(probabilities[1])
        prob_healthy = float(probabilities[0])
    elif hasattr(model, "decision_function"):
        score = float(model.decision_function(df_features)[0])
        prob_disease = float(1 / (1 + np.exp(-score)))
        prob_healthy = float(1.0 - prob_disease)
    else:
        prob_disease = float(raw_pred)
        prob_healthy = float(1.0 - raw_pred)

    risk_tier, theme_color, badge_style = determine_risk_tier(prob_disease)
    indicators = evaluate_clinical_indicators(sanitized)
    recommendations = generate_clinical_recommendations(sanitized, prob_disease)

    # Determine primary contributing biomarkers
    contributing_factors = []
    for marker, info in indicators.items():
        if info['severity'] in ['danger', 'warning']:
            contributing_factors.append({
                'marker': marker,
                'status': info['status'],
                'severity': info['severity'],
                'value': info['value'],
                'unit': info['unit']
            })

    result = {
        'success': True,
        'prediction': raw_pred,
        'label': 'Elevated Disease Risk Detected' if raw_pred == 1 else 'Low Disease Risk (Healthy Baseline)',
        'probability_disease': prob_disease,
        'probability_healthy': prob_healthy,
        'confidence_percent': max(prob_disease, prob_healthy) * 100,
        'risk_tier': risk_tier,
        'theme_color': theme_color,
        'badge_style': badge_style,
        'clinical_indicators': indicators,
        'contributing_factors': contributing_factors,
        'recommendations': recommendations,
        'sanitized_inputs': sanitized
    }

    return result


def generate_text_report(prediction_result: Dict[str, Any], metadata: Optional[Dict[str, Any]] = None) -> str:
    """
    Generates a structured clinical summary report suitable for downloading or printing.
    """
    if not prediction_result.get('success'):
        return "Error: Unable to generate report for an invalid prediction."

    inputs = prediction_result['sanitized_inputs']
    prob = prediction_result['probability_disease'] * 100
    tier = prediction_result['risk_tier']
    label = prediction_result['label']

    model_name = metadata.get('model_name', 'Calibrated Machine Learning Ensemble') if metadata else 'Calibrated Machine Learning Ensemble'
    version = metadata.get('version', '2.0.0') if metadata else '2.0.0'

    report_lines = [
        "=" * 68,
        "          AI CLINICAL ASSESSMENT & DISEASE RISK REPORT",
        "=" * 68,
        f"Assessment Timestamp: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S UTC')}",
        f"Evaluation Engine:    {model_name} (v{version})",
        "",
        "-" * 68,
        "1. PREDICTION SUMMARY",
        "-" * 68,
        f"Overall Assessment:   {label.upper()}",
        f"Estimated Risk Score: {prob:.1f}% Calibrated Probability",
        f"Risk Category:        {tier}",
        "",
        "-" * 68,
        "2. PATIENT BIOMARKERS & VITALS",
        "-" * 68,
        f"Age:                  {inputs.get('Age')} years",
        f"BMI:                  {inputs.get('BMI'):.1f} kg/m²",
        f"Blood Pressure:       {inputs.get('Blood_Pressure')} mmHg (Systolic)",
        f"Fasting Glucose:      {inputs.get('Glucose_Level')} mg/dL",
        f"Total Cholesterol:    {inputs.get('Cholesterol')} mg/dL",
        f"Resting Heart Rate:   {inputs.get('Heart_Rate')} bpm",
        f"Smoking Status:       {'Yes (Smoker)' if inputs.get('Smoking') == 1 else 'No (Non-smoker)'}",
        f"Alcohol Intake:       {'Yes (Regular)' if inputs.get('Alcohol') == 1 else 'No / Rare'}",
        f"Physical Activity:    {inputs.get('Physical_Activity')} hours/week",
        f"Family History:       {'Positive' if inputs.get('Family_History') == 1 else 'Negative'}",
        "",
        "-" * 68,
        "3. ELEVATED BIOMARKERS & RISK DRIVERS",
        "-" * 68,
    ]

    drivers = prediction_result.get('contributing_factors', [])
    if drivers:
        for d in drivers:
            report_lines.append(f" • {d['marker']}: {d['value']} {d['unit']} -> [{d['status']}]")
    else:
        report_lines.append(" • All assessed biomarkers are currently within standard reference ranges.")

    report_lines.extend([
        "",
        "-" * 68,
        "4. EVIDENCE-BASED RECOMMENDATIONS & CLINICAL FOLLOW-UP",
        "-" * 68,
    ])

    recs = prediction_result.get('recommendations', [])
    for idx, r in enumerate(recs, 1):
        report_lines.append(f" {idx}. [{r['title']}]")
        report_lines.append(f"    Clinical Next Step: {r['action']}")
        report_lines.append(f"    Lifestyle Guidance: {r['lifestyle']}")

    report_lines.extend([
        "",
        "=" * 68,
        "IMPORTANT MEDICAL DISCLAIMER:",
        "This report is generated by an artificial intelligence decision-support tool",
        "and is intended strictly for educational, informational, and triage purposes.",
        "It does NOT constitute a clinical diagnosis, formal prognosis, or medical prescription.",
        "Always seek direct medical consultation from a qualified physician or healthcare provider.",
        "=" * 68
    ])

    return "\n".join(report_lines)
