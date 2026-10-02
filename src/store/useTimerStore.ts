import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimerState {
  duration: number; // total duration in ms
  remainingAtPause: number; // remaining time when paused (ms)
  targetTimestamp: number | null; // epoch when the timer will hit 0
  isRunning: boolean;
  isCompleted: boolean;
  isRinging: boolean;
  label: string;

  setTimer: (duration: number, label?: string) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  dismiss: () => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      duration: 0,
      remainingAtPause: 0,
      targetTimestamp: null,
      isRunning: false,
      isCompleted: false,
      isRinging: false,
      label: "",

      setTimer: (duration: number, label?: string) => {
        set({
          duration,
          remainingAtPause: duration,
          targetTimestamp: null,
          isRunning: false,
          isCompleted: false,
          isRinging: false,
          label: label || formatDurationLabel(duration),
        });
      },

      start: () => {
        const state = get();
        if (state.isRunning || state.isCompleted || state.remainingAtPause <= 0) return;
        set({
          isRunning: true,
          targetTimestamp: Date.now() + state.remainingAtPause,
        });
      },

      pause: () => {
        const now = Date.now();
        const state = get();
        if (!state.isRunning) return;
        const remaining = Math.max(0, (state.targetTimestamp || now) - now);
        set({
          isRunning: false,
          remainingAtPause: remaining,
          targetTimestamp: null,
        });
      },

      reset: () => {
        const state = get();
        set({
          remainingAtPause: state.duration,
          targetTimestamp: null,
          isRunning: false,
          isCompleted: false,
          isRinging: false,
        });
      },

      dismiss: () => {
        const state = get();
        set({
          remainingAtPause: state.duration,
          targetTimestamp: null,
          isRunning: false,
          isCompleted: false,
          isRinging: false,
        });
      },

      tick: () => {
        const state = get();
        if (!state.isRunning || !state.targetTimestamp) return;
        if (Date.now() >= state.targetTimestamp) {
          set({
            isRunning: false,
            isCompleted: true,
            isRinging: true,
            remainingAtPause: 0,
            targetTimestamp: null,
          });
        }
      },
    }),
    {
      name: "timer-storage",
      partialize: (state) => ({
        duration: state.duration,
        label: state.label,
        // On reload, pause any running timer with correct remaining time
        remainingAtPause:
          state.isRunning && state.targetTimestamp
            ? Math.max(0, state.targetTimestamp - Date.now())
            : state.remainingAtPause,
        isRunning: false,
        targetTimestamp: null,
        isCompleted: false,
        isRinging: false,
      }),
    }
  )
);

function formatDurationLabel(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes} min`;
  }
  return `${seconds}s`;
}
