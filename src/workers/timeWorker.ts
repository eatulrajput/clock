/**
 * ============================================================================
 * File: timeWorker.ts
 * Module: Infrastructure / WebWorker Engine
 * Architectural Responsibility:
 *   Dedicated WebWorker interval timer providing non-throttled high-precision
 *   time ticks every 100 milliseconds to prevent timer drift during OS sleep,
 *   window minimization, or UI thread congestion (PRD section 3.2).
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Messages.
 *   - Zero Null Policy: Timer identifier modeled as `number | undefined`.
 * ============================================================================
 */

let intervalId: number | undefined = undefined;

self.onmessage = (event: MessageEvent<string>) => {
  if (event.data === "start") {
    if (intervalId !== undefined) return;

    // High precision tick every 100ms
    intervalId = (setInterval(() => {
      self.postMessage({ type: "tick", timestamp: Date.now() });
    }, 100) as unknown) as number;
  } else if (event.data === "stop") {
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }
};
