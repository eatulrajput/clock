import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StopwatchState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number; // accumulated time from previous runs
  laps: number[];
  
  start: () => void;
  stop: () => void;
  reset: () => void;
  lap: () => void;
}

export const useStopwatchStore = create<StopwatchState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      laps: [],

      start: () => {
        if (!get().isRunning) {
          set({ isRunning: true, startTime: Date.now() });
        }
      },
      
      stop: () => {
        if (get().isRunning) {
          const now = Date.now();
          set((state) => ({
            isRunning: false,
            elapsedTime: state.elapsedTime + (state.startTime ? now - state.startTime : 0),
            startTime: null
          }));
        }
      },

      reset: () => {
        set({ isRunning: false, startTime: null, elapsedTime: 0, laps: [] });
      },

      lap: () => {
        if (get().isRunning) {
          const now = Date.now();
          const state = get();
          const currentTotal = state.elapsedTime + (state.startTime ? now - state.startTime : 0);
          set((state) => ({
            laps: [currentTotal, ...state.laps]
          }));
        }
      }
    }),
    {
      name: "stopwatch-storage",
    }
  )
);
