/**
 * ============================================================================
 * File: types.ts
 * Module: Layout / TitleBar
 * Architectural Responsibility:
 *   Type definitions and window event contracts for the custom desktop TitleBar.
 *
 * Design Guidelines & HIG Compliance:
 *   - Custom window chrome with minimize, maximize/restore, and close actions.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<TitleBarProps>
 *   - Zero Null Policy: All absence of elements uses undefined.
 * ============================================================================
 */

export interface TitleBarProps {
  /**
   * Title text displayed in the header.
   */
  readonly title?: string;

  /**
   * When true, shows macOS-style traffic light dots.
   * @default true
   */
  readonly showWindowControls?: boolean;
}
