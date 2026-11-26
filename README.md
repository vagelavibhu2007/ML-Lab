# ML Model Studio 🚀
> Interactive Machine Learning Model Training and Evaluation Platform (Phase 1 Frontend)

ML Model Studio is a modern, responsive SaaS-style web application designed for interactive machine learning model configuration, dataset inspection, evaluation benchmarking, and algorithm comparison.

---

## 🛠️ Technology Stack

- **React.js 18** (Modern functional components, hooks, Context API)
- **Vite 6** (Fast build and HMR toolchain)
- **Tailwind CSS 3** (Custom blue theme palette, responsive utility classes)
- **React Router DOM 6** (Client-side nested routing & breadcrumbs)
- **Recharts 2** (Interactive data visualization charts)
- **Lucide React** (Consistent modern iconography)
- **PapaParse** (Client-side browser CSV parsing & schema detection)
- **Axios** (Configured for future Phase 2 REST API endpoints)

---

## 📂 Project Structure

```
ml-model-studio/
├── public/
│   └── logo.svg
├── sample_data/
│   ├── california_housing_sample.csv
│   └── customer_churn_sample.csv
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── ClassificationCharts.jsx   # Confusion Matrix, ROC, PR curves, Feature ranking
│   │   │   └── RegressionCharts.jsx       # Actual vs Predicted, Residual, Error Distribution
│   │   ├── common/
│   │   │   ├── ConfirmationModal.jsx      # Generic confirmation modal
│   │   │   ├── EmptyState.jsx             # Clean empty states with action triggers
│   │   │   ├── LoadingSpinner.jsx         # Animated spinner
│   │   │   ├── MetricCard.jsx             # Metric display cards with tooltips & badges
│   │   │   ├── PageHeader.jsx             # Standardized header with breadcrumb and actions
│   │   │   ├── SearchModal.jsx            # Ctrl+K global command/search palette
│   │   │   └── ToastContainer.jsx         # Floating toast alert notification system
│   │   ├── datasets/
│   │   │   ├── DatasetPreviewModal.jsx    # Table & schema preview modal
│   │   │   └── DatasetUploadModal.jsx     # Drag-and-drop CSV reader with PapaParse
│   │   └── layout/
│   │       ├── Header.jsx                 # Top bar, notifications, search, profile menu
│   │       ├── MainLayout.jsx             # Responsive container with dynamic sidebar margin
│   │       └── Sidebar.jsx                # Collapsible desktop sidebar & mobile drawer
│   ├── context/
│   │   └── MLContext.jsx                  # Global state: datasets, models, training simulation, toasts
│   ├── data/
│   │   ├── mlAlgorithms.js                # 16 algorithms (8 Regression + 8 Classification) with hyperparameter schemas
│   │   ├── mockHistory.js                 # Seeded historical model training runs
│   │   ├── mockMetrics.js                 # Realistic demonstration metrics & chart points
│   │   └── sampleDatasets.js              # 5 pre-configured realistic datasets
│   ├── pages/
│   │   ├── Classification.jsx             # Page 5: Classification workspace
│   │   ├── Dashboard.jsx                  # Page 1: Executive analytics dashboard
│   │   ├── Datasets.jsx                   # Page 2: Dataset manager & schema viewer
│   │   ├── ModelComparison.jsx            # Page 6: Side-by-side benchmark comparison
│   │   ├── ModelHistory.jsx               # Page 7: Audit history & detailed inspections
│   │   ├── ModelTraining.jsx              # Page 3: Dynamic training studio & simulation
│   │   ├── Regression.jsx                 # Page 4: Regression workspace
│   │   └── Settings.jsx                   # Page 8: Preferences, theme, and platform info
│   ├── App.jsx                            # Router configuration & providers
│   ├── index.css                          # Tailwind directives & typography
│   └── main.jsx                           # Application entry point
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🧠 Supported Machine Learning Algorithms (16 Total)

### 📈 Regression Models (8)
1. **Linear Regression** (Ordinary Least Squares, intercept options, positive coefficient constraints)
2. **Polynomial Regression** (Polynomial degree expansion, interaction terms, bias terms)
3. **Decision Tree Regressor** (Split criteria: MSE, Friedman MSE, MAE; max depth, min samples split/leaf)
4. **Random Forest Regressor** (Ensemble estimators, max depth, bootstrap sampling, leaf thresholds)
5. **Support Vector Regression (SVR)** (Kernel choices: RBF, Linear, Poly, Sigmoid; C, epsilon tube, gamma)
6. **K-Nearest Neighbors Regressor (KNN)** (Neighbors k, distance weights: uniform/distance, Minkowski metric)
7. **Gradient Boosting Regressor** (Boosting stages, learning rate shrinkage, subsample ratio, tree depth)
8. **XGBoost Regressor** (Extreme Gradient Boosting trees, eta shrinkage, colsample_bytree, gamma)

### 🎯 Classification Models (8)
1. **Logistic Regression** (Sigmoid classification, solvers: L-BFGS, LibLinear, SAGA; penalties: L1, L2, ElasticNet)
2. **Decision Tree Classifier** (Split impurity: Gini, Entropy, Log Loss; depth limits, sample splits)
3. **Random Forest Classifier** (Ensemble tree voting, Gini/Entropy criteria, bootstrap sampling)
4. **Support Vector Machine (SVM)** (Maximum margin hyperplanes, RBF kernel, Platt probability scaling)
5. **K-Nearest Neighbors Classifier (KNN)** (Majority vote over feature space distances)
6. **Gaussian Naive Bayes** (Fast probabilistic classifier with variance smoothing)
7. **Gradient Boosting Classifier** (Deviance loss optimization, tree boosting stages)
8. **XGBoost Classifier** (Gradient boosted decision trees with scale_pos_weight class balancing)

---

## 💻 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 📌 Phase 1 Completed Features
- **Modern Responsive SaaS Layout**: Collapsible desktop sidebar, responsive mobile drawer, sticky header, breadcrumbs, search trigger.
- **Global Search Command Palette (Ctrl+K)**: Instant search across pages, datasets, and algorithms.
- **Client-Side CSV Upload & Preview**: Browser-based parsing using PapaParse; supports drag-and-drop CSV upload, column type detection, missing value counts, and row pagination.
- **Dynamic Hyperparameter Forms**: Form fields adjust immediately based on the selected algorithm with contextual parameter tooltips.
- **Interactive Training Simulation**: Multi-stage progress visualizer simulating data preprocessing, train-test splitting, model fitting, and metric generation.
- **Comprehensive Diagnostic Visualizers**:
  - Regression: Actual vs Predicted scatter, Residual error plot, Error distribution histogram, Feature ranking.
  - Classification: Confusion Matrix (binary 2x2 & multiclass 3x3), ROC Curve with AUC, Precision-Recall Curve, Classification Report table.
- **Model Comparison Engine**: Select up to 4 models; highlights best-in-class metrics (green highlights for higher R²/Accuracy, lower MSE/MAE/RMSE).
- **History & Audit Log**: Filter, inspect full JSON payloads, view execution metadata, and remove past models.
- **Interactive Notifications & Modals**: Dismissible toast notifications and confirmation dialogs.

---

## 🚧 Features Intentionally Reserved for Phase 2 (Backend Integration)
- Python backend microservice (FastAPI / Uvicorn).
- Actual model fitting using Scikit-Learn, XGBoost, and LightGBM on GPU/CPU.
- Automated hyperparameter optimization (AutoML / Optuna).
- PostgreSQL or SQLite database storage for model artifacts and user datasets.
- Export trained model weights to ONNX or Pickle format.
- User authentication and multi-tenant access control.
