/**
 * ============================================================================
 * File: Settings.tsx
 * Module: Settings / Root Module Container
 * Architectural Responsibility:
 *   Top-level coordinator for the Settings tab. Composes the `SettingsNav`,
 *   `AppearanceSettings`, `GeneralSettings`, and `AudioSettings` components.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple HIG macOS-style grouped preferences layout.
 *   - Instant reactive application updates without requiring manual save clicks.
 *
 * Type Safety & Null Handling Contract:
 *   - Fully Type Checked: Strict React.FC implementation.
 *   - Zero Null Policy: No `null` keyword used throughout implementation.
 * ============================================================================
 */

import React, { useState } from "react";
import { SettingsTabId } from "./types";
import { SettingsNav } from "./components/SettingsNav";
import { AppearanceSettings } from "./components/AppearanceSettings";
import { GeneralSettings } from "./components/GeneralSettings";
import { AudioSettings } from "./components/AudioSettings";
import { GlassPanel } from "../../components/ui/GlassPanel/GlassPanel";
import { Clock, ShieldCheck } from "lucide-react";

/**
 * Root Settings module view.
 */
export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("appearance");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        gap: "20px",
      }}
    >
      {/* Title & Segmented Category Tab Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <h2 className="text-title" style={{ margin: 0 }}>
          Settings
        </h2>

        <SettingsNav activeTab={activeTab} onTabSelect={setActiveTab} />
      </div>

      {/* Main Settings Category Content */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "6px", paddingBottom: "32px" }}>
        {activeTab === "appearance" ? (
          <AppearanceSettings />
        ) : activeTab === "general" ? (
          <GeneralSettings />
        ) : activeTab === "audio" ? (
          <AudioSettings />
        ) : (
          /* About Section */
          <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <GlassPanel elevation="flat" paddingPixels={24}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    backgroundColor: "var(--accent-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                  }}
                >
                  <Clock size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>
                    Project Clock Desktop
                  </h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Version 1.0.0 · Production Modular Architecture
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  color: "var(--text-secondary)",
                  marginBottom: "16px",
                }}
              >
                High-performance desktop clock application designed for macOS, Windows, and Linux
                utilizing Tauri native WebViews, React 19, and Apple HIG Liquid Glass principles.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.82rem",
                  color: "var(--accent-color)",
                }}
              >
                <ShieldCheck size={16} />
                <span>Strictly Type Checked · Zero Null Architecture</span>
              </div>
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  );
};
