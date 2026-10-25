/**
 * ============================================================================
 * File: AppearanceSettings.tsx
 * Module: Settings / Components
 * Architectural Responsibility:
 *   Appearance settings section allowing users to configure solid/gradient/image
 *   desktop background styles, glass transparency, and backdrop blur strength.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple Liquid Glass translucency controls with live slider feedback.
 *   - Segmented buttons for background presentation modes.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Consumes `useSettingsStore` actions and state.
 *   - Zero Null Policy: Numeric sliders clamped to explicit positive bounds.
 * ============================================================================
 */

import React from "react";
import { useSettingsStore, BgMode } from "../../../store/useSettingsStore";
import { Toggle } from "../../../components/ui/Toggle/Toggle";
import { Input } from "../../../components/ui/Input/Input";
import { ColorPickerRow } from "./ColorPickerRow";
import { Image as ImageIcon } from "lucide-react";

/**
 * Appearance and Liquid Glass customization view.
 */
export const AppearanceSettings: React.FC = () => {
  const {
    bgMode,
    bgColor,
    gradientFrom,
    gradientTo,
    gradientAngle,
    bgImageUrl,
    transparencyEnabled,
    transparencyAmount,
    blurEnabled,
    blurAmount,
    setBgMode,
    setBgColor,
    setGradientFrom,
    setGradientTo,
    setGradientAngle,
    setBgImageUrl,
    setTransparencyEnabled,
    setTransparencyAmount,
    setBlurEnabled,
    setBlurAmount,
  } = useSettingsStore();

  const modes: readonly { readonly id: BgMode; readonly label: string }[] = [
    { id: "solid", label: "Solid" },
    { id: "gradient", label: "Gradient" },
    { id: "image", label: "Image" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "680px" }}>
      {/* Background Mode Selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)" }}>
            Background Mode
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Choose between solid color, gradient, or custom wallpaper
          </span>
        </div>

        <div
          style={{
            display: "inline-flex",
            backgroundColor: "rgba(120, 120, 128, 0.12)",
            borderRadius: "10px",
            padding: "3px",
            gap: "4px",
          }}
        >
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setBgMode(mode.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: bgMode === mode.id ? "var(--accent-color)" : "transparent",
                color: bgMode === mode.id ? "#FFFFFF" : "var(--text-secondary)",
                fontFamily: "inherit",
                fontSize: "0.82rem",
                fontWeight: bgMode === mode.id ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode-Specific Options */}
      {bgMode === "solid" ? (
        <ColorPickerRow
          label="Background Color"
          description="Solid dark mode theme color"
          hexColor={bgColor}
          onColorChange={setBgColor}
        />
      ) : bgMode === "gradient" ? (
        <>
          <ColorPickerRow
            label="Gradient Start Color"
            description="Primary gradient start tone"
            hexColor={gradientFrom}
            onColorChange={setGradientFrom}
          />
          <ColorPickerRow
            label="Gradient End Color"
            description="Secondary gradient end tone"
            hexColor={gradientTo}
            onColorChange={setGradientTo}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 0",
              borderBottom: "1px solid var(--glass-border)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)" }}>
                Gradient Angle
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                {gradientAngle}° degrees
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={gradientAngle}
              onChange={(e) => setGradientAngle(parseInt(e.target.value, 10) || 0)}
              style={{ width: "160px", accentColor: "var(--accent-color)" }}
            />
          </div>
        </>
      ) : (
        <div style={{ padding: "12px 0", borderBottom: "1px solid var(--glass-border)" }}>
          <Input
            label="Wallpaper Image URL"
            placeholder="https://example.com/wallpaper.jpg"
            value={bgImageUrl}
            onChange={(e) => setBgImageUrl(e.target.value)}
            leadingIcon={<ImageIcon size={16} />}
            showClearButton={true}
            onClear={() => setBgImageUrl("")}
          />
        </div>
      )}

      {/* Liquid Glass Transparency */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <Toggle
          isChecked={transparencyEnabled}
          onToggleChange={setTransparencyEnabled}
          titleLabel="Glass Transparency"
          description="Enable translucent background opacity"
          accessibleLabel="Toggle glass transparency"
        />

        {transparencyEnabled ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", width: "36px" }}>
              {transparencyAmount}%
            </span>
            <input
              type="range"
              min={10}
              max={100}
              value={transparencyAmount}
              onChange={(e) => setTransparencyAmount(parseInt(e.target.value, 10) || 65)}
              style={{ width: "140px", accentColor: "var(--accent-color)" }}
            />
          </div>
        ) : undefined}
      </div>

      {/* Backdrop Blur */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <Toggle
          isChecked={blurEnabled}
          onToggleChange={setBlurEnabled}
          titleLabel="Backdrop Blur Effect"
          description="Apply GPU hardware-accelerated frost blur"
          accessibleLabel="Toggle backdrop blur"
        />

        {blurEnabled ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", width: "36px" }}>
              {blurAmount}px
            </span>
            <input
              type="range"
              min={10}
              max={150}
              value={blurAmount}
              onChange={(e) => setBlurAmount(parseInt(e.target.value, 10) || 50)}
              style={{ width: "140px", accentColor: "var(--accent-color)" }}
            />
          </div>
        ) : undefined}
      </div>
    </div>
  );
};
