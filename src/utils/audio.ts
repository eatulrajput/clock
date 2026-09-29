let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let isPlaying = false;
let intervalId: number | null = null;

export const startAlarmSound = () => {
  if (isPlaying) return;
  
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  isPlaying = true;

  // A synthetic double-beep pattern
  const playBeep = () => {
    if (!audioCtx || !isPlaying) return;
    
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // High pitch beep
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.2);
    
    // Second beep shortly after
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(800, audioCtx.currentTime + 0.3);
    
    gain2.gain.setValueAtTime(0, audioCtx.currentTime + 0.3);
    gain2.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.35);
    gain2.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    
    osc2.start(audioCtx.currentTime + 0.3);
    osc2.stop(audioCtx.currentTime + 0.5);
  };

  playBeep();
  intervalId = setInterval(playBeep, 1000) as unknown as number;
};

export const stopAlarmSound = () => {
  isPlaying = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (oscillator) {
    try {
      oscillator.stop();
    } catch (e) {}
  }
};
