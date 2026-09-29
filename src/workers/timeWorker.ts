let intervalId: number | null = null;

self.onmessage = (e) => {
  if (e.data === "start") {
    if (intervalId) return;
    // Tick every 100ms for high precision (useful for stopwatch and timers)
    // Using a dedicated web worker prevents UI thread blocking and background throttling.
    intervalId = setInterval(() => {
      self.postMessage({ type: "tick", timestamp: Date.now() });
    }, 100) as unknown as number;
  } else if (e.data === "stop") {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
};
