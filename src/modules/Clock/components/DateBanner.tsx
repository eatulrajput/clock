/**
 * ============================================================================
 * File: DateBanner.tsx
 * Module: Clock / Components
 * Architectural Responsibility:
 *   Date header banner displaying localized weekday, month, day, and year
 *   for the selected primary timezone.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple-style subtle uppercase tracking (`letter-spacing: 0.05em`).
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<DateBannerProps>
 *   - Zero Null Policy: Calculations return validated formatted string.
 * ============================================================================
 */

import React from "react";

export interface DateBannerProps {
  /**
   * Master epoch timestamp in milliseconds.
   */
  readonly epochMilliseconds: number;

  /**
   * Target IANA timezone.
   */
  readonly timezoneIana: string;
}

/**
 * Localized date string banner component.
 */
export const DateBanner: React.FC<DateBannerProps> = ({
  epochMilliseconds,
  timezoneIana,
}) => {
  const date = new Date(epochMilliseconds);

  const formattedDate = date.toLocaleDateString(undefined, {
    timeZone: timezoneIana,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <h2
      style={{
        fontSize: "1.4rem",
        fontWeight: 400,
        color: "var(--text-secondary)",
        marginBottom: "16px",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {formattedDate}
    </h2>
  );
};
