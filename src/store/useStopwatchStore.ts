/**
 * ============================================================================
 * File: useStopwatchStore.ts
 * Module: Store / Stopwatch State Management
 * Architectural Responsibility:
 *   Zustand store managing high-performance continuous stopwatch timekeeping,
 *   split lap calculations, and real-time fastest/slowest lap analytics.
 *
 * Design Guidelines & HIG Compliance:
 *   - Zero drift epoch tracking comparing Date.now() against `startEpochTimestamp`.
 *   - Dynamically re-classifies fastest (green) and slowest (red) laps on recording.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed State: Readonly<StopwatchStoreState>
 *   - Zero Null Policy: Start timestamps modeled as `undefined` when idle.
 *     No `null` keyword permitted in store implementation.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Actions dispatched by StopwatchControls.
 *   - Outputs: Reactively consumed by StopwatchHero, LapTable, and useStopwatchRaf.
 *   - Side Effects: Persists stopwatch state to localStorage ("clock_stopwatch_v2").
 * ============================================================================
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LapRecord } from "../modules/Stopwatch/types";

export interface StopwatchStoreState {
  readonly isRunning: boolean;
  readonly startEpochTimestamp?: number;
  readonly accumulatedMilliseconds: number;
  readonly laps: readonly LapRecord[];

  readonly start: () => void;
  readonly stop: () => void;
  readonly reset: () => void;
  readonly recordLap: () => void;
}

/**
 * Recomputes fastest and slowest lap classifications whenever laps are recorded.
 */
function classifyLaps(rawLaps: readonly LapRecord[]): readonly LapRecord[] {
  if (rawLaps.length < 2) {
    return rawLaps.map((l) => ({ ...l, classification: "standard" as const }));
  }

  let minTime = Infinity;
  let maxTime = -Infinity;

  rawLaps.forEach((l) => {
    if (l.lapTimeMilliseconds < minTime) minTime = l.lapTimeMilliseconds;
    if (l.lapTimeMilliseconds > maxTime) maxTime = l.lapTimeMilliseconds;
  });

  return rawLaps.map((l) => {
    let classification: "fastest" | "slowest" | "standard" = "standard";
    if (l.lapTimeMilliseconds === minTime) {
      classification = "fastest";
    } else if (l.lapTimeMilliseconds === maxTime) {
      classification = "slowest";
    }
    return { ...l, classification };
  });
}

export const useStopwatchStore = create<StopwatchStoreState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      startEpochTimestamp: undefined,
      accumulatedMilliseconds: 0,
      laps: [],

      start: () => {
        const state = get();
        if (!state.isRunning) {
          set({
            isRunning: true,
            startEpochTimestamp: Date.now(),
          });
        }
      },

      stop: () => {
        const state = get();
        if (state.isRunning && state.startEpochTimestamp !== undefined) {
          const now = Date.now();
          const additionalElapsed = now - state.startEpochTimestamp;
          set({
            isRunning: false,
            accumulatedMilliseconds: state.accumulatedMilliseconds + additionalElapsed,
            startEpochTimestamp: undefined,
          });
        }
      },

      reset: () => {
        set({
          isRunning: false,
          startEpochTimestamp: undefined,
          accumulatedMilliseconds: 0,
          laps: [],
        });
      },

      recordLap: () => {
        const state = get();
        if (!state.isRunning || state.startEpochTimestamp === undefined) return;

        const now = Date.now();
        const currentTotal = state.accumulatedMilliseconds + (now - state.startEpochTimestamp);
        const previousTotal = state.laps.length > 0 ? state.laps[0].totalTimeMilliseconds : 0;
        const lapDuration = Math.max(0, currentTotal - previousTotal);

        const newLap: LapRecord = {
          lapNumber: state.laps.length + 1,
          lapTimeMilliseconds: lapDuration,
          totalTimeMilliseconds: currentTotal,
          classification: "standard",
        };

        const updatedLaps = classifyLaps([newLap, ...state.laps]);
        set({ laps: updatedLaps });
      },
    }),
    {
      name: "clock_stopwatch_v2",
      partialize: (state) => ({
        accumulatedMilliseconds: state.accumulatedMilliseconds,
        laps: state.laps,
        // On app reload, pause active running state safely without losing elapsed time
        isRunning: false,
        startEpochTimestamp: undefined,
      }),
    }
  )
);
