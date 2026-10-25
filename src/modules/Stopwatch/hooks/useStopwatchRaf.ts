/**
 * ============================================================================
 * File: useStopwatchRaf.ts
 * Module: Stopwatch / Custom Hooks
 * Architectural Responsibility:
 *   High-precision 60 frames-per-second `requestAnimationFrame` synchronization
 *   hook that computes continuous elapsed milliseconds with zero layout jitter.
 *
 * Design Guidelines & HIG Compliance:
 *   - Runs exclusively via hardware-accelerated RAF when the stopwatch is active.
 *   - Cancels animation frames immediately when paused or unmounted.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Return Contract: Readonly<UseStopwatchRafResult>
 *   - Zero Null Policy: Elapsed milliseconds are always non-negative finite numbers.
 * ============================================================================
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useStopwatchStore } from "../../../store/useStopwatchStore";

export interface UseStopwatchRafResult {
  readonly displayMilliseconds: number;
  readonly isRunning: boolean;
  readonly start: () => void;
  readonly stop: () => void;
  readonly reset: () => void;
  readonly recordLap: () => void;
}

/**
 * Custom hook providing 60fps smooth elapsed time updates for the stopwatch display.
 */
export const useStopwatchRaf = (): UseStopwatchRafResult => {
  const isRunning = useStopwatchStore((state) => state.isRunning);
  const startEpochTimestamp = useStopwatchStore((state) => state.startEpochTimestamp);
  const accumulatedMilliseconds = useStopwatchStore((state) => state.accumulatedMilliseconds);
  const start = useStopwatchStore((state) => state.start);
  const stop = useStopwatchStore((state) => state.stop);
  const reset = useStopwatchStore((state) => state.reset);
  const recordLap = useStopwatchStore((state) => state.recordLap);

  const [displayMilliseconds, setDisplayMilliseconds] = useState(accumulatedMilliseconds);
  const rafIdReference = useRef<number>(0);

  const updateFrame = useCallback(() => {
    if (isRunning && startEpochTimestamp !== undefined) {
      const now = Date.now();
      setDisplayMilliseconds(accumulatedMilliseconds + (now - startEpochTimestamp));
      rafIdReference.current = requestAnimationFrame(updateFrame);
    }
  }, [isRunning, startEpochTimestamp, accumulatedMilliseconds]);

  useEffect(() => {
    if (isRunning) {
      rafIdReference.current = requestAnimationFrame(updateFrame);
    } else {
      setDisplayMilliseconds(accumulatedMilliseconds);
    }

    return () => {
      if (rafIdReference.current) {
        cancelAnimationFrame(rafIdReference.current);
      }
    };
  }, [isRunning, startEpochTimestamp, accumulatedMilliseconds, updateFrame]);

  return {
    displayMilliseconds,
    isRunning,
    start,
    stop,
    reset,
    recordLap,
  };
};
