/**
 * ============================================================================
 * File: LapTable.tsx
 * Module: Stopwatch / Components
 * Architectural Responsibility:
 *   Scrollable history container rendering recorded lap splits with table headers
 *   and fastest/slowest analytical highlighting.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple Liquid Glass translucent panel styling with clear column hierarchy.
 *   - Tabular numerals preventing layout shift during live lap recording.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<LapTableProps>
 *   - Zero Null Policy: When no laps exist, renders clean instruction text.
 * ============================================================================
 */

import React from "react";
import { LapRecord } from "../types";
import { LapRow } from "./LapRow";
import { GlassPanel } from "../../../components/ui/GlassPanel/GlassPanel";

export interface LapTableProps {
  /**
   * Ordered collection of recorded lap splits.
   */
  readonly laps: readonly LapRecord[];
}

/**
 * Scrollable lap splits history table component.
 */
export const LapTable: React.FC<LapTableProps> = ({ laps }) => {
  if (laps.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          color: "var(--text-secondary)",
          fontSize: "0.88rem",
        }}
      >
        Press "Lap" while running to record split times
      </div>
    );
  }

  return (
    <GlassPanel
      elevation="flat"
      paddingPixels={0}
      style={{
        width: "100%",
        maxWidth: "600px",
        maxHeight: "260px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Column Headers */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid var(--glass-border)",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          position: "sticky",
          top: 0,
          backgroundColor: "var(--bg-color)",
          backdropFilter: "var(--glass-blur)",
          WebkitBackdropFilter: "var(--glass-blur)",
          zIndex: 2,
        }}
      >
        <span style={{ width: "120px" }}>Lap</span>
        <span>Split Time</span>
        <span style={{ width: "90px", textAlign: "right" }}>Total</span>
      </div>

      {/* Laps List */}
      <div>
        {laps.map((lap) => (
          <LapRow key={lap.lapNumber} lap={lap} />
        ))}
      </div>
    </GlassPanel>
  );
};
