import React from "react";
import { useTimeStore } from "../../store/useTimeStore";
import { useSettingsStore } from "../../store/useSettingsStore";

export const Clock: React.FC = () => {
  const now = useTimeStore((state) => state.now);
  const use24Hour = useSettingsStore((state) => state.use24Hour);
  const showSeconds = useSettingsStore((state) => state.showSeconds);
  const clockTimezone = useSettingsStore((state) => state.clockTimezone);

  const date = new Date(now);

  const timeString = date.toLocaleTimeString(undefined, {
    timeZone: clockTimezone,
    hour: "numeric",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: !use24Hour,
  });

  const dateString = date.toLocaleDateString(undefined, {
    timeZone: clockTimezone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      position: "relative"
    }}>
      <div 
        className="glass-panel"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 80px",
          borderRadius: "32px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h2 style={{ 
          fontSize: "1.5rem", 
          fontWeight: 400, 
          color: "var(--text-secondary)",
          marginBottom: "16px",
          letterSpacing: "0.05em",
          textTransform: "uppercase"
        }}>
          {dateString}
        </h2>
        <div 
          className="text-hero" 
          style={{ 
            fontSize: "6rem", 
            fontWeight: 200, 
            background: "linear-gradient(135deg, var(--text-primary), var(--accent-color))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.2))"
          }}
        >
          {timeString}
        </div>
      </div>
    </div>
  );
};
