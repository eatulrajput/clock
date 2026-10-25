/**
 * ============================================================================
 * File: ColorPickerRow.tsx
 * Module: Settings / Components
 * Architectural Responsibility:
 *   Hex color picker control featuring color input preview and quick-select
 *   Apple HIG palette swatches.
 *
 * Design Guidelines & HIG Compliance:
 *   - Circular swatch preview with subtle border sheen.
 *   - Quick-palette presets for dark mode backgrounds.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<ColorPickerRowProps>
 *   - Zero Null Policy: Swatches are immutable strings.
 * ============================================================================
 */

import React from "react";

export interface ColorPickerRowProps {
  /**
   * Title label for the color setting.
   */
  readonly label: string;

  /**
   * Optional helper description.
   */
  readonly description?: string;

  /**
   * Current selected hex color value (e.g., "#1e1e1e").
   */
  readonly hexColor: string;

  /**
   * Callback fired when color changes.
   */
  readonly onColorChange: (nextHexColor: string) => void;

  /**
   * Optional preset color swatch hex values.
   */
  readonly presetSwatches?: readonly string[];
}

const DEFAULT_SWATCHES: readonly string[] = [
  "#1e1e1e",
  "#0f172a",
  "#121212",
  "#1e1b4b",
  "#064e3b",
  "#31103f",
] as const;

/**
 * Standard color input row with preset swatches.
 */
export const ColorPickerRow: React.FC<ColorPickerRowProps> = ({
  label,
  description,
  hexColor,
  onColorChange,
  presetSwatches = DEFAULT_SWATCHES,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        borderBottom: "1px solid var(--glass-border)",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)" }}>
          {label}
        </span>
        {description ? (
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            {description}
          </span>
        ) : undefined}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Swatches */}
        <div style={{ display: "flex", gap: "6px" }}>
          {presetSwatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => onColorChange(swatch)}
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                backgroundColor: swatch,
                border:
                  hexColor.toLowerCase() === swatch.toLowerCase()
                    ? "2px solid var(--accent-color)"
                    : "1.5px solid rgba(255, 255, 255, 0.2)",
                cursor: "pointer",
                padding: 0,
                transition: "transform 0.15s ease",
              }}
              title={swatch}
            />
          ))}
        </div>

        {/* Color Input */}
        <label
          style={{
            position: "relative",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: hexColor,
            border: "1.5px solid var(--glass-border)",
            cursor: "pointer",
            overflow: "hidden",
            display: "inline-block",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
          title="Pick custom color"
        >
          <input
            type="color"
            value={hexColor}
            onChange={(e) => onColorChange(e.target.value)}
            style={{
              position: "absolute",
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
        </label>
      </div>
    </div>
  );
};
