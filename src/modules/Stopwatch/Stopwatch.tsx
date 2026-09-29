import React, { useEffect, useState, useRef } from "react";
import { useStopwatchStore } from "../../store/useStopwatchStore";
import { Play, Square, RotateCcw, Flag } from "lucide-react";

const formatTime = (ms: number) => {
  // Using Date is easy but can have issues if duration is > 24 hours. 
  // Let's calculate manually to be safe.
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  const centiseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, "0");
  return { minutes, seconds, centiseconds };
};

export const Stopwatch: React.FC = () => {
  const { isRunning, startTime, elapsedTime, laps, start, stop, reset, lap } = useStopwatchStore();
  const [displayTime, setDisplayTime] = useState(elapsedTime);
  const requestRef = useRef<number>(0);

  const updateTime = () => {
    if (isRunning && startTime) {
      setDisplayTime(elapsedTime + (Date.now() - startTime));
      requestRef.current = requestAnimationFrame(updateTime);
    }
  };

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(updateTime);
    } else {
      setDisplayTime(elapsedTime);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, startTime, elapsedTime]);

  const { minutes, seconds, centiseconds } = formatTime(displayTime);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h2 className="text-title">Stopwatch</h2>
      
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: "40px" }}>
          <span className="text-hero" style={{ fontVariantNumeric: "tabular-nums" }}>
            {minutes}:{seconds}
          </span>
          <span style={{ fontSize: "2.5rem", color: "var(--text-secondary)", marginLeft: "8px", fontWeight: 300, fontVariantNumeric: "tabular-nums" }}>
            .{centiseconds}
          </span>
        </div>

        <div style={{ display: "flex", gap: "24px", marginBottom: "48px" }}>
          {!isRunning ? (
            <button
              onClick={start}
              style={{
                width: "80px", height: "80px", borderRadius: "50%",
                border: "none", backgroundColor: "rgba(10, 132, 255, 0.15)",
                color: "var(--accent-color)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(10, 132, 255, 0.25)"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(10, 132, 255, 0.15)"}
            >
              <Play size={32} fill="currentColor" style={{ marginLeft: "6px" }} />
            </button>
          ) : (
            <button
              onClick={stop}
              style={{
                width: "80px", height: "80px", borderRadius: "50%",
                border: "none", backgroundColor: "rgba(255, 59, 48, 0.15)",
                color: "#FF3B30", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 59, 48, 0.25)"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 59, 48, 0.15)"}
            >
              <Square size={28} fill="currentColor" />
            </button>
          )}

          <button
            onClick={isRunning ? lap : reset}
            disabled={!isRunning && displayTime === 0}
            style={{
              width: "80px", height: "80px", borderRadius: "50%",
              border: "none", backgroundColor: "rgba(150, 150, 150, 0.15)",
              color: (!isRunning && displayTime === 0) ? "rgba(150, 150, 150, 0.3)" : "var(--text-primary)",
              cursor: (!isRunning && displayTime === 0) ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => (!isRunning && displayTime === 0) ? null : e.currentTarget.style.backgroundColor = "rgba(150, 150, 150, 0.25)"}
            onMouseOut={(e) => (!isRunning && displayTime === 0) ? null : e.currentTarget.style.backgroundColor = "rgba(150, 150, 150, 0.15)"}
          >
            {isRunning ? <Flag size={28} /> : <RotateCcw size={28} />}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {laps.map((lapTime, index) => {
          const previousLap = laps[index + 1] || 0;
          const lapDuration = lapTime - previousLap;
          const totalFormatted = formatTime(lapTime);
          const lapFormatted = formatTime(lapDuration);
          
          return (
            <div key={laps.length - index} style={{ 
              display: "flex", justifyContent: "space-between", 
              padding: "16px 0", borderBottom: "1px solid var(--glass-border)",
              color: index === 0 && isRunning ? "var(--text-primary)" : "var(--text-secondary)"
            }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>Lap {laps.length - index}</span>
              <div style={{ display: "flex", gap: "24px", fontFamily: "monospace", fontSize: "1.2rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>
                  +{lapFormatted.minutes}:{lapFormatted.seconds}.{lapFormatted.centiseconds}
                </span>
                <span style={{ color: "var(--text-primary)", minWidth: "90px", textAlign: "right" }}>
                  {totalFormatted.minutes}:{totalFormatted.seconds}.{totalFormatted.centiseconds}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
