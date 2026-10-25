/**
 * ============================================================================
 * File: types.ts
 * Module: Core UI Primitives / TimeDisplay
 * Architectural Responsibility:
 *   Type definitions and layout modes for high-precision tabular numerals time display.
 *
 * Design Guidelines & HIG Compliance:
 *   - Enforces `font-variant-numeric: tabular-nums` to eliminate jitter.
 *   - Supports formats: "digital-clock", "stopwatch", and "countdown-timer".
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<TimeDisplayProps>
 *   - Zero Null Policy: Optional seconds, centiseconds, or AM/PM indicators default to undefined.
 * ============================================================================
 */

/**
 * Format mode adapting layout proportions and typography weights.
 */
export type TimeDisplayFormat = "digital-clock" | "stopwatch" | "countdown-timer";

/**
 * Component properties for the TimeDisplay primitive.
 */
export interface TimeDisplayProps {
  /**
   * Two-digit hours string (e.g. "07", "12").
   */
  readonly hours: string;

  /**
   * Two-digit minutes string (e.g. "05", "30").
   */
  readonly minutes: string;

  /**
   * Optional two-digit seconds string (e.g. "45").
   */
  readonly seconds?: string;

  /**
   * Optional two-digit centiseconds/milliseconds string for stopwatches (e.g. "82").
   */
  readonly centiseconds?: string;

  /**
   * Layout visual format style.
   * @default "digital-clock"
   */
  readonly formatMode?: TimeDisplayFormat;

  /**
   * Optional 12-hour AM/PM period indicator.
   */
  readonly ampmIndicator?: "AM" | "PM";

  /**
   * Optional font size in rem units.
   */
  readonly fontSizeRem?: number;

  /**
   * Optional custom CSS class name.
   */
  readonly className?: string;
}
