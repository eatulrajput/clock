/**
 * ============================================================================
 * File: types.ts
 * Module: Core UI Primitives / GlassPanel
 * Architectural Responsibility:
 *   Type definitions and layout options for the HIG-compliant translucent
 *   GlassPanel container component.
 *
 * Design Guidelines & HIG Compliance:
 *   - Delivers customizable depth elevations (flat, elevated, floating).
 *   - Optional dynamic border reflection sheen.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<GlassPanelProps>
 *   - Zero Null Policy: All optional styling flags default to undefined or booleans.
 * ============================================================================
 */

import React from "react";

/**
 * Depth elevation level controlling shadow radius and border translucency.
 */
export type GlassElevation = "flat" | "elevated" | "floating";

/**
 * Component properties for the GlassPanel primitive.
 */
export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual elevation level.
   * @default "elevated"
   */
  readonly elevation?: GlassElevation;

  /**
   * When true, applies an ambient top-border light reflection sheen.
   * @default true
   */
  readonly borderSheen?: boolean;

  /**
   * Internal padding in pixels.
   * @default 24
   */
  readonly paddingPixels?: number;

  /**
   * Child elements rendered inside the panel.
   */
  readonly children: React.ReactNode;
}
