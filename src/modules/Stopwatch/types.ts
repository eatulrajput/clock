/**
 * ============================================================================
 * File: types.ts
 * Module: Stopwatch Domain Models
 * Architectural Responsibility:
 *   Domain entity interfaces, lap classification enums, and state contracts
 *   for continuous high-precision stopwatch timekeeping and lap analytics.
 *
 * Design Guidelines & HIG Compliance:
 *   - Precision down to the hundredth of a second (00:00.00).
 *   - Real-time lap analytics highlighting fastest (green) and slowest (red) laps
 *     as specified in PRD section 2.3.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Entities: Readonly<LapRecord>, Readonly<StopwatchSnapshot>
 *   - Zero Null Policy: Start timestamps are undefined when stopped. No nulls.
 * ============================================================================
 */

/**
 * Analytical classification for highlighting lap performance.
 */
export type LapClassification = "fastest" | "slowest" | "standard";

/**
 * Immutable record representing a single recorded lap split.
 */
export interface LapRecord {
  /**
   * 1-indexed sequential lap number.
   */
  readonly lapNumber: number;

  /**
   * Duration in milliseconds of this specific individual lap split.
   */
  readonly lapTimeMilliseconds: number;

  /**
   * Cumulative total elapsed milliseconds at the instant this lap was recorded.
   */
  readonly totalTimeMilliseconds: number;

  /**
   * Visual performance classification (fastest, slowest, or standard).
   */
  readonly classification: LapClassification;
}

/**
 * Snapshot representation of the active stopwatch state.
 */
export interface StopwatchSnapshot {
  readonly isRunning: boolean;
  readonly startEpochTimestamp?: number;
  readonly accumulatedMilliseconds: number;
  readonly laps: readonly LapRecord[];
}

/**
 * Formatted components for rendering tabular hundredths of a second.
 */
export interface FormattedStopwatchUnits {
  readonly minutes: string;
  readonly seconds: string;
  readonly centiseconds: string;
}
