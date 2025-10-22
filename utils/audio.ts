let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser");
    }
  }
  return audioContext;
};

const playSound = (type: OscillatorType, frequency: number, duration: number, volume: number) => {
  try {
    const context = getAudioContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    
    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  } catch (error) {
    console.error("Could not play sound:", error);
  }
};

export const playCorrectSound = () => {
  playSound('sine', 600, 0.1, 0.3);
};

export const playIncorrectSound = () => {
  playSound('square', 150, 0.2, 0.2);
};

export const playLevelCompleteSound = () => {
    const context = getAudioContext();
    if (!context) return;
    playSound('sine', 440, 0.1, 0.3);
    setTimeout(() => playSound('sine', 587.33, 0.1, 0.3), 100);
    setTimeout(() => playSound('sine', 880, 0.2, 0.4), 200);
};

export const PRONUNCIATION_MAP: { [key: string]: string } = {
  'ñ': 'eñe',
  ' ': 'espacio',
};

export const speak = (text: string) => {
  try {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech synthesis not supported in this browser.");
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.2;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Speech synthesis failed:", error);
  }
};
