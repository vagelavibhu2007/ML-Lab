import React, { useState } from 'react';
import {
  Settings,
  User,
  Sliders,
  Palette,
  HardDrive,
  Info,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { useML } from '../context/MLContext';
import { PageHeader } from '../components/common/PageHeader';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

export const SettingsPage = () => {
  const { datasets, trainedModels, addToast } = useML();

  // User Profile Form State
  const [name, setName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@mlstudio.io');
  const [role, setRole] = useState('Lead Machine Learning Engineer');
  const [organization, setOrganization] = useState('Deep Learning Labs');

  // Appearance State
  const [theme, setTheme] = useState('light');
  const [density, setDensity] = useState('comfortable');
  const [accentColor, setAccentColor] = useState('blue');

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

      {/* User Profile Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">User Profile</h2>
            <p className="text-xs text-slate-500">Local workspace identity and attribution metadata</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Engineering Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organization / Team
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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

      {/* Appearance & Themes */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Appearance & Theme</h2>
            <p className="text-xs text-slate-500">Customize dashboard visual theme and display metrics density</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Theme Mode Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Color Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-semibold">Light Theme</span>
                <span className="text-[10px] text-emerald-600 font-medium">Active (Default)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  addToast('Dark theme preview enabled (Phase 1 primarily targets Clean Light Theme).', 'info');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-slate-900 text-white ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-semibold">Dark Theme</span>
                <span className="text-[10px] text-slate-400">Available</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'system'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Laptop className="w-5 h-5 text-slate-500" />
                <span className="text-xs font-semibold">System Match</span>
                <span className="text-[10px] text-slate-400">Auto Sync</span>
              </button>
            </div>
          </div>

          {/* Density Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              UI Density
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDensity('comfortable')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  density === 'comfortable'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Comfortable (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setDensity('compact')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  density === 'compact'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Compact (High Information Density)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform & Phase 1 Environment Info */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Application Architecture & Scope</h2>
            <p className="text-xs text-slate-500">Phase 1 specifications and future backend roadmap</p>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Version</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">v1.0.0-phase1</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Frontend Engine</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">React 18 + Vite + Tailwind</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Datasets Stored</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">{datasets.length} Active in browser</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Models Logged</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">{trainedModels.length} Configurations</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
            <div className="font-bold text-blue-900">Phase 1 Delivery Status:</div>
            <p className="text-blue-800">
              Complete UI implementation with client-side CSV parsing, dynamic hyperparameter forms for all 16 algorithms, 5+ evaluation metrics, Recharts diagnostic visualizers, multi-model benchmark comparison, and local audit storage.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <div className="font-bold text-slate-800">Future Phase 2 Roadmap:</div>
            <p className="text-slate-500">
              Python FastAPI / Flask backend microservices, real Scikit-Learn / XGBoost model fitting, Optuna hyperparameter optimization, ONNX export, and PostgreSQL persistent store.
            </p>
          </div>
        </div>

        {/* Reset Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800">Reset Demo State</div>
            <div className="text-[11px] text-slate-400">Restore factory sample datasets and benchmark models</div>
          </div>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
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
