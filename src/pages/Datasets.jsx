import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  UploadCloud,
  Search,
  Filter,
  Eye,
  Trash2,
  Cpu,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';
import { useML } from '../context/MLContext';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { DatasetUploadModal } from '../components/datasets/DatasetUploadModal';
import { DatasetPreviewModal } from '../components/datasets/DatasetPreviewModal';

export const Datasets = () => {
  const navigate = useNavigate();
  const { datasets, deleteDataset } = useML();

  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDataset, setPreviewDataset] = useState(null);
  const [datasetToDelete, setDatasetToDelete] = useState(null);

  // Filtered dataset list
  const filteredDatasets = datasets.filter((ds) => {
    const matchesSearch =
      ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTask = taskFilter === 'ALL' || ds.task === taskFilter;
    const matchesType = typeFilter === 'ALL' || ds.type === typeFilter;
    return matchesSearch && matchesTask && matchesType;
  });

  const handleDeleteConfirm = () => {
    if (datasetToDelete) {
      deleteDataset(datasetToDelete.id);
      setDatasetToDelete(null);
    }
  };

  const handleTrainWithDataset = (dataset) => {
    navigate('/train', { state: { selectedDatasetId: dataset.id } });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Datasets Management"
        subtitle="Upload, inspect schemas, preview sample rows, and prepare training matrices."
        badge={`${datasets.length} Active Datasets`}
        actions={
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-500/20"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Dataset</span>
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
            placeholder="Search datasets by name, filename, or description..."
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
            <span>Format:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="ALL">All Formats</option>
              <option value="CSV">CSV</option>
              <option value="XLSX">XLSX / Excel</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dataset Cards Grid */}
      {filteredDatasets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDatasets.map((ds) => (
            <div
              key={ds.id}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {ds.name}
                      </h3>
                      <div className="text-[11px] font-mono text-slate-400 truncate max-w-[180px]">
                        {ds.filename}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      ds.task === 'Regression'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {ds.task}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                  {ds.description || 'Structured dataset preprocessed for machine learning analysis.'}
                </p>

                {/* Key Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Rows</div>
                    <div className="text-xs font-mono font-bold text-slate-800">
                      {ds.rows?.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Columns</div>
                    <div className="text-xs font-mono font-bold text-slate-800">
                      {ds.columns}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Size</div>
                    <div className="text-xs font-mono font-bold text-slate-800">
                      {ds.size}
                    </div>
                  </div>
                </div>

                {/* Target Column Info */}
                <div className="mt-3 flex items-center justify-between text-xs bg-slate-50/70 px-3 py-1.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500">Target Feature:</span>
                  <span className="font-mono text-blue-700 font-semibold text-[11px]">
                    {ds.targetColumn || 'Auto-detect'}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewDataset(ds)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                    title="Preview dataset schema and sample rows"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => setDatasetToDelete(ds)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete dataset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleTrainWithDataset(ds)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Train Model</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Database}
          title="No matching datasets"
          description={
            searchQuery || taskFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'Try adjusting your search criteria or task filters.'
              : 'Upload a CSV or Excel dataset to begin your machine learning experiments.'
          }
          actionLabel="Upload Dataset"
          onAction={() => setIsUploadOpen(true)}
        />
      )}

      {/* Modals */}
      <DatasetUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <DatasetPreviewModal
        dataset={previewDataset}
        isOpen={Boolean(previewDataset)}
        onClose={() => setPreviewDataset(null)}
      />
      <ConfirmationModal
        isOpen={Boolean(datasetToDelete)}
        title="Delete Dataset"
        message={`Are you sure you want to delete "${datasetToDelete?.name}"? Any past models referencing this dataset will remain in history.`}
        confirmLabel="Delete Dataset"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDatasetToDelete(null)}
      />
    </div>
  );
};
