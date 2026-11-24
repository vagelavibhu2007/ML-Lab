import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Database,
  TrendingUp,
  Target,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
  Play,
  ArrowRight,
  RotateCcw,
  Layers,
  Settings2,
  AlertCircle
} from 'lucide-react';
import { useML } from '../context/MLContext';
import { PageHeader } from '../components/common/PageHeader';
import { REGRESSION_ALGORITHMS, CLASSIFICATION_ALGORITHMS } from '../data/mlAlgorithms';

export const ModelTraining = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { datasets, startTrainingSimulation, trainingSimulation, resetSimulation } = useML();

  // If redirected with selected dataset
  const preselectedDatasetId = location.state?.selectedDatasetId;

  // Selected dataset
  const [selectedDatasetId, setSelectedDatasetId] = useState(
    preselectedDatasetId || (datasets.length > 0 ? datasets[0].id : '')
  );

  const selectedDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0];

  // Task selection: defaults to dataset task if available
  const [task, setTask] = useState(selectedDataset?.task || 'Regression');

  // When dataset changes, auto-align task and target column
  useEffect(() => {
    if (selectedDataset) {
      if (selectedDataset.task) {
        setTask(selectedDataset.task);
      }
      setTargetColumn(selectedDataset.targetColumn || '');
    }
  }, [selectedDatasetId]);

  // Target column
  const [targetColumn, setTargetColumn] = useState(selectedDataset?.targetColumn || '');

  // Available algorithms based on task
  const availableAlgorithms = task === 'Regression' ? REGRESSION_ALGORITHMS : CLASSIFICATION_ALGORITHMS;

  // Selected algorithm
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState(availableAlgorithms[0]?.id || '');

  // When task changes, update selected algorithm to first in new task
  useEffect(() => {
    const algos = task === 'Regression' ? REGRESSION_ALGORITHMS : CLASSIFICATION_ALGORITHMS;
    setSelectedAlgorithmId(algos[0]?.id || '');
  }, [task]);

  const selectedAlgorithm = availableAlgorithms.find((a) => a.id === selectedAlgorithmId) || availableAlgorithms[0];

  // Dynamic Hyperparameters state
  const [hyperparameters, setHyperparameters] = useState({});

  // Reset hyperparameters whenever algorithm changes
  useEffect(() => {
    if (selectedAlgorithm && selectedAlgorithm.hyperparameters) {
      const initialParams = {};
      selectedAlgorithm.hyperparameters.forEach((hp) => {
        initialParams[hp.name] = hp.default;
      });
      setHyperparameters(initialParams);
    }
  }, [selectedAlgorithmId]);

  // Split and random state
  const [trainRatio, setTrainRatio] = useState(80);
  const [randomState, setRandomState] = useState(42);
  const [modelName, setModelName] = useState('');

  // Default model name auto-population
  useEffect(() => {
    if (selectedAlgorithm) {
      const shortAlgo = selectedAlgorithm.name.split(' ')[0];
      const shortDs = selectedDataset ? selectedDataset.name.split(' ')[0] : 'Model';
      setModelName(`${shortDs}-${shortAlgo}-v1`);
    }
  }, [selectedAlgorithmId, selectedDatasetId]);

  // Handle hyperparameter input change
  const handleParamChange = (name, value) => {
    setHyperparameters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartTraining = () => {
    if (!selectedDataset) return;

    const config = {
      modelName: modelName.trim() || `${selectedAlgorithm.name}-Model`,
      algorithmId: selectedAlgorithm.id,
      algorithmName: selectedAlgorithm.name,
      task,
      datasetId: selectedDataset.id,
      datasetName: selectedDataset.name,
      targetColumn: targetColumn || selectedDataset.targetColumn || 'target',
      trainRatio,
      randomState,
      hyperparameters
    };

    startTrainingSimulation(config);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Model Training Studio"
        subtitle="Configure feature matrices, hyperparameter parameters, cross-validation and launch training pipelines."
        badge="Phase 1 Interface"
      />

      {/* Demo Simulation Notice Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/70 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Phase 1 Training Simulator:</span> This interface dynamically adapts parameters for all 16 ML algorithms. Clicking <span className="font-semibold">"Train Model"</span> simulates pipeline execution and registers realistic metrics into local history. Actual Python backend training with Scikit-Learn/XGBoost is reserved for Phase 2.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Configuration Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1 & 2: Dataset & Target Column Selection */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-800">Dataset & Target Selection</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Training Dataset *
                </label>
                <select
                  value={selectedDatasetId}
                  onChange={(e) => setSelectedDatasetId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                >
                  {datasets.map((ds) => (
                    <option key={ds.id} value={ds.id}>
                      {ds.name} ({ds.rows?.toLocaleString()} rows • {ds.task})
                    </option>
                  ))}
                </select>
                {selectedDataset && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    {selectedDataset.columns} columns • File: {selectedDataset.filename}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Column (y) *
                </label>
                <select
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium font-mono"
                >
                  {selectedDataset?.columnDetails?.map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name} ({col.type})
                    </option>
                  )) || (
                    <option value="target">target</option>
                  )}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Continuous values for regression, categorical for classification.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 3 & 4: Task & Algorithm Selection */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-800">Machine Learning Task & Algorithm</h3>
            </div>

            {/* Task Toggle Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Machine Learning Task
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTask('Regression')}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    task === 'Regression'
                      ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 text-blue-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <TrendingUp className={`w-5 h-5 ${task === 'Regression' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold">Regression</div>
                    <div className="text-[11px] text-slate-500">Continuous values (e.g. Price, Temperature)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTask('Classification')}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    task === 'Classification'
                      ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500 text-emerald-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Target className={`w-5 h-5 ${task === 'Classification' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold">Classification</div>
                    <div className="text-[11px] text-slate-500">Discrete classes (e.g. Churn, Fraud, Label)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Algorithm Grid Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  Select {task} Algorithm ({availableAlgorithms.length} available)
                </label>
                <span className="text-[11px] text-slate-400">
                  Includes Linear, Trees, Kernels & Ensembles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableAlgorithms.map((algo) => {
                  const isSelected = algo.id === selectedAlgorithmId;
                  return (
                    <div
                      key={algo.id}
                      onClick={() => setSelectedAlgorithmId(algo.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-bold text-slate-800">{algo.name}</span>
                        {algo.badge && (
                          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {algo.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                        {algo.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 5: Dynamic Hyperparameters Configuration */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Configure Hyperparameters ({selectedAlgorithm?.name})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (selectedAlgorithm?.hyperparameters) {
                    const resetObj = {};
                    selectedAlgorithm.hyperparameters.forEach((hp) => {
                      resetObj[hp.name] = hp.default;
                    });
                    setHyperparameters(resetObj);
                  }
                }}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Defaults</span>
              </button>
            </div>

            {selectedAlgorithm?.hyperparameters?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedAlgorithm.hyperparameters.map((param) => (
                  <div key={param.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <span>{param.label}</span>
                        <code className="text-[10px] font-mono text-slate-400">({param.name})</code>
                      </label>
                      {param.tooltip && (
                        <div className="group relative">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                          <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block w-52 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-30 leading-snug">
                            {param.tooltip}
                          </div>
                        </div>
                      )}
                    </div>

                    {param.type === 'number' && (
                      <input
                        type="number"
                        min={param.min}
                        max={param.max}
                        step={param.step || 1}
                        value={hyperparameters[param.name] ?? param.default}
                        onChange={(e) => handleParamChange(param.name, Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      />
                    )}

                    {param.type === 'select' && (
                      <select
                        value={hyperparameters[param.name] ?? param.default}
                        onChange={(e) => handleParamChange(param.name, e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        {param.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {param.type === 'boolean' && (
                      <label className="flex items-center gap-2 mt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(hyperparameters[param.name] ?? param.default)}
                          onChange={(e) => handleParamChange(param.name, e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="text-xs text-slate-600">
                          {hyperparameters[param.name] ? 'Enabled (True)' : 'Disabled (False)'}
                        </span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No tunable hyperparameters required for this baseline configuration.
              </p>
            )}
          </div>

          {/* STEP 6 & 7: Train-Test Split & Random State */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-800">Split & Validation Strategy</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Train/Test Split Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Train / Test Split Ratio</span>
                  <span className="font-mono font-bold text-blue-600">
                    {trainRatio}% Train / {100 - trainRatio}% Test
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  step="5"
                  value={trainRatio}
                  onChange={(e) => setTrainRatio(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>50 / 50</span>
                  <span>70 / 30</span>
                  <span className="font-bold text-slate-600">80 / 20</span>
                  <span>90 / 10</span>
                </div>
              </div>

              {/* Random State */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Random Seed (Reproducibility)</span>
                  <span className="text-[11px] text-slate-400">random_state</span>
                </div>
                <input
                  type="number"
                  value={randomState}
                  onChange={(e) => setRandomState(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                />
                <p className="text-[10px] text-slate-400">
                  Guarantees deterministic data split and internal algorithm shuffling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Configuration Summary & Launch Card */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5 sticky top-20">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Training Pipeline Summary</h3>
              <p className="text-xs text-slate-500">Review configuration before executing simulation</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Model Identifier Name
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Custom Model Name"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              />
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">ML Task:</span>
                <span className="font-semibold text-slate-900">{task}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">Algorithm:</span>
                <span className="font-semibold text-slate-900 text-right">{selectedAlgorithm?.name}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">Dataset:</span>
                <span className="font-semibold text-slate-900 text-right">{selectedDataset?.name}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">Target Feature:</span>
                <span className="font-mono text-blue-700 font-semibold">{targetColumn}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">Train/Test Split:</span>
                <span className="font-mono text-slate-900 font-medium">{trainRatio} / {100 - trainRatio}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">Tuned Parameters:</span>
                <span className="font-mono text-slate-900 font-medium">
                  {Object.keys(hyperparameters).length} configured
                </span>
              </div>
            </div>

            {/* Hyperparameter Summary Snippet */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 font-mono text-[11px] text-slate-600 max-h-36 overflow-y-auto">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Parameters Payload</div>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(hyperparameters, null, 2)}
              </pre>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStartTraining}
              disabled={trainingSimulation.isRunning}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{trainingSimulation.isRunning ? 'Training In Progress...' : 'Launch Training Simulation'}</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-tight">
              Phase 1 interactive simulation will run client-side and save results to Model History.
            </p>
          </div>
        </div>
      </div>

      {/* Training Simulation Modal / Progress Overlay */}
      {trainingSimulation.isRunning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Cpu className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Simulating Training: {trainingSimulation.config?.algorithmName}
                </h3>
                <p className="text-xs text-slate-500">
                  Dataset: {trainingSimulation.config?.datasetName}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">{trainingSimulation.currentStep}</span>
                <span className="font-mono text-blue-600">{trainingSimulation.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${trainingSimulation.progress}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 space-y-1">
              <div>• Splitting features and matrix encoding</div>
              <div>• Hyperparameters: {Object.keys(trainingSimulation.config?.hyperparameters || {}).join(', ')}</div>
              <div>• Computing cross-validation and residual errors</div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {trainingSimulation.completedModel && !trainingSimulation.isRunning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Model Simulation Complete!</h3>
                <p className="text-xs text-slate-500">
                  "{trainingSimulation.completedModel.name}" has been recorded.
                </p>
              </div>
            </div>

            {/* Metrics Snapshot */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="text-xs font-bold text-slate-700">Simulated Validation Metrics:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {trainingSimulation.completedModel.task === 'Regression' ? (
                  <>
                    <div>R² Score: <span className="font-mono font-bold text-blue-600">{trainingSimulation.completedModel.metrics.r2}</span></div>
                    <div>RMSE: <span className="font-mono font-bold text-slate-800">{trainingSimulation.completedModel.metrics.rmse}</span></div>
                    <div>MAE: <span className="font-mono font-bold text-slate-800">{trainingSimulation.completedModel.metrics.mae}</span></div>
                    <div>MSE: <span className="font-mono font-bold text-slate-800">{trainingSimulation.completedModel.metrics.mse}</span></div>
                  </>
                ) : (
                  <>
                    <div>Accuracy: <span className="font-mono font-bold text-emerald-600">{(trainingSimulation.completedModel.metrics.accuracy * 100).toFixed(1)}%</span></div>
                    <div>ROC-AUC: <span className="font-mono font-bold text-blue-600">{trainingSimulation.completedModel.metrics.rocAuc}</span></div>
                    <div>Precision: <span className="font-mono font-bold text-slate-800">{(trainingSimulation.completedModel.metrics.precision * 100).toFixed(1)}%</span></div>
                    <div>Recall: <span className="font-mono font-bold text-slate-800">{(trainingSimulation.completedModel.metrics.recall * 100).toFixed(1)}%</span></div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => resetSimulation()}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const targetWorkspace = trainingSimulation.completedModel.task === 'Regression' ? '/regression' : '/classification';
                  resetSimulation();
                  navigate(targetWorkspace);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <span>View in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
