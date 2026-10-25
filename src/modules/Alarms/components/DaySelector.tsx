/**
 * ============================================================================
 * File: DaySelector.tsx
 * Module: Alarms / Components
 * Architectural Responsibility:
 *   Segmented multi-select pill group allowing users to configure recurring
 *   alarm days of the week (Sunday through Saturday).
 *
 * Design Guidelines & HIG Compliance:
 *   - Tactile pill buttons with active selection accent states.
 *   - Displays quick convenience shortcuts ("Weekdays", "Weekends", "Every day").
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<DaySelectorProps>
 *   - Zero Null Policy: Days represented as immutable `readonly WeekDayIndex[]`.
 * ============================================================================
 */

import React from "react";
import { WeekDayIndex } from "../types";

export interface DaySelectorProps {
  /**
   * Currently active selected day indices.
   */
  readonly selectedDays: readonly WeekDayIndex[];

  /**
   * Callback fired when user toggles or changes the selected days.
   */
  readonly onDaysChange: (nextDays: readonly WeekDayIndex[]) => void;
}

export const DAYS_METADATA: readonly { readonly index: WeekDayIndex; readonly shortLabel: string; readonly fullLabel: string }[] = [
  { index: 0, shortLabel: "Sun", fullLabel: "Sunday" },
  { index: 1, shortLabel: "Mon", fullLabel: "Monday" },
  { index: 2, shortLabel: "Tue", fullLabel: "Tuesday" },
  { index: 3, shortLabel: "Wed", fullLabel: "Wednesday" },
  { index: 4, shortLabel: "Thu", fullLabel: "Thursday" },
  { index: 5, shortLabel: "Fri", fullLabel: "Friday" },
  { index: 6, shortLabel: "Sat", fullLabel: "Saturday" },
] as const;

/**
 * Multi-select day-of-week pill group for recurring alarms.
 */
export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onDaysChange,
}) => {
  const toggleDay = (dayIndex: WeekDayIndex) => {
    if (selectedDays.includes(dayIndex)) {
      onDaysChange(selectedDays.filter((index) => index !== dayIndex));
    } else {
      const nextList = [...selectedDays, dayIndex].sort((a, b) => a - b) as WeekDayIndex[];
      onDaysChange(nextList);
    }
  };

  const selectEveryDay = () => onDaysChange([0, 1, 2, 3, 4, 5, 6]);
  const selectWeekdays = () => onDaysChange([1, 2, 3, 4, 5]);
  const selectWeekends = () => onDaysChange([0, 6]);
  const clearSelection = () => onDaysChange([]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-primary)" }}>
          Repeat
        </span>

        {/* Quick Presets */}
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={selectWeekdays}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-color)",
              fontSize: "0.75rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Weekdays
          </button>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>·</span>
          <button
            type="button"
            onClick={selectWeekends}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-color)",
              fontSize: "0.75rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Weekends
          </button>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>·</span>
          <button
            type="button"
            onClick={selectEveryDay}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-color)",
              fontSize: "0.75rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Every day
          </button>
          {selectedDays.length > 0 ? (
            <>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>·</span>
              <button
                type="button"
                onClick={clearSelection}
                style={{
                  background: "none",
                  border: "none",
                  color: "#FF453A",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Once
              </button>
            </>
          ) : undefined}
        </div>
      </div>

      {/* Days Pill Buttons Row */}
      <div style={{ display: "flex", gap: "6px", justifyContent: "space-between" }}>
        {DAYS_METADATA.map((day) => {
          const isSelected = selectedDays.includes(day.index);
          return (
            <button
              key={day.index}
              type="button"
              onClick={() => toggleDay(day.index)}
              style={{
                flex: 1,
                height: "36px",
                borderRadius: "10px",
                border: isSelected
                  ? "1px solid var(--accent-color)"
                  : "1px solid var(--glass-border)",
                backgroundColor: isSelected
                  ? "var(--accent-color)"
                  : "rgba(120, 120, 128, 0.1)",
                color: isSelected ? "#FFFFFF" : "var(--text-primary)",
                fontFamily: "inherit",
                fontSize: "0.82rem",
                fontWeight: isSelected ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              title={day.fullLabel}
            >
              {day.shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};
