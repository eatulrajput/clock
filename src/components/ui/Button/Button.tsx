/**
 * ============================================================================
 * File: Button.tsx
 * Module: Core UI Primitives / Button
 * Architectural Responsibility:
 *   Universal tactile button component delivering Apple HIG-compliant spring
 *   press animations, focus accessibility rings, loading spinners, and semantic
 *   color variant management.
 *
 * Design Guidelines & HIG Compliance:
 *   - Micro-interaction: Tactile scale reduction to 0.96 upon pointer engagement.
 *   - ARIA support: `aria-busy` assigned automatically during `isLoading`.
 *   - WCAG 2.1 AA focus rings with high contrast outline.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<ButtonProps>
 *   - Zero Null Policy: Absence of leading/trailing icons or children resolves
 *     to `undefined`. No `null` returned or accepted.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<ButtonProps>
 *   - Outputs: Dispatches native React pointer & keyboard click events.
 *   - Side Effects: None. Pure functional component.
 * ============================================================================
 */

import React from "react";
import { ButtonProps } from "./types";
import "./Button.css";

/**
 * Tactical spring-animated button component.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "secondary",
  size = "medium",
  isLoading = false,
  leadingIcon,
  trailingIcon,
  disabled,
  children,
  className,
  type = "button",
  ...restAttributes
}) => {
  const isButtonDisabled = disabled || isLoading;

  const classNames = [
    "ui-button",
    `ui-button--${variant}`,
    `ui-button--${size}`,
    isLoading ? "ui-button--loading" : "",
    className ? className : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classNames}
      disabled={isButtonDisabled}
      aria-busy={isLoading}
      {...restAttributes}
    >
      {isLoading ? (
        <span className="ui-button__spinner" aria-label="Loading" />
      ) : (
        <>
          {leadingIcon ? <span className="ui-button__icon-leading">{leadingIcon}</span> : undefined}
          {children ? <span className="ui-button__content">{children}</span> : undefined}
          {trailingIcon ? <span className="ui-button__icon-trailing">{trailingIcon}</span> : undefined}
        </>
      )}
    </button>
  );
};
