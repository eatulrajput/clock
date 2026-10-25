/**
 * ============================================================================
 * File: AlarmRingerOverlay.tsx
 * Module: Alarms / Components
 * Architectural Responsibility:
 *   Full-screen high-priority alert overlay presented when a scheduled alarm rings.
 *   Provides immediate visual notification, animated bell icon, and tactile
 *   action buttons (Snooze for 9 minutes, Dismiss).
 *
 * Design Guidelines & HIG Compliance:
 *   - High blur liquid glass backdrop overlay (`backdrop-filter: blur(40px)`).
 *   - Supports Apple-native 9-minute snooze cycle and dismissal mechanics.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<AlarmRingerOverlayProps>
 *   - Zero Null Policy: When `activeAlarm` is undefined, returns empty fragment `<></>`.
 *     No null values returned.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<AlarmRingerOverlayProps>
 *   - Outputs: Dispatches `onSnooze(alarmId, minutes)` and `onDismiss(alarmId)`.
 *   - Side Effects: None. Pure presentation component.
 * ============================================================================
 */

import React from "react";
import { createPortal } from "react-dom";
import { AlarmEntity } from "../types";
import { Button } from "../../../components/ui/Button/Button";
import { BellRing, Moon, Check } from "lucide-react";

export interface AlarmRingerOverlayProps {
  /**
   * The currently sounding alarm entity, or undefined if no alarm is ringing.
   */
  readonly activeAlarm?: AlarmEntity;

  /**
   * When true, formats time in 24-hour style.
   * @default false
   */
  readonly use24HourFormat?: boolean;

  /**
   * Callback fired to snooze the alarm.
   */
  readonly onSnooze: (alarmId: string, snoozeMinutes?: number) => void;

  /**
   * Callback fired to dismiss and silence the alarm.
   */
  readonly onDismiss: (alarmId: string) => void;
}

/**
 * Format 24h string into 12h display string.
 */
function formatTime12h(timeStr: string, use24Hour: boolean): string {
  if (use24Hour) return timeStr;
  const [h, m] = timeStr.split(":");
  const numericHour = parseInt(h, 10);
  const ampm = numericHour >= 12 ? "PM" : "AM";
  const twelveHour = numericHour % 12 || 12;
  return `${twelveHour}:${m} ${ampm}`;
}

/**
 * Fullscreen alarm ringing alert dialog.
 */
export const AlarmRingerOverlay: React.FC<AlarmRingerOverlayProps> = ({
  activeAlarm,
  use24HourFormat = false,
  onSnooze,
  onDismiss,
}) => {
  if (!activeAlarm) {
    return <></>;
  }

  const { id, timeString24Hour, label } = activeAlarm;
  const timeDisplay = formatTime12h(timeString24Hour, use24HourFormat);

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.78)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        color: "#FFFFFF",
        padding: "24px",
      }}
      role="alertdialog"
      aria-labelledby="ui-alarm-title"
      aria-describedby="ui-alarm-label"
    >
      {/* Animated Pulsing Bell */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "rgba(10, 132, 255, 0.18)",
          border: "3px solid var(--accent-color)",
          boxShadow: "0 0 36px rgba(10, 132, 255, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "32px",
        }}
      >
        <BellRing size={56} style={{ color: "var(--accent-color)" }} />
      </div>

      <h1
        id="ui-alarm-title"
        className="text-hero"
        style={{
          fontSize: "4.5rem",
          fontWeight: 300,
          marginBottom: "12px",
          letterSpacing: "-0.03em",
        }}
      >
        {timeDisplay}
      </h1>

      <p
        id="ui-alarm-label"
        style={{
          fontSize: "1.4rem",
          fontWeight: 500,
          color: "rgba(255, 255, 255, 0.75)",
          marginBottom: "48px",
        }}
      >
        {label}
      </p>

      {/* Action Buttons: Snooze & Dismiss */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Button
          variant="glass"
          size="large"
          leadingIcon={<Moon size={20} />}
          onClick={() => onSnooze(id, 9)}
          style={{ padding: "0 36px" }}
        >
          Snooze (9 min)
        </Button>

        <Button
          variant="primary"
          size="large"
          leadingIcon={<Check size={20} />}
          onClick={() => onDismiss(id)}
          style={{ padding: "0 44px" }}
        >
          Dismiss
        </Button>
      </div>
    </div>,
    document.body
  );
};
