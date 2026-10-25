/**
 * ============================================================================
 * File: types.ts
 * Module: Layout / Background
 * Architectural Responsibility:
 *   Type definitions and layout options for the dynamic desktop background layer.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<DynamicBackgroundProps>
 *   - Zero Null Policy: Image URL and colors are string or undefined.
 * ============================================================================
 */

import React from "react";
import { BgMode } from "../../../store/useSettingsStore";

export interface DynamicBackgroundProps {
  readonly mode: BgMode;
  readonly solidColorHex: string;
  readonly gradientFromHex: string;
  readonly gradientToHex: string;
  readonly gradientAngleDegrees: number;
  readonly imageUri?: string;
  readonly isTransparencyEnabled: boolean;
  readonly transparencyPercent: number; // 0..100
  readonly isBlurEnabled: boolean;
  readonly blurRadiusPixels: number;
  readonly children: React.ReactNode;
}
