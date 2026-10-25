/**
 * ============================================================================
 * File: TimerCard.tsx
 * Module: Timers / Components
 * Architectural Responsibility:
 *   Autonomous countdown card presenting an individual timer instance with an SVG
 *   circular progress ring, tabular numerals display, dynamic state badges,
 *   and tactile controls (Start, Pause, Resume, Reset, Delete).
 *
 * Design Guidelines & HIG Compliance:
 *   - Utilizes `requestAnimationFrame` for 60fps fluid countdown animation while running.
 *   - Employs Apple Liquid Glass panel styling and semantic color shifts.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<TimerCardProps>
 *   - Zero Null Policy: Absence of callbacks or values uses undefined guards.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<ActiveTimerEntity>
 *   - Outputs: Dispatches `onStart`, `onPause`, `onResume`, `onReset`, `onDelete` events.
 *   - Side Effects: Manages local requestAnimationFrame loop during active countdown.
 * ============================================================================
 */

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Trash2 } from "lucide-react";
import { ActiveTimerEntity } from "../types";
import { CircularProgress } from "../../../components/ui/CircularProgress/CircularProgress";
import { TimeDisplay } from "../../../components/ui/TimeDisplay/TimeDisplay";
import { Button } from "../../../components/ui/Button/Button";
import { GlassPanel } from "../../../components/ui/GlassPanel/GlassPanel";
import { Badge } from "../../../components/ui/Badge/Badge";

export interface TimerCardProps {
  /**
   * Immutable timer entity data.
   */
  readonly timer: ActiveTimerEntity;

  /**
   * Flag indicating if this card should render in full hero mode (when only 1 timer exists).
   * @default false
   */
  readonly isHeroMode?: boolean;

  /**
   * Callback fired to start an idle timer.
   */
  readonly onStartTimer: (timerId: string) => void;

  /**
   * Callback fired to pause an actively running timer.
   */
  readonly onPauseTimer: (timerId: string) => void;

  /**
   * Callback fired to resume a paused timer.
   */
  readonly onResumeTimer: (timerId: string) => void;

  /**
   * Callback fired to reset a timer to its full initial duration.
   */
  readonly onResetTimer: (timerId: string) => void;

  /**
   * Callback fired to remove a timer from the grid.
   */
  readonly onDeleteTimer: (timerId: string) => void;
}

/**
 * Format milliseconds into padded string units.
 */
function formatRemainingUnits(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
    hasHours: hours > 0,
  };
}

/**
 * Visual countdown card component for a single active timer.
 */
export const TimerCard: React.FC<TimerCardProps> = ({
  timer,
  isHeroMode = false,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onResetTimer,
  onDeleteTimer,
}) => {
  const {
    id,
    label,
    totalDurationMilliseconds,
    remainingMilliseconds,
    targetEpochTimestamp,
    status,
    isRinging,
  } = timer;

  const [currentRemainingMs, setCurrentRemainingMs] = useState(remainingMilliseconds);
  const animationFrameReference = useRef<number>(0);

  const updateRunningTime = useCallback(() => {
    if (status === "running" && targetEpochTimestamp !== undefined) {
      const now = Date.now();
      const calculatedRemaining = Math.max(0, targetEpochTimestamp - now);
      setCurrentRemainingMs(calculatedRemaining);
      animationFrameReference.current = requestAnimationFrame(updateRunningTime);
    }
  }, [status, targetEpochTimestamp]);

  useEffect(() => {
    if (status === "running") {
      animationFrameReference.current = requestAnimationFrame(updateRunningTime);
    } else {
      setCurrentRemainingMs(remainingMilliseconds);
    }

    return () => {
      if (animationFrameReference.current) {
        cancelAnimationFrame(animationFrameReference.current);
      }
    };
  }, [status, remainingMilliseconds, updateRunningTime]);

  // Compute normalized progress for the SVG ring
  const normalizedProgress =
    totalDurationMilliseconds > 0
      ? currentRemainingMs / totalDurationMilliseconds
      : 0;

  const { hours, minutes, seconds, hasHours } = formatRemainingUnits(currentRemainingMs);

  const ringDiameter = isHeroMode ? 260 : 190;
  const strokeThickness = isHeroMode ? 8 : 6;
  const fontSize = isHeroMode ? (hasHours ? 2.5 : 3.4) : hasHours ? 1.8 : 2.4;

  const isCompleted = status === "completed" || isRinging;

  return (
    <GlassPanel
      elevation={isHeroMode ? "elevated" : "flat"}
      paddingPixels={isHeroMode ? 32 : 20}
      className="timer-card-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap: isHeroMode ? "20px" : "14px",
        minWidth: isHeroMode ? "360px" : "280px",
        border: isCompleted ? "1.5px solid #FF453A" : undefined,
      }}
    >
      {/* Header: Label and Status Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span
          style={{
            fontSize: isHeroMode ? "1.1rem" : "0.95rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "70%",
          }}
          title={label}
        >
          {label}
        </span>

        <Badge
          variant={
            isCompleted
              ? "destructive"
              : status === "running"
              ? "accent"
              : status === "paused"
              ? "warning"
              : "neutral"
          }
          size="small"
          showDot={status === "running"}
        >
          {isCompleted
            ? "Done"
            : status === "running"
            ? "Running"
            : status === "paused"
            ? "Paused"
            : "Ready"}
        </Badge>
      </div>

      {/* Progress Ring with Centered Digits */}
      <CircularProgress
        normalizedProgress={normalizedProgress}
        diameterPixels={ringDiameter}
        strokeThickness={strokeThickness}
        isCompleted={isCompleted}
      >
        <TimeDisplay
          hours={hasHours ? hours : minutes}
          minutes={hasHours ? minutes : seconds}
          seconds={hasHours ? seconds : undefined}
          formatMode="countdown-timer"
          fontSizeRem={fontSize}
        />
      </CircularProgress>

      {/* Action Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isHeroMode ? "16px" : "10px",
          width: "100%",
        }}
      >
        {status === "running" ? (
          <Button
            variant="glass"
            size={isHeroMode ? "medium" : "small"}
            leadingIcon={<Pause size={isHeroMode ? 18 : 16} fill="currentColor" />}
            onClick={() => onPauseTimer(id)}
            style={{ color: "#FF9F0A" }}
          >
            Pause
          </Button>
        ) : status === "paused" ? (
          <Button
            variant="primary"
            size={isHeroMode ? "medium" : "small"}
            leadingIcon={<Play size={isHeroMode ? 18 : 16} fill="currentColor" />}
            onClick={() => onResumeTimer(id)}
          >
            Resume
          </Button>
        ) : (
          <Button
            variant="primary"
            size={isHeroMode ? "medium" : "small"}
            leadingIcon={<Play size={isHeroMode ? 18 : 16} fill="currentColor" />}
            onClick={() => onStartTimer(id)}
            disabled={isCompleted}
          >
            Start
          </Button>
        )}

        <Button
          variant="secondary"
          size={isHeroMode ? "medium" : "small"}
          leadingIcon={<RotateCcw size={isHeroMode ? 16 : 14} />}
          onClick={() => onResetTimer(id)}
          title="Reset timer to initial duration"
        >
          Reset
        </Button>

        <Button
          variant="destructive"
          size={isHeroMode ? "medium" : "small"}
          leadingIcon={<Trash2 size={isHeroMode ? 16 : 14} />}
          onClick={() => onDeleteTimer(id)}
          title="Delete timer"
        />
      </div>
    </GlassPanel>
  );
};
