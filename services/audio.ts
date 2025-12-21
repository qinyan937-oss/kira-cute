
// Procedural Audio Engine for KIRA
// Generates Soft Orchestral Waltz / Disney Princess Fantasy BGM

let audioCtx: AudioContext | null = null;
let bgmSequencer: number | null = null;
let bgmStep = 0;
let bgmBar = 0;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const createOscillator = (ctx: AudioContext, type: OscillatorType, freq: number, duration: number, startTime: number, volume: number = 0.1, fadeOut: boolean = true) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  
  gain.gain.setValueAtTime(volume, startTime);
  if (fadeOut) {
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  } else {
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

// --- BGM ENGINE (Soft Orchestral Waltz Style) ---
// 80 BPM -> 1 beat = 750ms -> 16th note = 187.5ms
// 3/4 Time -> 12 steps per bar (3 beats * 4 16th-notes)
const playBGMStep = (ctx: AudioContext, t: number) => {
  const stepTime = 0.1875;
  
  // Romantic Waltz Progressions (Cmaj7 - Am7 - Fmaj7 - G7sus4)
  const progressions = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 349.23], // Fmaj7
    [196.00, 246.94, 349.23, 392.00]  // G7sus4
  ];
  
  const currentChord = progressions[Math.floor(bgmBar / 2) % progressions.length];

  // 1. Lush String Pad (Ethereal Airy Layers)
  if (bgmStep === 0) {
    currentChord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.detune.setValueAtTime((i - 1.5) * 8, t); // Gentle chorus
      
      pGain.gain.setValueAtTime(0, t);
      pGain.gain.linearRampToValueAtTime(0.03, t + 1.0); // Very soft swell
      pGain.gain.linearRampToValueAtTime(0, t + 2.5); // Long release
      
      osc.connect(pGain);
      pGain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 2.5);
    });
  }

  // 2. Soft Piano Accompaniment (Oom-Pah-Pah)
  // Oom (Root): Step 0
  if (bgmStep === 0) {
    createOscillator(ctx, 'triangle', currentChord[0] / 2, 0.8, t, 0.05);
  }
  // Pah-Pah (Chords): Step 4 and Step 8
  if (bgmStep === 4 || bgmStep === 8) {
    currentChord.slice(1).forEach(freq => {
        createOscillator(ctx, 'sine', freq, 0.4, t, 0.02);
    });
  }

  // 3. Magical Harp Glissando (Occurs every 4 bars)
  if (bgmBar % 4 === 3 && bgmStep < 8) {
    const scale = [0, 2, 4, 7, 9, 11, 12, 14]; // Major scale indices
    const base = currentChord[0];
    const harpNote = base * Math.pow(2, (scale[bgmStep] || 0) / 12);
    createOscillator(ctx, 'triangle', harpNote * 2, 0.3, t, 0.015);
    // Extra sparkle layer
    createOscillator(ctx, 'sine', harpNote * 4, 0.15, t, 0.01);
  }

  // 4. Soft Orchestral "Sparkle" (Steps 2, 6, 10)
  if (bgmStep % 4 === 2 && Math.random() > 0.7) {
    createOscillator(ctx, 'sine', 2000 + Math.random() * 500, 0.3, t, 0.008);
  }

  bgmStep++;
  // 12 steps per bar for 3/4 waltz
  if (bgmStep >= 12) {
    bgmStep = 0;
    bgmBar++;
  }
};

export const toggleBGM = (isOn: boolean) => {
  const ctx = getContext();
  if (isOn) {
    if (bgmSequencer) return;
    bgmStep = 0;
    bgmBar = 0;
    // Elegant harp intro sweep
    for(let i=0; i<8; i++) {
        createOscillator(ctx, 'sine', 440 * Math.pow(1.5, i/4), 0.5, ctx.currentTime + i*0.05, 0.02);
    }
    
    bgmSequencer = window.setInterval(() => {
      playBGMStep(ctx, ctx.currentTime);
    }, 187.5);
  } else {
    if (bgmSequencer) {
      clearInterval(bgmSequencer);
      bgmSequencer = null;
      // Soft fade-out
      createOscillator(ctx, 'sine', 261.63, 0.5, ctx.currentTime, 0.02);
    }
  }
};

export const playSound = (type: 'pop' | 'success' | 'shutter' | 'cancel' | 'arcade_press') => {
  try {
    const ctx = getContext();
    const t = ctx.currentTime;

    switch (type) {
      case 'arcade_press':
        createOscillator(ctx, 'sine', 659.25, 0.15, t, 0.06); // E5
        break;
      case 'pop':
        createOscillator(ctx, 'sine', 880, 0.1, t, 0.04);
        break;
      case 'success':
        // Magical chime
        [1046.50, 1318.51, 1567.98, 2093.00].forEach((f, i) => {
            createOscillator(ctx, 'sine', f, 0.4, t + i*0.08, 0.03);
        });
        break;
      case 'shutter':
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(0.08, t);
        nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        noise.connect(nGain);
        nGain.connect(ctx.destination);
        noise.start(t);
        break;
      case 'cancel':
        createOscillator(ctx, 'sine', 329.63, 0.3, t, 0.04);
        break;
    }
  } catch (e) {
    console.warn("Audio play failed", e);
  }
};
