/**
 * ============================================================================
 * File: types.ts
 * Module: Core UI Primitives / Button
 * Architectural Responsibility:
 *   Type definitions, variants, sizes, and event contracts for the standardized
 *   Button atomic component. Enforces strict type checking and zero null values.
 *
 * Design Guidelines & HIG Compliance:
 *   - Supports primary, secondary, destructive, ghost, and glass variants.
 *   - Encapsulates layout sizes (small, medium, large, icon).
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<ButtonProps>
 *   - Zero Null Policy: All optional properties default to undefined or explicit booleans.
 * ============================================================================
 */

import React from "react";

/**
 * Visual presentation style for the button, aligned with Apple HIG semantic colors.
 */
export type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost" | "glass";

/**
 * Dimension scale for padding, font size, and hit target.
 */
export type ButtonSize = "small" | "medium" | "large" | "icon";

/**
 * Component properties for the Button primitive.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual aesthetic variant of the button.
   * @default "secondary"
   */
  readonly variant?: ButtonVariant;

  /**
   * Physical size scale of the button.
   * @default "medium"
   */
  readonly size?: ButtonSize;

  /**
   * When true, shows an animated activity indicator spinner and disables interaction.
   * @default false
   */
  readonly isLoading?: boolean;

  /**
   * Optional icon rendered before the button label.
   */
  readonly leadingIcon?: React.ReactNode;

  /**
   * Optional icon rendered after the button label.
   */
  readonly trailingIcon?: React.ReactNode;

  /**
   * Content displayed inside the button body.
   */
  readonly children?: React.ReactNode;
}
