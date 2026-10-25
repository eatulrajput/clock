/**
 * ============================================================================
 * File: AlarmCard.tsx
 * Module: Alarms / Components
 * Architectural Responsibility:
 *   Autonomous alarm item card rendering formatted 12h/24h time display,
 *   recurring days summary, label, snooze indicators, interactive Toggle switch,
 *   and delete button.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple Liquid Glass panel styling with subtle opacity dimming when disabled.
 *   - Tabular numerals typography and accessible toggle mechanics.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<AlarmCardProps>
 *   - Zero Null Policy: Snooze badge conditionally rendered via undefined check.
 * ============================================================================
 */

import React from "react";
import { AlarmEntity } from "../types";
import { GlassPanel } from "../../../components/ui/GlassPanel/GlassPanel";
import { Toggle } from "../../../components/ui/Toggle/Toggle";
import { Button } from "../../../components/ui/Button/Button";
import { Badge } from "../../../components/ui/Badge/Badge";
import { Trash2, BellRing } from "lucide-react";
import { DAYS_METADATA } from "./DaySelector";

export interface AlarmCardProps {
  /**
   * Immutable alarm data entity.
   */
  readonly alarm: AlarmEntity;

  /**
   * When true, formats time in 24-hour style without AM/PM.
   * @default false
   */
  readonly use24HourFormat?: boolean;

  /**
   * Callback fired to toggle the enabled/disabled state of the alarm.
   */
  readonly onToggleAlarm: (alarmId: string, nextActive: boolean) => void;

  /**
   * Callback fired to permanently delete the alarm.
   */
  readonly onDeleteAlarm: (alarmId: string) => void;
}

/**
 * Format "HH:mm" time string into 12-hour or 24-hour visual parts.
 */
function formatTimeDisplay(timeStr: string, use24Hour: boolean) {
  const [hourString, minuteString] = timeStr.split(":");
  const numericHour = parseInt(hourString, 10);

  if (use24Hour) {
    return {
      digits: `${hourString}:${minuteString}`,
      ampm: undefined,
    };
  }

  const ampm = numericHour >= 12 ? "PM" : "AM";
  const twelveHour = numericHour % 12 || 12;

  return {
    digits: `${twelveHour}:${minuteString}`,
    ampm: ampm as "AM" | "PM",
  };
}

/**
 * Compute human-friendly recurring days summary string.
 */
function formatRecurringDaysSummary(days: readonly number[]): string {
  if (days.length === 0) return "Once";
  if (days.length === 7) return "Every day";
  if (days.length === 5 && [1, 2, 3, 4, 5].every((d) => days.includes(d))) return "Weekdays";
  if (days.length === 2 && days.includes(0) && days.includes(6)) return "Weekends";

  return days
    .map((dayIndex) => DAYS_METADATA.find((m) => m.index === dayIndex)?.shortLabel || "")
    .filter(Boolean)
    .join(", ");
}

/**
 * Individual alarm card component with toggle and delete actions.
 */
export const AlarmCard: React.FC<AlarmCardProps> = ({
  alarm,
  use24HourFormat = false,
  onToggleAlarm,
  onDeleteAlarm,
}) => {
  const { id, timeString24Hour, label, isActive, recurringDays, snoozedUntilTimestamp } = alarm;
  const { digits, ampm } = formatTimeDisplay(timeString24Hour, use24HourFormat);
  const daysSummary = formatRecurringDaysSummary(recurringDays);

  const isSnoozed = snoozedUntilTimestamp !== undefined && snoozedUntilTimestamp > Date.now();

  return (
    <GlassPanel
      elevation="flat"
      paddingPixels={20}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        opacity: isActive ? 1 : 0.55,
        transition: "opacity 0.25s ease",
      }}
    >
      {/* Left Column: Time Readout, Label, and Days Summary */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span
            className="text-hero"
            style={{
              fontSize: "2.8rem",
              fontWeight: 300,
              color: "var(--text-primary)",
              lineHeight: 1,
            }}
          >
            {digits}
          </span>
          {ampm ? (
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                letterSpacing: "0.05em",
              }}
            >
              {ampm}
            </span>
          ) : undefined}

          {isSnoozed ? (
            <Badge variant="warning" size="small" showDot={true}>
              <BellRing size={12} />
              <span>Snoozed</span>
            </Badge>
          ) : undefined}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-primary)" }}>
            {label}
          </span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>·</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            {daysSummary}
          </span>
        </div>
      </div>

      {/* Right Column: Toggle Switch and Delete Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Toggle
          isChecked={isActive}
          onToggleChange={(nextActive) => onToggleAlarm(id, nextActive)}
          accessibleLabel={`Toggle alarm ${label} at ${timeString24Hour}`}
        />

        <Button
          variant="ghost"
          size="icon"
          leadingIcon={<Trash2 size={16} />}
          onClick={() => onDeleteAlarm(id)}
          title="Delete alarm"
          style={{ color: "var(--text-secondary)" }}
        />
      </div>
    </GlassPanel>
  );
};
