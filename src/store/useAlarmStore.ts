/**
 * ============================================================================
 * File: useAlarmStore.ts
 * Module: Store / Alarms State Management
 * Architectural Responsibility:
 *   Zustand store managing scheduled alarms, recurring weekday schedules,
 *   snooze timers, and persistent storage synchronization.
 *
 * Design Guidelines & HIG Compliance:
 *   - Alarms persist reliably through app restarts and reboots via localStorage.
 *   - Supports 9-minute standard iOS snooze cycles and one-time vs recurring alarms.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed State: Readonly<AlarmStoreState>
 *   - Zero Null Policy: Snooze timestamps and ringing states modeled via `undefined`.
 *     No `null` keyword permitted in store implementation.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Actions dispatched by AlarmCard, AddAlarmModal, and AlarmRinger.
 *   - Outputs: Consumed reactively by Alarms view and AlarmRingerOverlay.
 *   - Side Effects: Serializes alarm collections safely into localStorage ("clock_alarms_v2").
 * ============================================================================
 */

import { create } from "zustand";
import { AlarmEntity, CreateAlarmInput, WeekDayIndex } from "../modules/Alarms/types";

// Maintain backwards compatibility alias for any legacy imports
export type Alarm = AlarmEntity;

export interface AlarmStoreState {
  /**
   * Sorted collection of configured alarms.
   */
  readonly alarms: readonly AlarmEntity[];

  /**
   * Array of IDs for alarms that are currently actively ringing.
   */
  readonly ringingAlarmIds: readonly string[];

  /**
   * Adds a new alarm to the store and persists changes.
   * @returns The generated UUID string of the newly created alarm.
   */
  readonly addAlarm: (input: CreateAlarmInput) => string;

  /**
   * Updates fields of an existing alarm.
   */
  readonly updateAlarm: (id: string, updates: Partial<AlarmEntity>) => void;

  /**
   * Deletes an alarm from the collection.
   */
  readonly removeAlarm: (id: string) => void;

  /**
   * Toggles an alarm between active and inactive states.
   */
  readonly toggleAlarm: (id: string, nextActive?: boolean) => void;

  /**
   * Triggers an alarm into ringing state.
   */
  readonly triggerAlarm: (id: string) => void;

  /**
   * Dismisses a ringing alarm, resetting snooze if applicable.
   */
  readonly dismissAlarm: (id: string) => void;

  /**
   * Snoozes an alarm for a designated duration (default 9 minutes).
   */
  readonly snoozeAlarm: (id: string, snoozeMinutes?: number) => void;
}

const STORAGE_KEY = "clock_alarms_v2";

/**
 * Safely load and validate serialized alarms from localStorage without crashing on corrupted data.
 */
function loadPersistedAlarms(): readonly AlarmEntity[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("clock_alarms");
    if (!rawData) return [];

    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) return [];

    // Normalize and validate parsed alarms
    return parsed
      .filter((item) => item && typeof item.id === "string")
      .map((item) => ({
        id: String(item.id),
        timeString24Hour: String(item.timeString24Hour || item.time || "07:00"),
        label: String(item.label || "Alarm"),
        isActive: Boolean(item.isActive !== undefined ? item.isActive : item.active),
        recurringDays: Array.isArray(item.recurringDays || item.days)
          ? ((item.recurringDays || item.days) as WeekDayIndex[])
          : [],
        soundThemeName: typeof item.soundThemeName === "string" ? item.soundThemeName : "bell",
        snoozedUntilTimestamp:
          typeof (item.snoozedUntilTimestamp || item.snoozedUntil) === "number"
            ? item.snoozedUntilTimestamp || item.snoozedUntil
            : undefined,
        lastTriggeredTimestamp:
          typeof (item.lastTriggeredTimestamp || item.lastTriggered) === "number"
            ? item.lastTriggeredTimestamp || item.lastTriggered
            : undefined,
      }))
      .sort((a, b) => a.timeString24Hour.localeCompare(b.timeString24Hour));
  } catch {
    return [];
  }
}

