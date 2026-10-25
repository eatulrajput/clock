/**
 * ============================================================================
 * File: StopwatchControls.tsx
 * Module: Stopwatch / Components
 * Architectural Responsibility:
 *   Tactile action button bar providing Start, Stop, Lap, and Reset controls
 *   adhering to Apple iOS Stopwatch layout and tactile physics.
 *
 * Design Guidelines & HIG Compliance:
 *   - Circular dual-action buttons with contextual color shifts.
 *   - Keyboard support: Space key toggles Start/Stop; 'L' key records lap.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<StopwatchControlsProps>
 *   - Zero Null Policy: Boolean flags control disabled states.
 * ============================================================================
 */

import React, { useEffect } from "react";
import { Play, Square, RotateCcw, Flag } from "lucide-react";

export interface StopwatchControlsProps {
  /**
   * Operational running state of the stopwatch.
   */
  readonly isRunning: boolean;

  /**
   * True if accumulated time or laps exist (allowing reset).
   */
  readonly canReset: boolean;

  /**
   * Action trigger callbacks.
   */
  readonly onStart: () => void;
  readonly onStop: () => void;
  readonly onReset: () => void;
  readonly onRecordLap: () => void;
}

/**
 * Tactile action button group for the stopwatch.
 */
export const StopwatchControls: React.FC<StopwatchControlsProps> = ({
  isRunning,
  canReset,
  onStart,
  onStop,
  onReset,
  onRecordLap,
}) => {
  // Global keyboard shortcuts: Space for Start/Stop, L for Lap, R for Reset
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        (activeElement as HTMLElement)?.isContentEditable;

      if (isInput) return;

      if (event.code === "Space") {
        event.preventDefault();
        if (isRunning) {
          onStop();
        } else {
          onStart();
        }
      } else if (event.key === "l" || event.key === "L") {
        if (isRunning) {
          event.preventDefault();
          onRecordLap();
        }
      } else if (event.key === "r" || event.key === "R") {
        if (!isRunning && canReset) {
          event.preventDefault();
          onReset();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, canReset, onStart, onStop, onReset, onRecordLap]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
      }}
    >
      {/* Secondary Action Button: Lap (when running) or Reset (when stopped) */}
      <button
        type="button"
        disabled={!isRunning && !canReset}
        onClick={isRunning ? onRecordLap : onReset}
        style={{
          width: "78px",
          height: "78px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: isRunning
            ? "rgba(120, 120, 128, 0.18)"
            : canReset
            ? "rgba(120, 120, 128, 0.18)"
            : "rgba(120, 120, 128, 0.08)",
          color: isRunning || canReset ? "var(--text-primary)" : "var(--text-secondary)",
          cursor: isRunning || canReset ? "pointer" : "not-allowed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          fontFamily: "inherit",
          fontSize: "0.85rem",
          fontWeight: 500,
          opacity: isRunning || canReset ? 1 : 0.45,
          transition: "all 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
          boxShadow: isRunning || canReset ? "0 4px 16px rgba(0, 0, 0, 0.08)" : "none",
        }}
        title={isRunning ? "Record Lap (L)" : "Reset Stopwatch (R)"}
      >
        {isRunning ? <Flag size={20} /> : <RotateCcw size={20} />}
        <span>{isRunning ? "Lap" : "Reset"}</span>
      </button>

      {/* Primary Action Button: Start or Stop */}
      <button
        type="button"
        onClick={isRunning ? onStop : onStart}
        style={{
          width: "88px",
          height: "88px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: isRunning
            ? "rgba(255, 69, 58, 0.18)"
            : "rgba(48, 209, 88, 0.18)",
          color: isRunning ? "#FF453A" : "#30D158",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          fontFamily: "inherit",
          fontSize: "0.95rem",
          fontWeight: 600,
          transition: "all 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
          boxShadow: isRunning
            ? "0 4px 20px rgba(255, 69, 58, 0.25)"
            : "0 4px 20px rgba(48, 209, 88, 0.25)",
        }}
        title={isRunning ? "Stop (Space)" : "Start (Space)"}
      >
        {isRunning ? (
          <Square size={24} fill="currentColor" />
        ) : (
          <Play size={24} fill="currentColor" style={{ marginLeft: "4px" }} />
        )}
        <span>{isRunning ? "Stop" : "Start"}</span>
      </button>
    </div>
  );
};
