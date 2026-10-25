/**
 * ============================================================================
 * File: AddTimerModal.tsx
 * Module: Timers / Components
 * Architectural Responsibility:
 *   Creation dialogue modal allowing users to configure custom countdown durations
 *   via the 3D DrumTimePicker roller, choose semantic tag labels, and start timers.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple-style 3D cylindrical drum wheels for hours, minutes, and seconds.
 *   - Quick increment pill chips (+1m, +5m, +10m, +15m) and tag suggestions.
 *   - Keyboard shortcut support: Pressing Enter starts the timer.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<AddTimerModalProps>
 *   - Zero Null Policy: All absence of elements uses undefined.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<AddTimerModalProps>
 *   - Outputs: Dispatches `onCreateTimer(durationMs, label, autoStart)`.
 *   - Side Effects: Listens for Enter key while dialog is open.
 * ============================================================================
 */

import React, { useState, useCallback, useEffect } from "react";
import { Modal } from "../../../components/ui/Modal/Modal";
import { DrumTimePicker } from "../../../components/ui/DrumPicker/DrumPicker";
import { Input } from "../../../components/ui/Input/Input";
import { Button } from "../../../components/ui/Button/Button";
import { Play, Plus, RotateCcw, Tag } from "lucide-react";

export interface AddTimerModalProps {
  /**
   * Visibility flag controlling modal display state.
   */
  readonly isOpen: boolean;

  /**
   * Callback fired to dismiss the modal dialogue.
   */
  readonly onCloseRequest: () => void;

  /**
   * Callback fired when timer duration is submitted.
   * @param durationMilliseconds Total duration in ms.
   * @param label Optional custom title string.
   * @param autoStart When true, immediately starts running.
   */
  readonly onCreateTimer: (
    durationMilliseconds: number,
    label?: string,
    autoStart?: boolean
  ) => void;
}

const QUICK_TAGS = ["Focus", "Pomodoro", "Tea", "Workout", "Cooking", "Nap"] as const;

/**
 * Modal dialogue for creating customized countdown timers.
 */
export const AddTimerModal: React.FC<AddTimerModalProps> = ({
  isOpen,
  onCloseRequest,
  onCreateTimer,
}) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [label, setLabel] = useState("");

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const isValidDuration = totalSeconds > 0;

  const resetForm = useCallback(() => {
    setHours(0);
    setMinutes(5);
    setSeconds(0);
    setLabel("");
  }, []);

  const handleCreate = useCallback(
    (autoStart: boolean) => {
      if (!isValidDuration) return;
      const durationMs = totalSeconds * 1000;
      onCreateTimer(durationMs, label.trim().length > 0 ? label.trim() : undefined, autoStart);
      resetForm();
      onCloseRequest();
    },
    [isValidDuration, totalSeconds, label, onCreateTimer, resetForm, onCloseRequest]
  );

  const addMinutes = (additionalMinutes: number) => {
    const updatedTotalSec = Math.min(23 * 3600 + 59 * 60 + 59, totalSeconds + additionalMinutes * 60);
    setHours(Math.floor(updatedTotalSec / 3600));
    setMinutes(Math.floor((updatedTotalSec % 3600) / 60));
    setSeconds(updatedTotalSec % 60);
  };

  // Keyboard shortcut: Press Enter to create & launch
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && isValidDuration) {
        event.preventDefault();
        handleCreate(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isValidDuration, handleCreate]);

  return (
    <Modal
      isOpen={isOpen}
      onCloseRequest={onCloseRequest}
      title="Create New Timer"
      description="Set hours, minutes, and seconds using the rollers below"
      maxWidthPixels={520}
      footerActions={
        <>
          <Button variant="ghost" onClick={onCloseRequest}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            disabled={!isValidDuration}
            onClick={() => handleCreate(false)}
          >
            Create
          </Button>
          <Button
            variant="primary"
            disabled={!isValidDuration}
            leadingIcon={<Play size={16} fill="currentColor" />}
            onClick={() => handleCreate(true)}
          >
            Start Timer
          </Button>
        </>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* 3D Drum Time Picker */}
        <DrumTimePicker
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          onTimeChange={(h, m, s) => {
            setHours(h);
            setMinutes(m);
            setSeconds(s);
          }}
        />

        {/* Quick Increment Chips */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {[1, 5, 10, 15].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => addMinutes(mins)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 12px",
                borderRadius: "16px",
                border: "1px solid var(--glass-border)",
                backgroundColor: "rgba(120, 120, 128, 0.1)",
                color: "var(--text-primary)",
                fontFamily: "inherit",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Plus size={12} />
              <span>+{mins}m</span>
            </button>
          ))}

          {isValidDuration ? (
            <button
              type="button"
              onClick={resetForm}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 12px",
                borderRadius: "16px",
                border: "1px solid rgba(255, 69, 58, 0.25)",
                backgroundColor: "rgba(255, 69, 58, 0.1)",
                color: "#FF453A",
                fontFamily: "inherit",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          ) : undefined}
        </div>

        {/* Label Input with Suggestions */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Input
            label="Timer Label"
            placeholder="e.g. Focus, Tea, Pomodoro (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            leadingIcon={<Tag size={16} />}
            showClearButton={true}
            onClear={() => setLabel("")}
            maxLength={32}
          />

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setLabel(tag)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "12px",
                  border: "1px solid var(--glass-border)",
                  backgroundColor:
                    label === tag ? "rgba(10, 132, 255, 0.2)" : "rgba(120, 120, 128, 0.08)",
                  color: label === tag ? "var(--accent-color)" : "var(--text-secondary)",
                  fontFamily: "inherit",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
