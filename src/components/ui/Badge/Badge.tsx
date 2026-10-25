/**
 * ============================================================================
 * File: Badge.tsx
 * Module: Core UI Primitives / Badge
 * Architectural Responsibility:
 *   Compact semantic status pill component for active counters, fastest/slowest
 *   lap indicators, and schedule notifications.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple HIG semantic color tokens for success, warning, destructive, and accent.
 *   - Optional leading pulse/status dot.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<BadgeProps>
 *   - Zero Null Policy: Absence of dot or children resolves via undefined guards.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<BadgeProps>
 *   - Outputs: Pure rendering component.
 *   - Side Effects: None.
 * ============================================================================
 */

import React from "react";
import { BadgeProps } from "./types";
import "./Badge.css";

/**
 * Compact semantic status indicator badge.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "medium",
  showDot = false,
  children,
  className,
}) => {
  const badgeClasses = [
    "ui-badge",
    `ui-badge--${variant}`,
    `ui-badge--${size}`,
    className ? className : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={badgeClasses}>
      {showDot ? <span className="ui-badge__dot" aria-hidden="true" /> : undefined}
      <span className="ui-badge__content">{children}</span>
    </span>
  );
};
