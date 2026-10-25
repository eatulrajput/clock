/**
 * ============================================================================
 * File: useTimeStore.ts
 * Module: Store / Time Engine State Management
 * Architectural Responsibility:
 *   Zustand store that mounts and communicates with the background WebWorker
 *   to distribute synchronized real-time epoch timestamps across all application modules.
 *
 * Design Guidelines & HIG Compliance:
 *   - Ensures zero drift throughout application lifecycle.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed State: Readonly<TimeState>
 *   - Zero Null Policy: Worker instance modeled as `Worker | undefined`.
 * ============================================================================
 */

import { create } from "zustand";

interface TimeState {
  readonly now: number;
  readonly initWorker: () => void;
}

let backgroundWorker: Worker | undefined = undefined;

export const useTimeStore = create<TimeState>((set) => ({
  now: Date.now(),
  initWorker: () => {
    if (backgroundWorker === undefined) {
      backgroundWorker = new Worker(new URL("../workers/timeWorker.ts", import.meta.url), {
        type: "module",
      });

      backgroundWorker.postMessage("start");
      backgroundWorker.onmessage = (event: MessageEvent<{ type: string; timestamp: number }>) => {
        if (event.data.type === "tick") {
          set({ now: event.data.timestamp });
        }
      };
    }
  },
}));
