/**
 * ============================================================================
 * File: TimerRingingOverlay.tsx
 * Module: Timers / Components
 * Architectural Responsibility:
 *   Full-screen high-priority alert overlay presenting completed timer status,
 *   pulsing completion ring, and action triggers (Repeat, Dismiss).
 *
 * Design Guidelines & HIG Compliance:
 *   - High blur liquid glass backdrop (`backdrop-filter: blur(40px)`).
 *   - Pulse keyframe animation and large Apple-style tactile action pills.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<TimerRingingOverlayProps>
 *   - Zero Null Policy: When `ringingTimer` is undefined, returns empty fragment `<></>`.
 *     No null values returned.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<TimerRingingOverlayProps>
 *   - Outputs: Dispatches `onDismiss(timerId)` and `onRepeat(timerId)`.
 *   - Side Effects: None.
 * ============================================================================
 */

import React from "react";
import { createPortal } from "react-dom";
import { ActiveTimerEntity } from "../types";
import { Button } from "../../../components/ui/Button/Button";
import { Bell, RotateCcw, Check } from "lucide-react";

export interface TimerRingingOverlayProps {
  /**
   * The active ringing timer entity, or undefined if no timer is ringing.
   */
  readonly ringingTimer?: ActiveTimerEntity;

  /**
   * Callback fired to silence the alarm and dismiss the overlay.
   */
  readonly onDismiss: (timerId: string) => void;

  /**
   * Callback fired to re-launch the countdown with the same duration.
   */
  readonly onRepeat: (timerId: string) => void;
}

/**
 * Fullscreen alert dialogue presented when a timer reaches zero.
 */
export const TimerRingingOverlay: React.FC<TimerRingingOverlayProps> = ({
  ringingTimer,
  onDismiss,
  onRepeat,
}) => {
  if (!ringingTimer) {
    return <></>;
  }

  const { id, label } = ringingTimer;

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
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        color: "#FFFFFF",
        padding: "24px",
      }}
      role="alertdialog"
      aria-labelledby="ui-timer-ringing-title"
      aria-describedby="ui-timer-ringing-desc"
    >
      {/* Pulsing Completion Circle */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          border: "3px solid #FF453A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "28px",
          backgroundColor: "rgba(255, 69, 58, 0.15)",
          boxShadow: "0 0 32px rgba(255, 69, 58, 0.4)",
        }}
      >
        <Bell size={48} style={{ color: "#FF453A" }} />
      </div>

      <h2
        id="ui-timer-ringing-title"
        style={{
          fontSize: "2rem",
          fontWeight: 600,
          marginBottom: "8px",
          letterSpacing: "-0.02em",
        }}
      >
        Timer Complete
      </h2>

      <p
        id="ui-timer-ringing-desc"
        style={{
          fontSize: "1.2rem",
          color: "rgba(255, 255, 255, 0.7)",
          marginBottom: "40px",
        }}
      >
        {label}
      </p>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "16px" }}>
        <Button
          variant="glass"
          size="large"
          leadingIcon={<RotateCcw size={20} />}
          onClick={() => onRepeat(id)}
          style={{ padding: "0 32px" }}
        >
          Repeat
        </Button>

        <Button
          variant="primary"
          size="large"
          leadingIcon={<Check size={20} />}
          onClick={() => onDismiss(id)}
          style={{ padding: "0 40px" }}
        >
          Dismiss
        </Button>
      </div>
    </div>,
    document.body
  );
};
