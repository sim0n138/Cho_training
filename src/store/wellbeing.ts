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

      deleteLog: (id) => {
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        }));
      },

      getStats: (): DailyStats[] => {
        const { logs } = get();
        const statsMap = new Map<
          string,
          {
            date: string;
            exerciseCount: number;
            moodSum: number;
            energySum: number;
            count: number;
          }
        >();

        logs.forEach((log) => {
          const existing = statsMap.get(log.date);
          if (existing) {
            existing.exerciseCount += log.exercises.length;
            existing.moodSum += log.mood;
            existing.energySum += log.energy;
            existing.count++;
          } else {
            statsMap.set(log.date, {
              date: log.date,
              exerciseCount: log.exercises.length,
              moodSum: log.mood,
              energySum: log.energy,
              count: 1,
            });
          }
        });

        return Array.from(statsMap.values())
          .map(({ date, exerciseCount, moodSum, energySum, count }) => ({
            date,
            exerciseCount,
            avgMood: moodSum / count,
            avgEnergy: energySum / count,
          }))
          .sort(
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
