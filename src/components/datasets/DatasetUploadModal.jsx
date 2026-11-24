import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { useML } from '../../context/MLContext';

export const DatasetUploadModal = ({ isOpen, onClose }) => {
  const { addDataset, addToast } = useML();
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [task, setTask] = useState('Regression');
  const [description, setDescription] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    setError('');
    if (!file) return;

    const fileExt = file.name.split('.').pop().toLowerCase();
    if (fileExt !== 'csv' && fileExt !== 'xlsx' && fileExt !== 'xls') {
      setError('Please upload a valid CSV or Excel file.');
      return;
    }

    setSelectedFile(file);
    if (!datasetName) {
      setDatasetName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    if (fileExt === 'csv') {
      setParsing(true);
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        preview: 20,
        skipEmptyLines: true,
        complete: (results) => {
          setParsing(false);
          if (results.data && results.data.length > 0) {
            const columns = Object.keys(results.data[0]);
            const columnDetails = columns.map((col) => {
              const sampleVal = results.data[0][col];
              const isNum = typeof sampleVal === 'number';
              return {
                name: col,
                type: isNum ? 'Float / Number' : 'String / Category',
                missing: 0,
                unique: new Set(results.data.map((r) => r[col])).size,
                sample: String(sampleVal ?? '')
              };
            });

            setParsedPreview({
              rows: results.meta.cursor ? Math.round(file.size / 65) : results.data.length,
              columns: columns.length,
              columnDetails,
              sampleRows: results.data.slice(0, 8),
              suggestedTarget: columns[columns.length - 1]
            });
          }
        },
        error: (err) => {
          setParsing(false);
          setError(`Error parsing CSV file: ${err.message}`);
        }
      });
    } else {
      // Excel (.xlsx/.xls) notice for Phase 1
      setError('Phase 1 Notice: Native binary Excel (.xlsx/.xls) parsing is reserved for Phase 2 backend ingestion. For client-side preview in Phase 1, please upload your dataset in CSV format.');
      setParsedPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    if (!datasetName.trim()) {
      setError('Please provide a name for this dataset.');
      return;
    }

    const newDataset = {
      id: `ds-${Date.now()}`,
      name: datasetName.trim(),
      filename: selectedFile.name,
      type: selectedFile.name.split('.').pop().toUpperCase(),
      task,
      rows: parsedPreview?.rows || 1500,
      columns: parsedPreview?.columns || 8,
      size: `${(selectedFile.size / 1024).toFixed(1)} KB`,
      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      targetColumn: parsedPreview?.suggestedTarget || 'target',
      description: description || `User uploaded ${task} dataset with ${parsedPreview?.columns || 8} features.`,
      columnDetails: parsedPreview?.columnDetails || [],
      sampleRows: parsedPreview?.sampleRows || []
    };

    addDataset(newDataset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Upload Dataset</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload CSV or Excel files. Files are parsed client-side in the browser.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {selectedFile ? selectedFile.name : 'Click to browse or drag & drop file'}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Supports CSV (Client-side parsed). Note: XLSX parsing is scheduled for Phase 2 backend.
              </p>
            </div>
          </div>

          {parsing && (
            <div className="flex items-center justify-center gap-2 text-xs text-blue-600 dark:text-blue-400 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Parsing file structure and schema in browser...</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dataset Name *
              </label>
              <input
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="e.g. Customer Churn Analysis"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Machine Learning Task
              </label>
              <select
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Regression">Regression (Continuous values)</option>
                <option value="Classification">Classification (Discrete categories)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context regarding the data provenance or target problem..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Parsed Schema Summary Preview */}
          {parsedPreview && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    File Parsed Successfully
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {parsedPreview.rows.toLocaleString()} estimated rows • {parsedPreview.columns} columns
                </div>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Detected Columns:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {parsedPreview.columnDetails.map((col) => (
                    <span
                      key={col.name}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                    >
                      {col.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedFile || parsing}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all"
          >
            Add Dataset to Studio
          </button>
        </div>
      </div>
    </div>
  );
};
