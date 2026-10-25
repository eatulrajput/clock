/**
 * ============================================================================
 * File: types.ts
 * Module: Layout / Navigation
 * Architectural Responsibility:
 *   Type definitions, module identifier unions, and descriptor interfaces for
 *   the desktop sidebar navigation rail.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<SidebarNavigationProps>
 *   - Zero Null Policy: Badge counts are numbers or undefined.
 * ============================================================================
 */

import React from "react";

/**
 * Valid application module identifiers.
 */
export type AppModuleIdentifier =
  | "clock"
  | "world-clock"
  | "alarms"
  | "stopwatch"
  | "timers"
  | "settings";

/**
 * Descriptor for a navigation item.
 */
export interface NavigationItemDescriptor {
  readonly id: AppModuleIdentifier;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly badgeCount?: number;
}

export interface SidebarNavigationProps {
  /**
   * Currently active module.
   */
  readonly activeModule: AppModuleIdentifier;

  /**
   * Callback fired to switch modules.
   */
  readonly onModuleSelect: (selectedModule: AppModuleIdentifier) => void;

  /**
   * Optional custom list of navigation items.
   */
  readonly items?: readonly NavigationItemDescriptor[];
}
