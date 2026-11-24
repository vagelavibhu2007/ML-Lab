import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Eye,
  Trash2,
  Cpu,
  TrendingUp,
  Target,
  CheckCircle2,
  BarChart2,
  X
} from 'lucide-react';
import { useML } from '../context/MLContext';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

export const ModelHistory = () => {
  const navigate = useNavigate();
  const { trainedModels, deleteModel, toggleComparisonModel, comparisonModelIds } = useML();

  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedDetailsModel, setSelectedDetailsModel] = useState(null);
  const [modelToDelete, setModelToDelete] = useState(null);

  // Filter models
  const filteredModels = trainedModels.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.algorithmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.datasetName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTask = taskFilter === 'ALL' || m.task === taskFilter;
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesTask && matchesStatus;
  });

  const handleDeleteConfirm = () => {
    if (modelToDelete) {
      deleteModel(modelToDelete.id);
      setModelToDelete(null);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Model Execution History"
        subtitle="Chronological audit record of trained algorithms, hyperparameters, and evaluation metrics."
        badge={`${trainedModels.length} Models`}
        actions={
          <button
            onClick={() => navigate('/train')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Train Models</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model name, algorithm, or dataset..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>Task:</span>
            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Tasks</option>
              <option value="Regression">Regression</option>
              <option value="Classification">Classification</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      {filteredModels.length > 0 ? (
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Model Name</th>
                  <th className="py-2.5 px-3 font-semibold">Algorithm</th>
                  <th className="py-2.5 px-3 font-semibold">Task</th>
                  <th className="py-2.5 px-3 font-semibold">Dataset</th>
                  <th className="py-2.5 px-3 font-semibold">Primary Metric</th>
                  <th className="py-2.5 px-3 font-semibold">Duration</th>
                  <th className="py-2.5 px-3 font-semibold">Created Date</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredModels.map((m) => {
                  const isCompared = comparisonModelIds.includes(m.id);
                  const primaryMetric =
                    m.task === 'Regression'
                      ? `R²: ${m.metrics?.r2?.toFixed(3) || 'N/A'}`
                      : `Acc: ${((m.metrics?.accuracy || 0) * 100).toFixed(1)}%`;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span>{m.name}</span>
                          {m.isSimulated && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal border border-slate-200 dark:border-slate-700">
                              Simulated
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{m.algorithmName}</td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${
                            m.task === 'Regression'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                          }`}
                        >
                          {m.task === 'Regression' ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <Target className="w-3 h-3" />
                          )}
                          <span>{m.task}</span>
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {m.datasetName}
                      </td>

                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {primaryMetric}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {m.trainingTime || '1.5s'}
                      </td>

                      <td className="py-2.5 px-3 text-slate-400 dark:text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {m.createdAt}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedDetailsModel(m)}
                            className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Inspect parameters & metrics"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => toggleComparisonModel(m.id)}
                            className={`p-1 rounded transition-colors ${
                              isCompared
                                ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                                : 'text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setModelToDelete(m)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete model checkpoint"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="No models found"
          description={
            searchQuery || taskFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria or task filter.'
              : 'Execute your first multi-model training pipeline in the studio.'
          }
          actionLabel="Train Models"
          onAction={() => navigate('/train')}
        />
      )}

      {/* Model Details Modal */}
      {selectedDetailsModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] transition-colors">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedDetailsModel.name}</h2>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {selectedDetailsModel.task}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {selectedDetailsModel.algorithmName} • Created {selectedDetailsModel.createdAt}
                </p>
              </div>
              <button
                onClick={() => setSelectedDetailsModel(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Dataset</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                    {selectedDetailsModel.datasetName}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Target</div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                    {selectedDetailsModel.targetColumn || 'target'}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Split</div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedDetailsModel.splitRatio}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Seed</div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedDetailsModel.randomState}
                  </div>
                </div>
              </div>

              {/* Evaluation Metrics */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2 uppercase tracking-wider">
                  Validation Metrics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(selectedDetailsModel.metrics || {}).map(([metricName, metricValue]) => (
                    <div
                      key={metricName}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    >
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">
                        {metricName}
                      </div>
                      <div className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                        {typeof metricValue === 'number'
                          ? metricValue >= 1 && metricName === 'accuracy'
                            ? `${metricValue}%`
                            : metricValue.toFixed(4)
                          : metricValue}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hyperparameters Payload */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2 uppercase tracking-wider">
                  Configured Hyperparameters
                </h3>
                <pre className="p-3 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  {JSON.stringify(selectedDetailsModel.hyperparameters, null, 2)}
                </pre>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">ID: {selectedDetailsModel.id}</span>
              <button
                onClick={() => {
                  const target = selectedDetailsModel.task === 'Regression' ? '/regression' : '/classification';
                  setSelectedDetailsModel(null);
                  navigate(target);
                }}
                className="px-3.5 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                Open Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(modelToDelete)}
        title="Delete Model Checkpoint"
        message={`Are you sure you want to remove "${modelToDelete?.name}" from your historical audit records?`}
        confirmLabel="Remove Model"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setModelToDelete(null)}
      />
    </div>
  );
};
