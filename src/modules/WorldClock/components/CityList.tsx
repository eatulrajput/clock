/**
 * ============================================================================
 * File: CityList.tsx
 * Module: World Clock / Components
 * Architectural Responsibility:
 *   Sortable list container for World Clock city cards supporting fluid
 *   drag-and-drop reordering without null pointer state anomalies.
 *
 * Design Guidelines & HIG Compliance:
 *   - Drag indicator feedback during active slot dragging.
 *   - Clean empty state illustration when all cities are removed.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<CityListProps>
 *   - Zero Null Policy: Drag indexes are numbers or undefined.
 * ============================================================================
 */

import React from "react";
import { TrackedCityEntity } from "../types";
import { CityCard } from "./CityCard";
import { Globe, Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button/Button";

export interface CityListProps {
  /**
   * Ordered collection of tracked cities.
   */
  readonly cities: readonly TrackedCityEntity[];

  /**
   * Current master epoch in milliseconds.
   */
  readonly currentEpochMilliseconds: number;

  /**
   * When true, renders time in 24-hour style.
   * @default false
   */
  readonly use24HourFormat?: boolean;

  /**
   * Index of the item currently being actively dragged, if any.
   */
  readonly draggedIndex?: number;

  /**
   * Index of the item currently receiving the drag hover, if any.
   */
  readonly dragOverIndex?: number;

  /**
   * Drag interaction callbacks.
   */
  readonly onDragStart: (index: number) => void;
  readonly onDragEnter: (index: number) => void;
  readonly onDragEnd: () => void;

  /**
   * Callback fired to remove a city.
   */
  readonly onDeleteCity: (cityId: string) => void;

  /**
   * Callback fired when clicking the empty state "Add City" button.
   */
  readonly onOpenAddModal: () => void;
}

/**
 * Sortable list container for tracked city cards.
 */
export const CityList: React.FC<CityListProps> = ({
  cities,
  currentEpochMilliseconds,
  use24HourFormat = false,
  draggedIndex,
  dragOverIndex,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDeleteCity,
  onOpenAddModal,
}) => {
  if (cities.length === 0) {
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
          <Globe size={40} style={{ opacity: 0.6, color: "var(--accent-color)" }} />
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
            No Cities Tracked
          </h3>
          <p style={{ fontSize: "0.9rem", maxWidth: "320px", margin: "0 auto" }}>
            Add global cities to monitor international timezones for remote collaboration.
          </p>
        </div>

        <Button
          variant="primary"
          size="medium"
          leadingIcon={<Plus size={18} />}
          onClick={onOpenAddModal}
        >
          Add City
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
      {cities.map((city, index) => (
        <CityCard
          key={city.id}
          city={city}
          index={index}
          currentEpochMilliseconds={currentEpochMilliseconds}
          use24HourFormat={use24HourFormat}
          isDragging={draggedIndex === index}
          isDragOver={dragOverIndex === index}
          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDeleteCity={onDeleteCity}
        />
      ))}
    </div>
  );
};
