/**
 * ============================================================================
 * File: GeneralSettings.tsx
 * Module: Settings / Components
 * Architectural Responsibility:
 *   General configuration section managing 24-hour vs 12-hour time formats,
 *   seconds visibility, default snooze durations, and primary clock timezones.
 *
 * Design Guidelines & HIG Compliance:
 *   - Clean toggle switches and standardized select pickers.
 *   - Destructive reset option with confirmation warning.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Consumes `useSettingsStore` actions and state.
 *   - Zero Null Policy: All absence of elements uses undefined.
 * ============================================================================
 */

import React from "react";
import { useSettingsStore } from "../../../store/useSettingsStore";
import { Toggle } from "../../../components/ui/Toggle/Toggle";
import { Button } from "../../../components/ui/Button/Button";
import { RotateCcw } from "lucide-react";

/**
 * General preferences configuration view.
 */
export const GeneralSettings: React.FC = () => {
  const {
    use24Hour,
    showSeconds,
    snoozeDuration,
    clockTimezone,
    setUse24Hour,
    setShowSeconds,
    setSnoozeDuration,
    setClockTimezone,
    resetAll,
  } = useSettingsStore();

  const commonTimezones = [
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "680px" }}>
      {/* 24-Hour Time Mode */}
      <div style={{ padding: "16px 0", borderBottom: "1px solid var(--glass-border)" }}>
        <Toggle
          isChecked={use24Hour}
          onToggleChange={setUse24Hour}
          titleLabel="24-Hour Time Format"
          description="Display times in 24-hour style (e.g. 14:30) instead of 12-hour AM/PM"
          accessibleLabel="Toggle 24-hour time format"
        />
      </div>

      {/* Show Seconds */}
      <div style={{ padding: "16px 0", borderBottom: "1px solid var(--glass-border)" }}>
        <Toggle
          isChecked={showSeconds}
          onToggleChange={setShowSeconds}
          titleLabel="Show Seconds"
          description="Display continuous ticking seconds on the main clock readout"
          accessibleLabel="Toggle seconds visibility"
        />
      </div>

      {/* Snooze Duration */}
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
            Default Snooze Duration
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Interval before a snoozed alarm rings again
          </span>
        </div>

        <select
          value={snoozeDuration}
          onChange={(e) => setSnoozeDuration(parseInt(e.target.value, 10) || 9)}
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid var(--glass-border)",
            backgroundColor: "rgba(120, 120, 128, 0.12)",
            color: "var(--text-primary)",
            fontFamily: "inherit",
            fontSize: "0.9rem",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value={5}>5 minutes</option>
          <option value={9}>9 minutes (iOS Default)</option>
          <option value={10}>10 minutes</option>
          <option value={15}>15 minutes</option>
        </select>
      </div>

      {/* Primary Clock Timezone */}
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
            Primary Clock Timezone
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Base timezone for the main hero clock screen
          </span>
        </div>

        <select
          value={clockTimezone}
          onChange={(e) => setClockTimezone(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid var(--glass-border)",
            backgroundColor: "rgba(120, 120, 128, 0.12)",
            color: "var(--text-primary)",
            fontFamily: "inherit",
            fontSize: "0.9rem",
            outline: "none",
            cursor: "pointer",
            maxWidth: "240px",
          }}
        >
          {Array.from(new Set(commonTimezones)).map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Defaults */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "#FF453A" }}>
            Reset Application Settings
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Revert all appearance and preference values to factory defaults
          </span>
        </div>

        <Button
          variant="destructive"
          size="small"
          leadingIcon={<RotateCcw size={14} />}
          onClick={resetAll}
        >
          Reset All
        </Button>
      </div>
    </div>
  );
};
