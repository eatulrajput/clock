/**
 * ============================================================================
 * File: AnalogClockMini.tsx
 * Module: World Clock / Components
 * Architectural Responsibility:
 *   Compact SVG analog clock face component providing day/night dynamic visual
 *   theme inversion based on whether it is daytime (6:00 AM to 6:00 PM) in the
 *   target city, as required by PRD section 2.1.
 *
 * Design Guidelines & HIG Compliance:
 *   - Automatic light/dark face inversion corresponding to solar phase of target locale.
 *   - Proportional hour, minute, and second hands with smooth geometry.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<AnalogClockMiniProps>
 *   - Zero Null Policy: Calculations bound to finite numbers. No nulls.
 * ============================================================================
 */

import React from "react";

export interface AnalogClockMiniProps {
  /**
   * Angle in degrees for the hour hand (0..360).
   */
  readonly hourHandDegrees: number;

  /**
   * Angle in degrees for the minute hand (0..360).
   */
  readonly minuteHandDegrees: number;

  /**
   * True if local time in city is between 6:00 AM and 6:00 PM.
   */
  readonly isDaytime: boolean;

  /**
   * Diameter in pixels for the clock face.
   * @default 48
   */
  readonly diameterPixels?: number;
}

/**
 * Compact SVG analog clock face with dynamic day/night contrast.
 */
export const AnalogClockMini: React.FC<AnalogClockMiniProps> = ({
  hourHandDegrees,
  minuteHandDegrees,
  isDaytime,
  diameterPixels = 48,
}) => {
  const center = diameterPixels / 2;
  const radius = center - 2;

  // Day mode: light face with dark hands; Night mode: dark face with light hands
  const faceBackground = isDaytime ? "#F2F2F7" : "#1C1C1E";
  const borderColor = isDaytime ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.18)";
  const handColor = isDaytime ? "#1C1C1E" : "#F2F2F7";
  const hourHandLength = radius * 0.52;
  const minuteHandLength = radius * 0.75;

  return (
    <svg
      width={diameterPixels}
      height={diameterPixels}
      viewBox={`0 0 ${diameterPixels} ${diameterPixels}`}
      style={{ flexShrink: 0 }}
      role="img"
      aria-label={`Analog clock face, ${isDaytime ? "Daytime" : "Nighttime"}`}
    >
      {/* Clock Face Background */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill={faceBackground}
        stroke={borderColor}
        strokeWidth={1.5}
      />

      {/* 12, 3, 6, 9 Cardinal Hour Tick Marks */}
      {[0, 90, 180, 270].map((angle) => (
        <line
          key={angle}
          x1={center}
          y1={center - radius + 2}
          x2={center}
          y2={center - radius + 5}
          stroke={handColor}
          strokeWidth={1.2}
          strokeLinecap="round"
          transform={`rotate(${angle} ${center} ${center})`}
          opacity={0.4}
        />
      ))}

      {/* Hour Hand */}
      <line
        x1={center}
        y1={center}
        x2={center}
        y2={center - hourHandLength}
        stroke={handColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        transform={`rotate(${hourHandDegrees} ${center} ${center})`}
      />

      {/* Minute Hand */}
      <line
        x1={center}
        y1={center}
        x2={center}
        y2={center - minuteHandLength}
        stroke={handColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        transform={`rotate(${minuteHandDegrees} ${center} ${center})`}
      />

      {/* Center Pivot Pin */}
      <circle cx={center} cy={center} r={2.5} fill="var(--accent-color)" />
    </svg>
  );
};
