// Mock historical trained models for history, dashboard, and comparison

export const INITIAL_TRAINED_MODELS = [
  {
    id: 'model-reg-001',
    name: 'Housing-XGBoost-v1',
    algorithmId: 'xgboost-regressor',
    algorithmName: 'XGBoost Regressor',
    task: 'Regression',
    datasetId: 'california-housing',
    datasetName: 'California Housing Prices',
    targetColumn: 'median_house_value',
    status: 'Completed',
    trainingTime: '2.4s',
    createdAt: '2026-03-22 16:45',
    splitRatio: '80 / 20',
    randomState: 42,
    hyperparameters: {
      n_estimators: 200,
      learning_rate: 0.05,
      max_depth: 6,
      colsample_bytree: 0.8
    },
    metrics: {
      r2: 0.912,
      adjustedR2: 0.908,
      mae: 0.285,
      mse: 0.142,
      rmse: 0.377
    }
  },
  {
    id: 'model-reg-002',
    name: 'Housing-RandomForest-Base',
    algorithmId: 'random-forest-regressor',
    algorithmName: 'Random Forest Regressor',
    task: 'Regression',
    datasetId: 'california-housing',
    datasetName: 'California Housing Prices',
    targetColumn: 'median_house_value',
    status: 'Completed',
    trainingTime: '3.8s',
    createdAt: '2026-03-21 11:20',
    splitRatio: '75 / 25',
    randomState: 42,
    hyperparameters: {
      n_estimators: 100,
      max_depth: 12,
      min_samples_split: 2,
      min_samples_leaf: 1
    },
    metrics: {
      r2: 0.884,
      adjustedR2: 0.879,
      mae: 0.324,
      mse: 0.187,
      rmse: 0.432
    }
  },
  {
    id: 'model-reg-003',
    name: 'Housing-GradientBoosting',
    algorithmId: 'gradient-boosting-regressor',
    algorithmName: 'Gradient Boosting Regressor',
    task: 'Regression',
    datasetId: 'california-housing',
    datasetName: 'California Housing Prices',
    targetColumn: 'median_house_value',
    status: 'Completed',
    trainingTime: '4.1s',
    createdAt: '2026-03-20 14:15',
    splitRatio: '80 / 20',
    randomState: 42,
    hyperparameters: {
      n_estimators: 150,
      learning_rate: 0.1,
      max_depth: 4
    },
    metrics: {
      r2: 0.896,
      adjustedR2: 0.891,
      mae: 0.301,
      mse: 0.165,
      rmse: 0.406
    }
  },
  {
    id: 'model-reg-004',
    name: 'Housing-LinearRegression-Baseline',
    algorithmId: 'linear-regression',
    algorithmName: 'Linear Regression',
    task: 'Regression',
    datasetId: 'california-housing',
    datasetName: 'California Housing Prices',
    targetColumn: 'median_house_value',
    status: 'Completed',
    trainingTime: '0.4s',
    createdAt: '2026-03-19 09:30',
    splitRatio: '80 / 20',
    randomState: 42,
    hyperparameters: {
      fit_intercept: true,
      copy_X: true
    },
    metrics: {
      r2: 0.642,
      adjustedR2: 0.638,
      mae: 0.528,
      mse: 0.524,
      rmse: 0.724
    }
  },
  {
    id: 'model-clf-001',
    name: 'Churn-XGBoost-Tuned',
    algorithmId: 'xgboost-classifier',
    algorithmName: 'XGBoost Classifier',
    task: 'Classification',
    datasetId: 'customer-churn',
    datasetName: 'Telco Customer Churn',
    targetColumn: 'Churn',
    status: 'Completed',
    trainingTime: '1.9s',
    createdAt: '2026-03-22 17:10',
    splitRatio: '80 / 20',
    randomState: 42,
    hyperparameters: {
      n_estimators: 120,
      learning_rate: 0.08,
      max_depth: 5,
      colsample_bytree: 0.85
    },
    metrics: {
      accuracy: 0.934,
      precision: 0.912,
      recall: 0.894,
      f1Score: 0.903,
      rocAuc: 0.968
    }
  },
  {
    id: 'model-clf-002',
    name: 'Churn-RandomForest-Opt',
    algorithmId: 'random-forest-classifier',
    algorithmName: 'Random Forest Classifier',
    task: 'Classification',
    datasetId: 'customer-churn',
    datasetName: 'Telco Customer Churn',
    targetColumn: 'Churn',
    status: 'Completed',
    trainingTime: '2.8s',
    createdAt: '2026-03-21 15:40',
    splitRatio: '80 / 20',
    randomState: 42,
    hyperparameters: {
      n_estimators: 100,
      max_depth: 10,
      criterion: 'gini'
    },
    metrics: {
      accuracy: 0.912,
      precision: 0.887,
      recall: 0.871,
      f1Score: 0.879,
      rocAuc: 0.954
    }
  },
  {
    id: 'model-clf-003',
    name: 'Churn-LogisticReg-L2',
    algorithmId: 'logistic-regression',
    algorithmName: 'Logistic Regression',
    task: 'Classification',
    datasetId: 'customer-churn',
    datasetName: 'Telco Customer Churn',
    targetColumn: 'Churn',
    status: 'Completed',
    trainingTime: '0.6s',
    createdAt: '2026-03-20 18:05',
    splitRatio: '70 / 30',
    randomState: 42,
    hyperparameters: {
      C: 1.0,
      penalty: 'l2',
      solver: 'lbfgs',
      max_iter: 200
    },
    metrics: {
      accuracy: 0.825,
      precision: 0.781,
      recall: 0.742,
      f1Score: 0.761,
      rocAuc: 0.876
    }
  },
  {
    id: 'model-clf-004',
    name: 'Churn-SupportVectorMachine',
    algorithmId: 'support-vector-machine',
    algorithmName: 'Support Vector Machine (SVM)',
    task: 'Classification',
    datasetId: 'customer-churn',
    datasetName: 'Telco Customer Churn',
    targetColumn: 'Churn',
    status: 'Completed',
    trainingTime: '5.2s',
    createdAt: '2026-03-19 14:50',
    splitRatio: '80 / 20',
    randomState: 42,
    hyperparameters: {
      C: 2.0,
      kernel: 'rbf',
      probability: true
    },
    metrics: {
      accuracy: 0.889,
      precision: 0.865,
      recall: 0.832,
      f1Score: 0.848,
      rocAuc: 0.928
    }
  }
];
