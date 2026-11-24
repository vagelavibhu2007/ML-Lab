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
  Calendar,
  CheckCircle2,
  Sliders,
  Sparkles,
  BarChart2,
  X,
  Database
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
    <div className="space-y-6">
      <PageHeader
        title="Model Execution History & Audit"
        subtitle="Chronological record of all configured hyperparameters, training iterations, and evaluation results."
        badge={`${trainedModels.length} Models Recorded`}
        actions={
          <button
            onClick={() => navigate('/train')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Train New Model</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model name, algorithm, or dataset..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Task:</span>
            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="ALL">All Tasks</option>
              <option value="Regression">Regression</option>
              <option value="Classification">Classification</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">Model Name</th>
                  <th className="py-3 px-4 font-semibold">Algorithm</th>
                  <th className="py-3 px-4 font-semibold">Task</th>
                  <th className="py-3 px-4 font-semibold">Dataset</th>
                  <th className="py-3 px-4 font-semibold">Primary Metric</th>
                  <th className="py-3 px-4 font-semibold">Created Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredModels.map((m) => {
                  const isCompared = comparisonModelIds.includes(m.id);
                  const primaryMetric =
                    m.task === 'Regression'
                      ? `R²: ${m.metrics?.r2?.toFixed(3) || 'N/A'}`
                      : `Acc: ${((m.metrics?.accuracy || 0) * 100).toFixed(1)}%`;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{m.name}</span>
                          {m.isSimulated && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-normal">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {m.algorithmName}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            m.task === 'Regression'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
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

                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {m.datasetName}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {primaryMetric}
                      </td>

                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {m.createdAt}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{m.status}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDetailsModel(m)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Inspect full model hyperparameters and metrics"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => toggleComparisonModel(m.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isCompared
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                            }`}
                            title={isCompared ? 'Remove from comparison' : 'Add to model comparison'}
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setModelToDelete(m)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete model entry"
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
              : 'Launch your first training pipeline from the training studio.'
          }
          actionLabel="Train New Model"
          onAction={() => navigate('/train')}
        />
      )}

      {/* Model Details Modal */}
      {selectedDetailsModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{selectedDetailsModel.name}</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedDetailsModel.task}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedDetailsModel.algorithmName} • Executed {selectedDetailsModel.createdAt}
                </p>
              </div>
              <button
                onClick={() => setSelectedDetailsModel(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Dataset & Execution Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Dataset</div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
                    {selectedDetailsModel.datasetName}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Target Variable</div>
                  <div className="text-xs font-mono font-bold text-blue-700 truncate mt-0.5">
                    {selectedDetailsModel.targetColumn || 'target'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Split Ratio</div>
                  <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                    {selectedDetailsModel.splitRatio}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Random State</div>
                  <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                    {selectedDetailsModel.randomState}
                  </div>
                </div>
              </div>

              {/* Evaluation Metrics Grid */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-2">Recorded Validation Metrics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(selectedDetailsModel.metrics || {}).map(([metricName, metricValue]) => (
                    <div
                      key={metricName}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/60"
                    >
                      <div className="text-[11px] text-slate-500 uppercase font-medium">
                        {metricName}
                      </div>
                      <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
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

              {/* Hyperparameters JSON Payload */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-2">Fitted Hyperparameters Payload</h3>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
                  {JSON.stringify(selectedDetailsModel.hyperparameters, null, 2)}
                </pre>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">ID: {selectedDetailsModel.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = selectedDetailsModel.task === 'Regression' ? '/regression' : '/classification';
                    setSelectedDetailsModel(null);
                    navigate(target);
                  }}
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
                >
                  Open in Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(modelToDelete)}
        title="Delete Model from History"
        message={`Are you sure you want to remove "${modelToDelete?.name}" from your historical audit records? This cannot be undone.`}
        confirmLabel="Remove Model"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setModelToDelete(null)}
      />
    </div>
  );
};
