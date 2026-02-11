
import React, { useState, useEffect } from 'react';
import { Tour, ViewMode, TourDay, Activity, ActivityCategory, AppSettings } from './types';
import Dashboard from './components/Dashboard';
import ItineraryEditor from './components/ItineraryEditor';
import ItineraryPreview from './components/ItineraryPreview';
import Settings from './components/Settings';
import QuickCalc from './components/QuickCalc';

const STORAGE_KEY = 'tour_architect_data';
const SETTINGS_KEY = 'tour_architect_settings';

const App: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    defaultCurrency: 'INR',
    userName: ''
  });

  // Load data on mount
  useEffect(() => {
    const savedTours = localStorage.getItem(STORAGE_KEY);
    if (savedTours) {
      try { setTours(JSON.parse(savedTours)); } catch (e) { console.error(e); }
    }

    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try { setSettings(JSON.parse(savedSettings)); } catch (e) { console.error(e); }
    }

    // Handle PWA installation prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  // Persist data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
  }, [tours]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
    setIsMenuOpen(false);
  };

  const createNewTour = () => {
    const newTour: Tour = {
      id: crypto.randomUUID(),
      title: 'New Trip',
      destination: '',
      startDate: new Date().toISOString().split('T')[0],
      currency: settings.defaultCurrency,
      days: [{
        id: crypto.randomUUID(),
        dayNumber: 1,
        date: new Date().toISOString().split('T')[0],
        summary: '',
        activities: []
      }]
    };
    setTours([...tours, newTour]);
    setActiveTour(newTour);
    setViewMode(ViewMode.EDITOR);
    setIsMenuOpen(false);
  };

  const handleUpdateTour = (updatedTour: Tour) => {
    const updatedTours = tours.map(t => t.id === updatedTour.id ? updatedTour : t);
    setTours(updatedTours);
    setActiveTour(updatedTour);
  };

  const deleteTour = (id: string) => {
    if (window.confirm('Are you sure?')) {
      setTours(tours.filter(t => t.id !== id));
      if (activeTour?.id === id) { setActiveTour(null); setViewMode(ViewMode.DASHBOARD); }
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center cursor-pointer group gap-2.5" 
              onClick={() => { setViewMode(ViewMode.DASHBOARD); closeMenu(); }}
            >
              <img src="icon.png" alt="" className="h-8 w-auto object-contain transition-transform group-hover:scale-110" />
              <div className="flex items-baseline">
                <span className="text-xl font-black text-slate-900 tracking-tight uppercase">Travel</span>
                <span className="text-xl font-black text-indigo-600 tracking-tight uppercase">og</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setViewMode(ViewMode.QUICK_CALC)} className={`text-sm font-bold transition-colors ${viewMode === ViewMode.QUICK_CALC ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Calculator</button>
              <button onClick={() => setViewMode(ViewMode.SETTINGS)} className={`text-sm font-bold transition-colors ${viewMode === ViewMode.SETTINGS ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Settings</button>
              <div className="h-4 w-[1px] bg-slate-200" />
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                title="Sync with GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <button 
                onClick={createNewTour}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                New Tour
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 shadow-2xl absolute w-full left-0 z-50 animate-in slide-in-from-top duration-200">
            <div className="px-4 py-6 space-y-2">
              <button onClick={() => { setViewMode(ViewMode.DASHBOARD); closeMenu(); }} className="w-full text-left px-4 py-4 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-4 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                My Journeys
              </button>
              <button onClick={() => { setViewMode(ViewMode.QUICK_CALC); closeMenu(); }} className="w-full text-left px-4 py-4 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-4 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                Cost Calculator
              </button>
              <button onClick={() => { setViewMode(ViewMode.SETTINGS); closeMenu(); }} className="w-full text-left px-4 py-4 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-4 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                Settings
              </button>
              {deferredPrompt && (
                <button onClick={handleInstallClick} className="w-full text-left px-4 py-4 rounded-2xl text-indigo-700 font-black bg-indigo-50 hover:bg-indigo-100 flex items-center gap-4">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Install App
                </button>
              )}
              <div className="pt-4 border-t border-slate-100">
                <button onClick={createNewTour} className="w-full px-4 py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-indigo-100">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Create New Tour
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {viewMode === ViewMode.DASHBOARD && <Dashboard tours={tours} onEdit={(t) => { setActiveTour(t); setViewMode(ViewMode.EDITOR); }} onPreview={(t) => { setActiveTour(t); setViewMode(ViewMode.PREVIEW); }} onDelete={deleteTour} />}
        {viewMode === ViewMode.EDITOR && activeTour && <ItineraryEditor tour={activeTour} onUpdate={handleUpdateTour} onPreview={() => setViewMode(ViewMode.PREVIEW)} />}
        {viewMode === ViewMode.PREVIEW && activeTour && <ItineraryPreview tour={activeTour} onEdit={() => setViewMode(ViewMode.EDITOR)} />}
        {viewMode === ViewMode.SETTINGS && <Settings settings={settings} onUpdate={setSettings} />}
        {viewMode === ViewMode.QUICK_CALC && <QuickCalc currency={settings.defaultCurrency} />}
      </main>
    </div>
  );
};

export default App;
