import React, { useState } from "react";
import { Plus, X, Bell } from "lucide-react";
import { useAlarmStore, Alarm } from "../../store/useAlarmStore";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const Alarms: React.FC = () => {
  const { alarms, addAlarm, toggleAlarm, removeAlarm } = useAlarmStore();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Alarm State
  const [newTime, setNewTime] = useState("07:00");
  const [newLabel, setNewLabel] = useState("Alarm");
  const [newDays, setNewDays] = useState<number[]>([]);

  const handleSave = () => {
    addAlarm({
      time: newTime,
      label: newLabel,
      active: true,
      days: newDays
    });
    setIsAddOpen(false);
    // Reset defaults
    setNewTime("07:00");
    setNewLabel("Alarm");
    setNewDays([]);
  };

  const toggleDay = (dayIdx: number) => {
    if (newDays.includes(dayIdx)) {
      setNewDays(newDays.filter(d => d !== dayIdx));
    } else {
      setNewDays([...newDays, dayIdx].sort());
    }
  };

  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "100%", overflowY: "auto", paddingRight: "12px", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10, paddingBottom: "12px" }}>
        <h2 className="text-title" style={{ marginBottom: 0 }}>Alarms</h2>
        <button 
          onClick={() => setIsAddOpen(true)}
          style={{ background: "transparent", border: "none", color: "var(--accent-color)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", borderRadius: "50%" }}>
          <Plus size={28} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "40px" }}>
        {alarms.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "40px" }}>
            <Bell size={48} style={{ opacity: 0.2, marginBottom: "16px" }} />
            <p>No alarms set</p>
          </div>
        ) : (
          alarms.map((alarm) => (
            <div key={alarm.id} className="glass-panel" style={{ 
              display: "flex", alignItems: "center", justifyContent: "space-between",
              opacity: alarm.active ? 1 : 0.6, transition: "opacity 0.3s ease"
            }}>
              <div>
                <div className="text-hero" style={{ fontSize: "3rem", fontWeight: 300, marginBottom: "8px" }}>
                  {formatTime(alarm.time)}
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>{alarm.label}</span>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    {alarm.days.length === 0 ? "Once" : alarm.days.length === 7 ? "Every day" : alarm.days.map(d => DAYS[d]).join(", ")}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                {/* iOS style Toggle Switch */}
                <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", position: "relative" }}>
                  <input type="checkbox" checked={alarm.active} onChange={() => toggleAlarm(alarm.id)} style={{ opacity: 0, position: "absolute", zIndex: -1 }} />
                  <div style={{ 
                    width: "50px", height: "30px", borderRadius: "15px", 
                    background: alarm.active ? "var(--accent-color)" : "rgba(128,128,128,0.3)",
                    transition: "background 0.3s", position: "relative"
                  }}>
                    <div style={{
                      width: "26px", height: "26px", borderRadius: "50%", background: "#FFF",
                      position: "absolute", top: "2px", left: alarm.active ? "22px" : "2px",
                      transition: "left 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }} />
                  </div>
                </label>
                
                <button 
                  onClick={() => removeAlarm(alarm.id)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "4px" }}>
                  <X size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isAddOpen && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "var(--bg-color)", backdropFilter: "blur(20px) saturate(150%)", zIndex: 50,
          borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <button onClick={() => setIsAddOpen(false)} style={{ background: "none", border: "none", color: "var(--accent-color)", fontSize: "1.1rem", cursor: "pointer" }}>
              Cancel
            </button>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>Add Alarm</h3>
            <button onClick={handleSave} style={{ background: "none", border: "none", color: "var(--accent-color)", fontSize: "1.1rem", fontWeight: 600, cursor: "pointer" }}>
              Save
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
            <input 
              type="time" 
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              style={{
                fontSize: "4rem", background: "transparent", border: "none", color: "var(--text-primary)",
                fontFamily: "inherit", fontWeight: 300, textAlign: "center", outline: "none", 
                width: "100%", padding: "16px 0"
              }}
            />

            <input 
              type="text" 
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Label"
              style={{
                width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid var(--glass-border)",
                background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", fontSize: "1.1rem", outline: "none"
              }}
            />

            <div style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)" }}>
              <div style={{ marginBottom: "16px", fontWeight: 500 }}>Repeat</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {DAYS.map((day, idx) => {
                  const isActive = newDays.includes(idx);
                  return (
                    <div 
                      key={day} 
                      onClick={() => toggleDay(idx)}
                      style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", fontSize: "0.9rem", fontWeight: 500,
                        background: isActive ? "var(--accent-color)" : "transparent",
                        color: isActive ? "#FFF" : "var(--text-primary)",
                        transition: "all 0.2s"
                      }}
                    >
                      {day.charAt(0)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
