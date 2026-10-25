/**
 * ============================================================================
 * File: TimerPresets.tsx
 * Module: Timers / Components
 * Architectural Responsibility:
 *   Quick-select preset strip providing standardized duration pills (e.g. Pomodoro,
 *   Tea, Workout) and rapid increment actions to instantly launch timers.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple-style tactile pill buttons with active selection states.
 *   - Double-click triggers immediate countdown launch.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<TimerPresetsProps>
 *   - Zero Null Policy: All preset descriptors are immutable records. Zero nulls.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<TimerPresetsProps>
 *   - Outputs: Dispatches `onSelectPreset(durationMs, label, autoStart)`.
 *   - Side Effects: None. Pure presentation component.
 * ============================================================================
 */

import React from "react";
import { TimerPresetDescriptor } from "../types";
import { Zap } from "lucide-react";

export const TIMER_PRESETS: readonly TimerPresetDescriptor[] = [
  { id: "1m", label: "1 min", hint: "Quick", hours: 0, minutes: 1, seconds: 0, durationMilliseconds: 60_000 },
  { id: "5m", label: "5 min", hint: "Tea", hours: 0, minutes: 5, seconds: 0, durationMilliseconds: 300_000 },
  { id: "10m", label: "10 min", hint: "Break", hours: 0, minutes: 10, seconds: 0, durationMilliseconds: 600_000 },
  { id: "15m", label: "15 min", hint: "Short Break", hours: 0, minutes: 15, seconds: 0, durationMilliseconds: 900_000 },
  { id: "25m", label: "25 min", hint: "Pomodoro", hours: 0, minutes: 25, seconds: 0, durationMilliseconds: 1_500_000 },
  { id: "30m", label: "30 min", hint: "Deep Work", hours: 0, minutes: 30, seconds: 0, durationMilliseconds: 1_800_000 },
  { id: "45m", label: "45 min", hint: "Workout", hours: 0, minutes: 45, seconds: 0, durationMilliseconds: 2_700_000 },
  { id: "1h", label: "1 hr", hint: "Focus Session", hours: 1, minutes: 0, seconds: 0, durationMilliseconds: 3_600_000 },
] as const;

export interface TimerPresetsProps {
  /**
   * Callback fired when a preset pill is clicked.
   * @param durationMilliseconds Total duration in ms.
   * @param label Predefined semantic tag.
   * @param autoStart When true, immediately starts running.
   */
  readonly onSelectPreset: (
    durationMilliseconds: number,
    label: string,
    autoStart: boolean
  ) => void;

  /**
   * When true, disables preset interactions (e.g. when maximum timers reached).
   * @default false
   */
  readonly isDisabled?: boolean;
}

/**
 * Standard quick-duration preset buttons bar.
 */
export const TimerPresets: React.FC<TimerPresetsProps> = ({
  onSelectPreset,
  isDisabled = false,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%",
        maxWidth: "760px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-secondary)",
          fontSize: "0.82rem",
          fontWeight: 500,
        }}
      >
        <Zap size={14} style={{ color: "var(--accent-color)" }} />
        <span>Quick Presets (Click to create, double-click to start)</span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {TIMER_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelectPreset(preset.durationMilliseconds, preset.hint, false)}
            onDoubleClick={() => onSelectPreset(preset.durationMilliseconds, preset.hint, true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "12px",
              border: "1px solid var(--glass-border)",
              backgroundColor: "rgba(120, 120, 128, 0.1)",
              color: "var(--text-primary)",
              fontFamily: "inherit",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: isDisabled ? "not-allowed" : "pointer",
              opacity: isDisabled ? 0.5 : 1,
              transition: "all 0.15s ease",
            }}
            onMouseOver={(event) => {
              if (!isDisabled) {
                event.currentTarget.style.backgroundColor = "rgba(10, 132, 255, 0.15)";
                event.currentTarget.style.borderColor = "var(--accent-color)";
              }
            }}
            onMouseOut={(event) => {
              if (!isDisabled) {
                event.currentTarget.style.backgroundColor = "rgba(120, 120, 128, 0.1)";
                event.currentTarget.style.borderColor = "var(--glass-border)";
              }
            }}
            title={`${preset.hint} (${preset.label})`}
          >
            <span style={{ fontWeight: 600 }}>{preset.label}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              {preset.hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
