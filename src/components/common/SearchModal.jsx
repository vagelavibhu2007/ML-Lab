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
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-900/60 backdrop-blur-sm fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[75vh] transition-colors">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search algorithms, datasets, pages, or commands..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Navigation */}
          {navigationItems.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1.5">
                Navigation
              </div>
              <div className="space-y-0.5">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500">{item.desc}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Algorithms */}
          {filteredAlgorithms.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1.5">
                Machine Learning Algorithms ({filteredAlgorithms.length})
              </div>
              <div className="space-y-0.5">
                {filteredAlgorithms.slice(0, 5).map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => handleSelect('/train')}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{algo.name}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">{algo.category} • {algo.family}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      Train
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Datasets */}
          {filteredDatasets.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1.5">
                Datasets ({filteredDatasets.length})
              </div>
              <div className="space-y-0.5">
                {filteredDatasets.map((ds) => (
                  <button
                    key={ds.id}
                    onClick={() => handleSelect('/datasets')}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Database className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{ds.name}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">{ds.rows?.toLocaleString()} rows • {ds.task}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      View
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Use</span>
            <kbd className="px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded font-mono">Esc</kbd>
            <span>to close</span>
          </div>
          <span>Phase 1 Quick Navigation</span>
        </div>
      </div>
    </div>
  );
};
