"""
Integration tests for end-to-end prediction pipeline and report generation.
"""

from model_utils import (
    load_model,
    load_model_metadata,
    predict_patient_risk,
    generate_text_report
)
from preprocessing import DEMO_PROFILES


def test_end_to_end_flow_and_report_generation():
    model = load_model()
    metadata = load_model_metadata()

    for name, profile in DEMO_PROFILES.items():
        res = predict_patient_risk(model, profile)
        assert res['success'] is True

        report = generate_text_report(res, metadata)
        assert isinstance(report, str)
        assert "AI CLINICAL ASSESSMENT & DISEASE RISK REPORT" in report
        assert "PREDICTION SUMMARY" in report
        assert "PATIENT BIOMARKERS & VITALS" in report
        assert "IMPORTANT MEDICAL DISCLAIMER" in report
        assert f"{res['risk_tier']}" in report


def test_report_generation_handles_errors():
    invalid_result = {'success': False, 'errors': ['Test error']}
    report = generate_text_report(invalid_result)
    assert "Error" in report
