/**
 * ============================================================================
 * File: TitleBar.tsx
 * Module: Layout / TitleBar
 * Architectural Responsibility:
 *   Native window title bar providing window dragging capability and macOS-style
 *   traffic light controls (Close, Minimize, Maximize/Restore) integrating with
 *   the Tauri window runtime API.
 *
 * Design Guidelines & HIG Compliance:
 *   - macOS traffic light button styling with hover iconography.
 *   - Native window dragging region (`data-tauri-drag-region`).
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<TitleBarProps>
 *   - Zero Null Policy: All absence of elements uses undefined.
 *
 * State & Dependency Boundaries:
 *   - Side Effects: Invokes `@tauri-apps/api/window` APIs safely inside try/catch blocks.
 * ============================================================================
 */

import React from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { TitleBarProps } from "./types";
import { X, Minus, Maximize2 } from "lucide-react";
import "./TitleBar.css";

/**
 * Custom desktop window TitleBar component.
 */
export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  showWindowControls = true,
}) => {
  const handleClose = async () => {
    try {
      await getCurrentWindow().close();
    } catch {
      // Ignored in non-Tauri browser environments
    }
  };

  const handleMinimize = async () => {
    try {
      await getCurrentWindow().minimize();
    } catch {
      // Ignored in non-Tauri browser environments
    }
  };

  const handleMaximize = async () => {
    try {
      await getCurrentWindow().toggleMaximize();
    } catch {
      // Ignored in non-Tauri browser environments
    }
  };

  return (
    <div className="ui-titlebar" data-tauri-drag-region={true}>
      {showWindowControls ? (
        <div className="ui-titlebar__controls">
          <button
            type="button"
            className="ui-window-btn ui-window-btn--close"
            onClick={handleClose}
            aria-label="Close window"
          >
            <X size={8} strokeWidth={3} />
          </button>
          <button
            type="button"
            className="ui-window-btn ui-window-btn--minimize"
            onClick={handleMinimize}
            aria-label="Minimize window"
          >
            <Minus size={8} strokeWidth={3} />
          </button>
          <button
            type="button"
            className="ui-window-btn ui-window-btn--maximize"
            onClick={handleMaximize}
            aria-label="Maximize window"
          >
            <Maximize2 size={8} strokeWidth={3} />
          </button>
        </div>
      ) : (
        <div />
      )}

      {title ? (
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "var(--text-secondary)",
            pointerEvents: "none",
          }}
        >
          {title}
        </span>
      ) : undefined}

      <div className="ui-titlebar__drag-region" data-tauri-drag-region={true} />
    </div>
  );
};
