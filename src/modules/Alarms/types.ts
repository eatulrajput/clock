/**
 * ============================================================================
 * File: types.ts
 * Module: Alarms Domain Models
 * Architectural Responsibility:
 *   Domain entity interfaces, weekday index enums, creation inputs, and formatted
 *   time models for scheduled alarms and snooze management.
 *
 * Design Guidelines & HIG Compliance:
 *   - Supports 24-hour time representation ("HH:mm") with localized 12-hour AM/PM presentation.
 *   - Configurable recurring day schedules (Sunday to Saturday) and customizable snooze cycles.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Entities: Readonly<AlarmEntity>
 *   - Zero Null Policy: Snooze timestamps and trigger history are undefined when inactive.
 *     No `null` keyword permitted in domain models.
 * ============================================================================
 */

/**
 * Numeric representation of day of the week matching JavaScript Date.getDay() (0 = Sunday ... 6 = Saturday).
 */
export type WeekDayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Immutable entity representing a configured scheduled alarm.
 */
export interface AlarmEntity {
  /**
   * Unique identifier generated via crypto.randomUUID().
   */
  readonly id: string;

  /**
   * 24-hour formatted time string "HH:mm" (e.g. "07:30", "22:15").
   */
  readonly timeString24Hour: string;

  /**
   * User-defined text label (e.g., "Wake Up", "Medication").
   */
  readonly label: string;

  /**
   * Operational enabled/disabled toggle state.
   */
  readonly isActive: boolean;

  /**
   * Repeating day indexes. An empty array designates a one-time non-repeating alarm.
   */
  readonly recurringDays: readonly WeekDayIndex[];

  /**
   * Audio sound theme identifier for this alarm.
   * @default "bell"
   */
  readonly soundThemeName?: string;

  /**
   * Future epoch timestamp until which the alarm is snoozed.
   * Undefined when not actively snoozed.
   */
  readonly snoozedUntilTimestamp?: number;

  /**
   * Epoch timestamp when this alarm last triggered, preventing double triggers within the same minute.
   */
  readonly lastTriggeredTimestamp?: number;
}

/**
 * Input payload for creating or editing an alarm entity.
 */
export interface CreateAlarmInput {
  readonly timeString24Hour: string;
  readonly label: string;
  readonly recurringDays: readonly WeekDayIndex[];
  readonly soundThemeName?: string;
  readonly isActive?: boolean;
}

/**
 * Formatted components for displaying time in 12-hour AM/PM format.
 */
export interface FormattedAlarmTime {
  readonly formattedHours: string;
  readonly formattedMinutes: string;
  readonly ampmIndicator: "AM" | "PM";
  readonly fullDisplayString: string;
}
