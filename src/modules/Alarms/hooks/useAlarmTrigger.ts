/**
 * ============================================================================
 * File: useAlarmTrigger.ts
 * Module: Alarms / Custom Hooks
 * Architectural Responsibility:
 *   Decoupled alarm scheduler hook that evaluates configured alarms against the
 *   central WebWorker epoch tick, evaluates recurring day-of-week rules, detects
 *   snooze expirations, and coordinates audio alarm playback.
 *
 * Design Guidelines & HIG Compliance:
 *   - Prevents duplicate audio triggers within the same 60-second window.
 *   - Continuous Web Audio playback until explicitly snoozed or dismissed.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Return Contract: Readonly<UseAlarmTriggerResult>
 *   - Zero Null Policy: Active ringing alarm modeled as `ringingAlarm?: AlarmEntity`.
 *     No `null` keyword used anywhere in implementation.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Consumes master epoch from `useTimeStore` and alarms from `useAlarmStore`.
 *   - Outputs: Dispatches `triggerAlarm`, `dismissAlarm`, `snoozeAlarm`.
 *   - Side Effects: Manages audio synthesize loop via `startAlarmSound()` / `stopAlarmSound()`.
 * ============================================================================
 */

import { useEffect, useMemo } from "react";
import { useAlarmStore } from "../../../store/useAlarmStore";
import { useTimeStore } from "../../../store/useTimeStore";
import { startAlarmSound, stopAlarmSound } from "../../../utils/audio";
import { AlarmEntity, WeekDayIndex } from "../types";

export interface UseAlarmTriggerResult {
  readonly alarms: readonly AlarmEntity[];
  readonly ringingAlarmIds: readonly string[];
  readonly ringingAlarm?: AlarmEntity;
  readonly isAnyAlarmRinging: boolean;
  readonly dismissAlarm: (id: string) => void;
  readonly snoozeAlarm: (id: string, snoozeMinutes?: number) => void;
}

/**
 * Custom hook monitoring scheduled alarms against real-time epoch ticks.
 */
export const useAlarmTrigger = (): UseAlarmTriggerResult => {
  const alarms = useAlarmStore((state) => state.alarms);
  const ringingAlarmIds = useAlarmStore((state) => state.ringingAlarmIds);
  const triggerAlarm = useAlarmStore((state) => state.triggerAlarm);
  const dismissAlarm = useAlarmStore((state) => state.dismissAlarm);
  const snoozeAlarm = useAlarmStore((state) => state.snoozeAlarm);

  const currentEpoch = useTimeStore((state) => state.now);

  // Core evaluation loop checking every epoch tick from WebWorker
  useEffect(() => {
    const currentDate = new Date(currentEpoch);
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const currentDayIndex = currentDate.getDay() as WeekDayIndex;
    const currentTimeString = `${hours}:${minutes}`;

    alarms.forEach((alarm) => {
      if (!alarm.isActive) return;
      let shouldTrigger = false;

      // 1. Check if an active snooze duration has elapsed
      if (
        alarm.snoozedUntilTimestamp !== undefined &&
        alarm.snoozedUntilTimestamp <= currentEpoch
      ) {
        shouldTrigger = true;
      } else if (alarm.snoozedUntilTimestamp === undefined) {
        // 2. Standard scheduled time check
        if (alarm.timeString24Hour === currentTimeString) {
          const isScheduledForToday =
            alarm.recurringDays.length === 0 ||
            alarm.recurringDays.includes(currentDayIndex);

          if (isScheduledForToday) {
            // Prevent duplicate triggers within the same 60 seconds
            const ONE_MINUTE_MS = 60 * 1000;
            const hasTriggeredRecently =
              alarm.lastTriggeredTimestamp !== undefined &&
              currentEpoch - alarm.lastTriggeredTimestamp < ONE_MINUTE_MS;

            if (!hasTriggeredRecently) {
              shouldTrigger = true;
            }
          }
        }
      }

      if (shouldTrigger && !ringingAlarmIds.includes(alarm.id)) {
        triggerAlarm(alarm.id);
      }
    });
  }, [currentEpoch, alarms, ringingAlarmIds, triggerAlarm]);

  // Identify active ringing alarm entity if one exists
  const ringingAlarm = useMemo(() => {
    if (ringingAlarmIds.length === 0) return undefined;
    const activeId = ringingAlarmIds[0];
    return alarms.find((alarm) => alarm.id === activeId);
  }, [alarms, ringingAlarmIds]);

  const isAnyAlarmRinging = ringingAlarmIds.length > 0;

  // Manage Web Audio alarm playback
  useEffect(() => {
    if (isAnyAlarmRinging) {
      startAlarmSound();
    } else {
      stopAlarmSound();
    }
  }, [isAnyAlarmRinging]);

  return {
    alarms,
    ringingAlarmIds,
    ringingAlarm,
    isAnyAlarmRinging,
    dismissAlarm,
    snoozeAlarm,
  };
};
