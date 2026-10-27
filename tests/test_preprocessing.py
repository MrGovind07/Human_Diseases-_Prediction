"""
Unit tests for preprocessing and validation module.
"""

import pandas as pd
from preprocessing import (
    FEATURE_NAMES,
    FEATURE_SPECS,
    DEMO_PROFILES,
    validate_inputs,
    prepare_feature_dataframe,
    evaluate_clinical_indicators
)


def test_feature_names_list():
    assert len(FEATURE_NAMES) == 10
    assert 'Age' in FEATURE_NAMES
    assert 'Glucose_Level' in FEATURE_NAMES
    assert 'Physical_Activity' in FEATURE_NAMES


def test_valid_input_passes():
    valid_data = {
        'Age': 40,
        'BMI': 23.5,
        'Blood_Pressure': 120,
        'Glucose_Level': 90,
        'Cholesterol': 180,
        'Heart_Rate': 72,
        'Smoking': 0,
        'Alcohol': 0,
        'Physical_Activity': 4.0,
        'Family_History': 0
    }
    is_valid, sanitized, errors = validate_inputs(valid_data)
    assert is_valid is True
    assert len(errors) == 0
    assert sanitized['Age'] == 40
    assert sanitized['BMI'] == 23.5


def test_missing_field_fails():
    incomplete_data = {
        'Age': 40,
        'BMI': 23.5
        # Missing all other fields
    }
    is_valid, sanitized, errors = validate_inputs(incomplete_data)
    assert is_valid is False
    assert len(errors) > 0
    assert any("Blood_Pressure" in e for e in errors)


def test_out_of_bounds_input_fails():
    invalid_data = {
        'Age': 150,  # Max is 120
        'BMI': 23.5,
        'Blood_Pressure': 120,
        'Glucose_Level': 90,
        'Cholesterol': 180,
        'Heart_Rate': 72,
        'Smoking': 0,
        'Alcohol': 0,
        'Physical_Activity': 4.0,
        'Family_History': 0
    }
    is_valid, sanitized, errors = validate_inputs(invalid_data)
    assert is_valid is False
    assert any("Age" in e and "outside valid" in e for e in errors)


def test_invalid_type_fails():
    bad_type = {
        'Age': "not_a_number",
        'BMI': 23.5,
        'Blood_Pressure': 120,
        'Glucose_Level': 90,
        'Cholesterol': 180,
        'Heart_Rate': 72,
        'Smoking': 0,
        'Alcohol': 0,
        'Physical_Activity': 4.0,
        'Family_History': 0
    }
    is_valid, sanitized, errors = validate_inputs(bad_type)
    assert is_valid is False
    assert any("valid number" in e for e in errors)


def test_prepare_feature_dataframe():
    valid_data = DEMO_PROFILES['Low-Risk / Healthy Adult']
    df = prepare_feature_dataframe(valid_data)
    assert isinstance(df, pd.DataFrame)
    assert df.shape == (1, 10)
    assert list(df.columns) == FEATURE_NAMES


def test_clinical_indicators_evaluation():
    high_risk_data = {
        'Age': 65,
        'BMI': 32.0,            # Obese
        'Blood_Pressure': 150,  # Stage 2 Hypertension
        'Glucose_Level': 140,   # Diabetic range
        'Cholesterol': 260,     # High
        'Heart_Rate': 80,
        'Smoking': 1,
        'Alcohol': 1,
        'Physical_Activity': 1.0, # Below WHO
        'Family_History': 1
    }
    indicators = evaluate_clinical_indicators(high_risk_data)
    assert indicators['BMI']['severity'] == 'danger'
    assert indicators['Blood_Pressure']['severity'] == 'danger'
    assert indicators['Glucose_Level']['severity'] == 'danger'
    assert indicators['Cholesterol']['severity'] == 'danger'
    assert indicators['Smoking']['severity'] == 'danger'


def test_all_demo_profiles_valid():
    for name, profile in DEMO_PROFILES.items():
        is_valid, sanitized, errors = validate_inputs(profile)
        assert is_valid is True, f"Demo profile '{name}' failed validation: {errors}"
