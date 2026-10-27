"""
Disease Prediction System - Evaluation Module
Calculates standard and clinical machine learning metrics including
precision, recall, F1, macro/weighted F1, ROC-AUC, Brier score, and confusion matrix.
"""

from typing import Dict, Any
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    roc_curve,
    brier_score_loss,
    confusion_matrix,
    classification_report,
    make_scorer
)
from sklearn.calibration import calibration_curve
from sklearn.model_selection import cross_validate, StratifiedKFold


def evaluate_model_performance(
    model: Any,
    X_test: pd.DataFrame,
    y_test: pd.Series
) -> Dict[str, Any]:
    """
    Computes a comprehensive suite of offline evaluation metrics on held-out test data.
    """
    y_pred = model.predict(X_test)

    # Probability estimation with fallback
    if hasattr(model, "predict_proba"):
        y_proba = model.predict_proba(X_test)[:, 1]
    elif hasattr(model, "decision_function"):
        raw_decision = model.decision_function(X_test)
        y_proba = 1 / (1 + np.exp(-raw_decision))
    else:
        y_proba = y_pred.astype(float)

    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()

    metrics = {
        'accuracy': float(accuracy_score(y_test, y_pred)),
        'precision': float(precision_score(y_test, y_pred, zero_division=0)),
        'recall': float(recall_score(y_test, y_pred, zero_division=0)),
        'f1': float(f1_score(y_test, y_pred, zero_division=0)),
        'macro_f1': float(f1_score(y_test, y_pred, average='macro', zero_division=0)),
        'weighted_f1': float(f1_score(y_test, y_pred, average='weighted', zero_division=0)),
        'roc_auc': float(roc_auc_score(y_test, y_proba)),
        'brier_score': float(brier_score_loss(y_test, y_proba)),
        'confusion_matrix': {
            'tn': int(tn),
            'fp': int(fp),
            'fn': int(fn),
            'tp': int(tp),
            'matrix': cm.tolist()
        },
        'per_class_report': classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    }

    # ROC curve points
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    step = max(1, len(fpr) // 50)
    metrics['roc_curve'] = {
        'fpr': fpr[::step].tolist(),
        'tpr': tpr[::step].tolist()
    }

    # Calibration curve
    prob_true, prob_pred = calibration_curve(y_test, y_proba, n_bins=8, strategy='uniform')
    metrics['calibration_curve'] = {
        'prob_true': prob_true.tolist(),
        'prob_pred': prob_pred.tolist()
    }

    return metrics


def run_cross_validation(
    pipeline: Any,
    X: pd.DataFrame,
    y: pd.Series,
    cv_splits: int = 5,
    random_state: int = 42
) -> Dict[str, float]:
    """
    Executes Stratified K-Fold cross validation and computes mean and std for key metrics.
    """
    skf = StratifiedKFold(n_splits=cv_splits, shuffle=True, random_state=random_state)
    scoring = {
        'accuracy': 'accuracy',
        'precision': make_scorer(precision_score, zero_division=0),
        'recall': make_scorer(recall_score, zero_division=0),
        'f1_macro': make_scorer(f1_score, average='macro', zero_division=0),
        'roc_auc': 'roc_auc'
    }

    cv_res = cross_validate(
        pipeline, X, y,
        cv=skf,
        scoring=scoring,
        n_jobs=1
    )

    return {
        'cv_accuracy_mean': float(cv_res['test_accuracy'].mean()),
        'cv_accuracy_std': float(cv_res['test_accuracy'].std()),
        'cv_recall_mean': float(cv_res['test_recall'].mean()),
        'cv_recall_std': float(cv_res['test_recall'].std()),
        'cv_f1_macro_mean': float(cv_res['test_f1_macro'].mean()),
        'cv_f1_macro_std': float(cv_res['test_f1_macro'].std()),
        'cv_roc_auc_mean': float(cv_res['test_roc_auc'].mean()),
        'cv_roc_auc_std': float(cv_res['test_roc_auc'].std())
    }
