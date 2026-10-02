import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BgMode = "solid" | "gradient" | "image";

interface SettingsState {
  // General
  use24Hour: boolean;
  snoozeDuration: number; // minutes
  alarmVolume: number; // 0..100
  showSeconds: boolean; // world clock show seconds
  clockTimezone: string; // The primary timezone for the Clock page

  // Appearance
  transparencyEnabled: boolean;
  transparencyAmount: number; // 0..100 percent opacity
  bgMode: BgMode; // "solid", "gradient", or "image"
  bgColor: string; // hex color for solid background
  bgImageUrl: string; // URL for image background
  gradientFrom: string; // hex start color
  gradientTo: string; // hex end color
  gradientAngle: number; // degrees
  blurEnabled: boolean;
  blurAmount: number; // 0..50 px

  // General setters
  setUse24Hour: (val: boolean) => void;
  setSnoozeDuration: (val: number) => void;
  setAlarmVolume: (val: number) => void;
  setShowSeconds: (val: boolean) => void;
  setClockTimezone: (val: string) => void;

  // Appearance setters
  setTransparencyEnabled: (val: boolean) => void;
  setTransparencyAmount: (val: number) => void;
  setBgMode: (val: BgMode) => void;
  setBgColor: (val: string) => void;
  setBgImageUrl: (val: string) => void;
  setGradientFrom: (val: string) => void;
  setGradientTo: (val: string) => void;
  setGradientAngle: (val: number) => void;
  setBlurEnabled: (val: boolean) => void;
  setBlurAmount: (val: number) => void;

  resetAll: () => void;
}

const defaults = {
  use24Hour: false,
  snoozeDuration: 9,
  alarmVolume: 80,
  showSeconds: true,
  clockTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",

  transparencyEnabled: true,
  transparencyAmount: 65,
  bgMode: "solid" as BgMode,
  bgColor: "#1e1e1e",
  bgImageUrl: "",
  gradientFrom: "#1a1a2e",
  gradientTo: "#16213e",
  gradientAngle: 135,
  blurEnabled: true,
  blurAmount: 100,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,

      setUse24Hour: (val) => set({ use24Hour: val }),
      setSnoozeDuration: (val) => set({ snoozeDuration: val }),
      setAlarmVolume: (val) => set({ alarmVolume: val }),
      setShowSeconds: (val) => set({ showSeconds: val }),
      setClockTimezone: (val) => set({ clockTimezone: val }),

      setTransparencyEnabled: (val) => set({ transparencyEnabled: val }),
      setTransparencyAmount: (val) => set({ transparencyAmount: val }),
      setBgMode: (val) => set({ bgMode: val }),
      setBgColor: (val) => set({ bgColor: val }),
      setBgImageUrl: (val) => set({ bgImageUrl: val }),
      setGradientFrom: (val) => set({ gradientFrom: val }),
      setGradientTo: (val) => set({ gradientTo: val }),
      setGradientAngle: (val) => set({ gradientAngle: val }),
      setBlurEnabled: (val) => set({ blurEnabled: val }),
      setBlurAmount: (val) => set({ blurAmount: val }),

      resetAll: () => set(defaults),
    }),
    { name: "clock-settings" }
  )
);
