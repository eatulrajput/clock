/**
 * ============================================================================
 * File: LapRow.tsx
 * Module: Stopwatch / Components
 * Architectural Responsibility:
 *   Individual split record row displaying lap number, split delta duration,
 *   cumulative time, and real-time fastest/slowest analytical highlighting badges.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple HIG data visualization: Green badge for fastest lap, Red for slowest.
 *   - Monospaced tabular-lining numerals preventing horizontal jitter.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<LapRowProps>
 *   - Zero Null Policy: Analytical classification bound to string literal union.
 * ============================================================================
 */

import React from "react";
import { LapRecord } from "../types";
import { Badge } from "../../../components/ui/Badge/Badge";

export interface LapRowProps {
  /**
   * Immutable lap record entity.
   */
  readonly lap: LapRecord;
}

/**
 * Format milliseconds into MM:SS.cc.
 */
function formatLapSplit(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
}

/**
 * Individual recorded lap split row item.
 */
export const LapRow: React.FC<LapRowProps> = ({ lap }) => {
  const { lapNumber, lapTimeMilliseconds, totalTimeMilliseconds, classification } = lap;
  const splitTimeString = formatLapSplit(lapTimeMilliseconds);
  const totalTimeString = formatLapSplit(totalTimeMilliseconds);

  const rowColor =
    classification === "fastest"
      ? "#30D158"
      : classification === "slowest"
      ? "#FF453A"
      : "var(--text-primary)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid var(--glass-border)",
        fontVariantNumeric: "tabular-nums",
        WebkitFontFeatureSettings: "'tnum'",
        fontFeatureSettings: "'tnum'",
        transition: "background-color 0.15s ease",
      }}
    >
      {/* Lap Sequential Number */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "120px" }}>
        <span style={{ fontSize: "0.95rem", fontWeight: 500, color: rowColor }}>
          Lap {lapNumber}
        </span>

        {classification === "fastest" ? (
          <Badge variant="success" size="small">
            Fastest
          </Badge>
        ) : classification === "slowest" ? (
          <Badge variant="destructive" size="small">
            Slowest
          </Badge>
        ) : undefined}
      </div>

      {/* Individual Split Delta */}
      <span
        style={{
          fontSize: "1.1rem",
          fontWeight: 400,
          color: rowColor,
          letterSpacing: "-0.01em",
        }}
      >
        +{splitTimeString}
      </span>

      {/* Cumulative Overall Time */}
      <span
        style={{
          fontSize: "1rem",
          fontWeight: 300,
          color: "var(--text-secondary)",
          width: "90px",
          textAlign: "right",
        }}
      >
        {totalTimeString}
      </span>
    </div>
  );
};
