/**
 * ============================================================================
 * File: types.ts
 * Module: Core UI Primitives / Modal
 * Architectural Responsibility:
 *   Type definitions and component contract for the liquid glass Modal dialogue.
 *
 * Design Guidelines & HIG Compliance:
 *   - Translucent frosted glass backdrop with high blur radius.
 *   - Focus trapping, Escape key dismissal, and scale spring in/out animations.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<ModalProps>
 *   - Zero Null Policy: `footerActions` and `description` default to undefined.
 * ============================================================================
 */

import React from "react";

/**
 * Component properties for the Modal dialog primitive.
 */
export interface ModalProps {
  /**
   * Visibility flag controlling display state of the modal dialogue.
   */
  readonly isOpen: boolean;

  /**
   * Callback fired when user requests dismissal (backdrop click, escape key, close icon).
   */
  readonly onCloseRequest: () => void;

  /**
   * Primary title text rendered in the modal header.
   */
  readonly title: string;

  /**
   * Optional descriptive subtitle text below the title.
   */
  readonly description?: string;

  /**
   * Primary body content rendered inside the modal container.
   */
  readonly children: React.ReactNode;

  /**
   * Optional footer action slot (e.g., Cancel and Confirm buttons).
   */
  readonly footerActions?: React.ReactNode;

  /**
   * Maximum width in pixels for the modal container.
   * @default 480
   */
  readonly maxWidthPixels?: number;

  /**
   * Optional custom CSS class name applied to dialog container.
   */
  readonly className?: string;
}
