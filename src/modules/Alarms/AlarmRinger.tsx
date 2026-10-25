/**
 * ============================================================================
 * File: AlarmRinger.tsx
 * Module: Alarms / Global Ringing Controller
 * Architectural Responsibility:
 *   Global headless listener and alert presenter mounted at the application root.
 *   Consumes the `useAlarmTrigger` scheduling engine to monitor active alarms
 *   and renders `AlarmRingerOverlay` whenever an alarm triggers, irrespective
 *   of the currently selected navigation tab.
 *
 * Design Guidelines & HIG Compliance:
 *   - Global persistence ensures scheduled alarms fire even if user is on Settings or Stopwatch tab.
 *   - Web Audio alarms and snooze cycles handled reliably.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed: React.FC with zero `any`.
 *   - Zero Null Policy: When no alarm is ringing, returns empty fragment `<></>`.
 *     No null values returned.
 *
 * State & Dependency Boundaries:
 *   - State: Driven by `useAlarmTrigger` and `useSettingsStore`.
 *   - Outputs: Dispatches `snoozeAlarm` and `dismissAlarm`.
 * ============================================================================
 */

import React from "react";
import { useAlarmTrigger } from "./hooks/useAlarmTrigger";
import { useSettingsStore } from "../../store/useSettingsStore";
import { AlarmRingerOverlay } from "./components/AlarmRingerOverlay";

/**
 * Global alarm ringer listener mounted at the App root.
 */
export const AlarmRinger: React.FC = () => {
  const { ringingAlarm, snoozeAlarm, dismissAlarm } = useAlarmTrigger();
  const use24Hour = useSettingsStore((state) => state.use24Hour);

  if (!ringingAlarm) {
    return <></>;
  }

  return (
    <AlarmRingerOverlay
      activeAlarm={ringingAlarm}
      use24HourFormat={use24Hour}
      onSnooze={snoozeAlarm}
      onDismiss={dismissAlarm}
    />
  );
};
