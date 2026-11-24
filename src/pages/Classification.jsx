import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Cpu,
  Database,
  Sliders,
  Info,
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
    <div className="space-y-5">
      <PageHeader
        title="Classification Modeling Workspace"
        subtitle="Evaluate discrete classifiers, assess confusion matrices, ROC-AUC, and precision-recall trade-offs."
        badge="Discrete Modeling"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpdateEvaluation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span>Simulate Evaluation</span>
            </button>
            <button
              onClick={() => navigate('/train')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Train in Studio</span>
            </button>
          </div>
        }
      />

      {/* Demonstration metrics notice */}
      <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 transition-colors">
        <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Simulated Classification Metrics:</span> Displaying simulated validation diagnostics for <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedAlgorithm.name}</span> on dataset <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedDataset?.name}</span>. Full backend model training will integrate in Phase 2.
        </div>
      </div>

      {/* Top Controls: Algorithm Picker, Dataset & Hyperparameters Panel */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Algorithm Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Classification Algorithm ({CLASSIFICATION_ALGORITHMS.length} options)
            </label>
            <select
              value={selectedAlgorithmId}
              onChange={(e) => handleAlgorithmChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800 dark:text-slate-200"
            >
              {CLASSIFICATION_ALGORITHMS.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name} ({algo.family})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{selectedAlgorithm.description}</p>
          </div>

          {/* Dataset Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Active Dataset & Target
            </label>
            <select
              value={selectedDatasetId}
              onChange={(e) => setSelectedDatasetId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800 dark:text-slate-200"
            >
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name} (Target: {ds.targetColumn || 'Auto'})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {selectedDataset?.rows?.toLocaleString()} rows • {selectedDataset?.columns} features
            </p>
          </div>
        </div>

        {/* Hyperparameter Quick Tuning bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>Hyperparameters ({selectedAlgorithm.name})</span>
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Dynamic schema</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {selectedAlgorithm.hyperparameters?.map((param) => (
              <div key={param.name} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 truncate">
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
                    className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono"
                  />
                )}
                {param.type === 'select' && (
                  <select
                    value={hyperparameters[param.name] ?? param.default}
                    onChange={(e) =>
                      setHyperparameters({ ...hyperparameters, [param.name]: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    {param.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {param.type === 'boolean' && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="checkbox"
                      checked={Boolean(hyperparameters[param.name] ?? param.default)}
                      onChange={(e) =>
                        setHyperparameters({ ...hyperparameters, [param.name]: e.target.checked })
                      }
                      className="w-3.5 h-3.5 text-blue-600 rounded"
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300">True</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Classification Metrics 5-Card Dashboard */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Classification Performance Metrics
          </h2>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Calculated on holdout validation split</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <MetricCard
            title="Accuracy"
            value={`${(metricsData.metrics.accuracy * 100).toFixed(1)}%`}
            subtitle="Overall correct predictions"
            tooltip="Ratio of correct predictions to total input samples."
            badge="Primary Metric"
            highlight={true}
          />
          <MetricCard
            title="Precision"
            value={`${(metricsData.metrics.precision * 100).toFixed(1)}%`}
            subtitle="Positive predictive value"
            tooltip="Proportion of positive identifications that were actually correct."
            badge="Macro Average"
          />
          <MetricCard
            title="Recall"
            value={`${(metricsData.metrics.recall * 100).toFixed(1)}%`}
            subtitle="Sensitivity (True Positive Rate)"
            tooltip="Proportion of actual positives identified correctly."
            badge="Sensitivity"
          />
          <MetricCard
            title="F1-Score"
            value={metricsData.metrics.f1Score.toFixed(4)}
            subtitle="Harmonic mean of P & R"
            tooltip="Harmonic mean of precision and recall; balanced accuracy indicator."
            badge="Balanced Score"
          />
          <MetricCard
            title="ROC-AUC"
            value={metricsData.metrics.rocAuc.toFixed(4)}
            subtitle="Area under ROC curve"
            tooltip="Degree of separability; measures distinction between true classes."
            badge="Threshold Invariant"
          />
        </div>
      </div>

      {/* Visualizations Section: Confusion Matrix, ROC Curve & Diagnostics */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Classification Diagnostics & Confusion Matrix
          </h2>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Interactive visual diagnostics</span>
        </div>

        <ClassificationCharts metricsData={metricsData} />
      </div>
    </div>
  );
};
