"""
Disease Prediction System - Preprocessing & Input Validation Module
Provides consistent schema enforcement, range validation, clinical reference
evaluations, and demo patient archetypes.
"""

from typing import Dict, Any, Tuple, List
import pandas as pd
import numpy as np

# Exact feature ordering expected by trained models
FEATURE_NAMES: List[str] = [
    'Age',
    'BMI',
    'Blood_Pressure',
    'Glucose_Level',
    'Cholesterol',
    'Heart_Rate',
    'Smoking',
    'Alcohol',
    'Physical_Activity',
    'Family_History'
]

# Feature specifications with physiological constraints and defaults
FEATURE_SPECS: Dict[str, Dict[str, Any]] = {
    'Age': {
        'type': int,
        'min': 18,
        'max': 120,
        'default': 45,
        'unit': 'years',
        'label': 'Age',
        'category': 'Demographics'
    },
    'BMI': {
        'type': float,
        'min': 10.0,
        'max': 60.0,
        'default': 24.5,
        'unit': 'kg/m²',
        'label': 'Body Mass Index (BMI)',
        'category': 'Biometrics'
    },
    'Blood_Pressure': {
        'type': int,
        'min': 60,
        'max': 250,
        'default': 120,
        'unit': 'mmHg (Systolic)',
        'label': 'Systolic Blood Pressure',
        'category': 'Vitals'
    },
    'Glucose_Level': {
        'type': int,
        'min': 50,
        'max': 400,
        'default': 95,
        'unit': 'mg/dL (Fasting)',
        'label': 'Fasting Glucose Level',
        'category': 'Metabolic'
    },
    'Cholesterol': {
        'type': int,
        'min': 100,
        'max': 500,
        'default': 185,
        'unit': 'mg/dL (Total)',
        'label': 'Total Cholesterol',
        'category': 'Metabolic'
    },
    'Heart_Rate': {
        'type': int,
        'min': 40,
        'max': 220,
        'default': 72,
        'unit': 'bpm (Resting)',
        'label': 'Resting Heart Rate',
        'category': 'Vitals'
    },
    'Smoking': {
        'type': int,
        'min': 0,
        'max': 1,
        'default': 0,
        'unit': 'binary',
        'label': 'Smoking Status',
        'category': 'Lifestyle'
    },
    'Alcohol': {
        'type': int,
        'min': 0,
        'max': 1,
        'default': 0,
        'unit': 'binary',
        'label': 'Regular Alcohol Intake',
        'category': 'Lifestyle'
    },
    'Physical_Activity': {
        'type': float,
        'min': 0.0,
        'max': 40.0,
        'default': 4.0,
        'unit': 'hours/week',
        'label': 'Physical Activity',
        'category': 'Lifestyle'
    },
    'Family_History': {
        'type': int,
        'min': 0,
        'max': 1,
        'default': 0,
        'unit': 'binary',
        'label': 'Family History of Chronic Disease',
        'category': 'Genetics'
    }
}

# Standard clinical guidelines for context and educational interpretation
CLINICAL_GUIDELINES = {
    'BMI': [
        (18.5, 'Underweight', 'info'),
        (24.9, 'Normal Weight', 'success'),
        (29.9, 'Overweight', 'warning'),
        (float('inf'), 'Obese', 'danger')
    ],
    'Blood_Pressure': [
        (119, 'Normal (< 120 mmHg)', 'success'),
        (129, 'Elevated (120-129 mmHg)', 'warning'),
        (139, 'Stage 1 Hypertension (130-139 mmHg)', 'warning'),
        (float('inf'), 'Stage 2 Hypertension (≥ 140 mmHg)', 'danger')
    ],
    'Glucose_Level': [
        (99, 'Normal Fasting (< 100 mg/dL)', 'success'),
        (125, 'Pre-diabetes (100-125 mg/dL)', 'warning'),
        (float('inf'), 'Diabetic Range (≥ 126 mg/dL)', 'danger')
    ],
    'Cholesterol': [
        (199, 'Desirable (< 200 mg/dL)', 'success'),
        (239, 'Borderline High (200-239 mg/dL)', 'warning'),
        (float('inf'), 'High (≥ 240 mg/dL)', 'danger')
    ],
    'Heart_Rate': [
        (59, 'Bradycardia / Athletic (< 60 bpm)', 'info'),
        (100, 'Normal Resting (60-100 bpm)', 'success'),
        (float('inf'), 'Tachycardia (> 100 bpm)', 'warning')
    ],
    'Physical_Activity': [
        (2.49, 'Below WHO Guideline (< 2.5 hrs/wk)', 'warning'),
        (float('inf'), 'Meets/Exceeds WHO Guideline (≥ 2.5 hrs/wk)', 'success')
    ]
}

