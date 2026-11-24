// Demonstration Evaluation Metrics and Chart Data Generator

export const getRegressionDemoMetrics = (algorithmName = 'Random Forest Regressor') => {
  return {
    isDemo: true,
    algorithm: algorithmName,
    task: 'Regression',
    dataset: 'California Housing Prices',
    metrics: {
      r2: 0.8842,
      adjustedR2: 0.8795,
      mae: 0.3241,
      mse: 0.1872,
      rmse: 0.4326,
      explainedVariance: 0.8856,
      maxError: 1.482
    },
    actualVsPredicted: [
      { actual: 1.2, predicted: 1.15, index: 1 },
      { actual: 1.8, predicted: 1.92, index: 2 },
      { actual: 2.1, predicted: 2.05, index: 3 },
      { actual: 2.5, predicted: 2.44, index: 4 },
      { actual: 2.9, predicted: 3.12, index: 5 },
      { actual: 3.2, predicted: 3.18, index: 6 },
      { actual: 3.6, predicted: 3.75, index: 7 },
      { actual: 4.0, predicted: 3.89, index: 8 },
      { actual: 4.4, predicted: 4.52, index: 9 },
      { actual: 4.8, predicted: 4.67, index: 10 },
      { actual: 1.5, predicted: 1.62, index: 11 },
      { actual: 2.3, predicted: 2.21, index: 12 },
      { actual: 2.8, predicted: 2.95, index: 13 },
      { actual: 3.4, predicted: 3.29, index: 14 },
      { actual: 3.9, predicted: 4.10, index: 15 },
      { actual: 4.6, predicted: 4.41, index: 16 },
      { actual: 5.0, predicted: 4.88, index: 17 }
    ],
    residuals: [
      { predicted: 1.15, residual: 0.05 },
      { predicted: 1.92, residual: -0.12 },
      { predicted: 2.05, residual: 0.05 },
      { predicted: 2.44, residual: 0.06 },
      { predicted: 3.12, residual: -0.22 },
      { predicted: 3.18, residual: 0.02 },
      { predicted: 3.75, residual: -0.15 },
      { predicted: 3.89, residual: 0.11 },
      { predicted: 4.52, residual: -0.12 },
      { predicted: 4.67, residual: 0.13 },
      { predicted: 1.62, residual: -0.12 },
      { predicted: 2.21, residual: 0.09 },
      { predicted: 2.95, residual: -0.15 },
      { predicted: 3.29, residual: 0.11 },
      { predicted: 4.10, residual: -0.20 },
      { predicted: 4.41, residual: 0.19 },
      { predicted: 4.88, residual: 0.12 }
    ],
    errorDistribution: [
      { range: '-0.5 to -0.3', count: 14 },
      { range: '-0.3 to -0.1', count: 68 },
      { range: '-0.1 to 0.1', count: 184 },
      { range: '0.1 to 0.3', count: 72 },
      { range: '0.3 to 0.5', count: 18 }
    ],
    featureImportance: [
      { feature: 'median_income', importance: 0.524, percentage: '52.4%' },
      { feature: 'housing_median_age', importance: 0.142, percentage: '14.2%' },
      { feature: 'longitude', importance: 0.118, percentage: '11.8%' },
      { feature: 'latitude', importance: 0.104, percentage: '10.4%' },
      { feature: 'population', importance: 0.046, percentage: '4.6%' },
      { feature: 'total_rooms', importance: 0.038, percentage: '3.8%' },
      { feature: 'households', importance: 0.028, percentage: '2.8%' }
    ]
  };
};

export const getClassificationDemoMetrics = (algorithmName = 'Random Forest Classifier') => {
  return {
    isDemo: true,
    algorithm: algorithmName,
    task: 'Classification',
    dataset: 'Telco Customer Churn',
    classificationType: 'binary', // binary | multiclass
    metrics: {
      accuracy: 0.9124,
      precision: 0.8875,
      recall: 0.8712,
      f1Score: 0.8792,
      rocAuc: 0.9542,
      logLoss: 0.2314,
      cohenKappa: 0.7941
    },
    confusionMatrixBinary: {
      classes: ['No Churn (0)', 'Churn (1)'],
      matrix: [
        [984, 82],   // True Neg, False Pos
        [96, 542]    // False Neg, True Pos
      ],
      tn: 984,
      fp: 82,
      fn: 96,
      tp: 542
    },
    confusionMatrixMulticlass: {
      classes: ['Class A', 'Class B', 'Class C'],
      matrix: [
        [142, 6, 2],
        [8, 134, 8],
        [3, 11, 136]
      ]
    },
    rocCurve: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.02, tpr: 0.35 },
      { fpr: 0.05, tpr: 0.65 },
      { fpr: 0.09, tpr: 0.82 },
      { fpr: 0.15, tpr: 0.91 },
      { fpr: 0.25, tpr: 0.96 },
      { fpr: 0.40, tpr: 0.98 },
      { fpr: 0.65, tpr: 0.99 },
      { fpr: 1.0, tpr: 1.0 }
    ],
    precisionRecallCurve: [
      { recall: 0.0, precision: 1.0 },
      { recall: 0.35, precision: 0.98 },
      { recall: 0.62, precision: 0.94 },
      { recall: 0.78, precision: 0.91 },
      { recall: 0.87, precision: 0.88 },
      { recall: 0.94, precision: 0.78 },
      { recall: 1.0, precision: 0.42 }
    ],
    featureImportance: [
      { feature: 'Contract_Month-to-month', importance: 0.312, percentage: '31.2%' },
      { feature: 'tenure', importance: 0.245, percentage: '24.5%' },
      { feature: 'MonthlyCharges', importance: 0.184, percentage: '18.4%' },
      { feature: 'TotalCharges', importance: 0.126, percentage: '12.6%' },
      { feature: 'TechSupport_No', importance: 0.068, percentage: '6.8%' },
      { feature: 'OnlineSecurity_No', importance: 0.041, percentage: '4.1%' },
      { feature: 'PaperlessBilling_Yes', importance: 0.024, percentage: '2.4%' }
    ],
    classificationReport: [
      { classLabel: 'No Churn (0)', precision: 0.911, recall: 0.923, f1Score: 0.917, support: 1066 },
      { classLabel: 'Churn (1)', precision: 0.869, recall: 0.849, f1Score: 0.859, support: 638 },
      { classLabel: 'Macro Avg', precision: 0.890, recall: 0.886, f1Score: 0.888, support: 1704 },
      { classLabel: 'Weighted Avg', precision: 0.895, recall: 0.895, f1Score: 0.895, support: 1704 }
    ]
  };
};
