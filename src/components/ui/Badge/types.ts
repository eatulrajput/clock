/**
 * ============================================================================
 * File: types.ts
 * Module: Core UI Primitives / Badge
 * Architectural Responsibility:
 *   Type definitions, variants, and sizes for the Badge indicator primitive.
 *
 * Design Guidelines & HIG Compliance:
 *   - Semantic intent variants: "neutral", "accent", "success", "warning", "destructive".
 *   - Compact pill layout with optional leading dot indicator.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<BadgeProps>
 *   - Zero Null Policy: All optional flags default to boolean or undefined.
 * ============================================================================
 */

import React from "react";

/**
 * Visual semantic intent of the badge.
 */
export type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "destructive";

/**
 * Scale sizing for the badge.
 */
export type BadgeSize = "small" | "medium";

/**
 * Component properties for the Badge primitive.
 */
export interface BadgeProps {
  /**
   * Semantic color variant of the badge.
   * @default "neutral"
   */
  readonly variant?: BadgeVariant;

  /**
   * Dimension scale of the badge.
   * @default "medium"
   */
  readonly size?: BadgeSize;

  /**
   * When true, displays an illuminated circular dot before the content.
   * @default false
   */
  readonly showDot?: boolean;

  /**
   * Content displayed within the badge body.
   */
  readonly children: React.ReactNode;

  /**
   * Optional custom CSS class name.
   */
  readonly className?: string;
}
