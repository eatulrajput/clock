/**
 * ============================================================================
 * File: DrumPicker.tsx
 * Module: Core UI Primitives / DrumPicker
 * Architectural Responsibility:
 *   3D cylindrical drum roller number picker mimicking authentic Apple iOS wheel pickers.
 *   Provides pointer dragging, wheel scrolling, 3D perspective rotation, and
 *   magnetic snapping to integer values.
 *
 * Design Guidelines & HIG Compliance:
 *   - Cylindrical perspective projection (`rotateX(...) translateZ(...)`).
 *   - High-contrast selection lens and top/bottom opacity gradient vignettes.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<DrumPickerColumnProps>, Readonly<DrumTimePickerProps>
 *   - Zero Null Policy: Values are always bounded positive integers. No nulls.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<DrumPickerColumnProps>
 *   - Outputs: Dispatches `onSelectedValueChange(number)`
 *   - Side Effects: Attaches window pointerup and pointermove listeners while dragging.
 * ============================================================================
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import { DrumPickerColumnProps, DrumTimePickerProps } from "./types";
import "./DrumPicker.css";

const DRUM_CYLINDER_RADIUS_PIXELS = 130;
const STEP_ANGLE_DEGREES = 25;

/**
 * Single column 3D drum wheel picker.
 */
export const DrumPickerColumn: React.FC<DrumPickerColumnProps> = ({
  selectedValue,
  minimumValue = 0,
  maximumValue,
  unitLabel,
  onSelectedValueChange,
}) => {
  const totalUnits = maximumValue - minimumValue + 1;
  const [rotationAngleDegrees, setRotationAngleDegrees] = useState(
    selectedValue * STEP_ANGLE_DEGREES
  );

  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartAngleRef = useRef(0);

  // Sync internal rotation angle when selectedValue prop updates externally
  useEffect(() => {
    if (!isDraggingRef.current) {
      setRotationAngleDegrees(selectedValue * STEP_ANGLE_DEGREES);
    }
  }, [selectedValue]);

  const snapToNearestValue = useCallback(
    (currentAngle: number) => {
      const rawIndex = Math.round(currentAngle / STEP_ANGLE_DEGREES);
      const clampedIndex = Math.max(0, Math.min(totalUnits - 1, rawIndex));
      const nextValue = minimumValue + clampedIndex;
      setRotationAngleDegrees(clampedIndex * STEP_ANGLE_DEGREES);
      onSelectedValueChange(nextValue);
    },
    [minimumValue, onSelectedValueChange, totalUnits]
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartYRef.current = event.clientY;
    dragStartAngleRef.current = rotationAngleDegrees;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaY = event.clientY - dragStartYRef.current;
    // Drag down decrements angle, drag up increments angle
    const angleDelta = (deltaY / 3) * -1;
    const nextAngle = dragStartAngleRef.current + angleDelta;
    const minAngle = 0;
    const maxAngle = (totalUnits - 1) * STEP_ANGLE_DEGREES;
    // Add rubber banding damping beyond bounds
    const boundedAngle =
      nextAngle < minAngle
        ? nextAngle * 0.3
        : nextAngle > maxAngle
        ? maxAngle + (nextAngle - maxAngle) * 0.3
        : nextAngle;

    setRotationAngleDegrees(boundedAngle);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
    snapToNearestValue(rotationAngleDegrees);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? 1 : -1;
    const currentIndex = selectedValue - minimumValue;
    const nextIndex = Math.max(0, Math.min(totalUnits - 1, currentIndex + direction));
    const nextValue = minimumValue + nextIndex;
    onSelectedValueChange(nextValue);
  };

  // Render visible items in range around active angle
  const centerIndex = Math.round(rotationAngleDegrees / STEP_ANGLE_DEGREES);
  const visibleIndices: number[] = [];
  for (let offset = -4; offset <= 4; offset += 1) {
    const itemIndex = centerIndex + offset;
    if (itemIndex >= 0 && itemIndex < totalUnits) {
      visibleIndices.push(itemIndex);
    }
  }

  return (
    <div
      className="ui-drum-column-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      role="spinbutton"
      aria-valuenow={selectedValue}
      aria-valuemin={minimumValue}
      aria-valuemax={maximumValue}
      aria-label={unitLabel}
    >
      <div className="ui-drum-lens-bar" />
      <div className="ui-drum-vignette-top" />
      <div className="ui-drum-vignette-bottom" />

      <div className="ui-drum-viewport">
        {visibleIndices.map((index) => {
          const itemValue = minimumValue + index;
          const itemAngleDegrees = index * STEP_ANGLE_DEGREES - rotationAngleDegrees;
          const radians = (itemAngleDegrees * Math.PI) / 180;
          const opacity = Math.max(0.1, Math.cos(radians));

          return (
            <div
              key={itemValue}
              className="ui-drum-item"
              style={{
                transform: `rotateX(${itemAngleDegrees}deg) translateZ(${DRUM_CYLINDER_RADIUS_PIXELS}px)`,
                opacity: opacity,
              }}
            >
              {String(itemValue).padStart(2, "0")}
            </div>
          );
        })}
      </div>

      <span className="ui-drum-unit-label">{unitLabel}</span>
    </div>
  );
};

/**
 * Composite hours, minutes, and seconds 3-column drum time picker.
 */
export const DrumTimePicker: React.FC<DrumTimePickerProps> = ({
  hours,
  minutes,
  seconds,
  onTimeChange,
}) => {
  return (
    <div className="ui-drum-time-picker">
      <DrumPickerColumn
        selectedValue={hours}
        minimumValue={0}
        maximumValue={23}
        unitLabel="hours"
        onSelectedValueChange={(nextHours) => onTimeChange(nextHours, minutes, seconds)}
      />
      <DrumPickerColumn
        selectedValue={minutes}
        minimumValue={0}
        maximumValue={59}
        unitLabel="min"
        onSelectedValueChange={(nextMinutes) => onTimeChange(hours, nextMinutes, seconds)}
      />
      <DrumPickerColumn
        selectedValue={seconds}
        minimumValue={0}
        maximumValue={59}
        unitLabel="sec"
        onSelectedValueChange={(nextSeconds) => onTimeChange(hours, minutes, nextSeconds)}
      />
    </div>
  );
};
