
import React, { useState, useRef } from 'react';
import { Tour } from '../types';
import { gemini } from '../services/geminiService';

declare var html2pdf: any;

interface ItineraryPreviewProps {
  tour: Tour;
  onEdit: () => void;
}

const ItineraryPreview: React.FC<ItineraryPreviewProps> = ({ tour, onEdit }) => {
  const [aiSummary, setAiSummary] = useState<string>(tour.aiSummary || '');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const generateAISummary = async () => {
    setIsGeneratingSummary(true);
    const summary = await gemini.generateTourSummary(tour);
    setAiSummary(summary);
    setIsGeneratingSummary(false);
  };

  const downloadPDF = async () => {
    if (!pdfContentRef.current) return;
    setIsExporting(true);
    const element = pdfContentRef.current;
    const fileName = `${(tour.customerName || 'Guest').replace(/\s+/g, '_')}_${tour.title.replace(/\s+/g, '_')}_Itinerary.pdf`;
    
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error(err);
      alert('PDF generation failed.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 print:pb-0 print:max-w-none">
      {/* Top Nav Controls */}
      <div className="flex items-center justify-between mb-6 no-print px-4">
        <button 
          onClick={onEdit}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-[11px] uppercase tracking-widest group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Editor
        </button>
        <div className="flex gap-3">
          <button 
            onClick={downloadPDF}
            disabled={isExporting}
            className="px-8 py-3.5 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all flex items-center gap-2.5 disabled:opacity-50 active:scale-95"
          >
            {isExporting ? 'Generating PDF...' : 'Download Itinerary'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
        </div>
      </div>

      <div ref={pdfContentRef} className="bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] rounded-[2rem] overflow-hidden print:shadow-none print:rounded-none">
        {/* Header Hero */}
        <div className="relative h-[420px] print:h-[350px] w-full bg-[#070b14] flex flex-col justify-center overflow-hidden">
          {tour.coverImage && (
            <img src={tour.coverImage} crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#070b14]/70 to-transparent" />
          
          <div className="absolute top-10 left-10 md:left-14 z-20 flex items-center gap-4">
            <img src="logo.png" alt="Travelog" className="h-10 md:h-14 w-auto object-contain brightness-0 invert" crossOrigin="anonymous" />
          </div>

          <div className="relative z-10 px-10 md:px-14 mt-16">
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-4">
                 <span className="px-4 py-1.5 bg-[#4f46e5] text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">Premium Itinerary</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                 <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">{tour.days.length} Days</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                {tour.title}
              </h1>
              
              {tour.customerName && (
                <div className="flex items-center gap-4 pt-2">
                  <div className="h-[2px] w-10 bg-indigo-500/80 rounded-full" />
                  <p className="text-base md:text-xl text-indigo-300 font-bold tracking-tight uppercase">
                    Specially for <span className="text-white">{tour.customerName}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-10 md:p-14 space-y-14 print:p-12">
          
          {/* Detailed Overview */}
          <section className="space-y-5">
            <div className="flex items-center justify-between no-print border-b border-slate-100 pb-3">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Trip Overview</h2>
              {!aiSummary && (
                <button 
                  onClick={generateAISummary}
                  disabled={isGeneratingSummary}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2 shadow-sm border border-indigo-100"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {isGeneratingSummary ? 'Refining...' : 'AI Enhance Content'}
                </button>
              )}
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-base md:text-xl font-medium text-slate-600 leading-relaxed border-l-4 border-indigo-200 pl-8 italic bg-slate-50/50 py-6 rounded-r-3xl">
                {aiSummary || `Explore the stunning landscapes of ${tour.destination || 'Vietnam'} with this curated ${tour.days.length}-day travel plan.`}
              </p>
            </div>
          </section>

          {/* Package Logistics */}
          {(tour.inclusions || tour.exclusions) && (
            <section className="space-y-8 print-break-inside-avoid">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight shrink-0 uppercase">Package Logistics</h2>
                <div className="h-[1px] w-full bg-slate-100 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tour.inclusions && (
                  <div className="bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-100/50 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">What's Included</h3>
                    </div>
                    <div className="whitespace-pre-line text-sm md:text-base text-slate-600 font-medium leading-relaxed pl-1">
                      {tour.inclusions}
                    </div>
                  </div>
                )}
                {tour.exclusions && (
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200/50 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-400 text-white rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      </div>
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Not Included</h3>
                    </div>
                    <div className="whitespace-pre-line text-sm md:text-base text-slate-400 font-medium leading-relaxed pl-1 italic">
                      {tour.exclusions}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Daily Schedule */}
          <section className="space-y-12">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight shrink-0 uppercase">The Journey Schedule</h2>
              <div className="h-[1px] w-full bg-slate-100 rounded-full" />
            </div>

            <div className="space-y-14">
              {tour.days.map((day) => (
                <div key={day.id} className="relative pl-14 print-break-inside-avoid">
                  <div className="absolute left-0 top-0 w-10 h-10 bg-[#070b14] text-white rounded-[1rem] flex items-center justify-center font-black text-base z-10 shadow-2xl ring-[6px] ring-white">
                    {day.dayNumber}
                  </div>
                  <div className="absolute left-[1.25rem] top-12 bottom-0 w-[2px] bg-slate-100 -translate-x-1/2 last:hidden" />

                  <div className="space-y-6">
                    <header className="space-y-1.5">
                      <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.4em]">
                        {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                      <h3 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight">{day.summary || `Day ${day.dayNumber}`}</h3>
                    </header>

                    <div className="space-y-4">
                      {day.activities.map((act) => (
                        <div key={act.id} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all print:bg-white print:border-slate-100">
                          <div className="flex gap-6">
                            <div className="shrink-0 text-center min-w-[55px]">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Time</p>
                              <p className="text-sm font-black text-indigo-600 font-mono bg-indigo-50/50 py-1.5 rounded-xl border border-indigo-100/30">{act.startTime}</p>
                            </div>
                            <div className="flex-1 space-y-2">
                              <span className="text-[8px] font-black text-slate-400 bg-white border border-slate-200 px-3.5 py-1 rounded-full uppercase tracking-widest inline-block">{act.category}</span>
                              <h4 className="text-[15px] font-bold text-slate-800 uppercase leading-snug">{act.name}</h4>
                              {act.notes && (
                                <p className="text-[12px] text-slate-500 leading-relaxed italic border-l-2 border-indigo-100/50 pl-4 mt-2">
                                  {act.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Child Policy */}
          <section className="space-y-8 print-break-inside-avoid pt-4">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-black text-slate-900 tracking-tight shrink-0 uppercase">Child Fares Policy</h2>
              <div className="h-[1px] w-full bg-slate-100 rounded-full" />
            </div>

            <div className="overflow-hidden border border-slate-200 rounded-3xl bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#070b14] text-white">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Age Group</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Policy</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Height Condition</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm font-medium">Under 03-year-old</td>
                    <td className="px-8 py-5 text-sm font-bold text-indigo-600 uppercase">Free of charge</td>
                    <td className="px-8 py-5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">Under 100 cm</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm font-medium">Under 7-years-old</td>
                    <td className="px-8 py-5 text-sm font-bold text-indigo-600 uppercase">80% Adult Charge</td>
                    <td className="px-8 py-5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">Under 140 cm</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm font-medium">From 7-year-old</td>
                    <td className="px-8 py-5 text-sm font-bold text-indigo-600 uppercase">Adult charges</td>
                    <td className="px-8 py-5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Terms */}
          <section className="space-y-8 print-break-inside-avoid">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-black text-slate-900 tracking-tight shrink-0 uppercase">Travelog Terms & Policies</h2>
              <div className="h-[1px] w-full bg-slate-100 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-slate-600">
              {[
                "60% Advance on confirm. 40% Balance one day before arrival.",
                "Advance payments are non-refundable except special cases.",
                "Hotel/flight bookings are non-cancellable per supplier rules.",
                "Airline policies apply to seats, meals, and baggage.",
                "Hotels subject to change based on availability.",
                "No refunds for unused services, sightseeing, or meals.",
                "Promotional usage of tour media allowed unless opted out.",
                "Schedules subject to local conditions/government regulations.",
                "Child/infant policies strictly follow hotel/airline rules.",
                "Check-in: 2:00 PM | Check-out: 11:00 AM – 12:00 PM.",
                "2 bottles water complimentary; others charged by hotel.",
                "Booking confirmation signifies acceptance of all terms."
              ].map((term, idx) => (
                <div key={idx} className="flex gap-5 items-start">
                  <span className="shrink-0 w-7 h-7 bg-slate-900 rounded-xl text-[10px] font-black flex items-center justify-center text-white">{(idx + 1).toString().padStart(2, '0')}</span>
                  <p className="text-[12px] font-medium leading-relaxed">{term}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Premium Footer */}
        <footer className="bg-[#070b14] py-20 px-10 text-center space-y-10 print:bg-white print:text-slate-900 print:py-14 print:border-t-2">
           <div className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <img src="logo.png" alt="Travelog" className="h-10 md:h-16 w-auto object-contain brightness-0 invert print:brightness-0" crossOrigin="anonymous" />
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.6em] print:text-slate-400">Travel Beyond Boundaries</span>
              </div>
              <p className="text-white/40 text-[11px] max-w-2xl mx-auto leading-relaxed print:text-slate-400">
                Crafted for explorers, by explorers. This personalized itinerary is your definitive guide to discovering the wonders of the world with elegance and precision.
              </p>
           </div>
           <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-[2px] bg-white/10 print:bg-slate-200" />
              <img src="icon.png" alt="" className="w-6 h-6 object-contain opacity-30" crossOrigin="anonymous" />
           </div>
        </footer>
      </div>
    </div>
  );
};

export default ItineraryPreview;
