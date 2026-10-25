/**
 * ============================================================================
 * File: SettingsNav.tsx
 * Module: Settings / Components
 * Architectural Responsibility:
 *   Segmented category navigation bar allowing users to switch between
 *   Appearance, General, Audio, and About configuration sections.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple-style segmented glass control with fluid indicator state.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<SettingsNavProps>
 *   - Zero Null Policy: Active tab bound to strict `SettingsTabId` union.
 * ============================================================================
 */

import React from "react";
import { SettingsTabId } from "../types";
import { Palette, Sliders, Volume2, Info } from "lucide-react";

export interface SettingsNavProps {
  /**
   * Currently active category tab identifier.
   */
  readonly activeTab: SettingsTabId;

  /**
   * Callback fired when a tab is selected.
   */
  readonly onTabSelect: (tabId: SettingsTabId) => void;
}

const TABS: readonly { readonly id: SettingsTabId; readonly label: string; readonly icon: React.ReactNode }[] = [
  { id: "appearance", label: "Appearance", icon: <Palette size={16} /> },
  { id: "general", label: "General", icon: <Sliders size={16} /> },
  { id: "audio", label: "Audio", icon: <Volume2 size={16} /> },
  { id: "about", label: "About", icon: <Info size={16} /> },
] as const;

/**
 * Segmented navigation tab bar for settings categories.
 */
export const SettingsNav: React.FC<SettingsNavProps> = ({
  activeTab,
  onTabSelect,
}) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "rgba(120, 120, 128, 0.12)",
        borderRadius: "12px",
        padding: "3px",
        gap: "4px",
        userSelect: "none",
        WebkitUserSelect: "none",
        border: "1px solid var(--glass-border)",
      }}
      role="tablist"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabSelect(tab.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "9px",
              border: "none",
              backgroundColor: isActive ? "var(--accent-color)" : "transparent",
              color: isActive ? "#FFFFFF" : "var(--text-secondary)",
              fontFamily: "inherit",
              fontSize: "0.88rem",
              fontWeight: isActive ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.18s cubic-bezier(0.25, 1, 0.5, 1)",
              boxShadow: isActive ? "0 2px 8px rgba(10, 132, 255, 0.3)" : "none",
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
