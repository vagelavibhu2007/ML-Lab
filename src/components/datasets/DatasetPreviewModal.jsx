import React, { useState } from 'react';
import { X, Table, Info, ListFilter, Download, Database, Check } from 'lucide-react';

export const DatasetPreviewModal = ({ dataset, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('data'); // 'data' | 'schema'
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen || !dataset) return null;

  const sampleRows = dataset.sampleRows || [];
  const columnDetails = dataset.columnDetails || [];

  const filteredColumns = columnDetails.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm fade-in">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{dataset.name}</h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {dataset.task}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {dataset.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {dataset.filename} • {dataset.rows?.toLocaleString()} rows • {dataset.columns} columns • {dataset.size}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Filter */}
        <div className="px-6 py-2.5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('data')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'data'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Preview ({sampleRows.length} sample rows)
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'schema'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Feature Schema ({columnDetails.length} columns)
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="font-medium text-slate-700">Target Column:</span>
            <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
              {dataset.targetColumn || 'Not specified'}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'data' ? (
            <div>
              {sampleRows.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto max-h-[55vh]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-700">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold text-slate-400 border-r border-slate-200 w-12 text-center">
                            #
                          </th>
                          {Object.keys(sampleRows[0]).map((col) => (
                            <th
                              key={col}
                              className={`py-2.5 px-3 font-semibold whitespace-nowrap border-r border-slate-200 last:border-r-0 ${
                                col === dataset.targetColumn ? 'bg-blue-50 text-blue-800' : ''
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span>{col}</span>
                                {col === dataset.targetColumn && (
                                  <span className="text-[10px] px-1 rounded bg-blue-200 text-blue-900 font-normal">
                                    Target
                                  </span>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2 px-3 text-slate-400 border-r border-slate-100 text-center font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            {Object.entries(row).map(([k, v], cellIdx) => (
                              <td
                                key={cellIdx}
                                className={`py-2 px-3 font-mono text-[11px] whitespace-nowrap border-r border-slate-100 last:border-r-0 ${
                                  k === dataset.targetColumn
                                    ? 'bg-blue-50/30 text-blue-900 font-semibold'
                                    : 'text-slate-700'
                                }`}
                              >
                                {String(v ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-slate-500">
                  No preview rows available for this dataset.
                </div>
              )}
            </div>
          ) : (
            /* Schema Table */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Filter feature columns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="text-xs text-slate-400">
                  Showing {filteredColumns.length} of {columnDetails.length} columns
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Feature / Column</th>
                      <th className="py-2.5 px-4 font-semibold">Data Type</th>
                      <th className="py-2.5 px-4 font-semibold">Missing Values</th>
                      <th className="py-2.5 px-4 font-semibold">Distinct Count</th>
                      <th className="py-2.5 px-4 font-semibold">Sample Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredColumns.map((col) => {
                      const isTarget = col.name === dataset.targetColumn;
                      return (
                        <tr
                          key={col.name}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isTarget ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                            <span>{col.name}</span>
                            {isTarget && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                Target Variable
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                              {col.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-600 font-mono">
                            {col.missing ?? 0}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600 font-mono">
                            {col.unique ?? 'N/A'}
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px] truncate max-w-xs">
                            {col.sample ?? '-'}
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

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Client-side preview • Safe isolated data sandbox</div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
