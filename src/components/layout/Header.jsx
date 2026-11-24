import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  Info,
  CheckCircle2,
  ExternalLink,
  Sliders,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useML } from '../../context/MLContext';

export const Header = ({ isCollapsed, setMobileOpen, onOpenSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainedModels, datasets } = useML();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Map path to title and category
  const routeTitles = {
    '/': { title: 'Dashboard', category: 'Workspace', subtitle: 'Overview of datasets, models and ML metrics' },
    '/datasets': { title: 'Datasets', category: 'Workspace', subtitle: 'Upload, inspect and preprocess data' },
    '/train': { title: 'Model Training', category: 'Workspace', subtitle: 'Configure hyperparameters and train algorithms' },
    '/regression': { title: 'Regression Workspace', category: 'Workspace', subtitle: 'Continuous target modeling & residual evaluations' },
    '/classification': { title: 'Classification Workspace', category: 'Workspace', subtitle: 'Categorical prediction, confusion matrix & ROC' },
    '/comparison': { title: 'Model Comparison', category: 'Workspace', subtitle: 'Benchmark metrics across multiple models' },
    '/history': { title: 'Model History', category: 'Workspace', subtitle: 'Audit log of all previously trained configurations' },
    '/settings': { title: 'Settings', category: 'Preferences', subtitle: 'Platform configurations, theme and environment' },
  };

  const currentRoute = routeTitles[location.pathname] || {
    title: 'Page',
    category: 'ML Model Studio',
    subtitle: ''
  };

  const notifications = [
    {
      id: 1,
      title: 'Phase 1 Frontend Ready',
      desc: 'All 16 algorithms and 8 core pages initialized.',
      time: 'Just now',
      unread: true
    },
    {
      id: 2,
      title: 'Datasets Loaded',
      desc: `${datasets.length} realistic sample datasets available for preview.`,
      time: '10m ago',
      unread: false
    },
    {
      id: 3,
      title: 'Comparison Engine',
      desc: 'Multi-model metrics radar & benchmark charts active.',
      time: '1h ago',
      unread: false
    }
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-400">{currentRoute.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">{currentRoute.title}</span>
        </div>

        <h1 className="sm:hidden font-bold text-slate-900 text-base truncate">
          {currentRoute.title}
        </h1>
      </div>

      {/* Center / Right: Search, Notifications, Phase Badge, Avatar */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Bar Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/60"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Quick search algorithms, datasets...</span>
          <span className="md:hidden">Search</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded-md">
            Ctrl K
          </kbd>
        </button>

        {/* Phase 1 Demo Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span>Demo Simulation Mode</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 fade-in">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">Notifications</span>
                <span className="text-[11px] font-medium text-blue-600">3 updates</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <span className="text-xs text-slate-400">Phase 1 local activity log</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
              MS
            </div>
            <div className="hidden sm:block text-left text-xs">
              <div className="font-semibold text-slate-800 leading-tight">ML Researcher</div>
              <div className="text-[10px] text-slate-400">Team Workspace</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 fade-in">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-xs font-semibold text-slate-900">Signed in as</div>
                <div className="text-xs text-slate-500 truncate">researcher@mlstudio.io</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  Preferences & Settings
                </button>
                <button
                  onClick={() => {
                    navigate('/history');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Audit History ({trainedModels.length})
                </button>
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-[11px] text-slate-400">
                Phase 1 Frontend Architecture
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
