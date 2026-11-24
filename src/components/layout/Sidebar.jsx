import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Cpu,
  TrendingUp,
  Target,
  BarChart2,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Boxes,
  X
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }) => {
  const workspaceNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Datasets', path: '/datasets', icon: Database },
    { name: 'Model Training', path: '/train', icon: Cpu },
    { name: 'Regression', path: '/regression', icon: TrendingUp },
    { name: 'Classification', path: '/classification', icon: Target },
    { name: 'Model Comparison', path: '/comparison', icon: BarChart2 },
    { name: 'Model History', path: '/history', icon: History },
  ];

  const preferencesNav = [
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 select-none transition-colors">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white shrink-0 shadow-xs">
            <Boxes className="w-4 h-4" />
          </div>
          {(!isCollapsed || mobileOpen) && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-sm truncate">
                ML Model Studio
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Phase 1 Prototype
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-3 px-2.5 space-y-5 overflow-y-auto">
        {/* Workspace Section */}
        <div>
          {(!isCollapsed || mobileOpen) && (
            <div className="px-2.5 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Workspace
            </div>
          )}
          <nav className="space-y-0.5">
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => mobileOpen && setMobileOpen(false)}
                  title={isCollapsed && !mobileOpen ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors group ${
                      isActive
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-semibold border-l-2 border-blue-600 dark:border-blue-500 rounded-l-none'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                    } ${isCollapsed && !mobileOpen ? 'justify-center px-1' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}
                      />
                      {(!isCollapsed || mobileOpen) && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Preferences Section */}
        <div>
          {(!isCollapsed || mobileOpen) && (
            <div className="px-2.5 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Preferences
            </div>
          )}
          <nav className="space-y-0.5">
            {preferencesNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => mobileOpen && setMobileOpen(false)}
                  title={isCollapsed && !mobileOpen ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors group ${
                      isActive
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-semibold border-l-2 border-blue-600 dark:border-blue-500 rounded-l-none'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                    } ${isCollapsed && !mobileOpen ? 'justify-center px-1' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}
                      />
                      {(!isCollapsed || mobileOpen) && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Status Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        {(!isCollapsed || mobileOpen) ? (
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Client Runtime</span>
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                Ready
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
              Local isolated environment with CSV parsing and simulation.
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Client Runtime Ready" />
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center w-full mt-2 py-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-1.5">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-[11px]">Collapse sidebar</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 z-50 w-64 max-w-[80vw] transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
