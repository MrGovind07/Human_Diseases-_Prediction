"""
Unit tests for model loading, predictions, and metadata.
"""

import os
from model_utils import (
    load_model,
    load_model_metadata,
    load_candidate_benchmarks,
    predict_patient_risk
)
from preprocessing import DEMO_PROFILES


def test_model_artifact_exists():
    assert os.path.exists(os.path.join("models", "disease_prediction_pipeline.pkl")) or os.path.exists("disease_model.pkl")


def test_load_model_succeeds():
    model = load_model()
    assert model is not None
    assert hasattr(model, "predict")
    assert hasattr(model, "predict_proba")


def test_load_metadata():
    metadata = load_model_metadata()
    assert isinstance(metadata, dict)
    assert 'production_metrics' in metadata
    assert 'accuracy' in metadata['production_metrics']
    assert metadata['production_metrics']['accuracy'] > 0.90


def test_candidate_benchmarks():
    benchmarks = load_candidate_benchmarks()
    assert isinstance(benchmarks, list)
    assert len(benchmarks) >= 5
    model_names = [b['model_name'] for b in benchmarks]
    assert any("XGBoost" in name for name in model_names)
    assert any("Original" in name or "KNN" in name for name in model_names)


def test_predict_patient_risk_low_risk():
    model = load_model()
    healthy_profile = DEMO_PROFILES['Low-Risk / Healthy Adult']
    result = predict_patient_risk(model, healthy_profile)

    assert result['success'] is True
    assert result['prediction'] == 0
    assert result['probability_disease'] < 0.50
    assert 'Low' in result['risk_tier']
    assert 0.0 <= result['probability_disease'] <= 1.0
    assert 0.0 <= result['probability_healthy'] <= 1.0
    assert abs((result['probability_disease'] + result['probability_healthy']) - 1.0) < 1e-4


def test_predict_patient_risk_high_risk():
    model = load_model()
    high_risk_profile = DEMO_PROFILES['High Risk / Cardiometabolic Profile']
    result = predict_patient_risk(model, high_risk_profile)

    assert result['success'] is True
    assert result['prediction'] == 1
    assert result['probability_disease'] > 0.50
    assert 'Elevated' in result['label'] or 'Risk' in result['label']
    assert len(result['contributing_factors']) > 0


def test_deterministic_predictions():
    model = load_model()
    profile = DEMO_PROFILES['Moderate / Borderline Risk Profile']
    res1 = predict_patient_risk(model, profile)
    res2 = predict_patient_risk(model, profile)

    assert res1['prediction'] == res2['prediction']
    assert abs(res1['probability_disease'] - res2['probability_disease']) < 1e-6
