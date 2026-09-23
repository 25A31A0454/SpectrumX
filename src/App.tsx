import React, { useEffect, useState } from 'react';
import { SpectrumProvider, useSpectrum } from './context/SpectrumContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { SpectrumPage } from './pages/SpectrumPage';
import { SignalsPage } from './pages/SignalsPage';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { AlertsPage } from './pages/AlertsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SystemPage } from './pages/SystemPage';
import { AboutPage } from './pages/AboutPage';
import { Menu, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setIsSearchOpen } = useSpectrum();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardPage />;
      case 'spectrum': return <SpectrumPage />;
      case 'signals': return <SignalsPage />;
      case 'ai': return <AIAnalysisPage />;
      case 'alerts': return <AlertsPage />;
      case 'history': return <HistoryPage />;
      case 'system': return <SystemPage />;
      case 'about': return <AboutPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-mono select-none">
      {/* Top Header */}
      <Header />

      {/* Main Workspace with Persistent Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden flex"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div 
              className="w-72 bg-[#070D1F] h-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <span className="font-bold text-white tracking-wider">NAVIGATION</span>
                <button 
                  onClick={() => setMobileSidebarOpen(false)} 
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-tactical-grid">
          {/* Mobile Navigation Toggle Button */}
          <div className="lg:hidden mb-4 flex items-center justify-between pb-3 border-b border-slate-800">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-200 text-xs"
            >
              <Menu className="w-4 h-4 text-cyan-400" />
              <span>Menu</span>
            </button>
            <span className="text-xs uppercase font-bold text-cyan-400">
              {activeTab}
            </span>
          </div>

          {/* Active Route Page Content */}
          <div className="max-w-[1720px] mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SpectrumProvider>
      <AppContent />
    </SpectrumProvider>
  );
};

export default App;
