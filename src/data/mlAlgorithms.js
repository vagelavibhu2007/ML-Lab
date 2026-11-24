// Machine Learning Algorithms Specification and Hyperparameters

export const REGRESSION_ALGORITHMS = [
  {
    id: 'linear-regression',
    name: 'Linear Regression',
    category: 'Regression',
    family: 'Linear Models',
    badge: 'Baseline',
    description: 'Models linear relationship between scalar response and one or more explanatory variables using ordinary least squares.',
    icon: 'TrendingUp',
    hyperparameters: [
      {
        name: 'fit_intercept',
        label: 'Fit Intercept',
        type: 'boolean',
        default: true,
        tooltip: 'Whether to calculate the intercept for this model. If set to false, no intercept will be used in calculations (data expected to be centered).'
      },
      {
        name: 'copy_X',
        label: 'Copy X',
        type: 'boolean',
        default: true,
        tooltip: 'If True, X will be copied; else, it may be overwritten.'
      },
      {
        name: 'positive',
        label: 'Positive Coefficients',
        type: 'boolean',
        default: false,
        tooltip: 'When set to True, forces the coefficients to be positive. Useful for physical models where values cannot be negative.'
      }
    ]
  },
  {
    id: 'polynomial-regression',
    name: 'Polynomial Regression',
    category: 'Regression',
    family: 'Linear Models',
    badge: 'Non-linear',
    description: 'Extends linear models by constructing polynomial features from input variables, capturing non-linear relationships.',
    icon: 'Activity',
    hyperparameters: [
      {
        name: 'degree',
        label: 'Polynomial Degree',
        type: 'number',
        default: 2,
        min: 2,
        max: 5,
        step: 1,
        tooltip: 'The degree of the polynomial features. Higher degrees capture complex curves but increase overfitting risk.'
      },
      {
        name: 'include_bias',
        label: 'Include Bias',
        type: 'boolean',
        default: true,
        tooltip: 'If True, includes a bias column (all ones) in the feature matrix.'
      },
      {
        name: 'interaction_only',
        label: 'Interaction Only',
        type: 'boolean',
        default: false,
        tooltip: 'If True, only interaction features are produced: features that are products of at most degree distinct input features.'
      }
    ]
  },
  {
    id: 'decision-tree-regressor',
    name: 'Decision Tree Regressor',
    category: 'Regression',
    family: 'Tree-based',
    badge: 'Interpretable',
    description: 'Non-parametric supervised learning method that predicts target value by learning simple decision rules inferred from features.',
    icon: 'GitFork',
    hyperparameters: [
      {
        name: 'criterion',
        label: 'Criterion',
        type: 'select',
        default: 'squared_error',
        options: [
          { value: 'squared_error', label: 'Squared Error (MSE)' },
          { value: 'friedman_mse', label: 'Friedman MSE' },
          { value: 'absolute_error', label: 'Absolute Error (MAE)' },
          { value: 'poisson', label: 'Poisson' }
        ],
        tooltip: 'Function to measure the quality of a split.'
      },
      {
        name: 'max_depth',
        label: 'Max Depth',
        type: 'number',
        default: 6,
        min: 1,
        max: 30,
        step: 1,
        tooltip: 'The maximum depth of the tree. None means nodes are expanded until all leaves are pure.'
      },
      {
        name: 'min_samples_split',
        label: 'Min Samples Split',
        type: 'number',
        default: 2,
        min: 2,
        max: 20,
        step: 1,
        tooltip: 'The minimum number of samples required to split an internal node.'
      },
      {
        name: 'min_samples_leaf',
        label: 'Min Samples Leaf',
        type: 'number',
        default: 1,
        min: 1,
        max: 20,
        step: 1,
        tooltip: 'The minimum number of samples required to be at a leaf node.'
      }
    ]
  },
  {
    id: 'random-forest-regressor',
    name: 'Random Forest Regressor',
    category: 'Regression',
    family: 'Ensemble',
    badge: 'Popular',
    description: 'Ensemble meta-estimator that fits multiple classifying decision trees on subsamples and uses averaging to improve predictive accuracy and control over-fitting.',
    icon: 'Trees',
    hyperparameters: [
      {
        name: 'n_estimators',
        label: 'Number of Estimators',
        type: 'number',
        default: 100,
        min: 10,
        max: 1000,
        step: 10,
        tooltip: 'The number of trees in the forest. Higher values increase performance up to saturation at computational cost.'
      },
      {
        name: 'max_depth',
        label: 'Max Depth',
        type: 'number',
        default: 12,
        min: 1,
        max: 50,
        step: 1,
        tooltip: 'Maximum depth of individual trees. Limits tree complexity to prevent overfitting.'
      },
      {
        name: 'min_samples_split',
        label: 'Min Samples Split',
        type: 'number',
        default: 2,
        min: 2,
        max: 20,
        step: 1,
        tooltip: 'Minimum number of samples required to split an internal node.'
      },
      {
        name: 'min_samples_leaf',
        label: 'Min Samples Leaf',
        type: 'number',
        default: 1,
        min: 1,
        max: 20,
        step: 1,
        tooltip: 'Minimum number of samples required to be at a leaf node.'
      },
      {
        name: 'bootstrap',
        label: 'Bootstrap Samples',
        type: 'boolean',
        default: true,
        tooltip: 'Whether bootstrap samples are used when building trees.'
      }
    ]
  },
  {
    id: 'support-vector-regression',
    name: 'Support Vector Regression (SVR)',
    category: 'Regression',
    family: 'Kernel Methods',
    badge: 'Robust',
    description: 'Uses support vector machines to find a function that deviates from actual target values by no more than epsilon for all training data.',
    icon: 'Layers',
    hyperparameters: [
      {
        name: 'C',
        label: 'Regularization Parameter (C)',
        type: 'number',
        default: 1.0,
        min: 0.01,
        max: 100.0,
        step: 0.1,
        tooltip: 'Regularization parameter. The strength of the regularization is inversely proportional to C. Must be strictly positive.'
      },
      {
        name: 'kernel',
        label: 'Kernel',
        type: 'select',
        default: 'rbf',
        options: [
          { value: 'rbf', label: 'RBF (Radial Basis Function)' },
          { value: 'linear', label: 'Linear' },
          { value: 'poly', label: 'Polynomial' },
          { value: 'sigmoid', label: 'Sigmoid' }
        ],
        tooltip: 'Specifies the kernel type to be used in the algorithm.'
      },
      {
        name: 'epsilon',
        label: 'Epsilon (ε)',
        type: 'number',
        default: 0.1,
        min: 0.001,
        max: 1.0,
        step: 0.01,
        tooltip: 'Epsilon in the epsilon-SVR model. Specifies the epsilon-tube within which no penalty is associated in the training loss.'
      },
      {
        name: 'gamma',
        label: 'Gamma',
        type: 'select',
        default: 'scale',
        options: [
          { value: 'scale', label: 'Scale (1 / (n_features * X.var()))' },
          { value: 'auto', label: 'Auto (1 / n_features)' }
        ],
        tooltip: 'Kernel coefficient for RBF, Poly and Sigmoid.'
      }
    ]
  },
  {
    id: 'knn-regressor',
    name: 'K-Nearest Neighbors Regressor',
    category: 'Regression',
    family: 'Instance-based',
    badge: 'Simple',
    description: 'Target is predicted by local interpolation of targets associated with nearest neighbors in training set.',
    icon: 'Share2',
    hyperparameters: [
      {
        name: 'n_neighbors',
        label: 'Number of Neighbors (k)',
        type: 'number',
        default: 5,
        min: 1,
        max: 50,
        step: 1,
        tooltip: 'Number of neighbors to use by default for kneighbors queries.'
      },
      {
        name: 'weights',
        label: 'Weights',
        type: 'select',
        default: 'uniform',
        options: [
          { value: 'uniform', label: 'Uniform (Equal weight)' },
          { value: 'distance', label: 'Distance (Closer neighbors weighted higher)' }
        ],
        tooltip: 'Weight function used in prediction.'
      },
      {
        name: 'algorithm',
        label: 'Algorithm',
        type: 'select',
        default: 'auto',
        options: [
          { value: 'auto', label: 'Auto' },
          { value: 'ball_tree', label: 'BallTree' },
          { value: 'kd_tree', label: 'KDTree' },
          { value: 'brute', label: 'Brute Force' }
        ],
        tooltip: 'Algorithm used to compute nearest neighbors.'
      },
      {
        name: 'p',
        label: 'Power Parameter (p)',
        type: 'select',
        default: '2',
        options: [
          { value: '1', label: 'p = 1 (Manhattan distance)' },
          { value: '2', label: 'p = 2 (Euclidean distance)' }
        ],
        tooltip: 'Power parameter for the Minkowski metric.'
      }
    ]
  },
  {
    id: 'gradient-boosting-regressor',
    name: 'Gradient Boosting Regressor',
    category: 'Regression',
    family: 'Ensemble',
    badge: 'High Accuracy',
    description: 'Builds additive model in forward stage-wise fashion, optimizing arbitrary differentiable loss functions at each step.',
    icon: 'Zap',
    hyperparameters: [
      {
        name: 'n_estimators',
        label: 'Number of Estimators',
        type: 'number',
        default: 100,
        min: 10,
        max: 1000,
        step: 10,
        tooltip: 'The number of boosting stages to perform. Gradient boosting is fairly robust to over-fitting.'
      },
      {
        name: 'learning_rate',
        label: 'Learning Rate (Shrinkage)',
        type: 'number',
        default: 0.1,
        min: 0.001,
        max: 1.0,
        step: 0.01,
        tooltip: 'Learning rate shrinks contribution of each tree by learning_rate. Trade-off with n_estimators.'
      },
      {
        name: 'max_depth',
        label: 'Max Depth',
        type: 'number',
        default: 3,
        min: 1,
        max: 15,
        step: 1,
        tooltip: 'Maximum depth of the individual regression estimators. Limits tree size.'
      },
      {
        name: 'subsample',
        label: 'Subsample Ratio',
        type: 'number',
        default: 1.0,
        min: 0.1,
        max: 1.0,
        step: 0.05,
        tooltip: 'Fraction of samples to be used for fitting the individual base learners. Values < 1.0 lead to Stochastic Gradient Boosting.'
      }
    ]
  },
  {
    id: 'xgboost-regressor',
    name: 'XGBoost Regressor',
    category: 'Regression',
    family: 'Ensemble',
    badge: 'SOTA / Fast',
    description: 'Optimized distributed gradient boosting library designed to be highly efficient, flexible and portable.',
    icon: 'Cpu',
    hyperparameters: [
      {
        name: 'n_estimators',
        label: 'Number of Trees',
        type: 'number',
        default: 100,
        min: 10,
        max: 1000,
        step: 10,
        tooltip: 'Number of gradient boosted trees.'
      },
      {
        name: 'learning_rate',
        label: 'Learning Rate (eta)',
        type: 'number',
        default: 0.05,
        min: 0.001,
        max: 0.5,
        step: 0.01,
        tooltip: 'Step size shrinkage used in update to prevent overfitting.'
      },
      {
        name: 'max_depth',
        label: 'Max Depth',
        type: 'number',
        default: 6,
        min: 1,
        max: 20,
        step: 1,
        tooltip: 'Maximum depth of a tree. Increasing this value makes model more complex and more likely to overfit.'
      },
      {
        name: 'colsample_bytree',
        label: 'Subsample Ratio of Columns',
        type: 'number',
        default: 0.8,
        min: 0.1,
        max: 1.0,
        step: 0.05,
        tooltip: 'Subsample ratio of columns when constructing each tree.'
      },
      {
        name: 'gamma',
        label: 'Min Split Loss (Gamma)',
        type: 'number',
        default: 0,
        min: 0,
        max: 10,
        step: 0.1,
        tooltip: 'Minimum loss reduction required to make a further partition on a leaf node of the tree.'
      }
    ]
  }
];

