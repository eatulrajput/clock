/**
 * ============================================================================
 * File: CircularProgress.tsx
 * Module: Core UI Primitives / CircularProgress
 * Architectural Responsibility:
 *   Resolution-independent SVG circular countdown progress indicator.
 *   Calculates geometry, radius, circumference, and offset dynamically with
 *   hardware-accelerated stroke transitions and center slot embedding.
 *
 * Design Guidelines & HIG Compliance:
 *   - Round stroke linecaps and fluid interpolation avoiding UI stutter.
 *   - Dynamic completion color shift for zero-remaining states.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<CircularProgressProps>
 *   - Zero Null Policy: Clamps progress cleanly between 0.0 and 1.0.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<CircularProgressProps>
 *   - Outputs: Pure SVG component rendering.
 *   - Side Effects: None.
 * ============================================================================
 */

import React from "react";
import { CircularProgressProps } from "./types";
import "./CircularProgress.css";

/**
 * High-performance circular progress ring primitive.
 */
export const CircularProgress: React.FC<CircularProgressProps> = ({
  normalizedProgress,
  diameterPixels = 260,
  strokeThickness = 8,
  strokeColor = "var(--accent-color)",
  trackColor = "rgba(150, 150, 150, 0.14)",
  isCompleted = false,
  children,
  className,
}) => {
  // Clamp progress strictly between 0 and 1 to prevent SVG rendering artifacts
  const clampedProgress = Math.max(0, Math.min(1, normalizedProgress));
  const radius = (diameterPixels - strokeThickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedProgress);
  const activeColor = isCompleted ? "#FF453A" : strokeColor;

  const containerClasses = [
    "ui-circular-progress",
    className ? className : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClasses}
      style={{ width: `${diameterPixels}px`, height: `${diameterPixels}px` }}
      role="progressbar"
      aria-valuenow={Math.round(clampedProgress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        className="ui-circular-progress__svg"
        width={diameterPixels}
        height={diameterPixels}
        viewBox={`0 0 ${diameterPixels} ${diameterPixels}`}
      >
        <circle
          className="ui-circular-progress__track"
          cx={diameterPixels / 2}
          cy={diameterPixels / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeThickness}
        />
        <circle
          className="ui-circular-progress__indicator"
          cx={diameterPixels / 2}
          cy={diameterPixels / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeThickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {children ? (
        <div className="ui-circular-progress__center">{children}</div>
      ) : undefined}
    </div>
  );
};
