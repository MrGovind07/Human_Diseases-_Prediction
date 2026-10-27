"""
Test Runner using Python standard library (no external pytest dependency required).
"""

import sys
import os
import traceback

# Ensure workspace root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from tests.test_preprocessing import (
    test_feature_names_list,
    test_valid_input_passes,
    test_missing_field_fails,
    test_out_of_bounds_input_fails,
    test_invalid_type_fails,
    test_prepare_feature_dataframe,
    test_clinical_indicators_evaluation,
    test_all_demo_profiles_valid
)

from tests.test_model import (
    test_model_artifact_exists,
    test_load_model_succeeds,
    test_load_metadata,
    test_candidate_benchmarks,
    test_predict_patient_risk_low_risk,
    test_predict_patient_risk_high_risk,
    test_deterministic_predictions
)

from tests.test_pipeline import (
    test_end_to_end_flow_and_report_generation,
    test_report_generation_handles_errors
)


def run_all_tests():
    test_functions = [
        # Preprocessing tests
        test_feature_names_list,
        test_valid_input_passes,
        test_missing_field_fails,
        test_out_of_bounds_input_fails,
        test_invalid_type_fails,
        test_prepare_feature_dataframe,
        test_clinical_indicators_evaluation,
        test_all_demo_profiles_valid,
        # Model tests
        test_model_artifact_exists,
        test_load_model_succeeds,
        test_load_metadata,
        test_candidate_benchmarks,
        test_predict_patient_risk_low_risk,
        test_predict_patient_risk_high_risk,
        test_deterministic_predictions,
        # Pipeline tests
        test_end_to_end_flow_and_report_generation,
        test_report_generation_handles_errors
    ]

    passed = 0
    failed = 0

    print("=" * 65)
    print("  RUNNING AUTOMATED TEST SUITE")
    print("=" * 65)

    for test_fn in test_functions:
        test_name = test_fn.__name__
        try:
            test_fn()
            print(f" [PASS] {test_name}")
            passed += 1
        except Exception as e:
            print(f" [FAIL] {test_name}: {e}")
            traceback.print_exc()
            failed += 1

    print("=" * 65)
    print(f" Total Tests: {len(test_functions)} | Passed: {passed} | Failed: {failed}")
    print("=" * 65)

    if failed > 0:
        sys.exit(1)


if __name__ == '__main__':
    run_all_tests()
