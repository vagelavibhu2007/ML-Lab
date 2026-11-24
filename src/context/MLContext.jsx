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

  // Active training simulation state
  const [trainingSimulation, setTrainingSimulation] = useState({
    isRunning: false,
    progress: 0,
    currentStep: '',
    config: null,
    completedModel: null
  });

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
        trainingSimulation,
        startTrainingSimulation,
        resetSimulation,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </MLContext.Provider>
  );
};
