
import React from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900">App Settings</h1>
        <p className="text-slate-500 mt-1">Personalize your Travelog experience.</p>
      </header>

      <section className="bg-white rounded-3xl border border-slate-200 p-8 space-y-8 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block">Default Currency</label>
          <p className="text-xs text-slate-400 mb-3">This currency will be selected automatically for all new tours.</p>
          <select 
            value={settings.defaultCurrency}
            onChange={(e) => onUpdate({ ...settings, defaultCurrency: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
            <option value="JPY">Japanese Yen (¥)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block">Your Professional Name</label>
          <p className="text-xs text-slate-400 mb-3">Appears as the author in the footer of your exported PDFs.</p>
          <input 
            type="text" 
            value={settings.userName}
            onChange={(e) => onUpdate({ ...settings, userName: e.target.value })}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
          />
        </div>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">
              Settings are saved locally on this device. Clearing your browser cache may reset these preferences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
