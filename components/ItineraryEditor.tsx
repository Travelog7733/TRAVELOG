
import React, { useState } from 'react';
import { Tour, TourDay, Activity, ActivityCategory } from '../types';
import { VIETNAM_TEMPLATES, TourTemplate } from '../services/templateService';
import { gemini } from '../services/geminiService';

interface ItineraryEditorProps {
  tour: Tour;
  onUpdate: (tour: Tour) => void;
  onPreview: () => void;
}

const CATEGORIES: ActivityCategory[] = ['Sightseeing', 'Food', 'Stay', 'Transport', 'Shopping', 'Other'];
const REGIONS: ('HANOI' | 'DANANG' | 'PHU QUOC' | 'HCMC')[] = ['HANOI', 'DANANG', 'PHU QUOC', 'HCMC'];

const ItineraryEditor: React.FC<ItineraryEditorProps> = ({ tour, onUpdate, onPreview }) => {
  const [showTemplates, setShowTemplates] = useState<{ dayId: string } | null>(null);
  const [activeRegionFilter, setActiveRegionFilter] = useState<'HANOI' | 'DANANG' | 'PHU QUOC' | 'HCMC'>('HANOI');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const updateField = (field: keyof Tour, value: any) => {
    onUpdate({ ...tour, [field]: value });
  };

  const handleGenerateCover = async (destination: string) => {
    if (!destination || isGeneratingImage) return;
    setIsGeneratingImage(true);
    try {
      const imageUrl = await gemini.generateCoverImage({ ...tour, destination });
      if (imageUrl) {
        updateField('coverImage', imageUrl);
      }
    } catch (error) {
      console.error("Failed to generate cover image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const addDay = () => {
    const lastDay = tour.days[tour.days.length - 1];
    const newDate = new Date(lastDay.date);
    newDate.setDate(newDate.getDate() + 1);

    const newDay: TourDay = {
      id: crypto.randomUUID(),
      dayNumber: tour.days.length + 1,
      date: newDate.toISOString().split('T')[0],
      summary: '',
      activities: []
    };
    onUpdate({ ...tour, days: [...tour.days, newDay] });
  };

  const updateDay = (dayId: string, updates: Partial<TourDay>) => {
    const updatedDays = tour.days.map(d => d.id === dayId ? { ...d, ...updates } : d);
    onUpdate({ ...tour, days: updatedDays });
  };

  const deleteDay = (dayId: string) => {
    if (tour.days.length === 1) return;
    const updatedDays = tour.days.filter(d => d.id !== dayId).map((d, i) => ({ ...d, dayNumber: i + 1 }));
    onUpdate({ ...tour, days: updatedDays });
  };

  const addActivity = (dayId: string) => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      name: '',
      startTime: '09:00',
      category: 'Sightseeing',
      notes: ''
    };
    const updatedDays = tour.days.map(d => 
      d.id === dayId ? { ...d, activities: [...d.activities, newActivity] } : d
    );
    onUpdate({ ...tour, days: updatedDays });
  };

  const importTemplate = (dayId: string, template: TourTemplate) => {
    const newActivities: Activity[] = template.activities.map(a => ({
      ...a,
      id: crypto.randomUUID()
    }));
    
    const updatedDays = tour.days.map(d => 
      d.id === dayId ? { 
        ...d, 
        summary: template.name,
        activities: [...d.activities, ...newActivities] 
      } : d
    );
    onUpdate({ ...tour, days: updatedDays });
    setShowTemplates(null);
  };

  const updateActivity = (dayId: string, activityId: string, updates: Partial<Activity>) => {
    const updatedDays = tour.days.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          activities: d.activities.map(a => a.id === activityId ? { ...a, ...updates } : a)
        };
      }
      return d;
    });
    onUpdate({ ...tour, days: updatedDays });
  };

  const deleteActivity = (dayId: string, activityId: string) => {
    const updatedDays = tour.days.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          activities: d.activities.filter(a => a.id !== activityId)
        };
      }
      return d;
    });
    onUpdate({ ...tour, days: updatedDays });
  };

  const filteredTemplates = VIETNAM_TEMPLATES.filter(t => t.region === activeRegionFilter);

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 pb-48 md:pb-20 px-4 md:px-0">
      {/* Trip Cover & Info */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-48 bg-slate-100 relative group">
          {tour.coverImage ? (
            <img src={tour.coverImage} className="w-full h-full object-cover" alt="Cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}
          {isGeneratingImage && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Generating AI Cover...</span>
              </div>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => handleGenerateCover(tour.destination)}
              disabled={!tour.destination || isGeneratingImage}
              className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-800 uppercase tracking-widest hover:bg-white transition-all shadow-xl disabled:opacity-50 flex items-center gap-1.5"
            >
              <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Refresh AI Cover
            </button>
          </div>
        </div>
        
        <div className="p-5 md:p-8 space-y-6">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Trip & Client Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Name</label>
              <input 
                type="text" 
                value={tour.customerName || ''}
                onChange={(e) => updateField('customerName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-700"
                placeholder="e.g. Mr. & Mrs. Smith"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Itinerary Title</label>
              <input 
                type="text" 
                value={tour.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-700"
                placeholder="Exotic Vietnam Tour"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Destination</label>
              <input 
                type="text" 
                value={tour.destination}
                onChange={(e) => updateField('destination', e.target.value)}
                onBlur={(e) => {
                  if (e.target.value && !tour.coverImage) {
                    handleGenerateCover(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-700"
                placeholder="Vietnam"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starting Date</label>
              <input 
                type="date" 
                value={tour.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Inclusions & Exclusions */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Package Logistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
               </div>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inclusions</label>
            </div>
            <textarea 
              value={tour.inclusions || ''}
              onChange={(e) => updateField('inclusions', e.target.value)}
              rows={6}
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-200 outline-none font-medium text-slate-600 text-sm leading-relaxed"
              placeholder="List what is included (e.g. • Buffet Breakfast&#10;• Private Vehicle&#10;• Entrance Fees)"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
               </div>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exclusions</label>
            </div>
            <textarea 
              value={tour.exclusions || ''}
              onChange={(e) => updateField('exclusions', e.target.value)}
              rows={6}
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-red-200 outline-none font-medium text-slate-600 text-sm leading-relaxed"
              placeholder="List what is NOT included (e.g. • Flights&#10;• Tips&#10;• Personal Expenses)"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 px-1">Daywise Schedule</h2>

        {tour.days.map((day) => (
          <div key={day.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-4 md:px-6 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-sm">
                  {day.dayNumber}
                </span>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Day {day.dayNumber} Plan</h3>
                  <input 
                    type="date"
                    value={day.date}
                    onChange={(e) => updateDay(day.id, { date: e.target.value })}
                    className="text-[10px] text-slate-400 bg-transparent border-none p-0 outline-none font-bold"
                  />
                </div>
              </div>
              <button onClick={() => deleteDay(day.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              <input 
                value={day.summary}
                onChange={(e) => updateDay(day.id, { summary: e.target.value })}
                placeholder="Brief title for the day (e.g. Arrival & Evening Cruise)"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-indigo-300"
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sequence of Activities</h4>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowTemplates({ dayId: day.id })} 
                      className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-all flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      Import Package
                    </button>
                    <button onClick={() => addActivity(day.id)} className="text-[10px] font-black text-indigo-600 uppercase hover:text-indigo-800 transition-all">+ Add New</button>
                  </div>
                </div>

                <div className="space-y-3">
                  {day.activities.map((act) => (
                    <div key={act.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 group hover:border-indigo-200 transition-all">
                      <div className="flex gap-3">
                        <input type="time" value={act.startTime} onChange={(e) => updateActivity(day.id, act.id, { startTime: e.target.value })} className="w-20 text-[11px] font-black p-2 bg-slate-50 rounded-xl" />
                        <input type="text" value={act.name} onChange={(e) => updateActivity(day.id, act.id, { name: e.target.value })} placeholder="What's the plan?" className="flex-1 text-sm font-bold p-1 outline-none border-b-2 border-transparent focus:border-indigo-200" />
                        <button onClick={() => deleteActivity(day.id, act.id)} className="text-slate-200 hover:text-red-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                      <div className="flex items-center gap-3">
                        <select value={act.category} onChange={(e) => updateActivity(day.id, act.id, { category: e.target.value as ActivityCategory })} className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border-none outline-none">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <textarea 
                          value={act.notes}
                          onChange={(e) => updateActivity(day.id, act.id, { notes: e.target.value })}
                          placeholder="Detailed description, inclusions, or tips..."
                          className="flex-1 text-xs text-slate-500 bg-slate-50/50 rounded-xl p-3 outline-none focus:ring-1 focus:ring-indigo-100 transition-all"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button onClick={addDay} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">+ New Day</button>
      </section>

      {/* Template Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-12">
            <div className="p-8 border-b border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Itinerary Library</h3>
                  <p className="text-sm text-slate-400 font-medium">Browse tour packages categorized by city.</p>
                </div>
                <button onClick={() => setShowTemplates(null)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* City Filter Tabs */}
              <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                {REGIONS.map(region => (
                  <button
                    key={region}
                    onClick={() => setActiveRegionFilter(region)}
                    className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeRegionFilter === region 
                      ? 'bg-slate-900 text-white shadow-xl' 
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 overflow-y-auto max-h-[50vh] space-y-4 custom-scrollbar">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map(template => (
                  <div key={template.id} className="p-6 border-2 border-slate-50 rounded-3xl hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{template.activities.length} Steps</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-800 uppercase leading-tight tracking-tight">{template.name}</h4>
                        <p className="text-xs text-slate-400 mt-2 italic">{template.description}</p>
                      </div>
                      <button 
                        onClick={() => importTemplate(showTemplates.dayId, template)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                      >
                        Import
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-slate-400 italic font-bold">
                  No templates available for this city yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Summary Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-md z-[60]">
        <button 
          onClick={onPreview}
          className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.2em] transition-all shadow-2xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4"
        >
          Generate Final Itinerary
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ItineraryEditor;
