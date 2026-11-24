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
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Check,
  CheckSquare,
  Square,
  Trophy,
  BarChart2,
  Clock,
  X
} from 'lucide-react';
import { useML } from '../context/MLContext';
import { PageHeader } from '../components/common/PageHeader';
import { REGRESSION_ALGORITHMS, CLASSIFICATION_ALGORITHMS } from '../data/mlAlgorithms';

export const ModelTraining = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    datasets,
    multiTrainingJob,
    startMultiModelTrainingSimulation,
    resetMultiTraining,
    setSpecificComparisonModels,
    addToast
  } = useML();

  // If redirected with selected dataset
  const preselectedDatasetId = location.state?.selectedDatasetId;

  // Selected dataset
  const [selectedDatasetId, setSelectedDatasetId] = useState(
    preselectedDatasetId || (datasets.length > 0 ? datasets[0].id : '')
  );
  const selectedDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0];

  // Task selection: defaults to dataset task if available
  const [task, setTask] = useState(selectedDataset?.task || 'Regression');

  // Align task and target column when dataset changes
  useEffect(() => {
    if (selectedDataset) {
      if (selectedDataset.task) {
        setTask(selectedDataset.task);
      }
      setTargetColumn(selectedDataset.targetColumn || '');
    }
  }, [selectedDatasetId]);

  const [targetColumn, setTargetColumn] = useState(selectedDataset?.targetColumn || '');

  // Available algorithms based on task
  const availableAlgorithms = task === 'Regression' ? REGRESSION_ALGORITHMS : CLASSIFICATION_ALGORITHMS;

  // Multi-select algorithms state: minimum 2 algorithms
  const [selectedAlgorithmIds, setSelectedAlgorithmIds] = useState(() => {
    const algos = task === 'Regression' ? REGRESSION_ALGORITHMS : CLASSIFICATION_ALGORITHMS;
    return [algos[0]?.id || '', algos[3]?.id || algos[1]?.id || ''];
  });

  // When task changes, reset selection to first two algorithms of the new task
  useEffect(() => {
    const algos = task === 'Regression' ? REGRESSION_ALGORITHMS : CLASSIFICATION_ALGORITHMS;
    setSelectedAlgorithmIds([algos[0]?.id || '', algos[3]?.id || algos[1]?.id || '']);
  }, [task]);

  // Individual hyperparameters state: map algorithmId -> { [paramName]: value }
  const [algorithmHyperparameters, setAlgorithmHyperparameters] = useState({});

  // Individual custom model names: map algorithmId -> string
  const [customModelNames, setCustomModelNames] = useState({});

  // Accordion expanded state for hyperparameter panels: map algorithmId -> boolean
  const [expandedPanels, setExpandedPanels] = useState({});

  // Initialize hyperparameters for newly selected algorithms while preserving existing ones
  useEffect(() => {
    setAlgorithmHyperparameters((prev) => {
      const updated = { ...prev };
      selectedAlgorithmIds.forEach((algoId) => {
        if (!updated[algoId]) {
          const algo = availableAlgorithms.find((a) => a.id === algoId);
          if (algo && algo.hyperparameters) {
            const defaults = {};
            algo.hyperparameters.forEach((hp) => {
              defaults[hp.name] = hp.default;
            });
            updated[algoId] = defaults;
          }
        }
      });
      return updated;
    });

    setCustomModelNames((prev) => {
      const updated = { ...prev };
      selectedAlgorithmIds.forEach((algoId) => {
        if (!updated[algoId]) {
          const algo = availableAlgorithms.find((a) => a.id === algoId);
          const shortDs = selectedDataset ? selectedDataset.name.split(' ')[0] : 'Model';
          const shortAlgo = algo ? algo.name.split(' ')[0] : 'Algo';
          updated[algoId] = `${shortDs}-${shortAlgo}`;
        }
      });
      return updated;
    });

    setExpandedPanels((prev) => {
      const updated = { ...prev };
      selectedAlgorithmIds.forEach((algoId, idx) => {
        if (updated[algoId] === undefined) {
          updated[algoId] = idx === 0;
        }
      });
      return updated;
    });
  }, [selectedAlgorithmIds, availableAlgorithms, selectedDatasetId]);

  // Common training settings
  const [trainRatio, setTrainRatio] = useState(80);
  const [randomState, setRandomState] = useState(42);

  // Toggle algorithm selection (multi-select)
  const toggleAlgorithmSelection = (algoId) => {
    setSelectedAlgorithmIds((prev) => {
      if (prev.includes(algoId)) {
        return prev.filter((id) => id !== algoId);
      } else {
        return [...prev, algoId];
      }
    });
  };

  // Select all algorithms in current task
  const handleSelectAll = () => {
    setSelectedAlgorithmIds(availableAlgorithms.map((a) => a.id));
    addToast(`Selected all ${availableAlgorithms.length} ${task} algorithms.`, 'info');
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedAlgorithmIds([]);
    addToast('Cleared algorithm selection. Please select at least 2 algorithms.', 'info');
  };

  // Handle hyperparameter change for a specific algorithm
  const handleParamChange = (algoId, paramName, value) => {
    setAlgorithmHyperparameters((prev) => ({
      ...prev,
      [algoId]: {
        ...(prev[algoId] || {}),
        [paramName]: value
      }
    }));
  };

  // Reset hyperparameters for a single algorithm to defaults
  const handleResetAlgorithmParams = (algoId) => {
    const algo = availableAlgorithms.find((a) => a.id === algoId);
    if (algo && algo.hyperparameters) {
      const defaults = {};
      algo.hyperparameters.forEach((hp) => {
        defaults[hp.name] = hp.default;
      });
      setAlgorithmHyperparameters((prev) => ({
        ...prev,
        [algoId]: defaults
      }));
      addToast(`Reset ${algo.name} parameters to defaults.`, 'info');
    }
  };

  // Toggle accordion expand/collapse
  const togglePanelExpand = (algoId) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [algoId]: !prev[algoId]
    }));
  };

  // Validation
  const isSelectionValid = selectedAlgorithmIds.length >= 2;
  const isDatasetValid = Boolean(selectedDataset && targetColumn);
  const canTrain = isSelectionValid && isDatasetValid && !multiTrainingJob.isRunning;

  // Handle Start Multi-Training
  const handleStartMultiTraining = () => {
    if (!isDatasetValid) {
      addToast('Please select a valid dataset and target column.', 'warning');
      return;
    }
    if (selectedAlgorithmIds.length < 2) {
      addToast('Please select at least 2 algorithms to train and compare simultaneously.', 'warning');
      return;
    }

    const modelsPayload = selectedAlgorithmIds.map((algoId) => {
      const algo = availableAlgorithms.find((a) => a.id === algoId);
      const name = customModelNames[algoId] || `${algo.name}-v1`;
      const hp = algorithmHyperparameters[algoId] || {};
      return {
        algorithmId: algo.id,
        algorithmName: algo.name,
        name,
        hyperparameters: hp
      };
    });

    startMultiModelTrainingSimulation({
      dataset: selectedDataset,
      targetColumn,
      task,
      trainRatio,
      randomState,
      models: modelsPayload
    });
  };

  // Find best-performing model among multi-training results
  const getBestModelId = (results) => {
    if (!results || results.length === 0) return null;
    if (task === 'Regression') {
      let best = results[0];
      results.forEach((m) => {
        if ((m.metrics?.r2 || 0) > (best.metrics?.r2 || 0)) {
          best = m;
        }
      });
      return best.id;
    } else {
      let best = results[0];
      results.forEach((m) => {
        if ((m.metrics?.accuracy || 0) > (best.metrics?.accuracy || 0)) {
          best = m;
        }
      });
      return best.id;
    }
  };

  const bestModelId = getBestModelId(multiTrainingJob.results);

  // Navigate to Comparison with newly trained models
  const handleCompareNewModels = () => {
    if (multiTrainingJob.results && multiTrainingJob.results.length >= 2) {
      const newIds = multiTrainingJob.results.slice(0, 4).map((m) => m.id);
      setSpecificComparisonModels(newIds);
      navigate('/comparison');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Model Training Workspace"
        subtitle="Configure feature matrices, select multiple candidate algorithms, tune individual hyperparameters, and execute parallel evaluation pipelines."
        badge="Multi-Model Pipeline"
      />

      {/* Demo Simulation Notice Banner */}
      <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 transition-colors">
        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Multi-Model Training Simulation:</span>{' '}
          Select 2 or more algorithms to train concurrently on the same dataset. Hyperparameters are tuned individually per model. Results are saved to Model History and can be benchmarked directly in Model Comparison.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Configuration Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: Dataset & Target Variable */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700">
                  1
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Dataset & Target Selection
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Common configuration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Training Dataset *
                </label>
                <select
                  value={selectedDatasetId}
                  onChange={(e) => setSelectedDatasetId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-800 dark:text-slate-200"
                >
                  {datasets.map((ds) => (
                    <option key={ds.id} value={ds.id}>
                      {ds.name} ({ds.rows?.toLocaleString()} rows • {ds.task})
                    </option>
                  ))}
                </select>
                {selectedDataset && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    {selectedDataset.columns} features • File: {selectedDataset.filename}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Column (y) *
                </label>
                <select
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono font-medium text-slate-800 dark:text-slate-200"
                >
                  {selectedDataset?.columnDetails?.map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name} ({col.type})
                    </option>
                  )) || <option value="target">target</option>}
                </select>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Variable to be predicted by all selected algorithms.
                </p>
              </div>
            </div>

            {/* Task Toggle */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Machine Learning Task
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTask('Regression')}
                  className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-colors ${
                    task === 'Regression'
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-300 font-medium'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <TrendingUp className={`w-4 h-4 ${task === 'Regression' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <div>
                    <div className="text-xs font-semibold">Regression</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Continuous values (e.g. price, cost)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTask('Classification')}
                  className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-colors ${
                    task === 'Classification'
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-300 font-medium'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Target className={`w-4 h-4 ${task === 'Classification' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <div>
                    <div className="text-xs font-semibold">Classification</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Discrete classes (e.g. churn, fraud)</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: Multi-Model Algorithm Selection */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700">
                  2
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Select Algorithms to Train
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                >
                  Select All
                </button>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Selection Counter & Requirement Warning */}
            <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedAlgorithmIds.length} Models Selected
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                  ({availableAlgorithms.length} {task} algorithms available)
                </span>
              </div>
              {!isSelectionValid && (
                <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Select at least 2 algorithms
                </span>
              )}
            </div>

            {/* Algorithm Grid Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableAlgorithms.map((algo) => {
                const isSelected = selectedAlgorithmIds.includes(algo.id);
                return (
                  <div
                    key={algo.id}
                    onClick={() => toggleAlgorithmSelection(algo.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-3 select-none ${
                      isSelected
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-blue-600 dark:ring-blue-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/70'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {algo.name}
                        </span>
                        {algo.badge && (
                          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                            {algo.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {algo.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Individual Hyperparameter Configurations */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700">
                  3
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Individual Model Hyperparameters ({selectedAlgorithmIds.length} Models)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Independent configuration</span>
            </div>

            {selectedAlgorithmIds.length > 0 ? (
              <div className="space-y-3">
                {selectedAlgorithmIds.map((algoId) => {
                  const algo = availableAlgorithms.find((a) => a.id === algoId);
                  if (!algo) return null;
                  const isExpanded = expandedPanels[algoId] ?? false;
                  const currentParams = algorithmHyperparameters[algoId] || {};
                  const currentName = customModelNames[algoId] || algo.name;

                  return (
                    <div
                      key={algoId}
                      className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 transition-all"
                    >
                      {/* Accordion Card Header */}
                      <div
                        onClick={() => togglePanelExpand(algoId)}
                        className="px-4 py-3 bg-slate-50/70 dark:bg-slate-800/70 hover:bg-slate-100/70 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between gap-3 select-none"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{algo.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                            {algo.family}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">
                            • {Object.keys(currentParams).length} parameters
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResetAlgorithmParams(algoId);
                            }}
                            className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 px-2 py-1 rounded hover:bg-white dark:hover:bg-slate-700 transition-colors"
                            title="Reset this model's parameters to defaults"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span className="hidden sm:inline">Defaults</span>
                          </button>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Accordion Card Content */}
                      {isExpanded && (
                        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
                          {/* Model custom name field */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Model Instance Name
                            </label>
                            <input
                              type="text"
                              value={currentName}
                              onChange={(e) =>
                                setCustomModelNames({ ...customModelNames, [algoId]: e.target.value })
                              }
                              placeholder={`${algo.name} Identifier`}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium"
                            />
                          </div>

                          {/* Dynamic Hyperparameters for this Algorithm */}
                          {algo.hyperparameters?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {algo.hyperparameters.map((param) => (
                                <div key={param.name} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                      <span>{param.label}</span>
                                      <code className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                        ({param.name})
                                      </code>
                                    </label>
                                    {param.tooltip && (
                                      <div className="group relative">
                                        <HelpCircle className="w-3 h-3 text-slate-400 dark:text-slate-500 cursor-help" />
                                        <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-30 leading-snug border border-slate-800">
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
                                      value={currentParams[param.name] ?? param.default}
                                      onChange={(e) =>
                                        handleParamChange(algoId, param.name, Number(e.target.value))
                                      }
                                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                                    />
                                  )}

                                  {param.type === 'select' && (
                                    <select
                                      value={currentParams[param.name] ?? param.default}
                                      onChange={(e) =>
                                        handleParamChange(algoId, param.name, e.target.value)
                                      }
                                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                                        checked={Boolean(currentParams[param.name] ?? param.default)}
                                        onChange={(e) =>
                                          handleParamChange(algoId, param.name, e.target.checked)
                                        }
                                        className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
                                      />
                                      <span className="text-xs text-slate-600 dark:text-slate-300">
                                        {currentParams[param.name] ? 'Enabled (True)' : 'Disabled (False)'}
                                      </span>
                                    </label>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                              No hyperparameters required for this baseline model.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
                Please select at least 2 algorithms above to configure their individual parameters.
              </div>
            )}
          </div>

          {/* SECTION 4: Split & Reproducibility */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700">
                  4
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Validation & Split Strategy
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Applied across all models</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Train/Test Split Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Train / Test Split Ratio</span>
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
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
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <span>50 / 50</span>
                  <span>70 / 30</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">80 / 20</span>
                  <span>90 / 10</span>
                </div>
              </div>

              {/* Random State */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Random Seed (random_state)</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">Reproducibility</span>
                </div>
                <input
                  type="number"
                  value={randomState}
                  onChange={(e) => setRandomState(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Ensures all models are evaluated on the exact same train/test split.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Batch Summary & Launch Panel */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 sticky top-20 transition-colors">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Batch Execution Summary
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Review configuration before training
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">ML Task:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{task}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Dataset:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-right truncate max-w-[150px]">
                  {selectedDataset?.name}
                </span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Target Feature:</span>
                <span className="font-mono text-blue-700 dark:text-blue-400 font-semibold">{targetColumn}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Selected Models:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {selectedAlgorithmIds.length} algorithms
                </span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Split Ratio:</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">
                  {trainRatio} / {100 - trainRatio}
                </span>
              </div>
            </div>

            {/* Selected Algorithms Chip List */}
            <div>
              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Selected Algorithms Roster
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {selectedAlgorithmIds.map((algoId) => {
                  const algo = availableAlgorithms.find((a) => a.id === algoId);
                  return (
                    <span
                      key={algoId}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      <span>{algo?.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Validation Notice */}
            {!isSelectionValid && (
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Select at least 2 algorithms to train.</span>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              onClick={handleStartMultiTraining}
              disabled={!canTrain}
              className="w-full py-2.5 px-4 rounded-lg font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>
                {multiTrainingJob.isRunning
                  ? 'Training Simulation in Progress...'
                  : `Train All Selected Models (${selectedAlgorithmIds.length})`}
              </span>
            </button>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-tight">
              Phase 1 simulated pipeline runs locally in browser. Results will populate Model History.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: Multi-Model Progress Simulation Modal */}
      {multiTrainingJob.isRunning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Cpu className="w-4 h-4 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Training {multiTrainingJob.modelsStatus.length} Models in Batch
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dataset: {multiTrainingJob.datasetName} • Target: {multiTrainingJob.targetColumn}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {multiTrainingJob.overallProgress}% Overall
              </span>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>{multiTrainingJob.currentStepMessage}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${multiTrainingJob.overallProgress}%` }}
                />
              </div>
            </div>

            {/* Individual Model Status List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              {multiTrainingJob.modelsStatus.map((ms, idx) => (
                <div key={ms.id || idx} className="p-3 flex items-center justify-between text-xs bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 text-center font-mono text-slate-400 dark:text-slate-500">{idx + 1}</span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{ms.name}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{ms.algorithmName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{ms.duration}</span>
                    {ms.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-medium">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    )}
                    {ms.status === 'training' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full font-medium animate-pulse">
                        <Cpu className="w-3 h-3 animate-spin" /> Training...
                      </span>
                    )}
                    {ms.status === 'pending' && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
              Simulation creates unique model entities and computes validation diagnostics.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 6: Multi-Model Results Dashboard (Appears upon completion) */}
      {multiTrainingJob.results && multiTrainingJob.results.length > 0 && !multiTrainingJob.isRunning && (
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 fade-in transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Batch Training Results ({multiTrainingJob.results.length} Models)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Simulated
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluation results recorded on {trainRatio}% train / {100 - trainRatio}% test split
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCompareNewModels}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Compare These Models in Studio</span>
              </button>
              <button
                onClick={() => navigate('/history')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                View History
              </button>
              <button
                onClick={resetMultiTraining}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Dismiss Results"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Model Name</th>
                  <th className="py-2.5 px-3 font-semibold">Algorithm</th>
                  <th className="py-2.5 px-3 font-semibold">Duration</th>
                  {task === 'Regression' ? (
                    <>
                      <th className="py-2.5 px-3 font-semibold">R² Score (↑)</th>
                      <th className="py-2.5 px-3 font-semibold">Adj R² (↑)</th>
                      <th className="py-2.5 px-3 font-semibold">MAE (↓)</th>
                      <th className="py-2.5 px-3 font-semibold">MSE (↓)</th>
                      <th className="py-2.5 px-3 font-semibold">RMSE (↓)</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2.5 px-3 font-semibold">Accuracy (↑)</th>
                      <th className="py-2.5 px-3 font-semibold">Precision (↑)</th>
                      <th className="py-2.5 px-3 font-semibold">Recall (↑)</th>
                      <th className="py-2.5 px-3 font-semibold">F1 Score (↑)</th>
                      <th className="py-2.5 px-3 font-semibold">ROC-AUC (↑)</th>
                    </>
                  )}
                  <th className="py-2.5 px-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {multiTrainingJob.results.map((m) => {
                  const isBest = m.id === bestModelId;
                  const metrics = m.metrics || {};

                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors ${
                        isBest ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span>{m.name}</span>
                          {isBest && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <Trophy className="w-3 h-3 text-emerald-700 dark:text-emerald-400" /> Best Model
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{m.algorithmName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">{m.trainingTime}</td>

                      {task === 'Regression' ? (
                        <>
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-700 dark:text-blue-400">
                            {metrics.r2?.toFixed(4)}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {metrics.adjustedR2?.toFixed(4)}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {metrics.mae?.toFixed(4)}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {metrics.mse?.toFixed(4)}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {metrics.rmse?.toFixed(4)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {(metrics.accuracy * 100)?.toFixed(1)}%
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {(metrics.precision * 100)?.toFixed(1)}%
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {(metrics.recall * 100)?.toFixed(1)}%
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {metrics.f1Score?.toFixed(4)}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {metrics.rocAuc?.toFixed(4)}
                          </td>
                        </>
                      )}

                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Recorded
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
