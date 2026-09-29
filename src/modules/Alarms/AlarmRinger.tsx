import React, { useEffect, useState } from "react";
import { useTimeStore } from "../../store/useTimeStore";
import { useAlarmStore } from "../../store/useAlarmStore";
import { startAlarmSound, stopAlarmSound } from "../../utils/audio";
import { BellRing } from "lucide-react";

export const AlarmRinger: React.FC = () => {
  const now = useTimeStore((state) => state.now);
  const { alarms, ringingAlarmIds, triggerAlarm, dismissAlarm, snoozeAlarm } = useAlarmStore();
  const [activeRingingAlarm, setActiveRingingAlarm] = useState<string | null>(null);

  // Core alarm checking engine - runs every tick (100ms)
  useEffect(() => {
    const currentNow = new Date(now);
    const currentHour = currentNow.getHours();
    const currentMinute = currentNow.getMinutes();
    const currentDay = currentNow.getDay();
    const currentTimeStr = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    alarms.forEach((alarm) => {
      if (!alarm.active) return;
      let shouldRing = false;

      // Check if it's snoozed and the snooze time has elapsed
      if (alarm.snoozedUntil && alarm.snoozedUntil <= now) {
        shouldRing = true;
      } else if (!alarm.snoozedUntil) {
        // Normal time check
        if (alarm.time === currentTimeStr) {
          // Check days
          if (alarm.days.length === 0 || alarm.days.includes(currentDay)) {
            // Ensure we don't repeatedly trigger for the entire minute.
            const oneMinute = 60 * 1000;
            if (!alarm.lastTriggered || now - alarm.lastTriggered > oneMinute) {
              shouldRing = true;
            }
          }
        }
      }

      if (shouldRing && !ringingAlarmIds.includes(alarm.id)) {
        triggerAlarm(alarm.id);
      }
    });
  }, [now, alarms, ringingAlarmIds, triggerAlarm]);

  // Audio and Overlay UI Management
  useEffect(() => {
    if (ringingAlarmIds.length > 0) {
      startAlarmSound();
      // Pick the first ringing alarm to display
      setActiveRingingAlarm(ringingAlarmIds[0]);
    } else {
      stopAlarmSound();
      setActiveRingingAlarm(null);
    }
  }, [ringingAlarmIds]);

  if (!activeRingingAlarm) return null;

  const alarmToDisplay = alarms.find((a) => a.id === activeRingingAlarm);
  if (!alarmToDisplay) return null;

  // Format time properly to 12-hour AM/PM for the big display
  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      backdropFilter: "blur(40px) saturate(200%)",
      WebkitBackdropFilter: "blur(40px) saturate(200%)",
      zIndex: 9999, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", color: "#FFF",
      WebkitAppRegion: "no-drag" // Make sure clicks work!
    } as React.CSSProperties & { WebkitAppRegion?: string }}>
      <BellRing size={80} color="var(--accent-color)" style={{ marginBottom: "24px", animation: "ring 0.8s ease-in-out infinite alternate" }} />
      <h1 className="text-hero" style={{ fontSize: "5rem", marginBottom: "16px" }}>
        {formatTime(alarmToDisplay.time)}
      </h1>
      <h2 style={{ fontSize: "2rem", fontWeight: 500, marginBottom: "64px" }}>
        {alarmToDisplay.label}
      </h2>

      <div style={{ display: "flex", gap: "24px" }}>
        <button 
          onClick={() => snoozeAlarm(alarmToDisplay.id, 9)} // 9-minute snooze by default
          style={{
            padding: "20px 48px", borderRadius: "100px", border: "none", fontSize: "1.25rem", fontWeight: 600,
            background: "rgba(255,255,255,0.2)", color: "#FFF", cursor: "pointer", transition: "background 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
          onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        >
          Snooze
        </button>
        <button 
          onClick={() => dismissAlarm(alarmToDisplay.id)}
          style={{
            padding: "20px 48px", borderRadius: "100px", border: "none", fontSize: "1.25rem", fontWeight: 600,
            background: "var(--accent-color)", color: "#FFF", cursor: "pointer", transition: "background 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "var(--accent-hover)"}
          onMouseOut={(e) => e.currentTarget.style.background = "var(--accent-color)"}
        >
          Stop
        </button>
      </div>

      <style>
        {`
          @keyframes ring {
            0% { transform: rotate(-20deg); }
            100% { transform: rotate(20deg); }
          }
        `}
      </style>
    </div>
  );
};