/**
 * Persist alarms collection to localStorage.
 */
function persistAlarms(alarms: readonly AlarmEntity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  } catch {
    // Fail gracefully if storage quota exceeded
  }
}

export const useAlarmStore = create<AlarmStoreState>((set, get) => ({
  alarms: loadPersistedAlarms(),
  ringingAlarmIds: [],

  addAlarm: (input) => {
    const newId = crypto.randomUUID();
    const newAlarm: AlarmEntity = {
      id: newId,
      timeString24Hour: input.timeString24Hour,
      label: input.label.trim().length > 0 ? input.label.trim() : "Alarm",
      isActive: input.isActive !== undefined ? input.isActive : true,
      recurringDays: input.recurringDays,
      soundThemeName: input.soundThemeName || "bell",
    };

    const nextAlarms = [...get().alarms, newAlarm].sort((a, b) =>
      a.timeString24Hour.localeCompare(b.timeString24Hour)
    );

    persistAlarms(nextAlarms);
    set({ alarms: nextAlarms });
    return newId;
  },

  updateAlarm: (id, updates) => {
    const nextAlarms = get().alarms.map((alarm) =>
      alarm.id === id ? { ...alarm, ...updates } : alarm
    );

    persistAlarms(nextAlarms);
    set({ alarms: nextAlarms });
  },

  removeAlarm: (id) => {
    const nextAlarms = get().alarms.filter((alarm) => alarm.id !== id);
    const nextRinging = get().ringingAlarmIds.filter((ringingId) => ringingId !== id);

    persistAlarms(nextAlarms);
    set({ alarms: nextAlarms, ringingAlarmIds: nextRinging });
  },

  toggleAlarm: (id, nextActive) => {
    const nextAlarms = get().alarms.map((alarm) => {
      if (alarm.id === id) {
        const targetActive = nextActive !== undefined ? nextActive : !alarm.isActive;
        return {
          ...alarm,
          isActive: targetActive,
          snoozedUntilTimestamp: undefined, // Clear any active snooze on toggle
        };
      }
      return alarm;
    });

    persistAlarms(nextAlarms);
    set({ alarms: nextAlarms });
  },

  triggerAlarm: (id) => {
    const state = get();
    if (!state.ringingAlarmIds.includes(id)) {
      const now = Date.now();
      const updatedAlarms = state.alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, lastTriggeredTimestamp: now } : alarm
      );

      persistAlarms(updatedAlarms);
      set({
        alarms: updatedAlarms,
        ringingAlarmIds: [...state.ringingAlarmIds, id],
      });
    }
  },

  dismissAlarm: (id) => {
    const state = get();
    const updatedAlarms = state.alarms.map((alarm) => {
      if (alarm.id === id) {
        // If it's a one-time alarm (no recurring days), deactivate it upon dismissal
        const shouldDeactivate = alarm.recurringDays.length === 0;
        return {
          ...alarm,
          isActive: shouldDeactivate ? false : alarm.isActive,
          snoozedUntilTimestamp: undefined,
        };
      }
      return alarm;
    });

    const nextRinging = state.ringingAlarmIds.filter((ringingId) => ringingId !== id);
    persistAlarms(updatedAlarms);
    set({ alarms: updatedAlarms, ringingAlarmIds: nextRinging });
  },

  snoozeAlarm: (id, snoozeMinutes = 9) => {
    const state = get();
    const snoozeEpoch = Date.now() + snoozeMinutes * 60 * 1000;

    const updatedAlarms = state.alarms.map((alarm) =>
      alarm.id === id ? { ...alarm, snoozedUntilTimestamp: snoozeEpoch } : alarm
    );

    const nextRinging = state.ringingAlarmIds.filter((ringingId) => ringingId !== id);
    persistAlarms(updatedAlarms);
    set({ alarms: updatedAlarms, ringingAlarmIds: nextRinging });
  },
}));
