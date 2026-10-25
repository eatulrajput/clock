/**
 * ============================================================================
 * File: GlassPanel.tsx
 * Module: Core UI Primitives / GlassPanel
 * Architectural Responsibility:
 *   Standardized liquid glass surface container enforcing Apple HIG vibrancy,
 *   translucent blur backdrop, border reflection sheen, and depth elevations.
 *
 * Design Guidelines & HIG Compliance:
 *   - CSS backdrop-filter (`blur(30px) saturate(150%)`).
 *   - Ambient gradient sheen along upper perimeter mimicking native macOS panels.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<GlassPanelProps>
 *   - Zero Null Policy: Absence of classes or attributes uses undefined.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<GlassPanelProps>
 *   - Outputs: Container rendering wrapper.
 *   - Side Effects: None. Pure functional component.
 * ============================================================================
 */

import React from "react";
import { GlassPanelProps } from "./types";
import "./GlassPanel.css";

/**
 * Standardized HIG-compliant liquid glass surface container.
 */
export const GlassPanel: React.FC<GlassPanelProps> = ({
  elevation = "elevated",
  borderSheen = true,
  paddingPixels = 24,
  children,
  className,
  style,
  ...restAttributes
}) => {
  const panelClasses = [
    "ui-glass-panel",
    `ui-glass-panel--${elevation}`,
    borderSheen ? "ui-glass-panel--sheen" : "",
    className ? className : "",
  ]
    .filter(Boolean)
    .join(" ");

  const combinedStyles: React.CSSProperties = {
    padding: `${paddingPixels}px`,
    ...style,
  };

  return (
    <div className={panelClasses} style={combinedStyles} {...restAttributes}>
      {children}
    </div>
  );
};
