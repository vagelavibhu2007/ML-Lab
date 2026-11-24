import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, Database, Cpu, TrendingUp, Target, BarChart2, History } from 'lucide-react';
import { ALL_ALGORITHMS } from '../../data/mlAlgorithms';
import { useML } from '../../context/MLContext';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { datasets } = useML();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open through props if callback supported
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAlgorithms = ALL_ALGORITHMS.filter((algo) =>
    algo.name.toLowerCase().includes(query.toLowerCase()) ||
    algo.category.toLowerCase().includes(query.toLowerCase()) ||
    algo.family.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDatasets = datasets.filter((ds) =>
    ds.name.toLowerCase().includes(query.toLowerCase()) ||
    ds.task.toLowerCase().includes(query.toLowerCase())
  );

  const navigationItems = [
    { title: 'Dashboard', path: '/', icon: Cpu, desc: 'Overview & statistics' },
    { title: 'Datasets', path: '/datasets', icon: Database, desc: 'Manage & inspect CSVs' },
    { title: 'Model Training', path: '/train', icon: Cpu, desc: 'Train new algorithm' },
    { title: 'Regression Workspace', path: '/regression', icon: TrendingUp, desc: 'Regression metrics & plots' },
    { title: 'Classification Workspace', path: '/classification', icon: Target, desc: 'Classification metrics & ROC' },
    { title: 'Model Comparison', path: '/comparison', icon: BarChart2, desc: 'Compare multi-model metrics' },
    { title: 'Model History', path: '/history', icon: History, desc: 'Past models audit' },
  ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search algorithms, datasets, pages..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Quick Pages */}
          {navigationItems.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 px-3 uppercase tracking-wider mb-1">
                Pages
              </div>
              <div className="space-y-0.5">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{item.title}</div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Algorithms */}
          {filteredAlgorithms.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 px-3 uppercase tracking-wider mb-1">
                Algorithms ({filteredAlgorithms.length})
              </div>
              <div className="space-y-0.5">
                {filteredAlgorithms.slice(0, 6).map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => handleSelect(algo.category === 'Regression' ? '/regression' : '/classification')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800">{algo.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          algo.category === 'Regression'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {algo.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-md">{algo.description}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Datasets */}
          {filteredDatasets.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 px-3 uppercase tracking-wider mb-1">
                Datasets ({filteredDatasets.length})
              </div>
              <div className="space-y-0.5">
                {filteredDatasets.map((ds) => (
                  <button
                    key={ds.id}
                    onClick={() => handleSelect('/datasets')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Database className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{ds.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {ds.rows.toLocaleString()} rows • {ds.columns} cols • {ds.task}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with arrows or click to select</span>
          <span>Phase 1 Quick Access</span>
        </div>
      </div>
    </div>
  );
};
