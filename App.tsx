import React, { useState, useEffect } from 'react';
import { Tour, ViewMode, AppSettings } from './types';
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
      if (activeTour?.id === id) {
        setActiveTour(null);
        setViewMode(ViewMode.DASHBOARD);
      }
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
              {/* LOGO / ICON */}
              <img
                src="/icon.png"
                alt="Travelog"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-110"
              />
              <div className="flex items-baseline">
                <span className="text-xl font-black text-slate-900 tracking-tight uppercase">Travel</span>
                <span className="text-xl font-black text-indigo-600 tracking-tight uppercase">og</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setViewMode(ViewMode.QUICK_CALC)}
                className={`text-sm font-bold transition-colors ${viewMode === ViewMode.QUICK_CALC ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Calculator
              </button>
              <button
                onClick={() => setViewMode(ViewMode.SETTINGS)}
                className={`text-sm font-bold transition-colors ${viewMode === ViewMode.SETTINGS ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Settings
              </button>

              <div className="h-4 w-[1px] bg-slate-200" />

              <button
                onClick={createNewTour}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 active:scale-95"
              >
                + New Tour
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {viewMode === ViewMode.DASHBOARD && (
          <Dashboard
            tours={tours}
            onEdit={(t) => { setActiveTour(t); setViewMode(ViewMode.EDITOR); }}
            onPreview={(t) => { setActiveTour(t); setViewMode(ViewMode.PREVIEW); }}
            onDelete={deleteTour}
          />
        )}

        {viewMode === ViewMode.EDITOR && activeTour && (
          <ItineraryEditor
            tour={activeTour}
            onUpdate={handleUpdateTour}
            onPreview={() => setViewMode(ViewMode.PREVIEW)}
          />
        )}

        {viewMode === ViewMode.PREVIEW && activeTour && (
          <ItineraryPreview
            tour={activeTour}
            onEdit={() => setViewMode(ViewMode.EDITOR)}
          />
        )}

        {viewMode === ViewMode.SETTINGS && (
          <Settings settings={settings} onUpdate={setSettings} />
        )}

        {viewMode === ViewMode.QUICK_CALC && (
          <QuickCalc currency={settings.defaultCurrency} />
        )}
      </main>
    </div>
  );
};

export default App;


export default App;
