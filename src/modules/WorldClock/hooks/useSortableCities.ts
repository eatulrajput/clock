/**
 * ============================================================================
 * File: useSortableCities.ts
 * Module: World Clock / Custom Hooks
 * Architectural Responsibility:
 *   State management and zero-null drag-and-drop reordering logic for tracked
 *   cities in the World Clock. Handles persistence to local disk.
 *
 * Design Guidelines & HIG Compliance:
 *   - Drag-and-drop reordering with fluid slot swapping as specified in PRD section 2.1.
 *   - Automatic persistent synchronization to localStorage.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Return Contract: Readonly<UseSortableCitiesResult>
 *   - Zero Null Policy: Active dragged indices modeled as `undefined` when idle.
 *     No `null` keyword used throughout implementation.
 *
 * State & Dependency Boundaries:
 *   - Inputs: User drag interactions, add/delete actions.
 *   - Outputs: Dispatches city ordering updates and storage serialization.
 *   - Side Effects: Serializes to localStorage key "clock_cities_v2".
 * ============================================================================
 */

import { useState, useEffect, useCallback } from "react";
import { TrackedCityEntity } from "../types";
import { getSystemLocalTimezone } from "./useCitySearch";

const STORAGE_KEY = "clock_cities_v2";

const DEFAULT_CITIES: readonly TrackedCityEntity[] = [
  { id: "local", cityName: "Local Time", timezoneIana: getSystemLocalTimezone(), displayOrder: 0 },
  { id: "America/New_York", cityName: "New York", timezoneIana: "America/New_York", displayOrder: 1 },
  { id: "Europe/London", cityName: "London", timezoneIana: "Europe/London", displayOrder: 2 },
  { id: "Asia/Tokyo", cityName: "Tokyo", timezoneIana: "Asia/Tokyo", displayOrder: 3 },
] as const;

/**
 * Safely parse persisted cities list.
 */
function loadPersistedCities(): readonly TrackedCityEntity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("clock_cities");
    if (!raw) return DEFAULT_CITIES;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CITIES;

    return parsed.map((item, idx) => ({
      id: String(item.id || item.timezone || `city-${idx}`),
      cityName: String(item.cityName || item.name || "City"),
      timezoneIana: String(item.timezoneIana || item.timezone || "UTC"),
      countryName: typeof item.countryName === "string" ? item.countryName : undefined,
      displayOrder: idx,
    }));
  } catch {
    return DEFAULT_CITIES;
  }
}

export interface UseSortableCitiesResult {
  readonly cities: readonly TrackedCityEntity[];
  readonly draggedIndex?: number;
  readonly dragOverIndex?: number;
  readonly addCity: (timezoneIana: string, cityName: string) => void;
  readonly removeCity: (cityId: string) => void;
  readonly handleDragStart: (index: number) => void;
  readonly handleDragEnter: (index: number) => void;
  readonly handleDragEnd: () => void;
}

/**
 * Custom hook providing sortable city list management with zero null values.
 */
export const useSortableCities = (): UseSortableCitiesResult => {
  const [cities, setCities] = useState<readonly TrackedCityEntity[]>(loadPersistedCities);
  const [draggedIndex, setDraggedIndex] = useState<number | undefined>(undefined);
  const [dragOverIndex, setDragOverIndex] = useState<number | undefined>(undefined);

  // Synchronize changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
    } catch {
      // Storage error fallback
    }
  }, [cities]);

  const addCity = useCallback((timezoneIana: string, cityName: string) => {
    setCities((prev) => {
      // Prevent duplicates
      if (prev.some((c) => c.timezoneIana === timezoneIana)) {
        return prev;
      }

      const newCity: TrackedCityEntity = {
        id: timezoneIana,
        cityName,
        timezoneIana,
        displayOrder: prev.length,
      };

      return [...prev, newCity];
    });
  }, []);

  const removeCity = useCallback((cityId: string) => {
    setCities((prev) => prev.filter((c) => c.id !== cityId));
  }, []);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragEnter = useCallback((index: number) => {
    setDragOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (
      draggedIndex !== undefined &&
      dragOverIndex !== undefined &&
      draggedIndex !== dragOverIndex
    ) {
      setCities((prev) => {
        const nextList = [...prev];
        const [movedItem] = nextList.splice(draggedIndex, 1);
        nextList.splice(dragOverIndex, 0, movedItem);
        return nextList.map((item, idx) => ({ ...item, displayOrder: idx }));
      });
    }

    setDraggedIndex(undefined);
    setDragOverIndex(undefined);
  }, [draggedIndex, dragOverIndex]);

  return {
    cities,
    draggedIndex,
    dragOverIndex,
    addCity,
    removeCity,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  };
};
