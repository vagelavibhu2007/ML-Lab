import React, { useState } from 'react';
import {
  Settings,
  User,
  Palette,
  HardDrive,
  Info,
  CheckCircle2,
  ShieldAlert,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { useML } from '../context/MLContext';
import { PageHeader } from '../components/common/PageHeader';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

export const SettingsPage = () => {
  const { datasets, trainedModels, addToast, theme, setTheme } = useML();

  // User Profile Form State
  const [name, setName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@mlstudio.io');
  const [role, setRole] = useState('Lead Machine Learning Engineer');
  const [organization, setOrganization] = useState('Deep Learning Labs');

  // Appearance State
  const [density, setDensity] = useState('comfortable');

  // Reset confirmation modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    addToast('Profile preferences updated locally.', 'success');
  };

  const handleResetData = () => {
    localStorage.removeItem('ml_studio_datasets');
    localStorage.removeItem('ml_studio_models');
    setIsResetModalOpen(false);
    addToast('All local storage data reset to default demo suite. Reloading...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Studio Settings & Environment"
        subtitle="Manage user workspace details, appearance preferences and platform metadata."
        badge="Phase 1 Configuration"
      />

      {/* Appearance & Themes */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Appearance & Theme</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Customize dashboard visual theme and display metrics density</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Theme Mode Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
              Color Theme Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Light Mode Option */}
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  addToast('Light Mode activated.', 'info');
                }}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all text-center cursor-pointer ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="p-2.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-500">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Light Mode</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Clean high-contrast daytime interface</span>
                </div>
                {theme === 'light' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 px-2 py-0.5 mt-1 font-medium">
                    Click to activate
                  </span>
                )}
              </button>

              {/* Dark Mode Option */}
              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  addToast('Dark Mode activated.', 'success');
                }}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all text-center cursor-pointer ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="p-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Dark Mode</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Deep slate palette for low-light focus</span>
                </div>
                {theme === 'dark' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 px-2 py-0.5 mt-1 font-medium">
                    Click to activate
                  </span>
                )}
              </button>

              {/* System Mode Option */}
              <button
                type="button"
                onClick={() => {
                  setTheme('system');
                  addToast('Theme synchronized with system preferences.', 'info');
                }}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all text-center cursor-pointer ${
                  theme === 'system'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">System Mode</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Sync automatically with OS dark/light mode</span>
                </div>
                {theme === 'system' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 px-2 py-0.5 mt-1 font-medium">
                    Click to activate
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Density Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              UI Density
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDensity('comfortable')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  density === 'comfortable'
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Comfortable (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setDensity('compact')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  density === 'compact'
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Compact (High Information Density)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">User Profile</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Local workspace identity and attribution metadata</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Engineering Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organization / Team
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all"
            >
              Save Profile Details
            </button>
          </div>
        </form>
      </div>

      {/* Platform & Phase 1 Environment Info */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Application Architecture & Scope</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Phase 1 specifications and future backend roadmap</p>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Version</div>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">v1.0.0-phase1</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Frontend Engine</div>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">React 18 + Vite + Tailwind</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Datasets Stored</div>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">{datasets.length} Active in browser</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Models Logged</div>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">{trainedModels.length} Configurations</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-1">
            <div className="font-bold text-blue-900 dark:text-blue-300">Phase 1 Delivery Status:</div>
            <p className="text-blue-800 dark:text-blue-200">
              Complete UI implementation with client-side CSV parsing, dynamic hyperparameter forms for all 16 algorithms, 5+ evaluation metrics, Recharts diagnostic visualizers, multi-model benchmark comparison, and local audit storage.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-200">Future Phase 2 Roadmap:</div>
            <p className="text-slate-500 dark:text-slate-400">
              Python FastAPI / Flask backend microservices, real Scikit-Learn / XGBoost model fitting, Optuna hyperparameter optimization, ONNX export, and PostgreSQL persistent store.
            </p>
          </div>
        </div>

        {/* Reset Action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Reset Demo State</div>
            <div className="text-[11px] text-slate-400">Restore factory sample datasets and benchmark models</div>
          </div>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900 rounded-xl transition-colors"
          >
            Reset Workspace Data
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Reset All Workspace Data"
        message="This will clear your local storage modifications, custom uploaded datasets, and simulated models, restoring the pristine demo suite."
        confirmLabel="Reset Everything"
        onConfirm={handleResetData}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
