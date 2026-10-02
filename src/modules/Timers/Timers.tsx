import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTimerStore } from "../../store/useTimerStore";
import { useTimeStore } from "../../store/useTimeStore";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { startAlarmSound, stopAlarmSound } from "../../utils/audio";

/* ───────────────────────── helpers ───────────────────────── */

const formatMs = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return {
    hours: h.toString().padStart(2, "0"),
    minutes: m.toString().padStart(2, "0"),
    seconds: s.toString().padStart(2, "0"),
    totalSeconds,
  };
};

/* ──────────────────── circular progress ring ────────────── */

const RING_SIZE = 260;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface TimerRingProps {
  progress: number; // 0..1
  isCompleted: boolean;
}

const TimerRing: React.FC<TimerRingProps> = ({ progress, isCompleted }) => {
  const offset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <svg
      width={RING_SIZE}
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}
    >
      {/* Background track */}
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke="rgba(150,150,150,0.12)"
        strokeWidth={RING_STROKE}
      />
      {/* Progress arc */}
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke={isCompleted ? "#FF3B30" : "var(--accent-color)"}
        strokeWidth={RING_STROKE}
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.15s linear, stroke 0.3s" }}
      />
    </svg>
  );
};

/* ─────────────────── time-setter view ──────────────────── */