export const CLASSIFICATION_ALGORITHMS = [
  {
    id: 'logistic-regression',
    name: 'Logistic Regression',
    category: 'Classification',
    family: 'Linear Models',
    badge: 'Baseline',
    description: 'Models probability of a discrete outcome given an input variable using a logistic sigmoid function.',
    icon: 'TrendingUp',
    hyperparameters: [
      {
        name: 'C',
        label: 'Inverse Regularization (C)',
        type: 'number',
        default: 1.0,
        min: 0.001,
        max: 100.0,
        step: 0.1,
        tooltip: 'Smaller values specify stronger regularization, preventing overfitting on noisy datasets.'
      },
      {
        name: 'penalty',
        label: 'Penalty',
        type: 'select',
        default: 'l2',
        options: [
          { value: 'l2', label: 'L2 (Ridge)' },
          { value: 'l1', label: 'L1 (Lasso)' },
          { value: 'elasticnet', label: 'ElasticNet' },
          { value: 'none', label: 'None' }
        ],
        tooltip: 'Specify the norm of the penalty.'
      },
      {
        name: 'solver',
        label: 'Solver',
        type: 'select',
        default: 'lbfgs',
        options: [
          { value: 'lbfgs', label: 'L-BFGS' },
          { value: 'liblinear', label: 'LibLinear' },
          { value: 'saga', label: 'SAGA' },
          { value: 'newton-cg', label: 'Newton-CG' }
        ],
        tooltip: 'Algorithm to use in the optimization problem.'
      },
      {
        name: 'max_iter',
        label: 'Max Iterations',
        type: 'number',
        default: 200,
        min: 50,
        max: 2000,
        step: 50,
        tooltip: 'Maximum number of iterations taken for the solvers to converge.'
      }
    ]
  },
  {
    id: 'decision-tree-classifier',
    name: 'Decision Tree Classifier',
    category: 'Classification',
    family: 'Tree-based',
    badge: 'Interpretable',
    description: 'Tree-structured classifier where internal nodes represent feature tests, branches represent test outcomes, and leaf nodes represent class labels.',
    icon: 'GitFork',
    hyperparameters: [
      {
        name: 'criterion',
        label: 'Criterion',
        type: 'select',
        default: 'gini',
        options: [
          { value: 'gini', label: 'Gini Impurity' },
          { value: 'entropy', label: 'Entropy (Information Gain)' },
          { value: 'log_loss', label: 'Log Loss' }
        ],
        tooltip: 'The function to measure the quality of a split.'
      },
      {
        name: 'max_depth',
        label: 'Max Depth',
        type: 'number',
        default: 6,
        min: 1,
        max: 30,
        step: 1,
        tooltip: 'The maximum depth of the tree. Shallow trees prevent overfitting.'
      },
      {
        name: 'min_samples_split',
        label: 'Min Samples Split',
        type: 'number',
        default: 2,
        min: 2,
        max: 20,
        step: 1,
        tooltip: 'The minimum number of samples required to split an internal node.'
      },
      {
        name: 'min_samples_leaf',
        label: 'Min Samples Leaf',
        type: 'number',
        default: 1,
        min: 1,
        max: 20,
        step: 1,
        tooltip: 'The minimum number of samples required to be at a leaf node.'
      }
    ]
  },
  {
    id: 'random-forest-classifier',
    name: 'Random Forest Classifier',
    category: 'Classification',
    family: 'Ensemble',
    badge: 'Popular',
    description: 'Constructs an ensemble of decision trees at training time and outputs the mode of classes predicted by individual trees.',
    icon: 'Trees',
    hyperparameters: [
      {
        name: 'n_estimators',
        label: 'Number of Estimators',
        type: 'number',
        default: 100,
        min: 10,
        max: 1000,
        step: 10,
        tooltip: 'The number of trees in the forest.'
      },
      {
        name: 'criterion',
        label: 'Criterion',
        type: 'select',
        default: 'gini',
        options: [
          { value: 'gini', label: 'Gini' },
          { value: 'entropy', label: 'Entropy' }
        ],
        tooltip: 'Function to measure split quality across trees.'
      },
      {
        name: 'max_depth',
        label: 'Max Depth',
        type: 'number',
        default: 12,
        min: 1,
        max: 40,
        step: 1,
        tooltip: 'Maximum depth of each decision tree.'
      },
      {
        name: 'min_samples_split',
        label: 'Min Samples Split',
        type: 'number',
        default: 2,
        min: 2,
        max: 20,
        step: 1,
        tooltip: 'Minimum samples required to split an internal node.'
      },
      {
        name: 'bootstrap',
        label: 'Bootstrap',
        type: 'boolean',
        default: true,
        tooltip: 'Whether bootstrap samples are used when building trees.'
      }
    ]
  },
  {
    id: 'support-vector-machine',
    name: 'Support Vector Machine (SVM)',
    category: 'Classification',
    family: 'Kernel Methods',
    badge: 'Effective in High-Dim',
    description: 'Finds optimal hyperplane in an N-dimensional space that distinctly classifies data points with maximum margin.',
    icon: 'Layers',
    hyperparameters: [
      {
        name: 'C',
        label: 'Regularization Parameter (C)',
        type: 'number',
        default: 1.0,
        min: 0.01,
        max: 100.0,
        step: 0.1,
        tooltip: 'Regularization parameter. Trade-off between smooth boundary and classifying training points correctly.'
      },
      {
        name: 'kernel',
        label: 'Kernel',
        type: 'select',
        default: 'rbf',
        options: [
          { value: 'rbf', label: 'RBF (Radial Basis Function)' },
          { value: 'linear', label: 'Linear' },
          { value: 'poly', label: 'Polynomial' },
          { value: 'sigmoid', label: 'Sigmoid' }
        ],
        tooltip: 'Specifies kernel type used to project data into higher-dimensional space.'
      },
      {
        name: 'probability',
        label: 'Enable Probabilities',
        type: 'boolean',
        default: true,
        tooltip: 'Whether to enable probability estimates using Platt scaling. Enables ROC-AUC and PR curves.'
      },
      {
        name: 'gamma',
        label: 'Gamma',
        type: 'select',
        default: 'scale',
        options: [
          { value: 'scale', label: 'Scale' },
          { value: 'auto', label: 'Auto' }
        ],
        tooltip: 'Kernel coefficient for RBF, Poly and Sigmoid.'
      }
    ]
  },
  {
    id: 'knn-classifier',
    name: 'K-Nearest Neighbors Classifier',
    category: 'Classification',
    family: 'Instance-based',
    badge: 'Intuitive',
    description: 'Classifies query point by majority vote of its k-nearest neighbors based on feature space distance metrics.',
    icon: 'Share2',
    hyperparameters: [
      {
        name: 'n_neighbors',
        label: 'Number of Neighbors (k)',
        type: 'number',
        default: 5,
        min: 1,
        max: 50,
        step: 1,
        tooltip: 'Number of neighbors to vote on class membership.'
      },
      {
        name: 'weights',
        label: 'Weights',
        type: 'select',
        default: 'uniform',
        options: [
          { value: 'uniform', label: 'Uniform' },
          { value: 'distance', label: 'Distance' }
        ],
        tooltip: 'Weight function used in voting.'
      },
      {
        name: 'metric',
        label: 'Distance Metric',
        type: 'select',
        default: 'minkowski',
        options: [
          { value: 'minkowski', label: 'Minkowski (Euclidean/Manhattan)' },
          { value: 'euclidean', label: 'Euclidean' },
          { value: 'manhattan', label: 'Manhattan' },
          { value: 'chebyshev', label: 'Chebyshev' }
        ],
        tooltip: 'Distance metric used for the tree query.'
      }
    ]
  },
  {
    id: 'naive-bayes',
    name: 'Gaussian Naive Bayes',
    category: 'Classification',
    family: 'Probabilistic',
    badge: 'Fast & Probabilistic',
    description: 'Probabilistic classifier applying Bayes theorem with strong (naive) independence assumptions between features.',
    icon: 'Compass',
    hyperparameters: [
      {
        name: 'var_smoothing',
        label: 'Variance Smoothing',
        type: 'number',
        default: 1e-9,
        min: 1e-12,
        max: 1e-2,
        step: 1e-9,
        tooltip: 'Portion of largest variance of all features that is added to variances for calculation stability.'
      }
    ]
  },
  {
    id: 'gradient-boosting-classifier',
    name: 'Gradient Boosting Classifier',
    category: 'Classification',
    family: 'Ensemble',
    badge: 'High Accuracy',
    description: 'Sequential ensemble boosting trees to correct residual errors made by preceding trees, minimizing classification deviance.',
    icon: 'Zap',
    hyperparameters: [
      {
        name: 'n_estimators',
        label: 'Number of Estimators',
        type: 'number',
        default: 100,
        min: 10,
        max: 1000,
        step: 10,
        tooltip: 'The number of boosting stages to perform.'
      },
      {
        name: 'learning_rate',
        label: 'Learning Rate',
        type: 'number',
        default: 0.1,
        min: 0.01,
        max: 1.0,
        step: 0.01,
        tooltip: 'Shrinks contribution of each tree. Slower learning rate with more trees usually yields higher accuracy.'
      },
      {
        name: 'max_depth',
        label: 'Max Depth',
        type: 'number',
        default: 3,
        min: 1,
        max: 15,
        step: 1,
        tooltip: 'Maximum depth of base estimators.'
      },
      {
        name: 'subsample',
        label: 'Subsample Ratio',
        type: 'number',
        default: 1.0,
        min: 0.2,
        max: 1.0,
        step: 0.05,
        tooltip: 'Fraction of samples used for fitting each tree.'
      }
    ]
  },
  {
    id: 'xgboost-classifier',
    name: 'XGBoost Classifier',
    category: 'Classification',
    family: 'Ensemble',
    badge: 'SOTA / Fast',
    description: 'Industry-standard gradient boosting framework optimized for speed and performance with built-in regularization against overfitting.',
    icon: 'Cpu',
    hyperparameters: [
      {
        name: 'n_estimators',
        label: 'Number of Trees',
        type: 'number',
        default: 100,
        min: 10,
        max: 1000,
        step: 10,
        tooltip: 'Number of gradient boosted trees.'
      },
      {
        name: 'learning_rate',
        label: 'Learning Rate (eta)',
        type: 'number',
        default: 0.05,
        min: 0.005,
        max: 0.5,
        step: 0.01,
        tooltip: 'Step size shrinkage used in update to prevent overfitting.'
      },
      {
        name: 'max_depth',
        label: 'Max Depth',
        type: 'number',
        default: 6,
        min: 1,
        max: 20,
        step: 1,
        tooltip: 'Maximum depth of a tree.'
      },
      {
        name: 'colsample_bytree',
        label: 'Subsample Columns Ratio',
        type: 'number',
        default: 0.8,
        min: 0.2,
        max: 1.0,
        step: 0.05,
        tooltip: 'Subsample ratio of columns when constructing each tree.'
      },
      {
        name: 'scale_pos_weight',
        label: 'Scale Pos Weight (Class Imbalance)',
        type: 'number',
        default: 1.0,
        min: 0.1,
        max: 50.0,
        step: 0.5,
        tooltip: 'Control the balance of positive and negative weights, useful for unbalanced classes.'
      }
    ]
  }
];

export const ALL_ALGORITHMS = [
  ...REGRESSION_ALGORITHMS,
  ...CLASSIFICATION_ALGORITHMS
];

export const getAlgorithmById = (id) => {
  return ALL_ALGORITHMS.find(algo => algo.id === id);
};
