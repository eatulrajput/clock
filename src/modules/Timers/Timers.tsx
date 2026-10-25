/**
 * ============================================================================
 * File: Timers.tsx
 * Module: Timers / Root Module Container
 * Architectural Responsibility:
 *   Top-level coordinator for the multi-timer module. Composes the decoupled
 *   `TimerGrid`, `TimerPresets`, `AddTimerModal`, and `TimerRingingOverlay` components
 *   while driving state synchronization via the `useTimerEngine` hook.
 *
 * Design Guidelines & HIG Compliance:
 *   - Supports concurrent execution of up to 6 distinct timers (PRD section 2.4).
 *   - Apple Liquid Glass aesthetics, fluid animations, and zero CPU timer drift.
 *
 * Type Safety & Null Handling Contract:
 *   - Fully Type Checked: Strict React.FC with zero `any` usage.
 *   - Zero Null Policy: No `null` keyword used throughout implementation.
 *
 * State & Dependency Boundaries:
 *   - State Engine: `useTimerEngine` hook connecting Zustand & WebWorker ticks.
 *   - Side Effects: Audio alert loops and persistence are strictly managed within hooks/stores.
 * ============================================================================
 */

import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useTimerEngine } from "./hooks/useTimerEngine";
import { TimerGrid } from "./components/TimerGrid";
import { TimerPresets } from "./components/TimerPresets";
import { AddTimerModal } from "./components/AddTimerModal";
import { TimerRingingOverlay } from "./components/TimerRingingOverlay";
import { Button } from "../../components/ui/Button/Button";
import { Badge } from "../../components/ui/Badge/Badge";
import { MAXIMUM_CONCURRENT_TIMERS } from "../../store/useTimerStore";

/**
 * Root multi-timer feature view.
 */
export const Timers: React.FC = () => {
  const {
    timers,
    ringingTimer,
    createTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    deleteTimer,
    dismissRinging,
  } = useTimerEngine();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const canAddMoreTimers = timers.length < MAXIMUM_CONCURRENT_TIMERS;

  const handleOpenAddModal = useCallback(() => {
    if (canAddMoreTimers) {
      setIsAddModalOpen(true);
    }
  }, [canAddMoreTimers]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleCreateTimer = useCallback(
    (durationMs: number, label?: string, autoStart?: boolean) => {
      createTimer(durationMs, label, autoStart);
    },
    [createTimer]
  );

  const handleSelectPreset = useCallback(
    (durationMs: number, label: string, autoStart: boolean) => {
      createTimer(durationMs, label, autoStart);
    },
    [createTimer]
  );

  const handleRepeatTimer = useCallback(
    (timerId: string) => {
      dismissRinging(timerId);
      resetTimer(timerId);
      startTimer(timerId);
    },
    [dismissRinging, resetTimer, startTimer]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        gap: "16px",
      }}
    >
      {/* Module Title Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h2 className="text-title" style={{ margin: 0 }}>
            Timers
          </h2>
          {timers.length > 0 ? (
            <Badge variant="accent" size="small">
              {timers.length} / {MAXIMUM_CONCURRENT_TIMERS}
            </Badge>
          ) : undefined}
        </div>

        {canAddMoreTimers ? (
          <Button
            variant="glass"
            size="small"
            leadingIcon={<Plus size={16} />}
            onClick={handleOpenAddModal}
          >
            New Timer
          </Button>
        ) : undefined}
      </div>

      {/* Concurrent Multi-Timer Grid */}
      <TimerGrid
        timers={timers}
        onStartTimer={startTimer}
        onPauseTimer={pauseTimer}
        onResumeTimer={resumeTimer}
        onResetTimer={resetTimer}
        onDeleteTimer={deleteTimer}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Bottom Preset Strip */}
      <div style={{ flexShrink: 0, paddingTop: "8px" }}>
        <TimerPresets
          onSelectPreset={handleSelectPreset}
          isDisabled={!canAddMoreTimers}
        />
      </div>

      {/* Timer Creation Dialogue Modal */}
      <AddTimerModal
        isOpen={isAddModalOpen}
        onCloseRequest={handleCloseAddModal}
        onCreateTimer={handleCreateTimer}
      />

      {/* High-Priority Ringing Alert Overlay */}
      <TimerRingingOverlay
        ringingTimer={ringingTimer}
        onDismiss={dismissRinging}
        onRepeat={handleRepeatTimer}
      />
    </div>
  );
};
