/**
 * ============================================================================
 * File: types.ts
 * Module: Core UI Primitives / Toggle
 * Architectural Responsibility:
 *   Type definitions, props contracts, and state interfaces for the iOS-style
 *   fluid Toggle switch component.
 *
 * Design Guidelines & HIG Compliance:
 *   - Matches Apple HIG toggle dimensions (51px by 31px with 27px circular thumb).
 *   - Full keyboard accessibility (Space / Enter toggling).
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<ToggleProps>
 *   - Zero Null Policy: `id`, `description`, and `className` default to undefined.
 * ============================================================================
 */

/**
 * Component properties for the Toggle primitive.
 */
export interface ToggleProps {
  /**
   * Controlled checked state of the toggle switch.
   */
  readonly isChecked: boolean;

  /**
   * Callback fired when user toggles the switch value.
   * @param nextChecked The new boolean value.
   */
  readonly onToggleChange: (nextChecked: boolean) => void;

  /**
   * Accessible text label announced by assistive screen-reader technologies.
   */
  readonly accessibleLabel: string;

  /**
   * Optional primary title label displayed visually adjacent to the switch.
   */
  readonly titleLabel?: string;

  /**
   * Optional secondary subtitle or explanatory text.
   */
  readonly description?: string;

  /**
   * When true, disables pointer and keyboard interaction.
   * @default false
   */
  readonly isDisabled?: boolean;

  /**
   * Optional HTML identifier for DOM labeling association.
   */
  readonly id?: string;

  /**
   * Additional optional CSS classes.
   */
  readonly className?: string;
}
