import React, { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_DATASETS } from '../data/sampleDatasets';
import { INITIAL_TRAINED_MODELS } from '../data/mockHistory';
import { ALL_ALGORITHMS } from '../data/mlAlgorithms';

const MLContext = createContext();

export const useML = () => {
  const context = useContext(MLContext);
  if (!context) {
    throw new Error('useML must be used within an MLProvider');
  }
  return context;
};

export const MLProvider = ({ children }) => {
  // Datasets state
  const [datasets, setDatasets] = useState(() => {
    const saved = localStorage.getItem('ml_studio_datasets');
    return saved ? JSON.parse(saved) : SAMPLE_DATASETS;
  });

  // Trained models history
  const [trainedModels, setTrainedModels] = useState(() => {
    const saved = localStorage.getItem('ml_studio_models');
    return saved ? JSON.parse(saved) : INITIAL_TRAINED_MODELS;
  });

  // Selected models for comparison
  const [comparisonModelIds, setComparisonModelIds] = useState(() => {
    // Default select first two regression models
    return ['model-reg-001', 'model-reg-002'];
  });

  // Active single-model training simulation state
  const [trainingSimulation, setTrainingSimulation] = useState({
    isRunning: false,
    progress: 0,
    currentStep: '',
    config: null,
    completedModel: null
  });

  // Active multi-model training simulation state
  const [multiTrainingJob, setMultiTrainingJob] = useState({
    isRunning: false,
    datasetName: '',
    targetColumn: '',
    task: 'Regression',
    overallProgress: 0,
    currentStepMessage: '',
    modelsStatus: [],
    results: []
  });

  // Theme state ('light' | 'dark' | 'system')
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('ml_studio_theme') || 'light';
  });

  const applyThemeDOM = (targetTheme) => {
    if (typeof window === 'undefined') return;
    const isDark =
      targetTheme === 'dark' ||
      (targetTheme === 'system' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add('dark');
      if (body) body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      if (body) body.classList.remove('dark');
    }
  };

  const setTheme = (newTheme) => {
    applyThemeDOM(newTheme);
    setThemeState(newTheme);
    try {
      localStorage.setItem('ml_studio_theme', newTheme);
    } catch (e) {
      console.warn('Could not save theme preference', e);
    }
  };

  useEffect(() => {
    applyThemeDOM(theme);

    if (theme === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyThemeDOM('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Toast notification system
  const [toasts, setToasts] = useState([]);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('ml_studio_datasets', JSON.stringify(datasets));
    } catch (e) {
      console.warn('Storage quota exceeded for datasets', e);
    }
  }, [datasets]);

  useEffect(() => {
    try {
      localStorage.setItem('ml_studio_models', JSON.stringify(trainedModels));
    } catch (e) {
      console.warn('Storage quota exceeded for models', e);
    }
  }, [trainedModels]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addDataset = (newDataset) => {
    setDatasets((prev) => [newDataset, ...prev]);
    addToast(`Dataset "${newDataset.name}" added successfully.`, 'success');
  };

  const deleteDataset = (datasetId) => {
    const target = datasets.find((d) => d.id === datasetId);
    setDatasets((prev) => prev.filter((d) => d.id !== datasetId));
    addToast(`Dataset "${target ? target.name : datasetId}" deleted.`, 'info');
  };

  const deleteModel = (modelId) => {
    const target = trainedModels.find((m) => m.id === modelId);
    setTrainedModels((prev) => prev.filter((m) => m.id !== modelId));
    setComparisonModelIds((prev) => prev.filter((id) => id !== modelId));
    addToast(`Model "${target ? target.name : modelId}" removed from history.`, 'info');
  };

  const toggleComparisonModel = (modelId) => {
    setComparisonModelIds((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      } else {
        if (prev.length >= 4) {
          addToast('You can compare up to 4 models simultaneously.', 'warning');
          return prev;
        }
        return [...prev, modelId];
      }
    });
  };

  const clearComparisonModels = () => {
    setComparisonModelIds([]);
    addToast('Cleared model comparison selection.', 'info');
  };

  const setSpecificComparisonModels = (ids) => {
    setComparisonModelIds(ids);
  };

  // Helper to generate realistic simulated metrics per algorithm family
  const generateSimulatedMetrics = (algorithmId, task) => {
    const isReg = task === 'Regression';
    const rand = (min, max, dec = 4) => Number((min + Math.random() * (max - min)).toFixed(dec));

    if (isReg) {
      switch (algorithmId) {
        case 'xgboost-regressor':
          return { r2: rand(0.91, 0.95), adjustedR2: rand(0.90, 0.94), mae: rand(0.22, 0.27), mse: rand(0.11, 0.16), rmse: rand(0.33, 0.40) };
        case 'gradient-boosting-regressor':
          return { r2: rand(0.89, 0.93), adjustedR2: rand(0.88, 0.92), mae: rand(0.25, 0.30), mse: rand(0.14, 0.19), rmse: rand(0.37, 0.43) };
        case 'random-forest-regressor':
          return { r2: rand(0.87, 0.92), adjustedR2: rand(0.86, 0.91), mae: rand(0.27, 0.32), mse: rand(0.16, 0.21), rmse: rand(0.40, 0.46) };
        case 'support-vector-regression':
          return { r2: rand(0.82, 0.87), adjustedR2: rand(0.81, 0.86), mae: rand(0.33, 0.38), mse: rand(0.22, 0.28), rmse: rand(0.47, 0.53) };
        case 'knn-regressor':
          return { r2: rand(0.79, 0.85), adjustedR2: rand(0.78, 0.84), mae: rand(0.36, 0.41), mse: rand(0.25, 0.31), rmse: rand(0.50, 0.56) };
        case 'polynomial-regression':
          return { r2: rand(0.77, 0.83), adjustedR2: rand(0.76, 0.82), mae: rand(0.38, 0.43), mse: rand(0.27, 0.33), rmse: rand(0.52, 0.57) };
        case 'decision-tree-regressor':
          return { r2: rand(0.75, 0.82), adjustedR2: rand(0.74, 0.81), mae: rand(0.40, 0.45), mse: rand(0.30, 0.36), rmse: rand(0.55, 0.60) };
        case 'linear-regression':
        default:
          return { r2: rand(0.67, 0.74), adjustedR2: rand(0.66, 0.73), mae: rand(0.46, 0.52), mse: rand(0.42, 0.50), rmse: rand(0.65, 0.71) };
      }
    } else {
      switch (algorithmId) {
        case 'xgboost-classifier':
          return { accuracy: rand(0.93, 0.96), precision: rand(0.91, 0.95), recall: rand(0.90, 0.94), f1Score: rand(0.90, 0.94), rocAuc: rand(0.97, 0.99) };
        case 'gradient-boosting-classifier':
          return { accuracy: rand(0.92, 0.95), precision: rand(0.90, 0.94), recall: rand(0.89, 0.93), f1Score: rand(0.89, 0.93), rocAuc: rand(0.96, 0.98) };
        case 'random-forest-classifier':
          return { accuracy: rand(0.90, 0.94), precision: rand(0.88, 0.92), recall: rand(0.87, 0.91), f1Score: rand(0.87, 0.91), rocAuc: rand(0.95, 0.97) };
        case 'support-vector-machine':
          return { accuracy: rand(0.87, 0.91), precision: rand(0.85, 0.89), recall: rand(0.84, 0.88), f1Score: rand(0.84, 0.88), rocAuc: rand(0.92, 0.95) };
        case 'knn-classifier':
          return { accuracy: rand(0.84, 0.88), precision: rand(0.82, 0.86), recall: rand(0.81, 0.85), f1Score: rand(0.81, 0.85), rocAuc: rand(0.89, 0.93) };
        case 'decision-tree-classifier':
          return { accuracy: rand(0.83, 0.87), precision: rand(0.81, 0.85), recall: rand(0.80, 0.84), f1Score: rand(0.80, 0.84), rocAuc: rand(0.86, 0.90) };
        case 'logistic-regression':
          return { accuracy: rand(0.81, 0.86), precision: rand(0.79, 0.84), recall: rand(0.77, 0.82), f1Score: rand(0.78, 0.83), rocAuc: rand(0.87, 0.91) };
        case 'naive-bayes':
        default:
          return { accuracy: rand(0.79, 0.84), precision: rand(0.77, 0.82), recall: rand(0.75, 0.80), f1Score: rand(0.76, 0.81), rocAuc: rand(0.84, 0.88) };
      }
    }
  };

  const getSimulatedDuration = (algorithmId) => {
    const times = {
      'linear-regression': '0.4s',
      'polynomial-regression': '0.9s',
      'decision-tree-regressor': '0.8s',
      'random-forest-regressor': '2.9s',
      'support-vector-regression': '3.6s',
      'knn-regressor': '1.1s',
      'gradient-boosting-regressor': '2.4s',
      'xgboost-regressor': '1.8s',
      'logistic-regression': '0.5s',
      'decision-tree-classifier': '0.7s',
      'random-forest-classifier': '2.8s',
      'support-vector-machine': '4.1s',
      'knn-classifier': '1.2s',
      'naive-bayes': '0.3s',
      'gradient-boosting-classifier': '2.5s',
      'xgboost-classifier': '1.9s'
    };
    return times[algorithmId] || '1.5s';
  };

  // Simulated model training for frontend demonstration
  const startTrainingSimulation = (config, onFinish) => {
    if (trainingSimulation.isRunning) return;

    setTrainingSimulation({
      isRunning: true,
      progress: 5,
      currentStep: 'Initializing ML environment and loading dataset...',
      config,
      completedModel: null
    });

    const steps = [
      { progress: 25, label: 'Preprocessing features, handling missing values & encoding categorical variables...' },
      { progress: 50, label: `Splitting dataset into train (${config.trainRatio || 80}%) & test (${100 - (config.trainRatio || 80)}%)...` },
      { progress: 75, label: `Training ${config.algorithmName} with configured hyperparameters...` },
      { progress: 95, label: 'Evaluating model metrics, residual errors & feature importances...' },
      { progress: 100, label: 'Model training simulation complete!' }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < steps.length) {
        setTrainingSimulation((prev) => ({
          ...prev,
          progress: steps[currentIdx].progress,
          currentStep: steps[currentIdx].label
        }));
        currentIdx++;
      } else {
        clearInterval(interval);

        // Generate realistic simulated metrics based on task
        const isReg = config.task === 'Regression';
        const simulatedMetrics = isReg
          ? {
              r2: Number((0.82 + Math.random() * 0.12).toFixed(4)),
              adjustedR2: Number((0.80 + Math.random() * 0.11).toFixed(4)),
              mae: Number((0.24 + Math.random() * 0.15).toFixed(4)),
              mse: Number((0.12 + Math.random() * 0.10).toFixed(4)),
              rmse: Number((0.35 + Math.random() * 0.12).toFixed(4))
            }
          : {
              accuracy: Number((0.88 + Math.random() * 0.08).toFixed(4)),
              precision: Number((0.86 + Math.random() * 0.08).toFixed(4)),
              recall: Number((0.84 + Math.random() * 0.09).toFixed(4)),
              f1Score: Number((0.85 + Math.random() * 0.08).toFixed(4)),
              rocAuc: Number((0.92 + Math.random() * 0.06).toFixed(4))
            };

        const newModel = {
          id: `model-${Date.now()}`,
          name: config.modelName || `${config.algorithmName.split(' ')[0]}-${Date.now().toString().slice(-4)}`,
          algorithmId: config.algorithmId,
          algorithmName: config.algorithmName,
          task: config.task,
          datasetId: config.datasetId,
          datasetName: config.datasetName,
          targetColumn: config.targetColumn,
          status: 'Completed',
          trainingTime: '2.8s',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          splitRatio: `${config.trainRatio || 80} / ${100 - (config.trainRatio || 80)}`,
          randomState: config.randomState || 42,
          hyperparameters: config.hyperparameters || {},
          metrics: simulatedMetrics,
          isSimulated: true
        };

        setTrainedModels((prev) => [newModel, ...prev]);
        setTrainingSimulation((prev) => ({
          ...prev,
          isRunning: false,
          progress: 100,
          currentStep: 'Completed',
          completedModel: newModel
        }));

        addToast(`Model "${newModel.name}" training simulation completed!`, 'success');
        if (onFinish) onFinish(newModel);
      }
    }, 600);
  };

  const resetSimulation = () => {
    setTrainingSimulation({
      isRunning: false,
      progress: 0,
      currentStep: '',
      config: null,
      completedModel: null
    });
  };

  // Multi-model training simulation for parallel / batch training
  const startMultiModelTrainingSimulation = (payload, onComplete) => {
    const { dataset, targetColumn, task, trainRatio, randomState, models } = payload;
    if (!models || models.length === 0) return;

    const initialStatuses = models.map((m, idx) => ({
      id: `temp-${idx}`,
      name: m.name,
      algorithmId: m.algorithmId,
      algorithmName: m.algorithmName,
      status: 'pending',
      progress: 0,
      duration: getSimulatedDuration(m.algorithmId),
      metrics: null,
      hyperparameters: m.hyperparameters || {}
    }));

    setMultiTrainingJob({
      isRunning: true,
      datasetName: dataset.name,
      targetColumn: targetColumn || dataset.targetColumn || 'target',
      task,
      overallProgress: 10,
      currentStepMessage: `Initializing training batch for ${models.length} models...`,
      modelsStatus: initialStatuses,
      results: []
    });

    let currentModelIdx = 0;
    const completedModelsList = [];

    const interval = setInterval(() => {
      if (currentModelIdx < models.length) {
        const activeModel = models[currentModelIdx];
        const simulatedMetrics = generateSimulatedMetrics(activeModel.algorithmId, task);
        const duration = getSimulatedDuration(activeModel.algorithmId);

        const finishedModel = {
          id: `model-${Date.now()}-${currentModelIdx}`,
          name: activeModel.name,
          algorithmId: activeModel.algorithmId,
          algorithmName: activeModel.algorithmName,
          task,
          datasetId: dataset.id,
          datasetName: dataset.name,
          targetColumn: targetColumn || dataset.targetColumn || 'target',
          status: 'Completed',
          trainingTime: duration,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          splitRatio: `${trainRatio || 80} / ${100 - (trainRatio || 80)}`,
          randomState: randomState || 42,
          hyperparameters: activeModel.hyperparameters || {},
          metrics: simulatedMetrics,
          isSimulated: true
        };

        completedModelsList.push(finishedModel);

        setMultiTrainingJob((prev) => {
          const updatedStatuses = prev.modelsStatus.map((ms, idx) => {
            if (idx === currentModelIdx) {
              return {
                ...ms,
                status: 'completed',
                progress: 100,
                metrics: simulatedMetrics,
                modelId: finishedModel.id
              };
            }
            if (idx === currentModelIdx + 1) {
              return {
                ...ms,
                status: 'training',
                progress: 50
              };
            }
            return ms;
          });

          const progressPercent = Math.round(((currentModelIdx + 1) / models.length) * 100);

          return {
            ...prev,
            overallProgress: progressPercent,
            currentStepMessage: `Completed ${currentModelIdx + 1} of ${models.length}: ${activeModel.name}`,
            modelsStatus: updatedStatuses,
            results: [...completedModelsList]
          };
        });

        currentModelIdx++;
      } else {
        clearInterval(interval);

        // Append all new models to trainedModels
        setTrainedModels((prev) => [...completedModelsList, ...prev]);

        setMultiTrainingJob((prev) => ({
          ...prev,
          isRunning: false,
          overallProgress: 100,
          currentStepMessage: `All ${models.length} model simulations completed successfully.`,
          results: [...completedModelsList]
        }));

        addToast(`Successfully trained ${models.length} models simultaneously!`, 'success');
        if (onComplete) onComplete(completedModelsList);
      }
    }, 600);
  };

  const resetMultiTraining = () => {
    setMultiTrainingJob({
      isRunning: false,
      datasetName: '',
      targetColumn: '',
      task: 'Regression',
      overallProgress: 0,
      currentStepMessage: '',
      modelsStatus: [],
      results: []
    });
  };

  return (
    <MLContext.Provider
      value={{
        datasets,
        addDataset,
        deleteDataset,
        trainedModels,
        deleteModel,
        comparisonModelIds,
        toggleComparisonModel,
        clearComparisonModels,
        setSpecificComparisonModels,
        trainingSimulation,
        startTrainingSimulation,
        resetSimulation,
        multiTrainingJob,
        startMultiModelTrainingSimulation,
        resetMultiTraining,
        toasts,
        addToast,
        removeToast,
        theme,
        setTheme
      }}
    >
      {children}
    </MLContext.Provider>
  );
};
