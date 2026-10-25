/**
 * ============================================================================
 * File: AddAlarmModal.tsx
 * Module: Alarms / Components
 * Architectural Responsibility:
 *   Modal dialogue allowing users to schedule new alarms, pick trigger times,
 *   specify recurring weekday schedules, and assign labels.
 *
 * Design Guidelines & HIG Compliance:
 *   - Translucent liquid glass modal styling (`backdrop-filter: blur(20px)`).
 *   - Intuitive numeric time picker with AM/PM selector and DaySelector integration.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<AddAlarmModalProps>
 *   - Zero Null Policy: All absence of elements uses undefined.
 * ============================================================================
 */

import React, { useState, useCallback } from "react";
import { Modal } from "../../../components/ui/Modal/Modal";
import { Input } from "../../../components/ui/Input/Input";
import { Button } from "../../../components/ui/Button/Button";
import { DaySelector } from "./DaySelector";
import { CreateAlarmInput, WeekDayIndex } from "../types";
import { Bell, Tag } from "lucide-react";

export interface AddAlarmModalProps {
  /**
   * Visibility flag controlling modal open state.
   */
  readonly isOpen: boolean;

  /**
   * When true, defaults to 24-hour time input layout.
   * @default false
   */
  readonly use24HourFormat?: boolean;

  /**
   * Callback fired to dismiss the modal dialogue.
   */
  readonly onCloseRequest: () => void;

  /**
   * Callback fired when a new alarm is saved.
   */
  readonly onSaveAlarm: (input: CreateAlarmInput) => void;
}

/**
 * Creation dialogue modal for scheduled alarms.
 */
export const AddAlarmModal: React.FC<AddAlarmModalProps> = ({
  isOpen,
  use24HourFormat = false,
  onCloseRequest,
  onSaveAlarm,
}) => {
  const [hour, setHour] = useState("07");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const [label, setLabel] = useState("Alarm");
  const [recurringDays, setRecurringDays] = useState<readonly WeekDayIndex[]>([]);

  const resetForm = useCallback(() => {
    setHour("07");
    setMinute("00");
    setAmpm("AM");
    setLabel("Alarm");
    setRecurringDays([]);
  }, []);

  const handleSave = () => {
    let numericHour = parseInt(hour, 10);
    if (isNaN(numericHour)) numericHour = 7;

    if (!use24HourFormat) {
      if (ampm === "PM" && numericHour < 12) {
        numericHour += 12;
      } else if (ampm === "AM" && numericHour === 12) {
        numericHour = 0;
      }
    }

    const numericMinute = Math.max(0, Math.min(59, parseInt(minute, 10) || 0));
    const formattedTimeString = `${numericHour.toString().padStart(2, "0")}:${numericMinute
      .toString()
      .padStart(2, "0")}`;

    onSaveAlarm({
      timeString24Hour: formattedTimeString,
      label: label.trim().length > 0 ? label.trim() : "Alarm",
      recurringDays,
      soundThemeName: "bell",
      isActive: true,
    });

    resetForm();
    onCloseRequest();
  };

  return (
    <Modal
      isOpen={isOpen}
      onCloseRequest={onCloseRequest}
      title="Add Alarm"
      description="Configure time, recurring schedule, and title"
      maxWidthPixels={460}
      footerActions={
        <>
          <Button variant="ghost" onClick={onCloseRequest}>
            Cancel
          </Button>
          <Button
            variant="primary"
            leadingIcon={<Bell size={16} />}
            onClick={handleSave}
          >
            Save Alarm
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        {/* Time Selector Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "16px 0",
          }}
        >
          {/* Hour input */}
          <input
            type="number"
            min={use24HourFormat ? 0 : 1}
            max={use24HourFormat ? 23 : 12}
            value={hour}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= 2) setHour(val);
            }}
            onBlur={() => {
              const num = parseInt(hour, 10);
              const maxVal = use24HourFormat ? 23 : 12;
              const minVal = use24HourFormat ? 0 : 1;
              const clamped = isNaN(num) ? minVal : Math.max(minVal, Math.min(maxVal, num));
              setHour(clamped.toString().padStart(2, "0"));
            }}
            style={{
              width: "80px",
              height: "70px",
              borderRadius: "16px",
              border: "1.5px solid var(--glass-border)",
              backgroundColor: "rgba(120, 120, 128, 0.12)",
              color: "var(--text-primary)",
              fontSize: "2.6rem",
              fontWeight: 300,
              textAlign: "center",
              fontFamily: "inherit",
              outline: "none",
            }}
          />

          <span style={{ fontSize: "2.6rem", fontWeight: 200, color: "var(--text-secondary)" }}>
            :
          </span>

          {/* Minute input */}
          <input
            type="number"
            min={0}
            max={59}
            value={minute}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= 2) setMinute(val);
            }}
            onBlur={() => {
              const num = parseInt(minute, 10);
              const clamped = isNaN(num) ? 0 : Math.max(0, Math.min(59, num));
              setMinute(clamped.toString().padStart(2, "0"));
            }}
            style={{
              width: "80px",
              height: "70px",
              borderRadius: "16px",
              border: "1.5px solid var(--glass-border)",
              backgroundColor: "rgba(120, 120, 128, 0.12)",
              color: "var(--text-primary)",
              fontSize: "2.6rem",
              fontWeight: 300,
              textAlign: "center",
              fontFamily: "inherit",
              outline: "none",
            }}
          />

          {/* AM / PM Segmented Switch */}
          {!use24HourFormat ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                marginLeft: "8px",
              }}
            >
              <button
                type="button"
                onClick={() => setAmpm("AM")}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: ampm === "AM" ? "1px solid var(--accent-color)" : "1px solid transparent",
                  backgroundColor: ampm === "AM" ? "var(--accent-color)" : "rgba(120, 120, 128, 0.1)",
                  color: ampm === "AM" ? "#FFFFFF" : "var(--text-secondary)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setAmpm("PM")}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: ampm === "PM" ? "1px solid var(--accent-color)" : "1px solid transparent",
                  backgroundColor: ampm === "PM" ? "var(--accent-color)" : "rgba(120, 120, 128, 0.1)",
                  color: ampm === "PM" ? "#FFFFFF" : "var(--text-secondary)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                PM
              </button>
            </div>
          ) : undefined}
        </div>

        {/* Label Field */}
        <Input
          label="Alarm Label"
          placeholder="e.g. Wake Up, Medication, Standup"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          leadingIcon={<Tag size={16} />}
          showClearButton={true}
          onClear={() => setLabel("")}
          maxLength={32}
        />

        {/* Recurring Day Selector */}
        <DaySelector
          selectedDays={recurringDays}
          onDaysChange={setRecurringDays}
        />
      </div>
    </Modal>
  );
};
