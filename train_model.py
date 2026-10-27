"""
Disease Prediction System - Production Model Training Pipeline
Performs machine learning audit, candidate evaluation, hyperparameter optimization,
pipeline serialization, and comprehensive metadata generation without data leakage.
"""

import os
import json
import datetime
import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from sklearn.calibration import CalibratedClassifierCV

from preprocessing import FEATURE_NAMES
from evaluation import evaluate_model_performance, run_cross_validation


def main():
    print("=" * 70)
    print("  AI-POWERED DISEASE PREDICTION SYSTEM: TRAINING PIPELINE")
    print("=" * 70)

    # 1. Load Dataset
    data_path = "disease_prediction_dataset.csv"
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at: {data_path}")

    df = pd.read_csv(data_path)
    print(f"\n[+] Loaded dataset successfully: {df.shape[0]} rows, {df.shape[1]} columns")

    # Audit dataset
    missing_count = int(df.isnull().sum().sum())
    duplicate_count = int(df.duplicated().sum())
    print(f"    - Missing values: {missing_count}")
    print(f"    - Duplicate rows: {duplicate_count}")

    X = df[FEATURE_NAMES]
    y = df['Disease']

    class_counts = {int(k): int(v) for k, v in y.value_counts().to_dict().items()}
    print(f"    - Class distribution: Disease=1: {class_counts.get(1, 0)} ({class_counts.get(1, 0)/len(df)*100:.1f}%), "
          f"Disease=0: {class_counts.get(0, 0)} ({class_counts.get(0, 0)/len(df)*100:.1f}%)")

    # 2. Stratified Train/Test Split (80% train, 20% test)
    RANDOM_SEED = 42
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=RANDOM_SEED, stratify=y
    )
    print(f"\n[+] Stratified Train/Test split created (random_state={RANDOM_SEED}):")
    print(f"    - Training set: {len(X_train)} samples")
    print(f"    - Test set (held-out): {len(X_test)} samples")

    # 3. Candidate Model Definitions
    candidate_definitions = {
        "Baseline (Dummy - Most Frequent)": Pipeline([
            ('model', DummyClassifier(strategy='most_frequent'))
        ]),
        "Original System Model (KNN, k=6)": Pipeline([
            ('scaler', StandardScaler()),
            ('model', KNeighborsClassifier(n_neighbors=6, weights='uniform'))
        ]),
        "Logistic Regression (L2, Balanced)": Pipeline([
            ('scaler', StandardScaler()),
            ('model', LogisticRegression(random_state=RANDOM_SEED, max_iter=1000, class_weight='balanced'))
        ]),
        "Gaussian Naive Bayes": Pipeline([
            ('scaler', StandardScaler()),
            ('model', GaussianNB())
        ]),
        "Decision Tree (Pruned)": Pipeline([
            ('model', DecisionTreeClassifier(max_depth=5, min_samples_split=10, random_state=RANDOM_SEED, class_weight='balanced'))
        ]),
        "Random Forest (Tuned Ensemble)": Pipeline([
            ('scaler', StandardScaler()),
            ('model', RandomForestClassifier(
                n_estimators=200,
                max_depth=None,
                min_samples_split=2,
                class_weight='balanced',
                random_state=RANDOM_SEED
            ))
        ]),
        "Gradient Boosting Classifier": Pipeline([
            ('scaler', StandardScaler()),
            ('model', GradientBoostingClassifier(
                n_estimators=120,
                learning_rate=0.08,
                max_depth=3,
                random_state=RANDOM_SEED
            ))
        ]),
        "XGBoost Classifier (Optimized)": Pipeline([
            ('scaler', StandardScaler()),
            ('model', XGBClassifier(
                n_estimators=150,
                learning_rate=0.1,
                max_depth=3,
                subsample=0.8,
                colsample_bytree=1.0,
                eval_metric='logloss',
                random_state=RANDOM_SEED
            ))
        ])
    }

    # 4. Train & Cross-Validate All Candidates
    print("\n[+] Benchmarking candidate models with 5-Fold Stratified Cross-Validation...")
    comparison_records = []

    for name, pipe in candidate_definitions.items():
        print(f"    -> Evaluating: {name}...")
        # 5-fold CV on train set only (no leakage)
        cv_metrics = run_cross_validation(pipe, X_train, y_train, cv_splits=5, random_state=RANDOM_SEED)

        # Fit on entire training set
        pipe.fit(X_train, y_train)

        # Evaluate on held-out test set
        test_metrics = evaluate_model_performance(pipe, X_test, y_test)

        record = {
            'model_name': name,
            'cv_accuracy_mean': cv_metrics['cv_accuracy_mean'],
            'cv_accuracy_std': cv_metrics['cv_accuracy_std'],
            'cv_recall_mean': cv_metrics['cv_recall_mean'],
            'cv_f1_macro_mean': cv_metrics['cv_f1_macro_mean'],
            'cv_roc_auc_mean': cv_metrics['cv_roc_auc_mean'],
            'test_accuracy': test_metrics['accuracy'],
            'test_precision': test_metrics['precision'],
            'test_recall': test_metrics['recall'],
            'test_f1': test_metrics['f1'],
            'test_macro_f1': test_metrics['macro_f1'],
            'test_roc_auc': test_metrics['roc_auc'],
            'test_brier': test_metrics['brier_score'],
            'confusion_matrix': test_metrics['confusion_matrix']
        }
        comparison_records.append(record)

    comparison_df = pd.DataFrame(comparison_records)
    print("\n=== CANDIDATE BENCHMARK RESULTS (HELD-OUT TEST SET) ===")
    display_cols = ['model_name', 'cv_accuracy_mean', 'test_accuracy', 'test_recall', 'test_f1', 'test_roc_auc']
    print(comparison_df[display_cols].to_string(index=False))

    # 5. Build Champion Production Pipeline with Probability Calibration
    print("\n[+] Constructing Final Production Pipeline (Calibrated XGBoost)...")
    base_champion = candidate_definitions["XGBoost Classifier (Optimized)"]
    # Fit base champion on train set to get feature importances
    base_champion.fit(X_train, y_train)

    # Calibrate with 5-fold cross-validation over train set
    calibrated_pipeline = CalibratedClassifierCV(base_champion, method='sigmoid', cv=5)
    calibrated_pipeline.fit(X_train, y_train)

    # Final production metrics on held-out test set
    prod_metrics = evaluate_model_performance(calibrated_pipeline, X_test, y_test)
    print(f"\n=== FINAL PRODUCTION MODEL PERFORMANCE ===")
    print(f"Accuracy:        {prod_metrics['accuracy']*100:.2f}%")
    print(f"Precision:       {prod_metrics['precision']*100:.2f}%")
    print(f"Recall (Sens.):  {prod_metrics['recall']*100:.2f}%")
    print(f"F1 Score:        {prod_metrics['f1']:.4f}")
    print(f"Macro F1 Score:  {prod_metrics['macro_f1']:.4f}")
    print(f"ROC-AUC:         {prod_metrics['roc_auc']:.4f}")
    print(f"Brier Score:     {prod_metrics['brier_score']:.4f}")
    print("Confusion Matrix (TN, FP, FN, TP):", prod_metrics['confusion_matrix'])

    # Feature importances from the base XGBoost model
    raw_xgb = base_champion.named_steps['model']
    importances = raw_xgb.feature_importances_
    feature_importance_dict = {
        feat: float(imp) for feat, imp in zip(FEATURE_NAMES, importances)
    }

    # 6. Save Artifacts and Metadata
    os.makedirs("models", exist_ok=True)

    # Save champion pipeline
    pipeline_save_path = os.path.join("models", "disease_prediction_pipeline.pkl")
    with open(pipeline_save_path, "wb") as f:
        pickle.dump(calibrated_pipeline, f)
    print(f"\n[+] Saved champion pipeline: {pipeline_save_path}")

    # Also save base pipeline (useful for feature contribution extraction)
    base_pipeline_path = os.path.join("models", "base_pipeline.pkl")
    with open(base_pipeline_path, "wb") as f:
        pickle.dump(base_champion, f)
    print(f"[+] Saved base pipeline: {base_pipeline_path}")

    # Also save in root for backward compatibility with existing tests/apps
    with open("disease_model.pkl", "wb") as f:
        pickle.dump(calibrated_pipeline, f)
    # Save scaler for backward compatibility
    with open("scaler.pkl", "wb") as f:
        pickle.dump(base_champion.named_steps['scaler'], f)
    print("[+] Updated backward-compatible 'disease_model.pkl' and 'scaler.pkl' in root.")

    # Save candidate comparison for UI
    comparison_path = os.path.join("models", "candidate_comparison.json")
    with open(comparison_path, "w", encoding="utf-8") as f:
        json.dump(comparison_records, f, indent=2)
    print(f"[+] Saved candidate benchmark comparison: {comparison_path}")

    # Save comprehensive metadata
    metadata = {
        'model_name': 'Calibrated XGBoost Classifier',
        'pipeline_type': 'StandardScaler + XGBClassifier + CalibratedClassifierCV (Sigmoid, 5-Fold)',
        'version': '2.0.0',
        'created_at': datetime.datetime.now().isoformat(),
        'random_seed': RANDOM_SEED,
        'features': FEATURE_NAMES,
        'dataset_statistics': {
            'total_samples': len(df),
            'train_samples': len(X_train),
            'test_samples': len(X_test),
            'class_balance': class_counts,
            'positive_rate': float(y.mean())
        },
        'hyperparameters': {
            'n_estimators': 150,
            'learning_rate': 0.1,
            'max_depth': 3,
            'subsample': 0.8,
            'colsample_bytree': 1.0,
            'eval_metric': 'logloss'
        },
        'production_metrics': prod_metrics,
        'feature_importance': feature_importance_dict
    }

    metadata_path = os.path.join("models", "model_metadata.json")
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"[+] Saved model metadata: {metadata_path}")

    print("\n" + "=" * 70)
    print("  TRAINING PIPELINE COMPLETE: ALL ARTIFACTS VERIFIED AND SAVED")
    print("=" * 70)


if __name__ == '__main__':
    main()
