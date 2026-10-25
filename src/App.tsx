/**
 * ============================================================================
 * File: App.tsx
 * Module: Root Application Container
 * Architectural Responsibility:
 *   Root composition shell of Project Clock. Coordinates the master timekeeping
 *   WebWorker initialization, background surface rendering via `DynamicBackground`,
 *   desktop navigation rail via `SidebarNavigation`, and view routing.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple Liquid Glass aesthetic with multi-layer translucency and backdrop filter.
 *   - Global headless `AlarmRinger` listener ensures scheduled alarms fire universally.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed: React.FC with zero `any` usage.
 *   - Zero Null Policy: All absence of elements uses undefined.
 *     No `null` keyword used throughout implementation.
 *
 * State & Dependency Boundaries:
 *   - Master Worker: Initializes `initWorker()` in `useTimeStore`.
 *   - Preferences: Consumes appearance settings from `useSettingsStore`.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import "./App.css";
import { useTimeStore } from "./store/useTimeStore";
import { useSettingsStore } from "./store/useSettingsStore";
import { DynamicBackground } from "./components/layout/Background/DynamicBackground";
import { SidebarNavigation } from "./components/layout/Navigation/SidebarNavigation";
import { AppModuleIdentifier } from "./components/layout/Navigation/types";
import { TitleBar } from "./components/layout/TitleBar/TitleBar";
import { Clock } from "./modules/Clock/Clock";
import { WorldClock } from "./modules/WorldClock/WorldClock";
import { Alarms } from "./modules/Alarms/Alarms";
import { AlarmRinger } from "./modules/Alarms/AlarmRinger";
import { Stopwatch } from "./modules/Stopwatch/Stopwatch";
import { Timers } from "./modules/Timers/Timers";
import { Settings } from "./modules/Settings/Settings";

function App(): React.ReactElement {
  const [activeModule, setActiveModule] = useState<AppModuleIdentifier>("clock");
  const initWorker = useTimeStore((state) => state.initWorker);

  // Appearance settings selectors
  const bgMode = useSettingsStore((s) => s.bgMode);
  const bgColor = useSettingsStore((s) => s.bgColor);
  const bgImageUrl = useSettingsStore((s) => s.bgImageUrl);
  const gradientFrom = useSettingsStore((s) => s.gradientFrom);
  const gradientTo = useSettingsStore((s) => s.gradientTo);
  const gradientAngle = useSettingsStore((s) => s.gradientAngle);
  const transparencyEnabled = useSettingsStore((s) => s.transparencyEnabled);
  const transparencyAmount = useSettingsStore((s) => s.transparencyAmount);
  const blurEnabled = useSettingsStore((s) => s.blurEnabled);
  const blurAmount = useSettingsStore((s) => s.blurAmount);

  // Initialize master WebWorker and prevent accidental text selections
  useEffect(() => {
    initWorker();

    const handleSelectStart = (event: Event) => {
      const targetElement = event.target as HTMLElement | undefined;
      if (
        targetElement &&
        targetElement.tagName !== "INPUT" &&
        targetElement.tagName !== "TEXTAREA" &&
        !targetElement.isContentEditable
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("selectstart", handleSelectStart);
    return () => document.removeEventListener("selectstart", handleSelectStart);
  }, [initWorker]);

  const renderActiveModuleContent = (): React.ReactElement => {
    switch (activeModule) {
      case "clock":
        return <Clock />;
      case "world-clock":
        return <WorldClock />;
      case "alarms":
        return <Alarms />;
      case "stopwatch":
        return <Stopwatch />;
      case "timers":
        return <Timers />;
      case "settings":
        return <Settings />;
    }
  };

  return (
    <DynamicBackground
      mode={bgMode}
      solidColorHex={bgColor}
      gradientFromHex={gradientFrom}
      gradientToHex={gradientTo}
      gradientAngleDegrees={gradientAngle}
      imageUri={bgImageUrl}
      isTransparencyEnabled={transparencyEnabled}
      transparencyPercent={transparencyAmount}
      isBlurEnabled={blurEnabled}
      blurRadiusPixels={blurAmount}
    >
      <TitleBar />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <SidebarNavigation
          activeModule={activeModule}
          onModuleSelect={setActiveModule}
        />

        <main className="main-content" style={{ flex: 1, overflow: "hidden" }}>
          {renderActiveModuleContent()}
        </main>
      </div>

      {/* Global alarm listener mounted at application root */}
      <AlarmRinger />
    </DynamicBackground>
  );
}

export default App;
