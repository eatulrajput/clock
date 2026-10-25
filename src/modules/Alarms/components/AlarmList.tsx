/**
 * ============================================================================
 * File: AlarmList.tsx
 * Module: Alarms / Components
 * Architectural Responsibility:
 *   List view container presenting configured scheduled alarms or a clean
 *   Apple HIG empty state when no alarms exist.
 *
 * Design Guidelines & HIG Compliance:
 *   - Fluid vertical scrolling layout with sticky header clearance.
 *   - Empty state illustration with call to action.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<AlarmListProps>
 *   - Zero Null Policy: All empty lists handled via zero-length array check.
 * ============================================================================
 */

import React from "react";
import { AlarmEntity } from "../types";
import { AlarmCard } from "./AlarmCard";
import { AlarmClock, Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button/Button";

export interface AlarmListProps {
  /**
   * Collection of configured alarm entities.
   */
  readonly alarms: readonly AlarmEntity[];

  /**
   * When true, formats times in 24-hour style.
   * @default false
   */
  readonly use24HourFormat?: boolean;

  /**
   * Callback fired to toggle an alarm's active state.
   */
  readonly onToggleAlarm: (alarmId: string, nextActive: boolean) => void;

  /**
   * Callback fired to permanently delete an alarm.
   */
  readonly onDeleteAlarm: (alarmId: string) => void;

  /**
   * Callback fired when clicking the empty state "Add Alarm" button.
   */
  readonly onOpenAddModal: () => void;
}

/**
 * Scrollable list container for alarm cards or empty state.
 */
export const AlarmList: React.FC<AlarmListProps> = ({
  alarms,
  use24HourFormat = false,
  onToggleAlarm,
  onDeleteAlarm,
  onOpenAddModal,
}) => {
  if (alarms.length === 0) {
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
          padding: "60px 16px",
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
          <AlarmClock size={40} style={{ opacity: 0.6, color: "var(--accent-color)" }} />
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
            No Alarms Scheduled
          </h3>
          <p style={{ fontSize: "0.9rem", maxWidth: "320px", margin: "0 auto" }}>
            Add an alarm to schedule morning wake-ups, medication reminders, or work routines.
          </p>
        </div>

        <Button
          variant="primary"
          size="medium"
          leadingIcon={<Plus size={18} />}
          onClick={onOpenAddModal}
        >
          Add Alarm
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        overflowY: "auto",
        paddingRight: "6px",
        paddingBottom: "32px",
      }}
    >
      {alarms.map((alarm) => (
        <AlarmCard
          key={alarm.id}
          alarm={alarm}
          use24HourFormat={use24HourFormat}
          onToggleAlarm={onToggleAlarm}
          onDeleteAlarm={onDeleteAlarm}
        />
      ))}
    </div>
  );
};
