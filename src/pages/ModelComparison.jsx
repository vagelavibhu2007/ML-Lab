import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2,
  TrendingUp,
  Target,
  Check,
  Trophy,
  RotateCcw,
  Plus,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useML } from '../context/MLContext';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';

export const ModelComparison = () => {
  const navigate = useNavigate();
  const { trainedModels, comparisonModelIds, toggleComparisonModel, clearComparisonModels } = useML();

  // Task filter: 'Regression' | 'Classification'
  const [activeTask, setActiveTask] = useState('Regression');

  // Filter trained models by active task
  const taskModels = trainedModels.filter((m) => m.task === activeTask);

  // Switch task and ensure models are selected for smooth UX
  const handleTaskSwitch = (newTask) => {
    setActiveTask(newTask);
    const newModels = trainedModels.filter((m) => m.task === newTask);
    const currentlySelectedInTask = newModels.filter((m) => comparisonModelIds.includes(m.id));
    if (currentlySelectedInTask.length < 2 && newModels.length >= 2) {
      newModels.slice(0, 2).forEach((m) => {
        if (!comparisonModelIds.includes(m.id)) {
          toggleComparisonModel(m.id);
        }
      });
    }
  };

  // Selected models for comparison (only those matching activeTask)
  const selectedModels = taskModels.filter((m) => comparisonModelIds.includes(m.id));

  // Determine best values for metrics
  const bestMetrics = {};
  if (selectedModels.length > 0) {
    if (activeTask === 'Regression') {
      bestMetrics.r2 = Math.max(...selectedModels.map((m) => m.metrics?.r2 ?? -Infinity));
      bestMetrics.adjustedR2 = Math.max(...selectedModels.map((m) => m.metrics?.adjustedR2 ?? -Infinity));
      bestMetrics.mae = Math.min(...selectedModels.map((m) => m.metrics?.mae ?? Infinity));
      bestMetrics.mse = Math.min(...selectedModels.map((m) => m.metrics?.mse ?? Infinity));
      bestMetrics.rmse = Math.min(...selectedModels.map((m) => m.metrics?.rmse ?? Infinity));
    } else {
      bestMetrics.accuracy = Math.max(...selectedModels.map((m) => m.metrics?.accuracy ?? -Infinity));
      bestMetrics.precision = Math.max(...selectedModels.map((m) => m.metrics?.precision ?? -Infinity));
      bestMetrics.recall = Math.max(...selectedModels.map((m) => m.metrics?.recall ?? -Infinity));
      bestMetrics.f1Score = Math.max(...selectedModels.map((m) => m.metrics?.f1Score ?? -Infinity));
      bestMetrics.rocAuc = Math.max(...selectedModels.map((m) => m.metrics?.rocAuc ?? -Infinity));
    }
  }

  // Chart data formatting
  const comparisonChartData = selectedModels.map((m) => {
    if (activeTask === 'Regression') {
      return {
        name: m.name.length > 16 ? m.name.substring(0, 14) + '..' : m.name,
        'R² Score': Number((m.metrics?.r2 || 0).toFixed(3)),
        'RMSE (Lower is better)': Number((m.metrics?.rmse || 0).toFixed(3)),
        'MAE (Lower is better)': Number((m.metrics?.mae || 0).toFixed(3))
      };
    } else {
      return {
        name: m.name.length > 16 ? m.name.substring(0, 14) + '..' : m.name,
        'Accuracy %': Number(((m.metrics?.accuracy || 0) * 100).toFixed(1)),
        'Precision %': Number(((m.metrics?.precision || 0) * 100).toFixed(1)),
        'Recall %': Number(((m.metrics?.recall || 0) * 100).toFixed(1)),
        'F1 Score %': Number(((m.metrics?.f1Score || 0) * 100).toFixed(1))
      };
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Model Benchmark & Comparison"
        subtitle="Compare multi-model evaluation metrics side-by-side, analyze trade-offs, and identify optimal checkpoints."
        badge={`${selectedModels.length} Models Selected`}
        actions={
          <div className="flex items-center gap-2">
            {comparisonModelIds.length > 0 && (
              <button
                onClick={clearComparisonModels}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Selection</span>
              </button>
            )}
            <button
              onClick={() => navigate('/train')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Train Models</span>
            </button>
          </div>
        }
      />

      {/* Task Filter Tab & Model Selector Panel */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Mode:
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => handleTaskSwitch('Regression')}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTask === 'Regression'
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Regression</span>
              </button>
              <button
                onClick={() => handleTaskSwitch('Classification')}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTask === 'Classification'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Classification</span>
              </button>
            </div>
          </div>

          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Select 2 to 4 models from the candidates below to benchmark
          </span>
        </div>

        {/* Model Checkbox Selector Chips */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Candidate {activeTask} Models ({taskModels.length} available)
          </label>
          <div className="flex flex-wrap gap-2">
            {taskModels.map((m) => {
              const isSelected = comparisonModelIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleComparisonModel(m.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 border transition-colors select-none ${
                    isSelected
                      ? activeTask === 'Regression'
                        ? 'bg-blue-50/70 dark:bg-blue-950/50 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-200'
                        : 'bg-teal-50/70 dark:bg-teal-950/50 border-teal-600 dark:border-teal-500 text-teal-900 dark:text-teal-200'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                      isSelected
                        ? activeTask === 'Regression'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span>{m.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">({m.algorithmName})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedModels.length >= 2 ? (
        <>
          {/* Comparison Table */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Metrics Benchmark Matrix
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Green highlights indicate superior metric values across candidate models
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md font-medium">
                <Trophy className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Best Metric Highlighted</span>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Model Name</th>
                    <th className="py-2.5 px-3 font-semibold">Algorithm</th>
                    <th className="py-2.5 px-3 font-semibold">Dataset</th>
                    {activeTask === 'Regression' ? (
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedModels.map((m) => {
                    const metrics = m.metrics || {};
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                          {m.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                          {m.algorithmName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {m.datasetName}
                        </td>

                        {activeTask === 'Regression' ? (
                          <>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  metrics.r2 === bestMetrics.r2
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {metrics.r2?.toFixed(4)}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  metrics.adjustedR2 === bestMetrics.adjustedR2
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {metrics.adjustedR2?.toFixed(4)}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  metrics.mae === bestMetrics.mae
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {metrics.mae?.toFixed(4)}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  metrics.mse === bestMetrics.mse
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {metrics.mse?.toFixed(4)}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  metrics.rmse === bestMetrics.rmse
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {metrics.rmse?.toFixed(4)}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  metrics.accuracy === bestMetrics.accuracy
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {(metrics.accuracy * 100)?.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  metrics.precision === bestMetrics.precision
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {(metrics.precision * 100)?.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  metrics.recall === bestMetrics.recall
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {(metrics.recall * 100)?.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  metrics.f1Score === bestMetrics.f1Score
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {metrics.f1Score?.toFixed(4)}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  metrics.rocAuc === bestMetrics.rocAuc
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {metrics.rocAuc?.toFixed(4)}
                              </span>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>
                Models should balance generalization capacity and residual stability rather than relying on a single metric in isolation.
              </span>
            </div>
          </div>

          {/* Performance Comparison Bar Chart */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Visual Metric Comparison
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Side-by-side metric distributions across candidate models
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Comparative Bar Chart
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData} margin={{ top: 15, right: 20, left: 0, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-2.5 rounded-lg bg-slate-900 text-white text-xs shadow-lg space-y-1 border border-slate-800">
                            <div className="font-bold border-b border-slate-800 pb-0.5">{label}</div>
                            {payload.map((entry, idx) => (
                              <div key={idx} className="flex justify-between gap-3">
                                <span style={{ color: entry.color }}>{entry.name}:</span>
                                <span className="font-mono font-bold">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  {activeTask === 'Regression' ? (
                    <>
                      <Bar dataKey="R² Score" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="RMSE (Lower is better)" fill="#d97706" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="MAE (Lower is better)" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="Accuracy %" fill="#0d9488" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Precision %" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Recall %" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="F1 Score %" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={BarChart2}
          title="Select at least 2 models to compare"
          description={`Please select at least 2 ${activeTask} models from the candidates above to render comparison tables and charts.`}
          actionLabel="Train New Models"
          onAction={() => navigate('/train')}
        />
      )}
    </div>
  );
};
