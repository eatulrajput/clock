/**
 * ============================================================================
 * File: Alarms.tsx
 * Module: Alarms / Root Module Container
 * Architectural Responsibility:
 *   Top-level coordinator for the Alarms tab. Composes the `AlarmList`,
 *   `AddAlarmModal`, and `AlarmRingerOverlay` components, subscribing reactively
 *   to `useAlarmStore` and `useSettingsStore`.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple Liquid Glass translucent interface with smooth list animations.
 *   - Supports 24-hour mode according to global user settings.
 *
 * Type Safety & Null Handling Contract:
 *   - Fully Type Checked: Strict React.FC implementation.
 *   - Zero Null Policy: No `null` keyword used throughout implementation.
 *
 * State & Dependency Boundaries:
 *   - State Store: Consumes alarms from `useAlarmStore` and preferences from `useSettingsStore`.
 *   - Outputs: Dispatches alarm creation, toggle, and removal actions.
 * ============================================================================
 */

import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useAlarmStore } from "../../store/useAlarmStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { AlarmList } from "./components/AlarmList";
import { AddAlarmModal } from "./components/AddAlarmModal";
import { Button } from "../../components/ui/Button/Button";
import { CreateAlarmInput } from "./types";

/**
 * Root Alarms module view.
 */
export const Alarms: React.FC = () => {
  const alarms = useAlarmStore((state) => state.alarms);
  const addAlarm = useAlarmStore((state) => state.addAlarm);
  const toggleAlarm = useAlarmStore((state) => state.toggleAlarm);
  const removeAlarm = useAlarmStore((state) => state.removeAlarm);
  const use24Hour = useSettingsStore((state) => state.use24Hour);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleSaveAlarm = useCallback(
    (input: CreateAlarmInput) => {
      addAlarm(input);
    },
    [addAlarm]
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
            Alarms
          </h2>
        </div>

        <Button
          variant="glass"
          size="small"
          leadingIcon={<Plus size={16} />}
          onClick={handleOpenAddModal}
        >
          Add Alarm
        </Button>
      </div>

      {/* Alarms List or Empty State */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <AlarmList
          alarms={alarms}
          use24HourFormat={use24Hour}
          onToggleAlarm={toggleAlarm}
          onDeleteAlarm={removeAlarm}
          onOpenAddModal={handleOpenAddModal}
        />
      </div>

      {/* Add Alarm Dialogue Modal */}
      <AddAlarmModal
        isOpen={isAddModalOpen}
        use24HourFormat={use24Hour}
        onCloseRequest={handleCloseAddModal}
        onSaveAlarm={handleSaveAlarm}
      />
    </div>
  );
};
