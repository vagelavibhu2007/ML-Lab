import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../common/ToastContainer';
import { SearchModal } from '../common/SearchModal';

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-150">
      {/* Sidebar navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Container Area with dynamic left margin matching sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ease-in-out ${
          isCollapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        {/* Top Header */}
        <Header
          isCollapsed={isCollapsed}
          setMobileOpen={setMobileOpen}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="py-3 px-6 border-t border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto transition-colors">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">ML Model Studio</span>
            <span>•</span>
            <span>Phase 1 Frontend</span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Multi-Model Training & Evaluation Dashboard
          </div>
        </footer>
      </div>

      {/* Global Modals & Notifications */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ToastContainer />
    </div>
  );
};
