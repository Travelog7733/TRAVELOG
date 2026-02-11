
import React, { useState, useMemo } from 'react';

type Region = 'HANOI' | 'DANANG' | 'PHU QUOC' | 'HCMC';
type TourType = 'SHARED' | 'PRIVATE';

interface PredefinedTour {
  id: string;
  name: string;
  baseCost: number;
  description: string;
  category: TourType;
  region: Region;
  inclusions: string;
}

interface TourCalcItem extends PredefinedTour {
  instanceId: string;
}

const PREDEFINED_TOURS: PredefinedTour[] = [
  // HANOI REGION (Image 3)
  { id: 'HN1', region: 'HANOI', category: 'SHARED', name: 'HANOI CITY TOUR - FULL DAY', baseCost: 2400, description: 'Comprehensive city highlights tour.', inclusions: 'Lunch' },
  { id: 'HN2', region: 'HANOI', category: 'SHARED', name: 'HANOI CITY TOUR - HALF DAY - MORNING', baseCost: 1650, description: 'Morning highlights.', inclusions: 'No Meals' },
  { id: 'HN3', region: 'HANOI', category: 'SHARED', name: 'HANOI CITY TOUR - HALF DAY - AFTERNOON', baseCost: 1900, description: 'Afternoon highlights.', inclusions: 'No Meals' },
  { id: 'HN4', region: 'HANOI', category: 'SHARED', name: 'HANOI CITY TOUR - JEEP - MORNING / AFTERNOON / EVENING', baseCost: 4800, description: 'Open-air vintage jeep experience.', inclusions: 'No Meals' },
  { id: 'HN5', region: 'HANOI', category: 'SHARED', name: 'INCENSE VILLAGE + CONICAL VILLAGE - HALF DAY - AFTERNOON', baseCost: 2200, description: 'Cultural craft village tour.', inclusions: 'No Meals' },
  { id: 'HN6', region: 'HANOI', category: 'SHARED', name: 'NINH BINH - HOA LU - TRANG AN (WITH LUNCH) - FULL DAY', baseCost: 3100, description: 'Spectacular karst landscapes.', inclusions: 'Lunch' },
  { id: 'HN7', region: 'HANOI', category: 'SHARED', name: 'NINH BINH - HOA LU - TAM COC (WITH LUNCH) - FULL DAY', baseCost: 2900, description: 'Ancient capital and river caves.', inclusions: 'Lunch' },
  { id: 'HN8', region: 'HANOI', category: 'SHARED', name: 'HALONG BAY - APPOLO 5 STAR LUXURY CRUISE - FULL DAY TOUR', baseCost: 3550, description: 'Premium day cruise.', inclusions: 'Buffet Lunch' },
  { id: 'HN9', region: 'HANOI', category: 'SHARED', name: 'HALONG BAY - SKY CRUISE 5 STAR CRUISE - FULL DAY TOUR', baseCost: 3350, description: 'Luxury sailing experience.', inclusions: 'Buffet Lunch' },
  { id: 'HN10', region: 'HANOI', category: 'SHARED', name: 'HALONG BAY OVERNIGHT CRUISE (2 DAY 1 NIGHT) - VERDURE LOTUS', baseCost: 14500, description: 'Premium overnight stay.', inclusions: 'L+D+B' },
  { id: 'HN11', region: 'HANOI', category: 'SHARED', name: 'HALONG BAY OVERNIGHT CRUISE (2 DAY 1 NIGHT) - ATHENA CRUISE', baseCost: 15500, description: 'Luxury cabin experience.', inclusions: 'L+D+B' },
  { id: 'HN12', region: 'HANOI', category: 'SHARED', name: 'HALONG BAY OVERNIGHT CRUISE (2 DAY 1 NIGHT) - ALISA CRUISE', baseCost: 16000, description: 'Top-tier luxury cruise.', inclusions: 'L+D+B' },
  { id: 'HN13', region: 'HANOI', category: 'PRIVATE', name: 'NINH BINH - HOA LU - TRANG AN (WITH LUNCH) - PRIVATE TOUR', baseCost: 5500, description: 'Private guide and vehicle.', inclusions: 'Lunch' },
  { id: 'HN14', region: 'HANOI', category: 'PRIVATE', name: 'GRANDWORLD - AFTERNOON TOUR - PRIVATE TOUR', baseCost: 3200, description: 'Private evening entertainment tour.', inclusions: 'No Meals' },
  { id: 'HN15', region: 'HANOI', category: 'PRIVATE', name: 'HANOI CITY TOUR - HALF DAY - NO GUIDE', baseCost: 2000, description: 'Vehicle only service.', inclusions: 'No Meals' },
  { id: 'HN16', region: 'HANOI', category: 'PRIVATE', name: 'AIRPORT PICKUP + HANOI CITY TOUR - HALF DAY', baseCost: 3500, description: 'Arrival + city orientation.', inclusions: 'Lunch' },
  { id: 'HN17', region: 'HANOI', category: 'PRIVATE', name: 'HANOI CITY TOUR - FULL DAY - WITH GUIDE', baseCost: 4500, description: 'Full day private guidance.', inclusions: 'Lunch' },
  { id: 'HN18', region: 'HANOI', category: 'PRIVATE', name: 'AIRPORT PICKUP - HANOI', baseCost: 800, description: 'Private transfer.', inclusions: 'No Meals' },
  { id: 'HN19', region: 'HANOI', category: 'PRIVATE', name: 'AIRPORT DROP - HANOI', baseCost: 600, description: 'Private transfer.', inclusions: 'No Meals' },

  // DANANG REGION (Image 4)
  { id: 'DN1', region: 'DANANG', category: 'SHARED', name: 'BA NA HILLS – GOLDEN BRIDGE FULL DAY TOUR (with lunch)', baseCost: 4900, description: 'Iconic hand bridge and buffet.', inclusions: 'Buffet Lunch' },
  { id: 'DN2', region: 'DANANG', category: 'SHARED', name: 'BA NA HILLS – GOLDEN BRIDGE FULL DAY TOUR (without lunch)', baseCost: 4100, description: 'Bridge access only.', inclusions: 'No Meals' },
  { id: 'DN3', region: 'DANANG', category: 'SHARED', name: 'DANANG CITY SITES & BA NA HILLS – GOLDEN BRIDGE', baseCost: 6750, description: 'Combined highlight tour.', inclusions: 'Set Menu Lunch' },
  { id: 'DN4', region: 'DANANG', category: 'SHARED', name: 'MY SON HOLYLAND & RICE PAPER MAKING DELUXE MORNING', baseCost: 2550, description: 'Ancient ruins and craft.', inclusions: 'Set Menu Lunch' },
  { id: 'DN5', region: 'DANANG', category: 'SHARED', name: 'MY SON HOLYLAND & RICE PAPER MAKING DELUXE AFTERNOON', baseCost: 2550, description: 'Sunset ruins tour.', inclusions: 'Set Menu Dinner' },
  { id: 'DN6', region: 'DANANG', category: 'SHARED', name: 'MARBLE MOUNTAINS - MONKEY MOUNTAIN – AM PHU CAVE MORNING', baseCost: 1850, description: 'Caves and Lady Buddha.', inclusions: '1 Local Dish' },
  { id: 'DN7', region: 'DANANG', category: 'SHARED', name: 'HAI VAN PASS & HUE CITY EXPLORE FULL DAY TOUR', baseCost: 3750, description: 'Scenic pass and imperial city.', inclusions: 'Set Menu Lunch' },
  { id: 'DN8', region: 'DANANG', category: 'SHARED', name: 'HUE CITY FULL DAY (Not Hai Van Pass)', baseCost: 2950, description: 'Direct Imperial city tour.', inclusions: 'Set Menu Lunch' },
  { id: 'DN9', region: 'DANANG', category: 'SHARED', name: 'COCONUT JUNGLE - HOI AN CITY - BOAT RIDE AFTERNOON', baseCost: 2750, description: 'Riverside charm and lanterns.', inclusions: 'Set Menu Dinner' },
  { id: 'DN10', region: 'DANANG', category: 'SHARED', name: 'MONKEY MOUNTAIN - MARBLE MOUTAINS – COCONUT JUNGLE', baseCost: 4450, description: 'The complete Danang loop.', inclusions: 'L+D Included' },
  { id: 'DN11', region: 'DANANG', category: 'SHARED', name: 'CHAM ISLAND SIGHTSEEING AND SNORKELING TOUR', baseCost: 2200, description: 'Island boat trip.', inclusions: 'Set Menu Lunch' },
  { id: 'DN12', region: 'DANANG', category: 'PRIVATE', name: 'AIPORT PICKUP - DANANG', baseCost: 600, description: 'Private arrival.', inclusions: 'No Meals' },
  { id: 'DN13', region: 'DANANG', category: 'PRIVATE', name: 'AIPORT DROP - DANANG', baseCost: 600, description: 'Private departure.', inclusions: 'No Meals' },

  // PHU QUOC REGION (Image 2)
  { id: 'PQ1', region: 'PHU QUOC', category: 'PRIVATE', name: 'STARFISH BEACH + GRAND WORLD - FULL DAY TOUR', baseCost: 3500, description: 'North island highlights.', inclusions: 'No Meals' },
  { id: 'PQ2', region: 'PHU QUOC', category: 'SHARED', name: 'SUNSET TOWN + KISS OF THE SEA SHOW - AFTERNOON TOUR', baseCost: 4500, description: 'Evening multi-media show.', inclusions: 'No Meals' },
  { id: 'PQ3', region: 'PHU QUOC', category: 'SHARED', name: '4 ISLANDS HOPPING TOUR + KISS BRIDGE - FULL DAY TOUR', baseCost: 4900, description: 'Speedboat and cable car.', inclusions: 'With Lunch' },
  { id: 'PQ4', region: 'PHU QUOC', category: 'SHARED', name: 'SOUTH ISLAND TOUR - FULL DAY TOUR (SHARED)', baseCost: 1400, description: 'South island sightseeing.', inclusions: 'With Lunch' },
  { id: 'PQ5', region: 'PHU QUOC', category: 'PRIVATE', name: 'SOUTH ISLAND TOUR - FULL DAY TOUR (PRIVATE)', baseCost: 2800, description: 'Private south island tour.', inclusions: 'No Meals' },
  { id: 'PQ6', region: 'PHU QUOC', category: 'PRIVATE', name: 'VINWONDERS - FULL DAY TOUR', baseCost: 5300, description: 'Theme park access.', inclusions: 'No Meals' },
  { id: 'PQ7', region: 'PHU QUOC', category: 'PRIVATE', name: 'VINPEARL SAFARI - FULL DAY TOUR', baseCost: 5100, description: 'Wildlife park access.', inclusions: 'No Meals' },
  { id: 'PQ8', region: 'PHU QUOC', category: 'PRIVATE', name: 'VINWONDER + VINPEARL SAFARI - FULL DAY TOUR', baseCost: 6800, description: 'Combo park access.', inclusions: 'No Meals' },
  { id: 'PQ9', region: 'PHU QUOC', category: 'PRIVATE', name: 'AIRPORT PICKUP - PHU QUOC', baseCost: 1000, description: 'Private transfer.', inclusions: 'No Meals' },
  { id: 'PQ10', region: 'PHU QUOC', category: 'PRIVATE', name: 'AIRPORT DROP - PHU QUOC', baseCost: 1000, description: 'Private transfer.', inclusions: 'No Meals' },
  { id: 'PQ11', region: 'PHU QUOC', category: 'SHARED', name: 'CRUISE TOUR - SUNRISE VOYAGE - 9 AM > 2:15 PM', baseCost: 5600, description: 'Morning sea voyage.', inclusions: 'With Lunch' },
  { id: 'PQ12', region: 'PHU QUOC', category: 'SHARED', name: 'CRUISE TOUR - SUNSET TOUR - 3 PM > 8:30 PM', baseCost: 5600, description: 'Evening sea voyage.', inclusions: 'With Lunch' },

  // HCMC REGION (Image 1)
  { id: 'HC1', region: 'HCMC', category: 'SHARED', name: 'MEKONG DELTA - FULL DAY', baseCost: 1650, description: 'Traditional river life.', inclusions: 'Local Lunch' },
  { id: 'HC2', region: 'HCMC', category: 'SHARED', name: 'CUCHI TUNNEL - HALF DAY - MORNING / AFTERNOON', baseCost: 1450, description: 'War history tunnels.', inclusions: 'No Meals' },
  { id: 'HC3', region: 'HCMC', category: 'SHARED', name: 'CUCHI TUNNEL + CITY TOUR - FULL DAY', baseCost: 3300, description: 'History and city combined.', inclusions: 'Local Lunch' },
  { id: 'HC4', region: 'HCMC', category: 'SHARED', name: 'CITY TOUR - FULL DAY', baseCost: 2900, description: 'Saigon highlights.', inclusions: 'Local Lunch' },
  { id: 'HC5', region: 'HCMC', category: 'SHARED', name: 'CITY TOUR - HALF DAY - MORNING / AFTERNOON', baseCost: 1300, description: 'Quick city tour.', inclusions: 'No Meals' },
  { id: 'HC6', region: 'HCMC', category: 'SHARED', name: 'CUCHI TUNNEL + MEKONG DELTA - FULL DAY', baseCost: 2900, description: 'The ultimate combo tour.', inclusions: 'Local Lunch' },
  { id: 'HC7', region: 'HCMC', category: 'SHARED', name: 'MUI NE 1 DAY + JEEP CAR DRIVE IN SAND DUNES - FULL DAY', baseCost: 5000, description: 'Desert-like adventures.', inclusions: 'Local Lunch' },
  { id: 'HC8', region: 'HCMC', category: 'SHARED', name: 'VUNG TAU - FULL DAY', baseCost: 3150, description: 'Coastal city experience.', inclusions: 'Local Lunch' },
  { id: 'HC9', region: 'HCMC', category: 'SHARED', name: 'CAN GIO - FULL DAY', baseCost: 2800, description: 'Mangrove forest tour.', inclusions: 'Local Lunch' },
  { id: 'HC10', region: 'HCMC', category: 'SHARED', name: 'WATER PUPPET SHOW & DINNER CRUISE - EVENING', baseCost: 4850, description: 'Cultural evening out.', inclusions: 'Dinner' },
  { id: 'HC11', region: 'HCMC', category: 'SHARED', name: 'SAIGON STEET FOOD TOUR BY BIKE - EVENING', baseCost: 3100, description: 'Local culinary bike tour.', inclusions: '8 Dish Dinner' },
  { id: 'HC12', region: 'HCMC', category: 'SHARED', name: 'DOUBLE DECKER BUS TOUR - NIGHT', baseCost: 1650, description: 'City lights night tour.', inclusions: 'No Meals' },
  { id: 'HC13', region: 'HCMC', category: 'SHARED', name: 'SAIGON SUNSET & CITY LIGHTS EXPERIENCE - EVENING', baseCost: 2750, description: 'Boat and bus combination.', inclusions: 'No Meals' },
];

