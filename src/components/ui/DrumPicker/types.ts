/**
 * ============================================================================
 * File: types.ts
 * Module: Core UI Primitives / DrumPicker
 * Architectural Responsibility:
 *   Type definitions, props contracts, and physics interfaces for the 3D
 *   iOS-style drum roller number picker primitive.
 *
 * Design Guidelines & HIG Compliance:
 *   - Cylindrical perspective projection with inertia momentum snapping.
 *   - Unit labels ("hours", "min", "sec") and touch/pointer wheel handling.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<DrumPickerColumnProps>
 *   - Zero Null Policy: Values are always bounded integers. Zero nulls.
 * ============================================================================
 */

/**
 * Properties for a single cylindrical drum column.
 */
export interface DrumPickerColumnProps {
  /**
   * The currently active selected integer value.
   */
  readonly selectedValue: number;

  /**
   * Minimum allowable integer value (inclusive).
   * @default 0
   */
  readonly minimumValue?: number;

  /**
   * Maximum allowable integer value (inclusive).
   */
  readonly maximumValue: number;

  /**
   * Accessible and visual text label displayed adjacent to the active value (e.g., "hours", "min", "sec").
   */
  readonly unitLabel: string;

  /**
   * Callback fired when user rotates to a new value.
   * @param nextValue The newly selected integer value.
   */
  readonly onSelectedValueChange: (nextValue: number) => void;
}

/**
 * Composite hours, minutes, and seconds 3-column drum time picker properties.
 */
export interface DrumTimePickerProps {
  /**
   * Currently selected hours (0..23).
   */
  readonly hours: number;

  /**
   * Currently selected minutes (0..59).
   */
  readonly minutes: number;

  /**
   * Currently selected seconds (0..59).
   */
  readonly seconds: number;

  /**
   * Callback fired whenever any of the 3 drum columns rotate.
   */
  readonly onTimeChange: (nextHours: number, nextMinutes: number, nextSeconds: number) => void;
}
