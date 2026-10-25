/**
 * ============================================================================
 * File: types.ts
 * Module: World Clock Domain Models
 * Architectural Responsibility:
 *   Type definitions, timezone metadata contracts, relative time calculations,
 *   and zero-null drag-and-drop state representations for the World Clock module.
 *
 * Design Guidelines & HIG Compliance:
 *   - Relative time difference indicators ("Today, +5 HRS", "Yesterday, -3 HRS").
 *   - Day/night visual inversion contracts (6:00 AM to 6:00 PM local).
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Entities: Readonly<TrackedCityEntity>
 *   - Zero Null Policy: Drag indexes are undefined when not dragging.
 *     No `null` keyword permitted in domain models.
 * ============================================================================
 */

/**
 * Immutable entity representing a city tracked in the world clock list.
 */
export interface TrackedCityEntity {
  /**
   * Unique identifier (e.g., "America/New_York", "Asia/Tokyo").
   */
  readonly id: string;

  /**
   * Localized display name (e.g., "New York", "Tokyo").
   */
  readonly cityName: string;

  /**
   * Standard IANA timezone string (e.g., "America/New_York").
   */
  readonly timezoneIana: string;

  /**
   * Optional country or region descriptor.
   */
  readonly countryName?: string;

  /**
   * Positional ordering index in the list.
   */
  readonly displayOrder: number;
}

/**
 * Computed time and relative offset values for a specific city.
 */
export interface CityTimeCalculation {
  readonly formattedHours: string;
  readonly formattedMinutes: string;
  readonly ampmIndicator?: "AM" | "PM";
  readonly formattedDate: string;
  readonly relativeHoursOffset: number; // e.g. +5.5, -3, 0
  readonly relativeDayLabel: "Today" | "Yesterday" | "Tomorrow";
  readonly isDaytime: boolean; // true if 6:00 AM <= local time < 6:00 PM
  readonly hourHandDegrees: number;
  readonly minuteHandDegrees: number;
}

/**
 * Drag-and-drop reordering state contract with zero nulls.
 */
export interface DragDropOrderState {
  readonly draggedIndex?: number;
  readonly dragOverIndex?: number;
}

/**
 * Search autocomplete result entity.
 */
export interface CitySearchResult {
  readonly id: string;
  readonly cityName: string;
  readonly timezoneIana: string;
  readonly region?: string;
}
