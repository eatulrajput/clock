/**
 * ============================================================================
 * File: TimeDisplay.tsx
 * Module: Core UI Primitives / TimeDisplay
 * Architectural Responsibility:
 *   Tabular monospaced time readout component preventing layout shifting and jitter
 *   during fast second/millisecond ticking.
 *
 * Design Guidelines & HIG Compliance:
 *   - CSS `font-variant-numeric: tabular-nums` for rock-solid horizontal stability.
 *   - Proportional sizing for seconds, milliseconds, and AM/PM badges.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<TimeDisplayProps>
 *   - Zero Null Policy: Absence of optional units handled via undefined guards.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<TimeDisplayProps>
 *   - Outputs: Pure rendering component.
 *   - Side Effects: None.
 * ============================================================================
 */

import React from "react";
import { TimeDisplayProps } from "./types";
import "./TimeDisplay.css";

/**
 * Tabular-lining numbers time display primitive.
 */
export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  hours,
  minutes,
  seconds,
  centiseconds,
  formatMode = "digital-clock",
  ampmIndicator,
  fontSizeRem,
  className,
}) => {
  const containerClasses = [
    "ui-time-display",
    `ui-time-display--${formatMode}`,
    className ? className : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inlineStyles: React.CSSProperties = fontSizeRem
    ? { fontSize: `${fontSizeRem}rem` }
    : {};

  return (
    <div className={containerClasses} style={inlineStyles}>
      <span className="ui-time-display__digits">{hours}</span>
      <span className="ui-time-display__separator">:</span>
      <span className="ui-time-display__digits">{minutes}</span>

      {seconds !== undefined ? (
        <>
          <span className="ui-time-display__separator">:</span>
          <span className="ui-time-display__digits">{seconds}</span>
        </>
      ) : undefined}

      {centiseconds !== undefined ? (
        <span className="ui-time-display__centiseconds">.{centiseconds}</span>
      ) : undefined}

      {ampmIndicator !== undefined ? (
        <span className="ui-time-display__ampm">{ampmIndicator}</span>
      ) : undefined}
    </div>
  );
};
