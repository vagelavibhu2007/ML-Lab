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
  Table as TableIcon,
  LayoutGrid,
  FileText,
  Calendar
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
  const [viewMode, setViewMode] = useState('table'); // 'table' (primary) | 'cards'

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
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="Dataset Management"
        subtitle="Upload, inspect schemas, preview sample rows, and prepare training matrices."
        badge={`${datasets.length} Datasets`}
        actions={
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Dataset</span>
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
            placeholder="Search datasets by name, filename, or schema..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters & View Toggle */}
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
            <span>Format:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Formats</option>
              <option value="CSV">CSV</option>
              <option value="XLSX">XLSX</option>
            </select>
          </div>

          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-800 dark:text-slate-100' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Table view"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1 rounded text-xs transition-colors ${
                viewMode === 'cards' ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-800 dark:text-slate-100' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Content: Table First Focus */}
      {filteredDatasets.length > 0 ? (
        viewMode === 'table' ? (
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Dataset Name</th>
                    <th className="py-2.5 px-3 font-semibold">Task</th>
                    <th className="py-2.5 px-3 font-semibold">Target Column</th>
                    <th className="py-2.5 px-3 font-semibold">Rows</th>
                    <th className="py-2.5 px-3 font-semibold">Columns</th>
                    <th className="py-2.5 px-3 font-semibold">Format</th>
                    <th className="py-2.5 px-3 font-semibold">Uploaded</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDatasets.map((ds) => (
                    <tr key={ds.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                        <div>
                          <div>{ds.name}</div>
                          <div className="font-mono text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                            {ds.filename}
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                            ds.task === 'Regression'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                          }`}
                        >
                          {ds.task}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {ds.targetColumn || 'Auto-detect'}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {ds.rows?.toLocaleString()}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {ds.columns} features
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {ds.type} • {ds.size}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {ds.uploadDate}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewDataset(ds)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Preview schema & sample rows"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleTrainWithDataset(ds)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
                          >
                            Train
                          </button>
                          <button
                            onClick={() => setDatasetToDelete(ds)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete dataset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDatasets.map((ds) => (
              <div
                key={ds.id}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{ds.name}</h3>
                        <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">{ds.filename}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                        ds.task === 'Regression'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                      }`}
                    >
                      {ds.task}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {ds.description || 'Structured dataset preprocessed for machine learning analysis.'}
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-1 bg-slate-50 dark:bg-slate-800 rounded">
                      <div className="text-[9px] uppercase text-slate-400 dark:text-slate-500 font-medium">Rows</div>
                      <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        {ds.rows?.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-1 bg-slate-50 dark:bg-slate-800 rounded">
                      <div className="text-[9px] uppercase text-slate-400 dark:text-slate-500 font-medium">Cols</div>
                      <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{ds.columns}</div>
                    </div>
                    <div className="p-1 bg-slate-50 dark:bg-slate-800 rounded">
                      <div className="text-[9px] uppercase text-slate-400 dark:text-slate-500 font-medium">Size</div>
                      <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{ds.size}</div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewDataset(ds)}
                      className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                      title="Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDatasetToDelete(ds)}
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleTrainWithDataset(ds)}
                    className="px-2.5 py-1 rounded text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                  >
                    Train
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <EmptyState
          icon={Database}
          title="No datasets match your filters"
          description={
            searchQuery || taskFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'Try adjusting your search criteria or task filters.'
              : 'Upload a CSV dataset to begin machine learning experiments.'
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
        message={`Are you sure you want to delete "${datasetToDelete?.name}"? Historical models trained on this dataset will remain intact.`}
        confirmLabel="Delete Dataset"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDatasetToDelete(null)}
      />
    </div>
  );
};
