/**
 * ============================================================================
 * File: DigitalClockHero.tsx
 * Module: Clock / Components
 * Architectural Responsibility:
 *   Hero digital clock display utilizing tabular numerals typography and
 *   dynamic accent gradient sheen.
 *
 * Design Guidelines & HIG Compliance:
 *   - Monospaced tabular numerals (`font-variant-numeric: tabular-nums`).
 *   - Gradient text clip reflecting accent color highlights.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<DigitalClockHeroProps>
 *   - Zero Null Policy: All formatted strings guaranteed non-null.
 * ============================================================================
 */

import React from "react";

export interface DigitalClockHeroProps {
  /**
   * Master epoch timestamp in milliseconds.
   */
  readonly epochMilliseconds: number;

  /**
   * When true, uses 24-hour time format.
   */
  readonly use24Hour: boolean;

  /**
   * When true, renders seconds digits.
   */
  readonly showSeconds: boolean;

  /**
   * Target IANA timezone string.
   */
  readonly timezoneIana: string;
}

/**
 * Large digital clock hero digits component.
 */
export const DigitalClockHero: React.FC<DigitalClockHeroProps> = ({
  epochMilliseconds,
  use24Hour,
  showSeconds,
  timezoneIana,
}) => {
  const date = new Date(epochMilliseconds);

  const formattedTime = date.toLocaleTimeString(undefined, {
    timeZone: timezoneIana,
    hour: "numeric",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: !use24Hour,
  });

  return (
    <div
      className="text-hero"
      style={{
        fontSize: "6rem",
        fontWeight: 200,
        background: "linear-gradient(135deg, var(--text-primary), var(--accent-color))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.2))",
        fontVariantNumeric: "tabular-nums",
        WebkitFontFeatureSettings: "'tnum'",
        fontFeatureSettings: "'tnum'",
        letterSpacing: "-0.03em",
      }}
    >
      {formattedTime}
    </div>
  );
};