# Pre-packaged demo patient archetypes for testing and evaluation
DEMO_PROFILES: Dict[str, Dict[str, Any]] = {
    'Low-Risk / Healthy Adult': {
        'Age': 28,
        'BMI': 22.1,
        'Blood_Pressure': 115,
        'Glucose_Level': 88,
        'Cholesterol': 170,
        'Heart_Rate': 68,
        'Smoking': 0,
        'Alcohol': 0,
        'Physical_Activity': 5.5,
        'Family_History': 0,
        'description': 'Young adult with optimal metabolic indicators, active lifestyle, and non-smoker.'
    },
    'Moderate / Borderline Risk Profile': {
        'Age': 48,
        'BMI': 27.4,
        'Blood_Pressure': 132,
        'Glucose_Level': 112,
        'Cholesterol': 215,
        'Heart_Rate': 78,
        'Smoking': 0,
        'Alcohol': 1,
        'Physical_Activity': 2.0,
        'Family_History': 0,
        'description': 'Middle-aged individual with borderline hypertension, pre-diabetic glucose, and sub-optimal exercise.'
    },
    'High Risk / Cardiometabolic Profile': {
        'Age': 64,
        'BMI': 33.5,
        'Blood_Pressure': 165,
        'Glucose_Level': 195,
        'Cholesterol': 275,
        'Heart_Rate': 88,
        'Smoking': 1,
        'Alcohol': 1,
        'Physical_Activity': 1.0,
        'Family_History': 1,
        'description': 'Senior patient presenting Stage 2 hypertension, diabetic-range glucose, obesity, and smoking.'
    }
}


def validate_inputs(data: Dict[str, Any]) -> Tuple[bool, Dict[str, Any], List[str]]:
    """
    Validates patient input against defined schemas and physical limits.
    
    Returns:
        is_valid: bool
        sanitized_data: sanitized dictionary with proper types
        errors: list of error strings if any
    """
    errors: List[str] = []
    sanitized: Dict[str, Any] = {}

    if not isinstance(data, dict):
        return False, {}, ["Input must be a key-value dictionary of health parameters."]

    for feature in FEATURE_NAMES:
        if feature not in data:
            errors.append(f"Missing required parameter: '{feature}'.")
            continue

        raw_val = data[feature]
        spec = FEATURE_SPECS[feature]
        expected_type = spec['type']

        # Type conversion attempt
        try:
            if expected_type == int:
                val = int(raw_val)
            else:
                val = float(raw_val)
        except (ValueError, TypeError):
            errors.append(f"'{feature}' must be a valid number (received: {raw_val}).")
            continue

        # Range verification
        if val < spec['min'] or val > spec['max']:
            errors.append(
                f"'{feature}' value {val} is outside valid physiological range "
                f"[{spec['min']}, {spec['max']}] {spec['unit']}."
            )
            continue

        sanitized[feature] = val

    return (len(errors) == 0), sanitized, errors


def prepare_feature_dataframe(data: Dict[str, Any]) -> pd.DataFrame:
    """
    Constructs a single-row pandas DataFrame with guaranteed column order and types.
    """
    is_valid, sanitized, errors = validate_inputs(data)
    if not is_valid:
        raise ValueError(f"Input validation failed: {'; '.join(errors)}")

    ordered_dict = {f: [sanitized[f]] for f in FEATURE_NAMES}
    return pd.DataFrame(ordered_dict)


def evaluate_clinical_indicators(data: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """
    Evaluates individual patient biomarkers against clinical reference ranges.
    Returns status label, severity ('success', 'info', 'warning', 'danger'),
    and contextual notes for each marker.
    """
    results = {}

    for marker, thresholds in CLINICAL_GUIDELINES.items():
        if marker not in data:
            continue
        val = data[marker]
        matched_status = "Unknown"
        matched_severity = "info"

        for limit, status_text, severity in thresholds:
            if val <= limit:
                matched_status = status_text
                matched_severity = severity
                break

        results[marker] = {
            'value': val,
            'unit': FEATURE_SPECS[marker]['unit'],
            'status': matched_status,
            'severity': matched_severity
        }

    # Binary lifestyle features
    if 'Smoking' in data:
        results['Smoking'] = {
            'value': 'Yes' if data['Smoking'] == 1 else 'No',
            'unit': '',
            'status': 'Elevated Cardiovascular Risk' if data['Smoking'] == 1 else 'Non-Smoker (Low Risk)',
            'severity': 'danger' if data['Smoking'] == 1 else 'success'
        }

    if 'Alcohol' in data:
        results['Alcohol'] = {
            'value': 'Yes' if data['Alcohol'] == 1 else 'No',
            'unit': '',
            'status': 'Regular Consumption' if data['Alcohol'] == 1 else 'Low / Non-Drinker',
            'severity': 'warning' if data['Alcohol'] == 1 else 'success'
        }

    if 'Family_History' in data:
        results['Family_History'] = {
            'value': 'Yes' if data['Family_History'] == 1 else 'No',
            'unit': '',
            'status': 'Genetic Predisposition' if data['Family_History'] == 1 else 'No Known History',
            'severity': 'warning' if data['Family_History'] == 1 else 'success'
        }

    return results
