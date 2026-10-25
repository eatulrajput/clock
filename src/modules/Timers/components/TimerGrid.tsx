/**
 * ============================================================================
 * File: TimerGrid.tsx
 * Module: Timers / Components
 * Architectural Responsibility:
 *   Adaptive responsive grid coordinating multiple concurrent timer cards.
 *   Switches automatically between centered hero display (for single timers)
 *   and multi-column dashboard grid (for 2 to 6 concurrent countdowns).
 *
 * Design Guidelines & HIG Compliance:
 *   - Supports up to 6 simultaneous timers without layout jitter.
 *   - Displays an "Add Timer" dashed card slot when active timer count < 6.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<TimerGridProps>
 *   - Zero Null Policy: Empty collections render dedicated fallback state.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<ActiveTimerEntity[]>
 *   - Outputs: Dispatches timer card actions and "Open Create Modal" trigger.
 *   - Side Effects: None.
 * ============================================================================
 */

import React from "react";
import { ActiveTimerEntity } from "../types";
import { TimerCard } from "./TimerCard";
import { Plus, Timer as TimerIcon } from "lucide-react";
import { Button } from "../../../components/ui/Button/Button";
import { MAXIMUM_CONCURRENT_TIMERS } from "../../../store/useTimerStore";

export interface TimerGridProps {
  /**
   * Collection of active timer instances.
   */
  readonly timers: readonly ActiveTimerEntity[];

  /**
   * Callback fired to start an idle timer.
   */
  readonly onStartTimer: (timerId: string) => void;

  /**
   * Callback fired to pause a running timer.
   */
  readonly onPauseTimer: (timerId: string) => void;

  /**
   * Callback fired to resume a paused timer.
   */
  readonly onResumeTimer: (timerId: string) => void;

  /**
   * Callback fired to reset a timer.
   */
  readonly onResetTimer: (timerId: string) => void;

  /**
   * Callback fired to delete a timer.
   */
  readonly onDeleteTimer: (timerId: string) => void;

  /**
   * Callback fired when user clicks the "Add Timer" button or card.
   */
  readonly onOpenAddModal: () => void;
}

/**
 * Responsive layout container for concurrent countdown cards.
 */
export const TimerGrid: React.FC<TimerGridProps> = ({
  timers,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onResetTimer,
  onDeleteTimer,
  onOpenAddModal,
}) => {
  const timerCount = timers.length;
  const canAddMoreTimers = timerCount < MAXIMUM_CONCURRENT_TIMERS;

  // Empty State
  if (timerCount === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
          color: "var(--text-secondary)",
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "rgba(120, 120, 128, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TimerIcon size={38} style={{ opacity: 0.6, color: "var(--accent-color)" }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "6px",
            }}
          >
            No Active Timers
          </h3>
          <p style={{ fontSize: "0.9rem", maxWidth: "340px", margin: "0 auto" }}>
            Create a custom timer or pick a preset below to run up to 6 timers concurrently.
          </p>
        </div>

        <Button
          variant="primary"
          size="medium"
          leadingIcon={<Plus size={18} />}
          onClick={onOpenAddModal}
        >
          Create Timer
        </Button>
      </div>
    );
  }

  // Single Timer Hero Mode
  if (timerCount === 1) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 0",
        }}
      >
        <TimerCard
          timer={timers[0]}
          isHeroMode={true}
          onStartTimer={onStartTimer}
          onPauseTimer={onPauseTimer}
          onResumeTimer={onResumeTimer}
          onResetTimer={onResetTimer}
          onDeleteTimer={onDeleteTimer}
        />
      </div>
    );
  }

  // Multi-Timer Grid Mode (2 to 6 timers)
  return (
    <div
      style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px",
        padding: "12px 0 24px",
        alignItems: "start",
        overflowY: "auto",
        width: "100%",
      }}
    >
      {timers.map((timer) => (
        <TimerCard
          key={timer.id}
          timer={timer}
          isHeroMode={false}
          onStartTimer={onStartTimer}
          onPauseTimer={onPauseTimer}
          onResumeTimer={onResumeTimer}
          onResetTimer={onResetTimer}
          onDeleteTimer={onDeleteTimer}
        />
      ))}

      {canAddMoreTimers ? (
        <button
          type="button"
          onClick={onOpenAddModal}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            minHeight: "260px",
            borderRadius: "18px",
            border: "2px dashed var(--glass-border)",
            backgroundColor: "rgba(120, 120, 128, 0.05)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(event) => {
            event.currentTarget.style.borderColor = "var(--accent-color)";
            event.currentTarget.style.backgroundColor = "rgba(10, 132, 255, 0.08)";
            event.currentTarget.style.color = "var(--accent-color)";
          }}
          onMouseOut={(event) => {
            event.currentTarget.style.borderColor = "var(--glass-border)";
            event.currentTarget.style.backgroundColor = "rgba(120, 120, 128, 0.05)";
            event.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(120, 120, 128, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={24} />
          </div>
          <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>
            Add Another Timer ({timerCount}/{MAXIMUM_CONCURRENT_TIMERS})
          </span>
        </button>
      ) : undefined}
    </div>
  );
};
