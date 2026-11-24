import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Cpu,
  Database,
  Sliders,
  Sparkles,
  Info,
  RefreshCw,
  Layers,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  Play
} from 'lucide-react';
import { useML } from '../context/MLContext';
import { PageHeader } from '../components/common/PageHeader';
import { MetricCard } from '../components/common/MetricCard';
import { REGRESSION_ALGORITHMS } from '../data/mlAlgorithms';
import { getRegressionDemoMetrics } from '../data/mockMetrics';
import { RegressionCharts } from '../components/charts/RegressionCharts';

export const Regression = () => {
  const navigate = useNavigate();
  const { datasets, trainedModels } = useML();

  // Filter regression datasets
  const regressionDatasets = datasets.filter((d) => d.task === 'Regression');
  const [selectedDatasetId, setSelectedDatasetId] = useState(
    regressionDatasets[0]?.id || datasets[0]?.id || ''
  );
  const selectedDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0];

  // Selected regression algorithm
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState('random-forest-regressor');
  const selectedAlgorithm =
    REGRESSION_ALGORITHMS.find((a) => a.id === selectedAlgorithmId) || REGRESSION_ALGORITHMS[3];

  // Hyperparameters
  const [hyperparameters, setHyperparameters] = useState({
    n_estimators: 100,
    max_depth: 12,
    min_samples_split: 2,
    min_samples_leaf: 1,
    bootstrap: true
  });

  // Metrics dataset
  const [metricsData, setMetricsData] = useState(() =>
    getRegressionDemoMetrics(selectedAlgorithm.name)
  );

  const handleAlgorithmChange = (algoId) => {
    setSelectedAlgorithmId(algoId);
    const newAlgo = REGRESSION_ALGORITHMS.find((a) => a.id === algoId);
    if (newAlgo) {
      const initial = {};
      newAlgo.hyperparameters?.forEach((hp) => {
        initial[hp.name] = hp.default;
      });
      setHyperparameters(initial);
      setMetricsData(getRegressionDemoMetrics(newAlgo.name));
    }
  };

  const handleUpdateEvaluation = () => {
    setMetricsData(getRegressionDemoMetrics(selectedAlgorithm.name));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regression Modeling Workspace"
        subtitle="Train continuous target estimators, inspect residual errors, and benchmark predictive variance."
        badge="Continuous Target Workspace"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpdateEvaluation}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Simulate Re-Evaluation</span>
            </button>
            <button
              onClick={() => navigate('/train')}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Launch Studio Trainer</span>
            </button>
          </div>
        }
      />

      {/* Demonstration metrics notice */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Demonstration Regression Metrics:</span> Displaying simulated model evaluation curves for <span className="font-semibold">{selectedAlgorithm.name}</span> on dataset <span className="font-semibold">{selectedDataset?.name}</span>. Real-time Scikit-Learn training pipelines and live residual calculation will integrate in Phase 2.
        </div>
      </div>

      {/* Top Controls: Algorithm Picker, Dataset & Hyperparameters Panel */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Algorithm Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Regression Algorithm ({REGRESSION_ALGORITHMS.length} options)
            </label>
            <select
              value={selectedAlgorithmId}
              onChange={(e) => handleAlgorithmChange(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            >
              {REGRESSION_ALGORITHMS.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name} ({algo.family})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">{selectedAlgorithm.description}</p>
          </div>

          {/* Dataset Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Active Dataset & Target
            </label>
            <select
              value={selectedDatasetId}
              onChange={(e) => setSelectedDatasetId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            >
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name} (Target: {ds.targetColumn || 'Auto'})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              {selectedDataset?.rows?.toLocaleString()} rows • {selectedDataset?.columns} features
            </p>
          </div>
        </div>

        {/* Hyperparameter Quick Tuning bar */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Hyperparameters ({selectedAlgorithm.name})</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Dynamic schema</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {selectedAlgorithm.hyperparameters?.map((param) => (
              <div key={param.name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 truncate">
                  {param.label}
                </div>
                {param.type === 'number' && (
                  <input
                    type="number"
                    min={param.min}
                    max={param.max}
                    step={param.step || 1}
                    value={hyperparameters[param.name] ?? param.default}
                    onChange={(e) =>
                      setHyperparameters({ ...hyperparameters, [param.name]: Number(e.target.value) })
                    }
                    className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                  />
                )}
                {param.type === 'select' && (
                  <select
                    value={hyperparameters[param.name] ?? param.default}
                    onChange={(e) =>
                      setHyperparameters({ ...hyperparameters, [param.name]: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white"
                  >
                    {param.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {param.type === 'boolean' && (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      checked={Boolean(hyperparameters[param.name] ?? param.default)}
                      onChange={(e) =>
                        setHyperparameters({ ...hyperparameters, [param.name]: e.target.checked })
                      }
                      className="w-3.5 h-3.5 text-blue-600 rounded"
                    />
                    <span className="text-xs text-slate-700">True</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regression Metrics 5-Card Dashboard */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800">
            Regression Evaluation Metrics
          </h2>
          <span className="text-xs text-slate-400">Calculated on holdout validation split (20%)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="R² Score"
            value={metricsData.metrics.r2.toFixed(4)}
            subtitle="Coefficient of determination"
            tooltip="Proportion of the variance in the dependent variable that is predictable from the independent variables (1.0 is optimal)."
            badge="Higher is better"
            highlight={true}
          />
          <MetricCard
            title="Adjusted R²"
            value={metricsData.metrics.adjustedR2.toFixed(4)}
            subtitle="Penalized for feature count"
            tooltip="Adjusted R-squared penalizes the score for adding non-contributing features."
            badge="Higher is better"
          />
          <MetricCard
            title="MAE"
            value={metricsData.metrics.mae.toFixed(4)}
            subtitle="Mean Absolute Error"
            tooltip="Average magnitude of the errors without considering their direction. Lower values are desirable."
            badge="Lower is better"
          />
          <MetricCard
            title="MSE"
            value={metricsData.metrics.mse.toFixed(4)}
            subtitle="Mean Squared Error"
            tooltip="Average squared difference between predicted and actual values. Heavily penalizes large outliers."
            badge="Lower is better"
          />
          <MetricCard
            title="RMSE"
            value={metricsData.metrics.rmse.toFixed(4)}
            subtitle="Root Mean Squared Error"
            tooltip="Square root of the MSE; measured in the same units as the target variable."
            badge="Lower is better"
          />
        </div>
      </div>

      {/* Visualizations Section: 4 Interactive Charts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800">
            Regression Diagnostics & Plots
          </h2>
          <span className="text-xs text-slate-400">Interactive visual inspections</span>
        </div>

        <RegressionCharts metricsData={metricsData} />
      </div>
    </div>
  );
};
