
export type ActivityCategory = 'Food' | 'Transport' | 'Stay' | 'Sightseeing' | 'Shopping' | 'Other';

export interface Activity {
  id: string;
  name: string;
  startTime: string;
  cost?: number; 
  category: ActivityCategory;
  notes: string;
}

export interface TourDay {
  id: string;
  dayNumber: number;
  date: string;
  summary: string;
  activities: Activity[];
}

export interface Tour {
  id: string;
  title: string;
  customerName?: string;
  destination: string;
  startDate: string;
  currency: string;
  coverImage?: string;
  days: TourDay[];
  aiSummary?: string;
  inclusions?: string;
  exclusions?: string;
}

export interface AppSettings {
  defaultCurrency: string;
  userName: string;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW',
  SETTINGS = 'SETTINGS',
  QUICK_CALC = 'QUICK_CALC'
}
