/**
 * ============================================================================
 * File: AudioSettings.tsx
 * Module: Settings / Components
 * Architectural Responsibility:
 *   Audio preferences section managing alarm volume, synthesized sound themes,
 *   and real-time sound playback testing.
 *
 * Design Guidelines & HIG Compliance:
 *   - Audio playback preview with immediate feedback.
 *   - Volume slider with percentage indicator.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Consumes `useSettingsStore` actions and state.
 *   - Zero Null Policy: All absence of elements uses undefined.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { useSettingsStore } from "../../../store/useSettingsStore";
import { Button } from "../../../components/ui/Button/Button";
import { startAlarmSound, stopAlarmSound } from "../../../utils/audio";
import { Volume2, VolumeX, Play, Square } from "lucide-react";

/**
 * Audio preferences and sound test view.
 */
export const AudioSettings: React.FC = () => {
  const { alarmVolume, setAlarmVolume } = useSettingsStore();
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  useEffect(() => {
    return () => {
      stopAlarmSound();
    };
  }, []);

  const handleToggleTest = () => {
    if (isPlayingTest) {
      stopAlarmSound();
      setIsPlayingTest(false);
    } else {
      startAlarmSound();
      setIsPlayingTest(true);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "680px" }}>
      {/* Alert Volume */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)" }}>
            Alarm & Timer Volume
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Output loudness level for alert tones
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {alarmVolume === 0 ? (
            <VolumeX size={18} style={{ color: "var(--text-secondary)" }} />
          ) : (
            <Volume2 size={18} style={{ color: "var(--accent-color)" }} />
          )}

          <input
            type="range"
            min={0}
            max={100}
            value={alarmVolume}
            onChange={(e) => setAlarmVolume(parseInt(e.target.value, 10) || 80)}
            style={{ width: "160px", accentColor: "var(--accent-color)" }}
          />

          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--text-primary)",
              width: "36px",
            }}
          >
            {alarmVolume}%
          </span>
        </div>
      </div>

      {/* Test Sound */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)" }}>
            Test Audio Output
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Play an alert ring tone to verify speaker output
          </span>
        </div>

        <Button
          variant={isPlayingTest ? "destructive" : "secondary"}
          size="small"
          leadingIcon={isPlayingTest ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          onClick={handleToggleTest}
        >
          {isPlayingTest ? "Stop Sound" : "Test Sound"}
        </Button>
      </div>
    </div>
  );
};
