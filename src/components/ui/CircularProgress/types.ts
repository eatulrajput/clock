/**
 * ============================================================================
 * File: types.ts
 * Module: Core UI Primitives / CircularProgress
 * Architectural Responsibility:
 *   Type definitions and mathematical parameter contracts for the resolution-independent
 *   SVG CircularProgress ring.
 *
 * Design Guidelines & HIG Compliance:
 *   - Smooth strokeDashoffset animation transitions.
 *   - Configurable radius, stroke thickness, color, and center slot.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<CircularProgressProps>
 *   - Zero Null Policy: Normalized progress is clamped from 0.0 to 1.0.
 * ============================================================================
 */

import React from "react";

/**
 * Component properties for the SVG CircularProgress indicator.
 */
export interface CircularProgressProps {
  /**
   * Normalized progress percentage expressed as a number from 0.0 to 1.0.
   */
  readonly normalizedProgress: number;

  /**
   * Outer diameter of the circular progress indicator in pixels.
   * @default 260
   */
  readonly diameterPixels?: number;

  /**
   * Stroke width in pixels for the progress and track arcs.
   * @default 8
   */
  readonly strokeThickness?: number;

  /**
   * Primary stroke color string (CSS color, hex, rgb, or var()).
   * @default "var(--accent-color)"
   */
  readonly strokeColor?: string;

  /**
   * Optional background track color string.
   * @default "rgba(150, 150, 150, 0.14)"
   */
  readonly trackColor?: string;

  /**
   * When true, applies completion color shift (e.g. system red).
   * @default false
   */
  readonly isCompleted?: boolean;

  /**
   * Optional center child content (e.g. digital time display, hero text).
   */
  readonly children?: React.ReactNode;

  /**
   * Optional custom CSS class name.
   */
  readonly className?: string;
}
