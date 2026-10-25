/**
 * ============================================================================
 * File: types.ts
 * Module: Settings Domain Models
 * Architectural Responsibility:
 *   Type definitions, tab descriptors, appearance modes, and preference schemas
 *   for the application configuration engine.
 *
 * Design Guidelines & HIG Compliance:
 *   - Supports Apple HIG translucent appearance customization.
 *   - Discrete preference enumerations with guaranteed fallback defaults.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Schemas: Readonly<UserPreferencesSchema>
 *   - Zero Null Policy: All absence of elements uses undefined.
 * ============================================================================
 */

/**
 * Navigation category tab identifier for the settings view.
 */
export type SettingsTabId = "appearance" | "general" | "audio" | "about";

/**
 * Desktop wallpaper presentation mode.
 */
export type BackgroundModeType = "solid" | "gradient" | "image";

/**
 * Predefined synthesized sound theme identifiers.
 */
export type SoundThemeIdentifier = "bell" | "digital" | "gentle" | "marimba" | "chime";

/**
 * Complete immutable user preferences state schema.
 */
export interface UserPreferencesSchema {
  readonly use24Hour: boolean;
  readonly snoozeDuration: number; // in minutes (default 9)
  readonly alarmVolume: number; // 0..100 percent
  readonly showSeconds: boolean;
  readonly clockTimezone: string; // IANA timezone string

  readonly transparencyEnabled: boolean;
  readonly transparencyAmount: number; // 0..100 percent
  readonly bgMode: BackgroundModeType;
  readonly bgColor: string; // hex color
  readonly bgImageUrl: string;
  readonly gradientFrom: string; // hex start
  readonly gradientTo: string; // hex end
  readonly gradientAngle: number; // degrees
  readonly blurEnabled: boolean;
  readonly blurAmount: number; // 0..50 px
}