const QuickCalc: React.FC<{ currency: string }> = ({ currency }) => {
  const [items, setItems] = useState<TourCalcItem[]>([]);
  const [activeRegion, setActiveRegion] = useState<Region>('HANOI');
  const [searchQuery, setSearchQuery] = useState('');
  
  const MARGIN_PERCENT = 0.20;

  const filteredTours = useMemo(() => {
    return PREDEFINED_TOURS.filter(t => 
      t.region === activeRegion && 
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeRegion, searchQuery]);

  const addItem = (tour: PredefinedTour) => {
    setItems([{ ...tour, instanceId: crypto.randomUUID() }, ...items]);
  };

  const removeItem = (instanceId: string) => {
    setItems(items.filter(i => i.instanceId !== instanceId));
  };

  const totalBase = items.reduce((acc, i) => acc + i.baseCost, 0);
  const totalMargin = totalBase * MARGIN_PERCENT;
  const totalSelling = totalBase + totalMargin;

  const formatPrice = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const regions: { id: Region; label: string }[] = [
    { id: 'HANOI', label: 'Hanoi' },
    { id: 'DANANG', label: 'Danang' },
    { id: 'PHU QUOC', label: 'Phu Quoc' },
    { id: 'HCMC', label: 'HCMC' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-12 animate-in fade-in duration-500 pb-72">
      <header className="text-center space-y-2 md:space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 bg-indigo-600 text-white rounded-[1.2rem] md:rounded-[2rem] shadow-xl mb-1 md:mb-2 transition-all cursor-default group">
          <svg className="w-7 h-7 md:w-10 md:h-10 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight px-4">Vietnam Estimator</h1>
        <p className="text-slate-500 font-medium text-sm md:text-lg max-w-2xl mx-auto italic px-4">Quick regional tour quotes with professional margins.</p>
      </header>

      {/* Region Navigation */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex overflow-x-auto pb-2 px-4 gap-2 no-scrollbar -mx-4 scroll-smooth">
          {regions.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveRegion(r.id)}
              className={`whitespace-nowrap px-5 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm transition-all border-2 flex-shrink-0 ${
                activeRegion === r.id 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="max-w-xl mx-auto px-4">
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder={`Search in ${regions.find(r => r.id === activeRegion)?.label}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 rounded-2xl md:rounded-3xl bg-white border border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm md:text-base font-semibold"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 px-4">
        {/* Package Catalog */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 md:pb-4">
            <h2 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <div className="w-2 h-6 md:w-3 md:h-8 bg-indigo-600 rounded-full" />
              {regions.find(r => r.id === activeRegion)?.label}
            </h2>
            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
              {filteredTours.length} tours
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-3 md:gap-4 max-h-[600px] md:max-h-[800px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
            {filteredTours.map(tour => (
              <TourCard key={tour.id} tour={tour} onAdd={addItem} currency={currency} formatPrice={formatPrice} />
            ))}
            {filteredTours.length === 0 && (
              <div className="py-12 md:py-20 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold italic text-sm">No matches found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Quote List */}
        <div className="space-y-6 md:space-y-8 order-first lg:order-last">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 md:pb-4">
            <h2 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">Current Quote</h2>
            <span className="text-[10px] md:text-xs font-black text-indigo-600 bg-indigo-50 px-3 md:px-4 py-1.5 rounded-full shadow-sm ring-1 ring-indigo-100">
              {items.length} items
            </span>
          </div>

          <div className="space-y-2 md:space-y-3 lg:sticky lg:top-24 max-h-[300px] lg:max-h-[calc(100vh-380px)] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
            {items.map(item => (
              <div key={item.instanceId} className="bg-white p-3 md:p-5 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group animate-in slide-in-from-right-2 hover:border-red-100 transition-all">
                <div className="overflow-hidden">
                  <p className="font-black text-slate-800 text-[10px] md:text-[11px] truncate pr-2 uppercase leading-none mb-1">{item.name}</p>
                  <p className="text-[10px] md:text-xs font-black text-indigo-600">{currency} {formatPrice(item.baseCost)}</p>
                </div>
                <button 
                  onClick={() => removeItem(item.instanceId)}
                  className="p-1.5 md:p-2.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg md:rounded-xl transition-all flex-shrink-0"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}

            {items.length === 0 && (
              <div className="py-12 md:py-24 text-center border-2 border-dashed border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50/50">
                <p className="text-slate-400 font-bold italic text-[11px] md:text-sm px-4">Quote is empty.<br/>Add tours to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optimized Sticky Bottom Total Summary */}
      <div className="fixed bottom-4 md:bottom-10 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[calc(100%-2.5rem)] md:max-w-6xl z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl text-white p-5 md:p-10 rounded-2xl md:rounded-[3.5rem] shadow-2xl border border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-12 w-full md:w-auto">
              <div className="space-y-0.5 md:space-y-1.5">
                <p className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">Base</p>
                <p className="text-base md:text-3xl font-bold">{currency} {formatPrice(totalBase)}</p>
              </div>
              <div className="space-y-0.5 md:space-y-1.5">
                <p className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">Margin</p>
                <p className="text-base md:text-3xl font-bold text-emerald-400">+{currency} {formatPrice(totalMargin)}</p>
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-0.5 md:space-y-1.5 pt-2 sm:pt-0 border-t border-white/5 sm:border-none">
                <p className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total Value</p>
                <p className="text-2xl md:text-5xl font-black leading-none text-indigo-400 tracking-tighter">{currency} {formatPrice(totalSelling)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
              <button 
                onClick={() => { if(window.confirm('Clear current calculation?')) setItems([]); }} 
                className="flex-1 md:flex-none px-4 md:px-8 py-3 md:py-5 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-3xl text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all"
              >
                Reset
              </button>
              <button 
                disabled={items.length === 0}
                onClick={() => window.print()}
                className="flex-[2] md:flex-none px-8 md:px-12 py-3 md:py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 rounded-xl md:rounded-3xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                Print Quote
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const TourCard: React.FC<{ 
  tour: PredefinedTour, 
  onAdd: (t: PredefinedTour) => void, 
  currency: string, 
  formatPrice: (v: number) => string 
}> = ({ tour, onAdd, currency, formatPrice }) => (
  <div className="group bg-white p-4 md:p-7 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-400 hover:shadow-lg transition-all cursor-default flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-8 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 md:w-1.5 h-full bg-slate-100 group-hover:bg-indigo-500 transition-colors" />
    
    <div className="flex-1 space-y-1.5 md:space-y-3">
      <div className="flex flex-wrap items-center gap-1.5 md:gap-3">
        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl ${
          tour.category === 'SHARED' ? 'text-indigo-600 bg-indigo-50' : 'text-emerald-600 bg-emerald-50'
        }`}>
          {tour.category}
        </span>
        <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl">
          {tour.inclusions}
        </span>
      </div>
      <h3 className="font-black text-slate-800 text-sm md:text-xl group-hover:text-indigo-600 transition-colors leading-tight uppercase">
        {tour.name}
      </h3>
      <p className="text-[10px] md:text-sm text-slate-500 leading-relaxed italic pr-4">
        {tour.description}
      </p>
    </div>
    
    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:min-w-[160px] sm:w-auto pt-3 sm:pt-0 border-t sm:border-none border-slate-50">
      <div className="text-left sm:text-right">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Cost</p>
        <p className="text-lg md:text-3xl font-black text-slate-900 tracking-tighter">{currency} {formatPrice(tour.baseCost)}</p>
      </div>
      <button 
        onClick={() => onAdd(tour)}
        className="px-6 md:px-8 py-2 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 active:scale-95"
      >
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
        Add
      </button>
    </div>
  </div>
);

export default QuickCalc;
