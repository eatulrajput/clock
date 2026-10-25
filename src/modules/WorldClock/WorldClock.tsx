/**
 * ============================================================================
 * File: WorldClock.tsx
 * Module: World Clock / Root Module Container
 * Architectural Responsibility:
 *   Top-level coordinator for the World Clock tab. Composes the `CityList` and
 *   `AddCityModal` components while managing persistent drag-and-drop state
 *   via the `useSortableCities` hook and real-time epoch tracking via `useTimeStore`.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple Liquid Glass aesthetic with day/night contrast inversion.
 *   - Drag-and-drop reordering with persistent list ordering.
 *
 * Type Safety & Null Handling Contract:
 *   - Fully Type Checked: Strict React.FC implementation.
 *   - Zero Null Policy: No `null` keyword used throughout implementation.
 *
 * State & Dependency Boundaries:
 *   - State Engine: `useSortableCities` and `useTimeStore`.
 *   - Preferences: Consumes 24-hour setting from `useSettingsStore`.
 * ============================================================================
 */

import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useSortableCities } from "./hooks/useSortableCities";
import { useTimeStore } from "../../store/useTimeStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { CityList } from "./components/CityList";
import { AddCityModal } from "./components/AddCityModal";
import { Button } from "../../components/ui/Button/Button";
import { Badge } from "../../components/ui/Badge/Badge";

/**
 * Root World Clock module view.
 */
export const WorldClock: React.FC = () => {
  const {
    cities,
    draggedIndex,
    dragOverIndex,
    addCity,
    removeCity,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  } = useSortableCities();

  const currentEpoch = useTimeStore((state) => state.now);
  const use24Hour = useSettingsStore((state) => state.use24Hour);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleSelectCity = useCallback(
    (timezoneIana: string, cityName: string) => {
      addCity(timezoneIana, cityName);
    },
    [addCity]
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
            World Clock
          </h2>
          {cities.length > 0 ? (
            <Badge variant="neutral" size="small">
              {cities.length} {cities.length === 1 ? "City" : "Cities"}
            </Badge>
          ) : undefined}
        </div>

        <Button
          variant="glass"
          size="small"
          leadingIcon={<Plus size={16} />}
          onClick={handleOpenAddModal}
        >
          Add City
        </Button>
      </div>

      {/* Sortable City Cards List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <CityList
          cities={cities}
          currentEpochMilliseconds={currentEpoch}
          use24HourFormat={use24Hour}
          draggedIndex={draggedIndex}
          dragOverIndex={dragOverIndex}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onDeleteCity={removeCity}
          onOpenAddModal={handleOpenAddModal}
        />
      </div>

      {/* City Search and Selection Modal */}
      <AddCityModal
        isOpen={isAddModalOpen}
        onCloseRequest={handleCloseAddModal}
        onSelectCity={handleSelectCity}
      />
    </div>
  );
};
