import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Cpu,
  Database,
  Sliders,
  Sparkles,
  RefreshCw,
  Layers,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useML } from '../context/MLContext';
import { PageHeader } from '../components/common/PageHeader';
import { MetricCard } from '../components/common/MetricCard';
import { CLASSIFICATION_ALGORITHMS } from '../data/mlAlgorithms';
import { getClassificationDemoMetrics } from '../data/mockMetrics';
import { ClassificationCharts } from '../components/charts/ClassificationCharts';

export const Classification = () => {
  const navigate = useNavigate();
  const { datasets } = useML();

  // Filter classification datasets
  const classificationDatasets = datasets.filter((d) => d.task === 'Classification');
  const [selectedDatasetId, setSelectedDatasetId] = useState(
    classificationDatasets[0]?.id || datasets[0]?.id || ''
  );
  const selectedDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0];

  // Selected classification algorithm
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState('random-forest-classifier');
  const selectedAlgorithm =
    CLASSIFICATION_ALGORITHMS.find((a) => a.id === selectedAlgorithmId) || CLASSIFICATION_ALGORITHMS[2];

  // Hyperparameters
  const [hyperparameters, setHyperparameters] = useState({
    n_estimators: 100,
    criterion: 'gini',
    max_depth: 12,
    min_samples_split: 2,
    bootstrap: true
  });

  // Metrics dataset
  const [metricsData, setMetricsData] = useState(() =>
    getClassificationDemoMetrics(selectedAlgorithm.name)
  );

  const handleAlgorithmChange = (algoId) => {
    setSelectedAlgorithmId(algoId);
    const newAlgo = CLASSIFICATION_ALGORITHMS.find((a) => a.id === algoId);
    if (newAlgo) {
      const initial = {};
      newAlgo.hyperparameters?.forEach((hp) => {
        initial[hp.name] = hp.default;
      });
      setHyperparameters(initial);
      setMetricsData(getClassificationDemoMetrics(newAlgo.name));
    }
  };

  const handleUpdateEvaluation = () => {
    setMetricsData(getClassificationDemoMetrics(selectedAlgorithm.name));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classification Modeling Workspace"
        subtitle="Train discrete category classifiers, evaluate confusion matrices, ROC-AUC, and precision-recall dynamics."
        badge="Discrete Category Workspace"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpdateEvaluation}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
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
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <span className="font-bold">Demonstration Classification Metrics:</span> Displaying simulated validation results for <span className="font-semibold">{selectedAlgorithm.name}</span> on dataset <span className="font-semibold">{selectedDataset?.name}</span>. Full backend model training, threshold tuning and multiclass probabilities will integrate in Phase 2.
        </div>
      </div>

      {/* Top Controls: Algorithm Picker, Dataset & Hyperparameters Panel */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Algorithm Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Classification Algorithm ({CLASSIFICATION_ALGORITHMS.length} options)
            </label>
            <select
              value={selectedAlgorithmId}
              onChange={(e) => handleAlgorithmChange(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            >
              {CLASSIFICATION_ALGORITHMS.map((algo) => (
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
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
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

      {/* Classification Metrics 5-Card Dashboard */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800">
            Classification Performance Metrics
          </h2>
          <span className="text-xs text-slate-400">Calculated on holdout validation split (20%)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Accuracy"
            value={`${(metricsData.metrics.accuracy * 100).toFixed(1)}%`}
            subtitle="Overall correct predictions"
            tooltip="Ratio of correctly predicted observations to total observations (TP + TN) / Total."
            badge="Higher is better"
            highlight={true}
          />
          <MetricCard
            title="Precision"
            value={`${(metricsData.metrics.precision * 100).toFixed(1)}%`}
            subtitle="Positive predictive value"
            tooltip="Ratio of correctly predicted positive observations to total predicted positive observations: TP / (TP + FP)."
            badge="Higher is better"
          />
          <MetricCard
            title="Recall"
            value={`${(metricsData.metrics.recall * 100).toFixed(1)}%`}
            subtitle="Sensitivity / True Positive Rate"
            tooltip="Ratio of correctly predicted positive observations to all observations in actual class: TP / (TP + FN)."
            badge="Higher is better"
          />
          <MetricCard
            title="F1 Score"
            value={metricsData.metrics.f1Score.toFixed(4)}
            subtitle="Harmonic mean of P & R"
            tooltip="Weighted average of Precision and Recall. Takes both false positives and false negatives into account."
            badge="Higher is better"
          />
          <MetricCard
            title="ROC-AUC"
            value={metricsData.metrics.rocAuc.toFixed(4)}
            subtitle="Area Under ROC Curve"
            tooltip="Degree or measure of separability between classes across all possible decision thresholds."
            badge="Higher is better"
          />
        </div>
      </div>

      {/* Visualizations Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800">
            Classification Diagnostics & Curves
          </h2>
          <span className="text-xs text-slate-400">Interactive ROC, PR and matrix displays</span>
        </div>

        <ClassificationCharts metricsData={metricsData} />
      </div>
    </div>
  );
};
