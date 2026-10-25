/**
 * ============================================================================
 * File: Toggle.tsx
 * Module: Core UI Primitives / Toggle
 * Architectural Responsibility:
 *   iOS-style fluid Toggle switch delivering tactile cubic-bezier slide transitions,
 *   keyboard accessibility (Space/Enter), and screen-reader ARIA states.
 *
 * Design Guidelines & HIG Compliance:
 *   - Proportional track and thumb dimensions adhering to HIG.
 *   - Color shifts to system accent color when activated.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<ToggleProps>
 *   - Zero Null Policy: All absence of elements uses undefined.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<ToggleProps>
 *   - Outputs: Dispatches `onToggleChange(boolean)`
 *   - Side Effects: None.
 * ============================================================================
 */

import React from "react";
import { ToggleProps } from "./types";
import "./Toggle.css";

/**
 * Fluid iOS-style toggle switch component.
 */
export const Toggle: React.FC<ToggleProps> = ({
  isChecked,
  onToggleChange,
  accessibleLabel,
  titleLabel,
  description,
  isDisabled = false,
  id,
  className,
}) => {
  const switchElementId = id ? id : undefined;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    onToggleChange(event.target.checked);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLabelElement>) => {
    if (isDisabled) return;
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onToggleChange(!isChecked);
    }
  };

  const containerClasses = [
    "ui-toggle-container",
    className ? className : "",
  ]
    .filter(Boolean)
    .join(" ");

  const switchClasses = [
    "ui-toggle-switch",
    isChecked ? "ui-toggle-switch--checked" : "",
    isDisabled ? "ui-toggle-switch--disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {titleLabel || description ? (
        <div className="ui-toggle-text">
          {titleLabel ? <span className="ui-toggle-title">{titleLabel}</span> : undefined}
          {description ? <span className="ui-toggle-description">{description}</span> : undefined}
        </div>
      ) : undefined}

      <label
        htmlFor={switchElementId}
        className={switchClasses}
        onKeyDown={handleKeyDown}
        tabIndex={isDisabled ? -1 : 0}
        role="switch"
        aria-checked={isChecked}
        aria-label={accessibleLabel}
      >
        <input
          id={switchElementId}
          type="checkbox"
          className="ui-toggle-input"
          checked={isChecked}
          onChange={handleInputChange}
          disabled={isDisabled}
          tabIndex={-1}
        />
        <span className="ui-toggle-track" />
        <span className="ui-toggle-thumb" />
      </label>
    </div>
  );
};
