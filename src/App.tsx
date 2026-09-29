import { useState, useEffect } from "react";
import { Globe, AlarmClock, Timer, TimerReset, Moon } from "lucide-react";
import "./App.css";
import { useTimeStore } from "./store/useTimeStore";
import { WorldClock } from "./modules/WorldClock/WorldClock";
import { Alarms } from "./modules/Alarms/Alarms";
import { AlarmRinger } from "./modules/Alarms/AlarmRinger";
import { Stopwatch } from "./modules/Stopwatch/Stopwatch";

type Module = "world-clock" | "alarms" | "stopwatch" | "timers" | "sleep";

function App() {
  const [activeModule, setActiveModule] = useState<Module>("world-clock");
  const initWorker = useTimeStore((state) => state.initWorker);

  useEffect(() => {
    initWorker();
  }, [initWorker]);

  const navItems = [
    { id: "world-clock", label: "World Clock", icon: <Globe size={20} /> },
    { id: "alarms", label: "Alarms", icon: <AlarmClock size={20} /> },
    { id: "stopwatch", label: "Stopwatch", icon: <TimerReset size={20} /> },
    { id: "timers", label: "Timers", icon: <Timer size={20} /> },
    { id: "sleep", label: "Bedtime", icon: <Moon size={20} /> },
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
        return <h2 className="text-title">Timers</h2>;
      case "sleep":
        return <h2 className="text-title">Bedtime Planner</h2>;
      default:
        return null;
    }
  };

  return (
    <div className="app-container" data-tauri-drag-region>
      <aside className="sidebar">
        {/* Important: allow dragging the window from the title/empty sidebar space */}
        <h1 style={{ WebkitAppRegion: "drag", cursor: "grab" } as any}>Project Clock</h1>
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

export default App;
