/**
 * ============================================================================
 * File: audio.ts
 * Module: Utilities / Web Audio Synthesizer
 * Architectural Responsibility:
 *   Hardware-independent Web Audio API sound generator providing alert beeps
 *   and ringing loops without requiring external media assets.
 *
 * Design Guidelines & HIG Compliance:
 *   - Smooth attack and release envelopes (linearRampToValueAtTime) preventing audio pops.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Nodes.
 *   - Zero Null Policy: Audio nodes modeled as `undefined` when idle. No nulls.
 * ============================================================================
 */

let audioContextInstance: AudioContext | undefined = undefined;
let activeOscillator: OscillatorNode | undefined = undefined;
let isAudioAlertPlaying = false;
let audioLoopIntervalId: number | undefined = undefined;

/**
 * Start high-frequency synthesized dual-beep alarm audio loop.
 */
export const startAlarmSound = (): void => {
  if (isAudioAlertPlaying) return;

  if (audioContextInstance === undefined) {
    const AudioContextClass =
      window.AudioContext ||
      ((window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);

    if (AudioContextClass) {
      audioContextInstance = new AudioContextClass();
    }
  }

  if (audioContextInstance?.state === "suspended") {
    audioContextInstance.resume();
  }

  isAudioAlertPlaying = true;

  const playSynthesizedBeep = () => {
    if (audioContextInstance === undefined || !isAudioAlertPlaying) return;

    try {
      activeOscillator = audioContextInstance.createOscillator();
      const gainNode = audioContextInstance.createGain();

      activeOscillator.type = "sine";
      activeOscillator.frequency.setValueAtTime(800, audioContextInstance.currentTime);

      gainNode.gain.setValueAtTime(0, audioContextInstance.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioContextInstance.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContextInstance.currentTime + 0.2);

      activeOscillator.connect(gainNode);
      gainNode.connect(audioContextInstance.destination);

      activeOscillator.start(audioContextInstance.currentTime);
      activeOscillator.stop(audioContextInstance.currentTime + 0.2);

      // Second beep
      const secondOscillator = audioContextInstance.createOscillator();
      const secondGainNode = audioContextInstance.createGain();

      secondOscillator.type = "sine";
      secondOscillator.frequency.setValueAtTime(800, audioContextInstance.currentTime + 0.3);

      secondGainNode.gain.setValueAtTime(0, audioContextInstance.currentTime + 0.3);
      secondGainNode.gain.linearRampToValueAtTime(1, audioContextInstance.currentTime + 0.35);
      secondGainNode.gain.linearRampToValueAtTime(0, audioContextInstance.currentTime + 0.5);

      secondOscillator.connect(secondGainNode);
      secondGainNode.connect(audioContextInstance.destination);

      secondOscillator.start(audioContextInstance.currentTime + 0.3);
      secondOscillator.stop(audioContextInstance.currentTime + 0.5);
    } catch {
      // Audio playback safety
    }
  };

  playSynthesizedBeep();
  audioLoopIntervalId = (setInterval(playSynthesizedBeep, 1000) as unknown) as number;
};

/**
 * Silence and stop any active alarm audio loops.
 */
export const stopAlarmSound = (): void => {
  isAudioAlertPlaying = false;

  if (audioLoopIntervalId !== undefined) {
    clearInterval(audioLoopIntervalId);
    audioLoopIntervalId = undefined;
  }

  if (activeOscillator !== undefined) {
    try {
      activeOscillator.stop();
    } catch {
      // Oscillator was already stopped
    }
    activeOscillator = undefined;
  }
};
