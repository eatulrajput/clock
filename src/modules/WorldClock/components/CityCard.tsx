/**
 * ============================================================================
 * File: CityCard.tsx
 * Module: World Clock / Components
 * Architectural Responsibility:
 *   Autonomous world clock card displaying localized city time, relative time
 *   offsets (hours ahead/behind), day/night contrast analog clock face,
 *   drag-and-drop reordering handles, and delete actions.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple Liquid Glass translucent panel styling with day/night contrast.
 *   - Tabular lining numbers typography preventing layout jitter.
 *   - Relative day labeling ("Today", "Yesterday", "Tomorrow", "+X HRS").
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<CityCardProps>
 *   - Zero Null Policy: Calculations return validated values. No nulls.
 * ============================================================================
 */

import React from "react";
import { TrackedCityEntity, CityTimeCalculation } from "../types";
import { GlassPanel } from "../../../components/ui/GlassPanel/GlassPanel";
import { Button } from "../../../components/ui/Button/Button";
import { Badge } from "../../../components/ui/Badge/Badge";
import { AnalogClockMini } from "./AnalogClockMini";
import { GripVertical, Trash2 } from "lucide-react";

export interface CityCardProps {
  /**
   * Tracked city domain entity.
   */
  readonly city: TrackedCityEntity;

  /**
   * Positional index of the city in the sortable list.
   */
  readonly index: number;

  /**
   * Current master epoch timestamp in milliseconds.
   */
  readonly currentEpochMilliseconds: number;

  /**
   * When true, displays 24-hour formatted time.
   * @default false
   */
  readonly use24HourFormat?: boolean;

  /**
   * True if this card is currently being actively dragged.
   * @default false
   */
  readonly isDragging?: boolean;

  /**
   * True if another dragged card is hovering over this card's drop target slot.
   * @default false
   */
  readonly isDragOver?: boolean;

  /**
   * Drag interaction callbacks.
   */
  readonly onDragStart: (index: number) => void;
  readonly onDragEnter: (index: number) => void;
  readonly onDragEnd: () => void;

  /**
   * Callback fired to remove this city from the tracked list.
   */
  readonly onDeleteCity: (cityId: string) => void;
}

/**
 * Computes localized time, relative difference, and clock hand angles for a given timezone.
 */
function calculateCityTime(
  epochMs: number,
  timezoneIana: string,
  use24Hour: boolean
): CityTimeCalculation {
  const date = new Date(epochMs);

  // Formatting local time in target timezone
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezoneIana,
    hour: "numeric",
    minute: "2-digit",
    hour12: !use24Hour,
  });

  const formattedTimeParts = timeFormatter.formatToParts(date);
  const hourPart = formattedTimeParts.find((p) => p.type === "hour")?.value || "12";
  const minutePart = formattedTimeParts.find((p) => p.type === "minute")?.value || "00";
  const dayPeriodPart = formattedTimeParts.find((p) => p.type === "dayPeriod")?.value as
    | "AM"
    | "PM"
    | undefined;

  // Determine 24-hour hour for day/night determination
  const hour24Formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezoneIana,
    hour: "numeric",
    hour12: false,
  });
  const numeric24Hour = parseInt(hour24Formatter.format(date), 10) || 0;
  const isDaytime = numeric24Hour >= 6 && numeric24Hour < 18;

  // Calculate relative offset in hours vs local system time
  const targetDateString = date.toLocaleString("en-US", { timeZone: timezoneIana });
  const localDateString = date.toLocaleString("en-US");
  const targetEpochOffset = new Date(targetDateString).getTime();
  const localEpochOffset = new Date(localDateString).getTime();
  const diffHours = Math.round((targetEpochOffset - localEpochOffset) / (3600 * 1000) * 2) / 2;

  // Relative day label
  const targetDateOnly = new Date(targetDateString).getDate();
  const localDateOnly = new Date(localDateString).getDate();
  const dayDelta = targetDateOnly - localDateOnly;
  const relativeDayLabel =
    dayDelta === 0 ? "Today" : dayDelta > 0 || dayDelta === -30 ? "Tomorrow" : "Yesterday";

  // Date banner
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezoneIana,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedDate = dateFormatter.format(date);

  // Analog hand angles
  const numericMinute = parseInt(minutePart, 10) || 0;
  const hourHandDegrees = (numeric24Hour % 12) * 30 + numericMinute * 0.5;
  const minuteHandDegrees = numericMinute * 6;

  return {
    formattedHours: hourPart,
    formattedMinutes: minutePart,
    ampmIndicator: dayPeriodPart,
    formattedDate,
    relativeHoursOffset: diffHours,
    relativeDayLabel,
    isDaytime,
    hourHandDegrees,
    minuteHandDegrees,
  };
}

/**
 * Individual World Clock city card component.
 */
export const CityCard: React.FC<CityCardProps> = ({
  city,
  index,
  currentEpochMilliseconds,
  use24HourFormat = false,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDeleteCity,
}) => {
  const { id, cityName, timezoneIana } = city;

  const {
    formattedHours,
    formattedMinutes,
    ampmIndicator,
    formattedDate,
    relativeHoursOffset,
    relativeDayLabel,
    isDaytime,
    hourHandDegrees,
    minuteHandDegrees,
  } = calculateCityTime(currentEpochMilliseconds, timezoneIana, use24HourFormat);

  const sign = relativeHoursOffset > 0 ? "+" : "";
  const offsetLabel =
    relativeHoursOffset === 0
      ? `${relativeDayLabel}, Same time`
      : `${relativeDayLabel}, ${sign}${relativeHoursOffset}HRS`;

  return (
    <div
      draggable={true}
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={onDragEnd}
      style={{
        opacity: isDragging ? 0.35 : 1,
        transform: isDragOver ? "translateY(4px)" : "none",
        transition: "all 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
      <GlassPanel
        elevation="flat"
        paddingPixels={18}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          cursor: "grab",
          border: isDragOver ? "1.5px solid var(--accent-color)" : undefined,
        }}
      >
        {/* Left: Drag Handle, City Name, Relative Offset */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              color: "var(--text-secondary)",
              cursor: "grab",
              display: "flex",
              alignItems: "center",
            }}
            title="Drag to reorder"
          >
            <GripVertical size={18} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {cityName}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Badge variant="neutral" size="small">
                {offsetLabel}
              </Badge>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Analog Clock Mini, Digital Time Readout, and Delete Action */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <AnalogClockMini
            hourHandDegrees={hourHandDegrees}
            minuteHandDegrees={minuteHandDegrees}
            isDaytime={isDaytime}
            diameterPixels={48}
          />

          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span
              className="text-hero"
              style={{
                fontSize: "2.4rem",
                fontWeight: 300,
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              {formattedHours}:{formattedMinutes}
            </span>
            {ampmIndicator ? (
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.04em",
                }}
              >
                {ampmIndicator}
              </span>
            ) : undefined}
          </div>

          <Button
            variant="ghost"
            size="icon"
            leadingIcon={<Trash2 size={16} />}
            onClick={() => onDeleteCity(id)}
            title={`Remove ${cityName}`}
            style={{ color: "var(--text-secondary)", marginLeft: "4px" }}
          />
        </div>
      </GlassPanel>
    </div>
  );
};
