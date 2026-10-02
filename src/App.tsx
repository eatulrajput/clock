import { useState, useEffect } from "react";
import { Globe, AlarmClock, Timer, TimerReset, Settings as SettingsIcon, X, Minus, Maximize2 } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";
import { useTimeStore } from "./store/useTimeStore";
import { useSettingsStore } from "./store/useSettingsStore";
import { WorldClock } from "./modules/WorldClock/WorldClock";
import { Alarms } from "./modules/Alarms/Alarms";
import { AlarmRinger } from "./modules/Alarms/AlarmRinger";
import { Stopwatch } from "./modules/Stopwatch/Stopwatch";
import { Timers } from "./modules/Timers/Timers";
import { Settings } from "./modules/Settings/Settings";

type Module = "world-clock" | "alarms" | "stopwatch" | "timers" | "settings";

function App() {
  const [activeModule, setActiveModule] = useState<Module>("world-clock");
  const initWorker = useTimeStore((state) => state.initWorker);

  // Appearance settings
  const transparencyEnabled = useSettingsStore((s) => s.transparencyEnabled);
  const transparencyAmount = useSettingsStore((s) => s.transparencyAmount);
  const bgMode = useSettingsStore((s) => s.bgMode);
  const bgColor = useSettingsStore((s) => s.bgColor);
  const bgImageUrl = useSettingsStore((s) => s.bgImageUrl);
  const gradientFrom = useSettingsStore((s) => s.gradientFrom);
  const gradientTo = useSettingsStore((s) => s.gradientTo);
  const gradientAngle = useSettingsStore((s) => s.gradientAngle);
  const blurEnabled = useSettingsStore((s) => s.blurEnabled);
  const blurAmount = useSettingsStore((s) => s.blurAmount);

  useEffect(() => {
    initWorker();
  }, [initWorker]);

  const navItems = [
    { id: "world-clock", label: "World Clock", icon: <Globe size={20} /> },
    { id: "alarms", label: "Alarms", icon: <AlarmClock size={20} /> },
    { id: "stopwatch", label: "Stopwatch", icon: <TimerReset size={20} /> },
    { id: "timers", label: "Timers", icon: <Timer size={20} /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon size={20} /> },
  ] as const;

  const renderContent = () => {
    switch (activeModule) {
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
      default:
        return null;
    }
  };

  // Build dynamic background
  const opacity = transparencyEnabled ? transparencyAmount / 100 : 1;

  let backgroundColor: string;
  if (bgMode === "gradient") {
    // For gradients, we apply via `background` (not backgroundColor) so use a flag below
    backgroundColor = "transparent";
  } else {
    // Convert hex to rgba with transparency
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  const backgroundGradient =
    bgMode === "gradient"
      ? `linear-gradient(${gradientAngle}deg, ${hexToRgba(gradientFrom, opacity)}, ${hexToRgba(gradientTo, opacity)})`
      : undefined;

  let backgroundValue = backgroundGradient;
  if (bgMode === "image" && bgImageUrl) {
    backgroundValue = `url('${bgImageUrl}') center/cover no-repeat`;
  }

  const blurFilter = blurEnabled
    ? `blur(${blurAmount}px) saturate(150%)`
    : "none";

  const containerStyle = {
    backgroundColor: bgMode === "solid" ? backgroundColor : undefined,
    background: backgroundValue,
    backdropFilter: blurFilter,
    WebkitBackdropFilter: blurFilter,
    "--glass-blur": blurFilter,
  } as React.CSSProperties;

  return (
    <div className="app-container" style={containerStyle}>
      <aside className="sidebar">
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button
            onClick={() => getCurrentWindow().close()}
            className="window-btn close-btn"
            title="Close"
          >
            <X size={10} />
          </button>
          <button
            onClick={() => getCurrentWindow().minimize()}
            className="window-btn min-btn"
            title="Minimize"
          >
            <Minus size={10} />
          </button>
          <button
            onClick={() => getCurrentWindow().toggleMaximize()}
            className="window-btn max-btn"
            title="Maximize"
          >
            <Maximize2 size={10} />
          </button>
        </div>

        <h1 data-tauri-drag-region style={{ cursor: "grab", marginBottom: "24px", userSelect: "none" }}>Project Clock</h1>
        <nav>
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeModule === item.id ? "active" : ""}`}
              onClick={() => setActiveModule(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {renderContent()}
      </main>
      <AlarmRinger />
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default App;
