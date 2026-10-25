/**
 * ============================================================================
 * File: useTimerStore.ts
 * Module: Store / Timers State Management
 * Architectural Responsibility:
 *   Zustand store managing multi-timer state supporting up to 6 concurrent countdowns
 *   with epoch-based delta timing, zero drift, and local persistence.
 *
 * Design Guidelines & HIG Compliance:
 *   - PRD section 2.4 compliance: concurrent execution of up to 6 distinct timers.
 *   - Epoch comparison: Never relies on setInterval; compares Date.now() against
 *     `targetEpochTimestamp` to ensure zero drift even during system sleep.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed State: Readonly<TimerStoreState>
 *   - Zero Null Policy: Absence of target timestamp or ringing timer modeled via
 *     `undefined`. No `null` values permitted.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Dispatched action methods from UI components.
 *   - Outputs: Reactively consumed by TimerCard, TimerGrid, and TimerRingingOverlay.
 *   - Side Effects: Persists state to localStorage key "clock_timers_v2".
 * ============================================================================
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ActiveTimerEntity } from "../modules/Timers/types";

export const MAXIMUM_CONCURRENT_TIMERS = 6;

/**
 * Format total milliseconds into a human-readable default label (e.g., "5 min", "1h 15m").
 */
export function formatDurationLabel(milliseconds: number): string {
  const totalSeconds = Math.round(milliseconds / 1000);
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

/**
 * Contract for the multi-timer Zustand state store.
 */
export interface TimerStoreState {
  /**
   * Collection of active countdown timer entities (up to 6).
   */
  readonly timers: readonly ActiveTimerEntity[];

  /**
   * ID of the timer currently sounding the completion alert, if any.
   */
  readonly ringingTimerId?: string;

  /**
   * Creates a new timer instance and adds it to the active pool.
   * @returns The generated UUID string of the newly created timer.
   */
  readonly createTimer: (
    durationMilliseconds: number,
    label?: string,
    autoStart?: boolean
  ) => string;

  /**
   * Starts a newly created or idle timer.
   */
  readonly startTimer: (timerId: string) => void;

  /**
   * Pauses an actively running timer, snapshotting remaining milliseconds.
   */
  readonly pauseTimer: (timerId: string) => void;

  /**
   * Resumes a paused timer by projecting a new future target epoch timestamp.
   */
  readonly resumeTimer: (timerId: string) => void;

  /**
   * Resets a timer back to its initial full duration in paused state.
   */
  readonly resetTimer: (timerId: string) => void;

  /**
   * Deletes a timer from the active pool.
   */
  readonly deleteTimer: (timerId: string) => void;

  /**
   * Silences the active ringing audio alert.
   */
  readonly dismissRinging: (timerId?: string) => void;

  /**
   * Core epoch evaluation tick invoked continuously by the master WebWorker.
   */
  readonly tick: () => void;
}

export const useTimerStore = create<TimerStoreState>()(
  persist(
    (set, get) => ({
      timers: [],
      ringingTimerId: undefined,

      createTimer: (durationMilliseconds, label, autoStart = false) => {
        const state = get();
        if (state.timers.length >= MAXIMUM_CONCURRENT_TIMERS) {
          return "";
        }

        const sanitizedLabel =
          label && label.trim().length > 0
            ? label.trim()
            : formatDurationLabel(durationMilliseconds);

        const newTimerId = crypto.randomUUID();
        const now = Date.now();

        const newTimer: ActiveTimerEntity = {
          id: newTimerId,
          label: sanitizedLabel,
          totalDurationMilliseconds: durationMilliseconds,
          remainingMilliseconds: durationMilliseconds,
          targetEpochTimestamp: autoStart ? now + durationMilliseconds : undefined,
          status: autoStart ? "running" : "idle",
          isRinging: false,
          createdAtTimestamp: now,
        };

        set({ timers: [...state.timers, newTimer] });
        return newTimerId;
      },

      startTimer: (timerId) => {
        const state = get();
        const now = Date.now();

        const updatedTimers = state.timers.map((timer) => {
          if (timer.id === timerId && timer.status !== "running") {
            const remaining =
              timer.remainingMilliseconds > 0
                ? timer.remainingMilliseconds
                : timer.totalDurationMilliseconds;

            return {
              ...timer,
              status: "running" as const,
              remainingMilliseconds: remaining,
              targetEpochTimestamp: now + remaining,
              isRinging: false,
            };
          }
          return timer;
        });

        set({ timers: updatedTimers });
      },

      pauseTimer: (timerId) => {
        const state = get();
        const now = Date.now();

        const updatedTimers = state.timers.map((timer) => {
          if (timer.id === timerId && timer.status === "running") {
            const calculatedRemaining = timer.targetEpochTimestamp
              ? Math.max(0, timer.targetEpochTimestamp - now)
              : timer.remainingMilliseconds;

            return {
              ...timer,
              status: "paused" as const,
              remainingMilliseconds: calculatedRemaining,
              targetEpochTimestamp: undefined,
            };
          }
          return timer;
        });

        set({ timers: updatedTimers });
      },

      resumeTimer: (timerId) => {
        const state = get();
        const now = Date.now();

        const updatedTimers = state.timers.map((timer) => {
          if (timer.id === timerId && timer.status === "paused") {
            return {
              ...timer,
              status: "running" as const,
              targetEpochTimestamp: now + timer.remainingMilliseconds,
            };
          }
          return timer;
        });

        set({ timers: updatedTimers });
      },

      resetTimer: (timerId) => {
        const state = get();

        const updatedTimers = state.timers.map((timer) => {
          if (timer.id === timerId) {
            return {
              ...timer,
              status: "idle" as const,
              remainingMilliseconds: timer.totalDurationMilliseconds,
              targetEpochTimestamp: undefined,
              isRinging: false,
            };
          }
          return timer;
        });

        const nextRingingId =
          state.ringingTimerId === timerId ? undefined : state.ringingTimerId;

        set({ timers: updatedTimers, ringingTimerId: nextRingingId });
      },

      deleteTimer: (timerId) => {
        const state = get();
        const remainingTimers = state.timers.filter((timer) => timer.id !== timerId);
        const nextRingingId =
          state.ringingTimerId === timerId ? undefined : state.ringingTimerId;

        set({ timers: remainingTimers, ringingTimerId: nextRingingId });
      },

      dismissRinging: (timerId) => {
        const state = get();
        const targetId = timerId ? timerId : state.ringingTimerId;

        const updatedTimers = state.timers.map((timer) => {
          if (!targetId || timer.id === targetId) {
            return {
              ...timer,
              isRinging: false,
            };
          }
          return timer;
        });

        set({ timers: updatedTimers, ringingTimerId: undefined });
      },

      tick: () => {
        const state = get();
        const now = Date.now();
        let stateHasChanged = false;
        let newRingingTimerId = state.ringingTimerId;

        const updatedTimers = state.timers.map((timer) => {
          if (timer.status === "running" && timer.targetEpochTimestamp !== undefined) {
            if (now >= timer.targetEpochTimestamp) {
              stateHasChanged = true;
              newRingingTimerId = timer.id;

              return {
                ...timer,
                status: "completed" as const,
                remainingMilliseconds: 0,
                targetEpochTimestamp: undefined,
                isRinging: true,
              };
            }
          }
          return timer;
        });

        if (stateHasChanged) {
          set({ timers: updatedTimers, ringingTimerId: newRingingTimerId });
        }
      },
    }),
    {
      name: "clock_timers_v2",
      partialize: (state) => ({
        timers: state.timers.map((timer) => {
          const now = Date.now();
          // If app was closed while running, compute remaining or complete
          if (timer.status === "running" && timer.targetEpochTimestamp !== undefined) {
            const remaining = Math.max(0, timer.targetEpochTimestamp - now);
            return {
              ...timer,
              status: remaining > 0 ? ("paused" as const) : ("completed" as const),
              remainingMilliseconds: remaining,
              targetEpochTimestamp: undefined,
              isRinging: remaining <= 0,
            };
          }
          return {
            ...timer,
            targetEpochTimestamp: undefined,
            isRinging: false,
          };
        }),
      }),
    }
  )
);
