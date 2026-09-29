import { create } from "zustand";

interface TimeState {
  now: number;
  initWorker: () => void;
}

let worker: Worker | null = null;

export const useTimeStore = create<TimeState>((set) => ({
  now: Date.now(),
  initWorker: () => {
    if (!worker) {
      worker = new Worker(new URL("../workers/timeWorker.ts", import.meta.url), {
        type: "module",
      });
      worker.postMessage("start");
      worker.onmessage = (e) => {
        if (e.data.type === "tick") {
          set({ now: e.data.timestamp });
        }
      };
    }
  },
}));
