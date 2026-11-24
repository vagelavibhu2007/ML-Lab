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
  Sparkles,
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
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20 shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          {(!isCollapsed || mobileOpen) && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 tracking-tight text-base truncate">
                ML Model Studio
              </span>
              <span className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> v1.0 • Phase 1
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {/* Workspace Section */}
        <div>
          {(!isCollapsed || mobileOpen) && (
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Workspace
            </div>
          )}
          <nav className="space-y-1">
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => mobileOpen && setMobileOpen(false)}
                  title={isCollapsed && !mobileOpen ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/80 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    } ${isCollapsed && !mobileOpen ? 'justify-center px-2' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      {(!isCollapsed || mobileOpen) && (
                        <span className="truncate">{item.name}</span>
                      )}
                      {isActive && (!isCollapsed || mobileOpen) && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
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
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Preferences
            </div>
          )}
          <nav className="space-y-1">
            {preferencesNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => mobileOpen && setMobileOpen(false)}
                  title={isCollapsed && !mobileOpen ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/80 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    } ${isCollapsed && !mobileOpen ? 'justify-center px-2' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      {(!isCollapsed || mobileOpen) && (
                        <span className="truncate">{item.name}</span>
                      )}
                      {isActive && (!isCollapsed || mobileOpen) && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
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
      <div className="p-3 border-t border-slate-100">
        {(!isCollapsed || mobileOpen) ? (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-800">Phase 1 UI Status</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Frontend sandbox mode with local dataset processing and interactive visualizations.
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Phase 1 Active" />
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center w-full mt-2 py-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-1.5">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse sidebar</span>
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
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
