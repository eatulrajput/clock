/**
 * ============================================================================
 * File: DynamicBackground.tsx
 * Module: Layout / Background
 * Architectural Responsibility:
 *   Desktop background container that dynamically renders solid color, linear gradient,
 *   or wallpaper image layers along with liquid glass backdrop filters and opacity.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple Liquid Glass translucency and saturation effects.
 *   - Graceful fallback for malformed hex codes and missing images.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<DynamicBackgroundProps>
 *   - Zero Null Policy: All absence of elements uses undefined.
 * ============================================================================
 */

import React from "react";
import { DynamicBackgroundProps } from "./types";

/**
 * Convert #RRGGBB hex string to rgba with target opacity.
 */
function hexToRgba(hex: string, opacity: number): string {
  try {
    const cleaned = hex.replace("#", "");
    if (cleaned.length !== 6) return `rgba(30, 30, 30, ${opacity})`;
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } catch {
    return `rgba(30, 30, 30, ${opacity})`;
  }
}

/**
 * Dynamic background surface layer wrapper.
 */
export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  mode,
  solidColorHex,
  gradientFromHex,
  gradientToHex,
  gradientAngleDegrees,
  imageUri,
  isTransparencyEnabled,
  transparencyPercent,
  isBlurEnabled,
  blurRadiusPixels,
  children,
}) => {
  const normalizedOpacity = isTransparencyEnabled ? transparencyPercent / 100 : 1;

  let backgroundValue: string;
  if (mode === "gradient") {
    backgroundValue = `linear-gradient(${gradientAngleDegrees}deg, ${hexToRgba(
      gradientFromHex,
      normalizedOpacity
    )}, ${hexToRgba(gradientToHex, normalizedOpacity)})`;
  } else if (mode === "image" && imageUri && imageUri.trim().length > 0) {
    backgroundValue = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("${imageUri}") center / cover no-repeat`;
  } else {
    backgroundValue = hexToRgba(solidColorHex, normalizedOpacity);
  }

  const backdropFilterValue = isBlurEnabled
    ? `blur(${blurRadiusPixels}px) saturate(150%)`
    : undefined;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: backgroundValue,
        backdropFilter: backdropFilterValue,
        WebkitBackdropFilter: backdropFilterValue,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};
