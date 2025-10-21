export interface WellbeingLog {
  id: string;
  date: string;
  exercises: string[];
  mood: number;
  energy: number;
  notes: string;
}

export interface DailyStats {
  date: string;
  exerciseCount: number;
  avgMood: number;
  avgEnergy: number;
}

export interface WellbeingStore {
  logs: WellbeingLog[];
  addLog: (log: Omit<WellbeingLog, 'id'>) => void;
  updateLog: (id: string, log: Partial<WellbeingLog>) => void;
  deleteLog: (id: string) => void;
  getStats: () => DailyStats[];
  importLogs: (logs: WellbeingLog[]) => void;
  exportLogs: () => WellbeingLog[];
}
