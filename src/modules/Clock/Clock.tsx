/**
 * ============================================================================
 * File: Clock.tsx
 * Module: Clock / Root Module Container
 * Architectural Responsibility:
 *   Top-level coordinator for the primary Clock tab. Composes the `DateBanner`
 *   and `DigitalClockHero` components wrapped in a liquid `GlassPanel`.
 *
 * Design Guidelines & HIG Compliance:
 *   - Apple Liquid Glass translucent floating panel presentation.
 *   - Centered symmetrical viewport layout.
 *
 * Type Safety & Null Handling Contract:
 *   - Fully Type Checked: Strict React.FC implementation.
 *   - Zero Null Policy: No `null` keyword used throughout implementation.
 * ============================================================================
 */

import React from "react";
import { useTimeStore } from "../../store/useTimeStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { DateBanner } from "./components/DateBanner";
import { DigitalClockHero } from "./components/DigitalClockHero";
import { GlassPanel } from "../../components/ui/GlassPanel/GlassPanel";

/**
 * Root Clock module view.
 */
export const Clock: React.FC = () => {
  const currentEpoch = useTimeStore((state) => state.now);
  const use24Hour = useSettingsStore((state) => state.use24Hour);
  const showSeconds = useSettingsStore((state) => state.showSeconds);
  const clockTimezone = useSettingsStore((state) => state.clockTimezone);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <GlassPanel
        elevation="elevated"
        paddingPixels={48}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "32px",
          minWidth: "480px",
        }}
      >
        <DateBanner
          epochMilliseconds={currentEpoch}
          timezoneIana={clockTimezone}
        />

        <DigitalClockHero
          epochMilliseconds={currentEpoch}
          use24Hour={use24Hour}
          showSeconds={showSeconds}
          timezoneIana={clockTimezone}
        />
      </GlassPanel>
    </div>
  );
};
