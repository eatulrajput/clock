import { create } from "zustand";

export interface Alarm {
  id: string;
  time: string; // "HH:MM" in 24hr format
  label: string;
  active: boolean;
  days: number[]; // 0=Sun, 1=Mon, etc. (empty = one-shot)
  snoozedUntil?: number; // timestamp
  lastTriggered?: number; // timestamp
}

interface AlarmState {
  alarms: Alarm[];
  ringingAlarmIds: string[]; // List of currently ringing alarms
  addAlarm: (alarm: Omit<Alarm, "id">) => void;
  updateAlarm: (id: string, updates: Partial<Alarm>) => void;
  removeAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  triggerAlarm: (id: string) => void;
  dismissAlarm: (id: string) => void;
  snoozeAlarm: (id: string, snoozeMinutes?: number) => void;
}

const loadAlarms = (): Alarm[] => {
  const saved = localStorage.getItem("clock_alarms");
  return saved ? JSON.parse(saved) : [];
};

export const useAlarmStore = create<AlarmState>((set, get) => ({
  alarms: loadAlarms(),
  ringingAlarmIds: [],
  
  addAlarm: (alarm) => {
    const newAlarm = { ...alarm, id: crypto.randomUUID() };
    const newAlarms = [...get().alarms, newAlarm].sort((a, b) => a.time.localeCompare(b.time));
    localStorage.setItem("clock_alarms", JSON.stringify(newAlarms));
    set({ alarms: newAlarms });
  },
  
  updateAlarm: (id, updates) => {
    const newAlarms = get().alarms.map((a) => (a.id === id ? { ...a, ...updates } : a));
    localStorage.setItem("clock_alarms", JSON.stringify(newAlarms));
    set({ alarms: newAlarms });
  },
  
  removeAlarm: (id) => {
    const newAlarms = get().alarms.filter((a) => a.id !== id);
    localStorage.setItem("clock_alarms", JSON.stringify(newAlarms));
    set({ alarms: newAlarms, ringingAlarmIds: get().ringingAlarmIds.filter(rId => rId !== id) });
  },
  
  toggleAlarm: (id) => {
    const newAlarms = get().alarms.map((a) => {
      if (a.id === id) {
        // If toggling off, clear snoozed state
        return { ...a, active: !a.active, snoozedUntil: undefined };
      }
      return a;
    });
    localStorage.setItem("clock_alarms", JSON.stringify(newAlarms));
    set({ alarms: newAlarms, ringingAlarmIds: get().ringingAlarmIds.filter(rId => rId !== id) });
  },

  triggerAlarm: (id) => {
    // Mark as triggered now, and add to ringing list
    const newAlarms = get().alarms.map((a) => (a.id === id ? { ...a, lastTriggered: Date.now(), snoozedUntil: undefined } : a));
    localStorage.setItem("clock_alarms", JSON.stringify(newAlarms));
    const currentRinging = get().ringingAlarmIds;
    if (!currentRinging.includes(id)) {
      set({ alarms: newAlarms, ringingAlarmIds: [...currentRinging, id] });
    } else {
      set({ alarms: newAlarms });
    }
  },

  dismissAlarm: (id) => {
    const alarm = get().alarms.find(a => a.id === id);
    let newAlarms = get().alarms;
    
    if (alarm) {
      // If it's a one-shot alarm, turn it off. Otherwise leave it active for the next day.
      const shouldTurnOff = alarm.days.length === 0;
      newAlarms = get().alarms.map(a => 
        a.id === id ? { ...a, active: !shouldTurnOff, snoozedUntil: undefined } : a
      );
      localStorage.setItem("clock_alarms", JSON.stringify(newAlarms));
    }
    
    set({ 
      alarms: newAlarms, 
      ringingAlarmIds: get().ringingAlarmIds.filter(rId => rId !== id) 
    });
  },

  snoozeAlarm: (id, snoozeMinutes = 9) => {
    const snoozeTime = Date.now() + snoozeMinutes * 60 * 1000;
    const newAlarms = get().alarms.map((a) => 
      a.id === id ? { ...a, snoozedUntil: snoozeTime } : a
    );
    localStorage.setItem("clock_alarms", JSON.stringify(newAlarms));
    
    set({ 
      alarms: newAlarms,
      ringingAlarmIds: get().ringingAlarmIds.filter(rId => rId !== id) 
    });
  }
}));