const TimerSetter: React.FC = () => {
  const { setTimer, start } = useTimerStore();

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [label, setLabel] = useState("");

  const presets = [
    { label: "1 min", ms: 60_000 },
    { label: "5 min", ms: 300_000 },
    { label: "10 min", ms: 600_000 },
    { label: "30 min", ms: 1_800_000 },
  ];

  const handlePreset = (ms: number) => {
    setTimer(ms);
    // start immediately after next render
    setTimeout(() => useTimerStore.getState().start(), 0);
  };

  const handleStart = () => {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    if (totalMs <= 0) return;
    setTimer(totalMs, label || undefined);
    setTimeout(() => useTimerStore.getState().start(), 0);
  };

  const scrollerStyle: React.CSSProperties = {
    width: "80px",
    textAlign: "center",
    fontSize: "3rem",
    fontWeight: 300,
    fontVariantNumeric: "tabular-nums",
    background: "rgba(150,150,150,0.08)",
    border: "1px solid var(--glass-border)",
    borderRadius: "14px",
    padding: "14px 4px",
    color: "var(--text-primary)",
    outline: "none",
    appearance: "none",
    MozAppearance: "textfield",
  };

  const separatorStyle: React.CSSProperties = {
    fontSize: "3rem",
    fontWeight: 300,
    color: "var(--text-secondary)",
    padding: "0 6px",
    userSelect: "none",
  };

  const unitLabelStyle: React.CSSProperties = {
    fontSize: "0.7rem",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginTop: "8px",
    textAlign: "center",
  };

  const isValid = hours > 0 || minutes > 0 || seconds > 0;

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "40px",
    }}>
      {/* Quick presets */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        {presets.map((p) => (
          <button
            key={p.ms}
            onClick={() => handlePreset(p.ms)}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              border: "1px solid var(--glass-border)",
              background: "rgba(10, 132, 255, 0.08)",
              color: "var(--accent-color)",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(10, 132, 255, 0.18)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(10, 132, 255, 0.08)")}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom time input */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <input
            type="number"
            min={0}
            max={23}
            value={hours}
            onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
            style={scrollerStyle}
          />
          <span style={unitLabelStyle}>Hours</span>
        </div>
        <span style={separatorStyle}>:</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            style={scrollerStyle}
          />
          <span style={unitLabelStyle}>Minutes</span>
        </div>
        <span style={separatorStyle}>:</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <input
            type="number"
            min={0}
            max={59}
            value={seconds}
            onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            style={scrollerStyle}
          />
          <span style={unitLabelStyle}>Seconds</span>
        </div>
      </div>

      {/* Label input */}
      <input
        type="text"
        placeholder="Label (optional)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        maxLength={30}
        style={{
          width: "320px",
          maxWidth: "90%",
          padding: "14px 16px",
          borderRadius: "12px",
          border: "1px solid var(--glass-border)",
          background: "rgba(150,150,150,0.08)",
          color: "var(--text-primary)",
          fontSize: "1rem",
          outline: "none",
          textAlign: "center",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-color)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--glass-border)")}
      />

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={!isValid}
        style={{
          padding: "16px 64px",
          borderRadius: "14px",
          border: "none",
          background: isValid ? "var(--accent-color)" : "rgba(150,150,150,0.15)",
          color: isValid ? "#FFF" : "rgba(150,150,150,0.4)",
          fontSize: "1.1rem",
          fontWeight: 600,
          cursor: isValid ? "pointer" : "default",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          if (isValid) e.currentTarget.style.background = "var(--accent-hover)";
        }}
        onMouseOut={(e) => {
          if (isValid) e.currentTarget.style.background = "var(--accent-color)";
        }}
      >
        Start Timer
      </button>
    </div>
  );
};

/* ──────────────── active countdown view ─────────────────── */

const TimerCountdown: React.FC = () => {
  const {
    duration, remainingAtPause, targetTimestamp,
    isRunning, isCompleted, label,
    start, pause, reset,
  } = useTimerStore();

  const [displayRemaining, setDisplayRemaining] = useState(remainingAtPause);
  const requestRef = useRef<number>(0);

  const animate = useCallback(() => {
    if (isRunning && targetTimestamp) {
      setDisplayRemaining(Math.max(0, targetTimestamp - Date.now()));
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning, targetTimestamp]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setDisplayRemaining(remainingAtPause);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, targetTimestamp, remainingAtPause, animate]);

  const progress = duration > 0 ? displayRemaining / duration : 0;
  const { hours, minutes, seconds } = formatMs(displayRemaining);
  const showHours = duration >= 3600000;

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
    }}>
      {/* Label */}
      <span style={{
        fontSize: "0.9rem",
        fontWeight: 600,
        color: "var(--text-secondary)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}>
        {label}
      </span>

      {/* Ring + Time */}
      <div style={{
        position: "relative",
        width: RING_SIZE,
        height: RING_SIZE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
      }}>
        <TimerRing progress={progress} isCompleted={isCompleted} />
        <span style={{
          fontVariantNumeric: "tabular-nums",
          fontSize: showHours ? "2.8rem" : "3.5rem",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          zIndex: 1,
          color: isCompleted ? "#FF3B30" : "var(--text-primary)",
        }}>
          {showHours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`}
        </span>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "24px" }}>
        {/* Play / Pause */}
        {!isCompleted && (
          <button
            onClick={() => (isRunning ? pause() : start())}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: isRunning
                ? "rgba(255, 149, 0, 0.15)"
                : "rgba(10, 132, 255, 0.15)",
              color: isRunning ? "#FF9500" : "var(--accent-color)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = isRunning
                ? "rgba(255, 149, 0, 0.25)"
                : "rgba(10, 132, 255, 0.25)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = isRunning
                ? "rgba(255, 149, 0, 0.15)"
                : "rgba(10, 132, 255, 0.15)")
            }
          >
            {isRunning
              ? <Pause size={30} fill="currentColor" />
              : <Play size={30} fill="currentColor" style={{ marginLeft: "4px" }} />}
          </button>
        )}

        {/* Reset */}
        <button
          onClick={reset}
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "rgba(150, 150, 150, 0.15)",
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(150, 150, 150, 0.25)")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(150, 150, 150, 0.15)")}
        >
          <RotateCcw size={26} />
        </button>

        {/* Cancel — go back to setter */}
        <button
          onClick={() => useTimerStore.getState().setTimer(0)}
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "rgba(255, 59, 48, 0.12)",
            color: "#FF3B30",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 59, 48, 0.22)")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 59, 48, 0.12)")}
        >
          <X size={26} />
        </button>
      </div>
    </div>
  );
};

/* ───────────────── completion overlay ────────────────────── */

const TimerCompletionOverlay: React.FC = () => {
  const { isRinging, label, dismiss, reset, start, duration } = useTimerStore();

  if (!isRinging) return null;

  const handleRepeat = () => {
    reset();
    setTimeout(() => useTimerStore.getState().start(), 0);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        WebkitAppRegion: "no-drag",
      } as React.CSSProperties & { WebkitAppRegion?: string }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          border: "3px solid #FF3B30",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "32px",
          animation: "pulse-ring 1.5s ease-in-out infinite",
        }}
      >
        <span style={{ fontSize: "2.5rem", fontWeight: 300, color: "#FF3B30" }}>0:00</span>
      </div>

      <h2 style={{ fontSize: "1.8rem", fontWeight: 500, marginBottom: "8px" }}>
        Timer Complete
      </h2>
      <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", marginBottom: "48px" }}>
        {label}
      </p>

      <div style={{ display: "flex", gap: "16px" }}>
        <button
          onClick={handleRepeat}
          style={{
            padding: "18px 40px",
            borderRadius: "100px",
            border: "none",
            fontSize: "1.15rem",
            fontWeight: 600,
            background: "rgba(255,255,255,0.2)",
            color: "#FFF",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
        >
          Repeat
        </button>
        <button
          onClick={dismiss}
          style={{
            padding: "18px 40px",
            borderRadius: "100px",
            border: "none",
            fontSize: "1.15rem",
            fontWeight: 600,
            background: "var(--accent-color)",
            color: "#FFF",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "var(--accent-color)")}
        >
          Dismiss
        </button>
      </div>

      <style>
        {`
          @keyframes pulse-ring {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.7; }
          }
        `}
      </style>
    </div>
  );
};

/* ─────────────────── main Timers view ────────────────────── */

export const Timers: React.FC = () => {
  const { duration, isRinging, tick } = useTimerStore();
  const now = useTimeStore((s) => s.now);

  // Use the web worker tick to check for timer completion
  useEffect(() => {
    tick();
  }, [now, tick]);

  // Play alarm sound when timer completes
  useEffect(() => {
    if (isRinging) {
      startAlarmSound();
    } else {
      stopAlarmSound();
    }
  }, [isRinging]);

  const hasTimer = duration > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h2 className="text-title">Timer</h2>

      {hasTimer ? <TimerCountdown /> : <TimerSetter />}

      <TimerCompletionOverlay />
    </div>
  );
};
