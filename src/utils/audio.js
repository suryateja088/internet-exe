// Procedural Web Audio API sound synthesizer for Internet.exe
// Zero external files, zero latency, ultra-lightweight

let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleAudioMute() {
  isMuted = !isMuted;
  return isMuted;
}

export function getAudioMuteState() {
  return isMuted;
}

// Gentle hover blip
export function playHoverSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

// Cyber click
export function playClickSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.065);
  } catch { }
}

// 8-bit victory / success chime
export function playSuccessChime() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + i * 0.06;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.04, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.13);
    });
  } catch { }
}

// Play a specific synthesizer tone (used by the Cyber Synth window)
export function playSynthNote(frequency = 440, waveType = 'sawtooth') {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch { }
}

// Synthesized 56k dial-up sequence simulation!
// Returns a cancel function so user can abort anytime
export function playDialupSimulation(onProgress, onComplete) {
  if (isMuted) {
    if (onComplete) onComplete();
    return () => { };
  }
  const ctx = getAudioContext();
  if (!ctx) {
    if (onComplete) onComplete();
    return () => { };
  }

  let isCancelled = false;
  const nodes = [];

  const cleanup = () => {
    isCancelled = true;
    nodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch { }
    });
  };

  // Phase 1: Dial tone (0 - 0.7s)
  const dialTone1 = ctx.createOscillator();
  const dialTone2 = ctx.createOscillator();
  const dialGain = ctx.createGain();

  dialTone1.frequency.value = 350;
  dialTone2.frequency.value = 440;
  dialGain.gain.setValueAtTime(0.04, ctx.currentTime);
  dialGain.gain.setValueAtTime(0, ctx.currentTime + 0.7);

  dialTone1.connect(dialGain);
  dialTone2.connect(dialGain);
  dialGain.connect(ctx.destination);
  dialTone1.start();
  dialTone2.start();
  dialTone1.stop(ctx.currentTime + 0.7);
  dialTone2.stop(ctx.currentTime + 0.7);
  nodes.push(dialTone1, dialTone2, dialGain);

  if (onProgress) onProgress('DIALING: 1-800-CYBER-VOID...', 20);

  // Phase 2: DTMF tones (0.8s - 1.8s)
  const dtmfFrequencies = [
    [697, 1209], [770, 1336], [852, 1477], [941, 1336],
    [697, 1477], [770, 1209], [852, 1336]
  ];

  dtmfFrequencies.forEach(([f1, f2], idx) => {
    const start = ctx.currentTime + 0.8 + idx * 0.12;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g = ctx.createGain();

    osc1.frequency.value = f1;
    osc2.frequency.value = f2;
    g.gain.setValueAtTime(0.05, start);
    g.gain.setValueAtTime(0, start + 0.08);

    osc1.connect(g);
    osc2.connect(g);
    g.connect(ctx.destination);
    osc1.start(start);
    osc2.start(start);
    osc1.stop(start + 0.08);
    osc2.stop(start + 0.08);
    nodes.push(osc1, osc2, g);
  });

  // Phase 3: Handshake screech & white noise (2.0s - 4.2s)
  setTimeout(() => {
    if (isCancelled) return;
    if (onProgress) onProgress('NEGOTIATING V.90 PROTOCOL...', 55);

    try {
      // Noise buffer for the famous carrier hiss
      const bufferSize = ctx.sampleRate * 2.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.18;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1800, ctx.currentTime);
      bandpass.frequency.linearRampToValueAtTime(3200, ctx.currentTime + 1.2);
      bandpass.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 2.2);
      bandpass.Q.value = 4.0;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 2.2);
      nodes.push(noise, bandpass, noiseGain);

      // Pitch sweeps
      const sweepOsc = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweepOsc.type = 'sawtooth';
      sweepOsc.frequency.setValueAtTime(1200, ctx.currentTime);
      sweepOsc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.8);
      sweepOsc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 1.8);

      sweepGain.gain.setValueAtTime(0.03, ctx.currentTime);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

      sweepOsc.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweepOsc.start();
      sweepOsc.stop(ctx.currentTime + 2.0);
      nodes.push(sweepOsc, sweepGain);
    } catch { }
  }, 2000);

  // Phase 4: Final handshake chime & connection established (4.2s)
  setTimeout(() => {
    if (isCancelled) return;
    if (onProgress) onProgress('CONNECTED AT 56,600 BAUD! WELCOME TO CYBERSPACE.', 100);
    playSuccessChime();
    if (onComplete) onComplete();
  }, 4200);

  return cleanup;
}

// Epic System Overload / Warp Glitch Sound
export function playWarpGlitchSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Pitch riser
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 1.2);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 1.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(6000, ctx.currentTime + 1.2);
    filter.Q.value = 7.0;

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 2.05);

    // Sub rumble impact at peak
    setTimeout(() => {
      try {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(150, ctx.currentTime);
        subOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.8);

        subGain.gain.setValueAtTime(0.22, ctx.currentTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start();
        subOsc.stop(ctx.currentTime + 0.85);
      } catch { }
    }, 1200);
  } catch { }
}
