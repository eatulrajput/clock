/**
 * ============================================================================
 * File: SidebarNavigation.tsx
 * Module: Layout / Navigation
 * Architectural Responsibility:
 *   Desktop navigation sidebar presenting module switching buttons with active
 *   highlight indicators and live badge counts for active timers and enabled alarms.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple macOS-style navigation sidebar with liquid glass vibrancy.
 *   - Fluid spring hover transitions and high-contrast active state.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<SidebarNavigationProps>
 *   - Zero Null Policy: Badge counts are numbers or undefined.
 * ============================================================================
 */

import React from "react";
import { SidebarNavigationProps, AppModuleIdentifier, NavigationItemDescriptor } from "./types";
import { Clock, Globe, AlarmClock, TimerReset, Timer, Settings as SettingsIcon } from "lucide-react";
import { useTimerStore } from "../../../store/useTimerStore";
import { useAlarmStore } from "../../../store/useAlarmStore";
import "./SidebarNavigation.css";

/**
 * Desktop sidebar navigation rail component.
 */
export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeModule,
  onModuleSelect,
  items,
}) => {
  const activeTimersCount = useTimerStore((state) => state.timers.length);
  const activeAlarmsCount = useAlarmStore(
    (state) => state.alarms.filter((alarm) => alarm.isActive).length
  );

  const defaultItems: readonly NavigationItemDescriptor[] = [
    { id: "clock", label: "Clock", icon: <Clock size={18} /> },
    { id: "world-clock", label: "World Clock", icon: <Globe size={18} /> },
    {
      id: "alarms",
      label: "Alarms",
      icon: <AlarmClock size={18} />,
      badgeCount: activeAlarmsCount > 0 ? activeAlarmsCount : undefined,
    },
    { id: "stopwatch", label: "Stopwatch", icon: <TimerReset size={18} /> },
    {
      id: "timers",
      label: "Timers",
      icon: <Timer size={18} />,
      badgeCount: activeTimersCount > 0 ? activeTimersCount : undefined,
    },
    { id: "settings", label: "Settings", icon: <SettingsIcon size={18} /> },
  ] as const;

  const navigationItems = items || defaultItems;

  return (
    <nav className="ui-sidebar-nav" aria-label="Main Navigation">
      <div className="ui-sidebar-brand">
        <Clock size={22} style={{ color: "var(--accent-color)" }} />
        <span>Clock</span>
      </div>

      <div className="ui-sidebar-menu">
        {navigationItems.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`ui-sidebar-item ${isActive ? "ui-sidebar-item--active" : ""}`}
              onClick={() => onModuleSelect(item.id as AppModuleIdentifier)}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="ui-sidebar-item__lead">
                {item.icon}
                <span>{item.label}</span>
              </div>

              {item.badgeCount !== undefined ? (
                <span className="ui-sidebar-item__badge">{item.badgeCount}</span>
              ) : undefined}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
