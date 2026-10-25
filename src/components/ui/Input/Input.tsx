/**
 * ============================================================================
 * File: Input.tsx
 * Module: Core UI Primitives / Input
 * Architectural Responsibility:
 *   High-precision text input component with liquid glass styling, leading/trailing
 *   icon slots, clear button mechanics, and accessible error message handling.
 *
 * Design Guidelines & HIG Compliance:
 *   - Glass inset background with contrast focus ring.
 *   - Full keyboard accessibility and assistive technology error linking.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<InputProps>
 *   - Zero Null Policy: All optional adornments render via `undefined` guard.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<InputProps>
 *   - Outputs: Dispatches native text input change & clear events.
 *   - Side Effects: None.
 * ============================================================================
 */

import React from "react";
import { X } from "lucide-react";
import { InputProps } from "./types";
import "./Input.css";

/**
 * Liquid glass typed text input primitive.
 */
export const Input: React.FC<InputProps> = ({
  label,
  errorMessage,
  helperText,
  leadingIcon,
  trailingIcon,
  showClearButton = false,
  onClear,
  value,
  id,
  className,
  ...restAttributes
}) => {
  const inputElementId = id ? id : undefined;
  const hasValue = value !== undefined && String(value).length > 0;
  const hasError = errorMessage !== undefined && errorMessage.length > 0;

  const boxClasses = [
    "ui-input-box",
    hasError ? "ui-input-box--error" : "",
    className ? className : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="ui-input-wrapper">
      {label ? (
        <label htmlFor={inputElementId} className="ui-input-label">
          {label}
        </label>
      ) : undefined}

      <div className={boxClasses}>
        {leadingIcon ? (
          <span className="ui-input-icon">{leadingIcon}</span>
        ) : undefined}

        <input
          id={inputElementId}
          value={value}
          className="ui-input-field"
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputElementId}-error`
              : helperText
              ? `${inputElementId}-helper`
              : undefined
          }
          {...restAttributes}
        />

        {showClearButton && hasValue && onClear ? (
          <button
            type="button"
            className="ui-input-clear-button"
            onClick={onClear}
            aria-label="Clear input value"
          >
            <X size={14} />
          </button>
        ) : undefined}

        {trailingIcon ? (
          <span className="ui-input-icon">{trailingIcon}</span>
        ) : undefined}
      </div>

      {hasError ? (
        <span id={`${inputElementId}-error`} className="ui-input-error-text">
          {errorMessage}
        </span>
      ) : helperText ? (
        <span id={`${inputElementId}-helper`} className="ui-input-helper-text">
          {helperText}
        </span>
      ) : undefined}
    </div>
  );
};
