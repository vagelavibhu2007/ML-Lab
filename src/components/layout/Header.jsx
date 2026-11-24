import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  Sliders,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { useML } from '../../context/MLContext';

export const Header = ({ isCollapsed, setMobileOpen, onOpenSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainedModels, datasets, theme, setTheme, addToast } = useML();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Map path to title and category
  const routeTitles = {
    '/': { title: 'Dashboard', category: 'Workspace' },
    '/datasets': { title: 'Datasets', category: 'Workspace' },
    '/train': { title: 'Model Training', category: 'Workspace' },
    '/regression': { title: 'Regression Workspace', category: 'Workspace' },
    '/classification': { title: 'Classification Workspace', category: 'Workspace' },
    '/comparison': { title: 'Model Comparison', category: 'Workspace' },
    '/history': { title: 'Model History', category: 'Workspace' },
    '/settings': { title: 'Settings', category: 'Preferences' },
  };

  const currentRoute = routeTitles[location.pathname] || {
    title: 'Page',
    category: 'Workspace'
  };

  const isCurrentlyDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleToggleTheme = () => {
    const nextTheme = isCurrentlyDark ? 'light' : 'dark';
    setTheme(nextTheme);
    addToast(`Switched to ${nextTheme === 'light' ? 'Light Mode' : 'Dark Mode'}.`, 'info');
  };

  const notifications = [
    {
      id: 1,
      title: 'Batch Training Ready',
      desc: 'Multi-model parallel training pipeline enabled.',
      time: 'Just now'
    },
    {
      id: 2,
      title: 'Workspace Active',
      desc: `${datasets.length} datasets ready for training.`,
      time: '10m ago'
    },
    {
      id: 3,
      title: 'Audit Log Synchronized',
      desc: `${trainedModels.length} historical model checkpoints available.`,
      time: '1h ago'
    }
  ];

  return (
    <header className="sticky top-0 z-20 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumb Navigation */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="text-slate-400 dark:text-slate-500">{currentRoute.category}</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">{currentRoute.title}</span>
        </div>

        <h1 className="sm:hidden font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
          {currentRoute.title}
        </h1>
      </div>

      {/* Right: Search, Status, Theme Toggle, Notifications, Avatar */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Search Command Palette Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-colors border border-slate-200/70 dark:border-slate-700"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span className="hidden md:inline">Search studio...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded">
            Ctrl K
          </kbd>
        </button>

        {/* Subtle Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span>Phase 1 Simulation</span>
        </div>

        {/* Quick Theme Toggle Button */}
        <button
          type="button"
          onClick={handleToggleTheme}
          className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Active theme: ${theme} (${isCurrentlyDark ? 'Dark' : 'Light'}). Click to toggle.`}
          aria-label="Toggle color theme"
        >
          {isCurrentlyDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50 fade-in">
              <div className="px-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">Notifications</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Activity Log</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center">
              ML
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-50 fade-in">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">ML Researcher</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">researcher@mllab.io</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  Studio Settings
                </button>
                <button
                  onClick={() => {
                    navigate('/history');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  Model History ({trainedModels.length})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
