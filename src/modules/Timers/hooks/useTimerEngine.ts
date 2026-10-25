/**
 * ============================================================================
 * File: useTimerEngine.ts
 * Module: Timers / Custom Hooks
 * Architectural Responsibility:
 *   Decoupled time synchronization hook that connects the multi-timer state store
 *   with the central WebWorker tick, triggers alarm audio loops upon completion,
 *   and provides unified action dispatchers.
 *
 * Design Guidelines & HIG Compliance:
 *   - Ensures continuous audio alert loops until explicitly silenced by user.
 *   - Decoupled from JSX render trees for clean testability.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Return Contract: Readonly<UseTimerEngineResult>
 *   - Zero Null Policy: Active ringing timer modeled as `ringingTimer?: ActiveTimerEntity`.
 *     No null values returned.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Listens to `useTimeStore.getState().now` and `useTimerStore`.
 *   - Outputs: Dispatches timer lifecycle actions and audio triggers.
 *   - Side Effects: Starts and stops Web Audio synthesizer loops via `startAlarmSound()` / `stopAlarmSound()`.
 * ============================================================================
 */

import { useEffect, useMemo } from "react";
import { useTimerStore } from "../../../store/useTimerStore";
import { useTimeStore } from "../../../store/useTimeStore";
import { startAlarmSound, stopAlarmSound } from "../../../utils/audio";
import { ActiveTimerEntity } from "../types";

export interface UseTimerEngineResult {
  readonly timers: readonly ActiveTimerEntity[];
  readonly ringingTimer?: ActiveTimerEntity;
  readonly isAnyTimerRinging: boolean;
  readonly createTimer: (durationMilliseconds: number, label?: string, autoStart?: boolean) => string;
  readonly startTimer: (timerId: string) => void;
  readonly pauseTimer: (timerId: string) => void;
  readonly resumeTimer: (timerId: string) => void;
  readonly resetTimer: (timerId: string) => void;
  readonly deleteTimer: (timerId: string) => void;
  readonly dismissRinging: (timerId?: string) => void;
}

/**
 * Custom hook orchestrating multi-timer execution and audio alarms.
 */
export const useTimerEngine = (): UseTimerEngineResult => {
  const timers = useTimerStore((state) => state.timers);
  const ringingTimerId = useTimerStore((state) => state.ringingTimerId);
  const tick = useTimerStore((state) => state.tick);
  const createTimer = useTimerStore((state) => state.createTimer);
  const startTimer = useTimerStore((state) => state.startTimer);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const resumeTimer = useTimerStore((state) => state.resumeTimer);
  const resetTimer = useTimerStore((state) => state.resetTimer);
  const deleteTimer = useTimerStore((state) => state.deleteTimer);
  const dismissRinging = useTimerStore((state) => state.dismissRinging);

  const workerEpoch = useTimeStore((state) => state.now);

  // Synchronize master WebWorker epoch ticks with timers store
  useEffect(() => {
    tick();
  }, [workerEpoch, tick]);

  // Find active ringing timer entity if one exists
  const ringingTimer = useMemo(() => {
    if (!ringingTimerId) return undefined;
    return timers.find((timer) => timer.id === ringingTimerId);
  }, [timers, ringingTimerId]);

  const isAnyTimerRinging = ringingTimer !== undefined;

  // Manage Web Audio synthesize loop based on ringing state
  useEffect(() => {
    if (isAnyTimerRinging) {
      startAlarmSound();
    } else {
      stopAlarmSound();
    }
  }, [isAnyTimerRinging]);

  return {
    timers,
    ringingTimer,
    isAnyTimerRinging,
    createTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    deleteTimer,
    dismissRinging,
  };
};
