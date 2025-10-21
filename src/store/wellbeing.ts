import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WellbeingLog, WellbeingStore, DailyStats } from '../types';

export const useWellbeingStore = create<WellbeingStore>()(
  persist(
    (set, get) => ({
      logs: [],

      addLog: (log) => {
        const newLog: WellbeingLog = {
          ...log,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          logs: [...state.logs, newLog],
        }));
      },

      updateLog: (id, updates) => {
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === id ? { ...log, ...updates } : log
          ),
        }));
      },

      deleteLog: (id) => {
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        }));
      },

      getStats: (): DailyStats[] => {
        const { logs } = get();
        const statsMap = new Map<string, DailyStats>();

        logs.forEach((log) => {
          const existing = statsMap.get(log.date);
          if (existing) {
            existing.exerciseCount += log.exercises.length;
            existing.avgMood = (existing.avgMood + log.mood) / 2;
            existing.avgEnergy = (existing.avgEnergy + log.energy) / 2;
          } else {
            statsMap.set(log.date, {
              date: log.date,
              exerciseCount: log.exercises.length,
              avgMood: log.mood,
              avgEnergy: log.energy,
            });
          }
        });

        return Array.from(statsMap.values()).sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      },

      importLogs: (logs) => {
        set({ logs });
      },

      exportLogs: () => {
        return get().logs;
      },
    }),
    {
      name: 'cho-training-storage',
    }
  )
);
