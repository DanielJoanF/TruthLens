import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import AnalyzerPage from './components/AnalyzerPage';
import HistoryPage from './components/HistoryPage';
import SavedPage from './components/SavedPage';
import InsightsPage from './components/InsightsPage';
import SettingsPage from './components/SettingsPage';

const PAGE_TITLES = {
  analyzer: 'Analyzer',
  history: 'History',
  saved: 'Saved Analysis',
  insights: 'Insights',
  settings: 'Settings',
};

function renderPage(nav) {
  switch (nav) {
    case 'analyzer': return <AnalyzerPage />;
    case 'history': return <HistoryPage />;
    case 'saved': return <SavedPage />;
    case 'insights': return <InsightsPage />;
    case 'settings': return <SettingsPage />;
    default: return <AnalyzerPage />;
  }
}

export default function App() {
  const [activeNav, setActiveNav] = useState('analyzer');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center gap-4 px-5 py-4 border-b border-white/5 bg-bg-primary/80 backdrop-blur-sm">
          {/* Mobile menu button */}
          <button
            id="mobile-menu-btn"
            className="lg:hidden p-2 btn-ghost rounded-lg"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title & breadcrumb */}
          <div>
            <div className="flex items-center gap-2 text-xs text-text-faint mb-0.5">
              <span>TruthLens</span>
              <span>/</span>
              <span className="text-text-muted">{PAGE_TITLES[activeNav]}</span>
            </div>
            <h1 className="text-base font-semibold text-text-primary">
              {PAGE_TITLES[activeNav]}
            </h1>
          </div>

          {/* Right side — status badge */}
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted
                           bg-bg-card px-3 py-1.5 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-risk-green animate-pulse-slow" />
              <span>AI Engine Active</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {renderPage(activeNav)}
        </main>
      </div>
    </div>
  );
}
