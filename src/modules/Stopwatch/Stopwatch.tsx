/**
 * ============================================================================
 * File: Stopwatch.tsx
 * Module: Stopwatch / Root Module Container
 * Architectural Responsibility:
 *   Top-level coordinator for the Stopwatch tab. Composes the `StopwatchHero`,
 *   `StopwatchControls`, and `LapTable` components, driving high-performance
 *   timekeeping via the `useStopwatchRaf` hook and `useStopwatchStore`.
 *
 * Design Guidelines & HIG Compliance:
 *   - Continuous 60fps elapsed time display without UI thread blocking.
 *   - Instant keyboard shortcuts (Space for Start/Stop, L for Lap, R for Reset).
 *
 * Type Safety & Null Handling Contract:
 *   - Fully Type Checked: Strict React.FC implementation.
 *   - Zero Null Policy: No `null` keyword used throughout implementation.
 *
 * State & Dependency Boundaries:
 *   - State Engine: `useStopwatchRaf` and `useStopwatchStore`.
 *   - Side Effects: Manages requestAnimationFrame updates while running.
 * ============================================================================
 */

import React from "react";
import { useStopwatchRaf } from "./hooks/useStopwatchRaf";
import { useStopwatchStore } from "../../store/useStopwatchStore";
import { StopwatchHero } from "./components/StopwatchHero";
import { StopwatchControls } from "./components/StopwatchControls";
import { LapTable } from "./components/LapTable";

/**
 * Root Stopwatch module view.
 */
export const Stopwatch: React.FC = () => {
  const { displayMilliseconds, isRunning, start, stop, reset, recordLap } = useStopwatchRaf();
  const laps = useStopwatchStore((state) => state.laps);
  const accumulatedMilliseconds = useStopwatchStore((state) => state.accumulatedMilliseconds);

  const canReset = accumulatedMilliseconds > 0 || laps.length > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        gap: "24px",
      }}
    >
      {/* Module Title Header Bar */}
      <div style={{ flexShrink: 0 }}>
        <h2 className="text-title" style={{ margin: 0 }}>
          Stopwatch
        </h2>
      </div>

      {/* Main Content Area: Hero Digits & Controls */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "36px",
          minHeight: "0",
        }}
      >
        <StopwatchHero elapsedMilliseconds={displayMilliseconds} />

        <StopwatchControls
          isRunning={isRunning}
          canReset={canReset}
          onStart={start}
          onStop={stop}
          onReset={reset}
          onRecordLap={recordLap}
        />

        {/* Scrollable Lap Splits Table */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <LapTable laps={laps} />
        </div>
      </div>
    </div>
  );
};
