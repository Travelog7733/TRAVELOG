
import React from 'react';
import { Tour } from '../types';

interface DashboardProps {
  tours: Tour[];
  onEdit: (tour: Tour) => void;
  onPreview: (tour: Tour) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tours, onEdit, onPreview, onDelete }) => {
  if (tours.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">No tours yet</h2>
        <p className="text-slate-500 max-w-sm mt-2">Start your journey by creating a professional tour itinerary manually, then enhance it with AI.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">Your Journeys</h1>
        <p className="text-slate-500 mt-1">Manage and preview your custom travel itineraries.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map(tour => {
          const totalCost = tour.days.reduce((acc, day) => 
            acc + day.activities.reduce((dAcc, act) => dAcc + act.cost, 0), 0);
          const activityCount = tour.days.reduce((acc, d) => acc + d.activities.length, 0);

          return (
            <div 
              key={tour.id} 
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all"
            >
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                {tour.coverImage ? (
                  <img src={tour.coverImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={tour.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50">
                    <svg className="w-12 h-12 text-indigo-100" fill="currentColor" viewBox="0 0 24 24"><path d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9A2.5 2.5 0 0 1 12 11.5M12 2A7 7 0 0 0 5 9C5 14.25 12 22 12 22S19 14.25 19 9A7 7 0 0 0 12 2Z" /></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg leading-tight">{tour.title}</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {tour.destination || 'Destination TBD'}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs text-slate-400 font-medium tracking-wider uppercase">Overview</div>
                  <div className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
                    {tour.days.length} Days
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Cost</p>
                    <p className="text-lg font-bold text-slate-800">{tour.currency} {totalCost.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Activities</p>
                    <p className="text-lg font-bold text-slate-800">{activityCount}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onPreview(tour)}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => onEdit(tour)}
                    className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button 
                    onClick={() => onDelete(tour.id)}
                    className="p-2 border border-red-100 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
