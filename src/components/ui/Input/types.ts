/**
 * ============================================================================
 * File: types.ts
 * Module: Core UI Primitives / Input
 * Architectural Responsibility:
 *   Type definitions, slots, validation states, and event contracts for the
 *   typed Input primitive component.
 *
 * Design Guidelines & HIG Compliance:
 *   - Glass inset background with high-contrast active focus ring.
 *   - Slots for leading/trailing icons and optional clear button.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<InputProps>
 *   - Zero Null Policy: Error messages and icon slots default to undefined.
 * ============================================================================
 */

import React from "react";

/**
 * Component properties for the Input primitive.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional primary text label positioned above the input field.
   */
  readonly label?: string;

  /**
   * Optional error message string; when present, highlights the input border in red.
   */
  readonly errorMessage?: string;

  /**
   * Optional helper or instruction text positioned below the input.
   */
  readonly helperText?: string;

  /**
   * Optional icon rendered at the start of the input container.
   */
  readonly leadingIcon?: React.ReactNode;

  /**
   * Optional icon rendered at the end of the input container.
   */
  readonly trailingIcon?: React.ReactNode;

  /**
   * When true and input has text, shows an interactive clear icon button.
   * @default false
   */
  readonly showClearButton?: boolean;

  /**
   * Callback fired when clear button is clicked.
   */
  readonly onClear?: () => void;
}
