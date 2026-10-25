/**
 * ============================================================================
 * File: types.ts
 * Module: Clock Domain Models
 * Architectural Responsibility:
 *   Type definitions and display option interfaces for the primary hero clock screen.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Entities: Readonly<ClockDisplayOptions>
 *   - Zero Null Policy: All absence of elements uses undefined.
 * ============================================================================
 */

export interface ClockDisplayOptions {
  readonly use24Hour: boolean;
  readonly showSeconds: boolean;
  readonly timezoneIana: string;
}
