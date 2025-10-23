// Fix: Implement audio utility functions. This file previously contained storage logic.
// Create a single AudioContext for all sounds to reuse.
let audioContext: AudioContext | undefined;

const getAudioContext = (): AudioContext | undefined => {
  if (typeof window === 'undefined') return undefined;
  if (!audioContext) {
    try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch(e) {
        console.error("Web Audio API is not supported in this browser");
        return undefined;
    }
  }
  return audioContext;
};

// A generic function to play a tone.
const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  try {
    const context = getAudioContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.start(context.currentTime);

    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + duration);
    oscillator.stop(context.currentTime + duration);
  } catch (error) {
    console.error("Could not play sound:", error);
  }
};

export const playCorrectSound = () => {
  playTone(600, 0.1, 'sine');
};

export const playIncorrectSound = () => {
  playTone(200, 0.2, 'square');
};

export const playLevelCompleteSound = () => {
    playTone(800, 0.1, 'triangle');
    setTimeout(() => playTone(1000, 0.1, 'triangle'), 150);
    setTimeout(() => playTone(1200, 0.2, 'triangle'), 300);
};

export const playJumpSound = () => {
    playTone(440, 0.05, 'square');
};

export const playTeleportSound = () => {
    playTone(300, 0.1, 'sawtooth');
    setTimeout(() => playTone(1200, 0.2, 'sawtooth'), 50);
};

export const playPlantSound = () => {
    playTone(1200, 0.15, 'triangle');
};

export const playPurchaseSound = () => {
    playTone(700, 0.05, 'sine');
    setTimeout(() => playTone(900, 0.1, 'sine'), 80);
};

export const playSellSound = () => {
    playTone(900, 0.05, 'sine');
    setTimeout(() => playTone(1200, 0.1, 'sine'), 80);
};

export const playRemoveSound = () => {
    playTone(300, 0.1, 'sawtooth');
};

export const playSkipSound = () => {
    playTone(1000, 0.05, 'sawtooth');
};


// Pitches for the rhythm game notes (C Major Arpeggio)
const NOTE_PITCHES = [
    261.63, // C4
    329.63, // E4
    392.00, // G4
    523.25, // C5
];

export const playNoteSound = (lane: number) => {
    if (lane >= 0 && lane < NOTE_PITCHES.length) {
        const frequency = NOTE_PITCHES[lane];
        playTone(frequency, 0.2, 'triangle');
    }
};

export const speak = (text: string) => {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES'; // Spanish
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  } catch (error) {
    console.error("Speech synthesis failed:", error);
  }
};

// To handle specific pronunciations for Spanish alphabet
export const PRONUNCIATION_MAP: { [key: string]: string } = {
  'q': 'cu',
  'w': 'uve doble',
  'y': 'i griega',
  'ñ': 'eñe',
  ',': 'coma',
  '.': 'punto',
  '-': 'guión',
  ' ': 'espacio',
};