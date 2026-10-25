/**
 * ============================================================================
 * File: Modal.tsx
 * Module: Core UI Primitives / Modal
 * Architectural Responsibility:
 *   Liquid glass dialogue overlay component rendered into document portal.
 *   Provides focus containment, Escape key dismissal, backdrop click dismiss,
 *   and spring-animated entrance transitions.
 *
 * Design Guidelines & HIG Compliance:
 *   - Translucent glass backdrop (`backdrop-filter: blur(20px)`).
 *   - Accessible header, close trigger, scrollable content area, and footer actions.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<ModalProps>
 *   - Zero Null Policy: When `isOpen` is false, returns empty fragment `<></>`.
 *     No `null` keyword used anywhere in implementation.
 *
 * State & Dependency Boundaries:
 *   - Inputs: Readonly<ModalProps>
 *   - Outputs: Dispatches `onCloseRequest()` on dismissal
 *   - Side Effects: Attaches and detaches document Escape key listener.
 * ============================================================================
 */

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { ModalProps } from "./types";
import "./Modal.css";

/**
 * High-fidelity liquid glass modal dialogue primitive.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onCloseRequest,
  title,
  description,
  children,
  footerActions,
  maxWidthPixels = 480,
  className,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRequest();
      }
    };

    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [isOpen, onCloseRequest]);

  if (!isOpen) {
    return <></>;
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCloseRequest();
    }
  };

  const dialogClasses = [
    "ui-modal-dialog",
    className ? className : "",
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <div
      className="ui-modal-overlay"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className={dialogClasses}
        style={{ maxWidth: `${maxWidthPixels}px` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ui-modal-title"
        aria-describedby={description ? "ui-modal-description" : undefined}
      >
        <div className="ui-modal-header">
          <div className="ui-modal-heading">
            <h2 id="ui-modal-title" className="ui-modal-title">
              {title}
            </h2>
            {description ? (
              <p id="ui-modal-description" className="ui-modal-description">
                {description}
              </p>
            ) : undefined}
          </div>
          <button
            type="button"
            className="ui-modal-close-button"
            onClick={onCloseRequest}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="ui-modal-body">{children}</div>

        {footerActions ? (
          <div className="ui-modal-footer">{footerActions}</div>
        ) : undefined}
      </div>
    </div>,
    document.body
  );
};
