import { useState } from 'react';
import {
  ScanText,
  History,
  BookmarkCheck,
  BarChart3,
  Settings,
  ChevronRight,
  Shield,
  X,
  Menu,
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { id: 'analyzer', label: 'Analyzer', icon: ScanText },
  { id: 'history', label: 'History', icon: History },
  { id: 'saved', label: 'Saved Analysis', icon: BookmarkCheck },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeNav, onNavChange, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 bg-bg-card border-r border-white/5 z-40',
          'flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-indigo to-indigo-600 flex items-center justify-center shadow-glow-indigo">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary leading-none">TruthLens</h1>
              <p className="text-[10px] text-text-muted mt-0.5 font-medium tracking-wider uppercase">AI Manipulation Detector</p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-text-faint uppercase tracking-widest px-4 mb-3">Main Menu</p>

          {NAV_ITEMS.slice(0, 4).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`nav-${id}`}
              onClick={() => { onNavChange(id); onMobileClose(); }}
              className={clsx(
                'nav-item w-full text-left',
                activeNav === id ? 'nav-item-active' : 'nav-item-inactive'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
              {activeNav === id && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-70" />
              )}
            </button>
          ))}

          <div className="pt-4">
            <p className="text-[10px] font-semibold text-text-faint uppercase tracking-widest px-4 mb-3">Preferences</p>
            {NAV_ITEMS.slice(4).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`nav-${id}`}
                onClick={() => { onNavChange(id); onMobileClose(); }}
                className={clsx(
                  'nav-item w-full text-left',
                  activeNav === id ? 'nav-item-active' : 'nav-item-inactive'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 pb-5 pt-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-indigo to-purple-600 flex items-center justify-center text-sm font-bold text-white">
              U
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">User</p>
              <p className="text-xs text-text-muted truncate">Pro Plan</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-risk-green flex-shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}
