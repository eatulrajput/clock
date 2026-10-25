/**
 * ============================================================================
 * File: StopwatchHero.tsx
 * Module: Stopwatch / Components
 * Architectural Responsibility:
 *   Hero readout displaying high-precision minutes, seconds, and centiseconds
 *   using monospaced tabular numerals (`font-variant-numeric: tabular-nums`)
 *   to guarantee rock-solid horizontal stability without layout shifts at 60fps.
 *
 * Design Guidelines & HIG Compliance:
 *   - Precision down to the hundredth of a second (00:00.00).
 *   - Proportional scale hierarchy (large minutes/seconds with smaller centiseconds).
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<StopwatchHeroProps>
 *   - Zero Null Policy: Calculations return validated formatted strings. No nulls.
 * ============================================================================
 */

import React from "react";
import { FormattedStopwatchUnits } from "../types";

export interface StopwatchHeroProps {
  /**
   * Continuous elapsed time in milliseconds.
   */
  readonly elapsedMilliseconds: number;
}

/**
 * Format milliseconds into minutes, seconds, and centiseconds.
 */
function formatStopwatchUnits(ms: number): FormattedStopwatchUnits {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return {
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
    centiseconds: centiseconds.toString().padStart(2, "0"),
  };
}

/**
 * High-precision stopwatch hero digits readout.
 */
export const StopwatchHero: React.FC<StopwatchHeroProps> = ({
  elapsedMilliseconds,
}) => {
  const { minutes, seconds, centiseconds } = formatStopwatchUnits(elapsedMilliseconds);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        justifyContent: "center",
        fontVariantNumeric: "tabular-nums",
        WebkitFontFeatureSettings: "'tnum'",
        fontFeatureSettings: "'tnum'",
        userSelect: "none",
        WebkitUserSelect: "none",
        lineHeight: 1,
        letterSpacing: "-0.04em",
      }}
      role="timer"
      aria-label={`${minutes} minutes, ${seconds} seconds, and ${centiseconds} hundredths`}
    >
      <span
        className="text-hero"
        style={{
          fontSize: "6.5rem",
          fontWeight: 200,
          color: "var(--text-primary)",
        }}
      >
        {minutes}:{seconds}
      </span>

      <span
        style={{
          fontSize: "2.8rem",
          fontWeight: 300,
          color: "var(--text-secondary)",
          marginLeft: "6px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        .{centiseconds}
      </span>
    </div>
  );
};
