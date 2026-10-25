/**
 * ============================================================================
 * File: types.ts
 * Module: Timers Domain Models
 * Architectural Responsibility:
 *   Domain entity interfaces, status types, preset descriptors, and formatting
 *   contracts for concurrent multi-timer state management.
 *
 * Design Guidelines & HIG Compliance:
 *   - Supports up to 6 simultaneous timers as specified in PRD section 2.4.
 *   - Strictly typed status transitions (idle -> running -> paused -> completed).
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<ActiveTimerEntity>
 *   - Zero Null Policy: Target timestamps are undefined when not ticking.
 *     No `null` keyword permitted in domain models.
 * ============================================================================
 */

/**
 * Operational lifecycle status of a timer instance.
 */
export type TimerStatus = "idle" | "running" | "paused" | "completed";

/**
 * Immutable entity representing a single active or configured countdown timer.
 */
export interface ActiveTimerEntity {
  /**
   * Unique identifier generated via crypto.randomUUID().
   */
  readonly id: string;

  /**
   * User-defined or auto-generated label (e.g., "Tea", "Pomodoro").
   */
  readonly label: string;

  /**
   * Total original countdown duration in milliseconds.
   */
  readonly totalDurationMilliseconds: number;

  /**
   * Milliseconds remaining when paused or computed.
   */
  readonly remainingMilliseconds: number;

  /**
   * Target epoch timestamp when countdown reaches 0.
   * Defined only while actively running. Undefined when paused or idle.
   */
  readonly targetEpochTimestamp?: number;

  /**
   * Current operational lifecycle state.
   */
  readonly status: TimerStatus;

  /**
   * When true, audio alert loop is actively ringing for this timer.
   */
  readonly isRinging: boolean;

  /**
   * Creation epoch timestamp for stable list ordering.
   */
  readonly createdAtTimestamp: number;
}

/**
 * Quick-select preset button descriptor.
 */
export interface TimerPresetDescriptor {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly durationMilliseconds: number;
}

/**
 * Deconstructed time breakdown for tabular numbers rendering.
 */
export interface FormattedTimeUnits {
  readonly hours: string;
  readonly minutes: string;
  readonly seconds: string;
  readonly totalRemainingSeconds: number;
}
