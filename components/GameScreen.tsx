import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Level } from '../types';
import Keyboard from './Keyboard';
import ProgressBar from './ProgressBar';
import TypingHands from './TypingHands';
import { playCorrectSound, playIncorrectSound, speak, PRONUNCIATION_MAP } from '../utils/audio';
import { FINGER_MAP, FINGER_NAME_MAP } from '../constants';

interface GameScreenProps {
  level: Level;
  onLevelComplete: (score: number, mistakes: number) => void;
  initialScore: number;
  scoreTarget: number | null;
}

const HINT_DELAY = 10000; // 10 segundos

const GameScreen: React.FC<GameScreenProps> = ({ level, onLevelComplete, initialScore, scoreTarget }) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(initialScore);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const hintTimerRef = useRef<number | null>(null);

  const currentChallenge = level.challenges[challengeIndex];
  const targetKey = currentChallenge[charIndex];

  useEffect(() => {
    if (targetKey) {
      window.speechSynthesis.cancel();
      const keyToSpeak = PRONUNCIATION_MAP[targetKey.toLowerCase()] || targetKey.toLowerCase();
      speak(keyToSpeak);
    }
  }, [targetKey, challengeIndex]);

  const resetHintTimer = useCallback(() => {
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
    }
    hintTimerRef.current = window.setTimeout(() => {
      if(targetKey) {
        const fingerCode = FINGER_MAP[targetKey.toLowerCase()];
        const fingerName = FINGER_NAME_MAP[fingerCode] || 'el dedo correcto';
        const hint = `¡Una ayudita! Para la letra '${targetKey}', usa ${fingerName}.`;
        speak(hint);
      }
    }, HINT_DELAY);
  }, [targetKey]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    
    if (event.ctrlKey || event.altKey || event.metaKey || key.length > 1 && key !== ' ') {
      return;
    }
    
    event.preventDefault();
    
    resetHintTimer();

    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);
    
    if (key === targetKey) {
      playCorrectSound();
      const newTypedText = typedText + key;
      setTypedText(newTypedText);
      const newScore = score + level.pointsPerCharacter;
      setScore(newScore);

      // 1. Primary completion: reaching the score target for the next level.
      if (scoreTarget !== null && newScore >= scoreTarget) {
          onLevelComplete(newScore, mistakes);
          return;
      }

      // 2. Advance character or challenge
      if (charIndex + 1 < currentChallenge.length) {
          setCharIndex(charIndex + 1);
      } else {
          // Challenge completed!
          
          // 3. Secondary completion: Finishing all challenges of the final level.
          const isLastLevel = scoreTarget === null;
          const isLastChallengeInList = challengeIndex === level.challenges.length - 1;
          if (isLastLevel && isLastChallengeInList) {
              onLevelComplete(newScore, mistakes);
              return;
          }
          
          // 4. If no completion condition met, loop the challenges for continued practice.
          const nextChallengeIndex = Math.floor(Math.random() * level.challenges.length);
          setChallengeIndex(nextChallengeIndex);
          setCharIndex(0);
          setTypedText('');
      }
    } else {
      playIncorrectSound();
      setMistakes(prev => prev + 1);
      const penalty = Math.round(level.pointsPerCharacter / 2);
      setScore(prev => Math.max(0, prev - penalty));
    }
  }, [charIndex, challengeIndex, currentChallenge, level, onLevelComplete, score, mistakes, typedText, targetKey, resetHintTimer, scoreTarget]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    resetHintTimer();
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, [handleKeyPress, resetHintTimer]);

  let progress = 0;
  const isLastLevel = scoreTarget === null;

  if (!isLastLevel && scoreTarget) {
      const startScore = level.pointsToUnlock;
      const currentProgress = score - startScore;
      const targetProgress = scoreTarget - startScore;
      if (targetProgress > 0) {
          progress = Math.min(100, (currentProgress / targetProgress) * 100);
      }
  } else {
      // For the last level, progress is based on chars typed in its challenges.
      const totalCharsInLevel = level.challenges.join('').length;
      const charsTypedInLevel = level.challenges.slice(0, challengeIndex).join('').length + charIndex;
      progress = (charsTypedInLevel / totalCharsInLevel) * 100;
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-between p-6 min-h-screen">
      <header className="w-full grid grid-cols-3 items-center gap-4 mb-8">
        <div className={`p-3 rounded-xl text-white text-center shadow-lg ${level.color}`}>
          <span className="text-xl font-bold">Nivel {level.level}</span>
        </div>
        <div className="p-3 bg-white rounded-xl text-gray-700 text-center shadow-lg">
          <span className="text-xl font-bold">Puntos: {score}</span>
        </div>
        <div className="p-3 bg-red-100 rounded-xl text-red-700 text-center shadow-lg">
          <span className="text-xl font-bold">Errores: {mistakes}</span>
        </div>
        <div className="col-span-3 mt-4">
            <ProgressBar progress={progress} color={level.color} />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center mb-8 w-full min-h-[150px] flex items-center justify-center">
            <p className="text-5xl font-mono tracking-widest">
              {currentChallenge.split('').map((char, index) => {
                let colorClass = 'text-gray-400';
                if (index < charIndex) {
                  colorClass = 'text-green-500';
                } else if (index === charIndex) {
                  colorClass = 'text-blue-600 underline decoration-4 underline-offset-8';
                }
                return <span key={index} className={colorClass}>{char === ' ' ? '␣' : char}</span>;
              })}
            </p>
        </div>
        <div className="relative w-full">
          <TypingHands targetKey={targetKey} />
          <Keyboard targetKey={targetKey} pressedKey={pressedKey} />
        </div>
      </main>

      <footer className="w-full mt-8 text-center text-gray-500">
        <p>Usa el dedo iluminado para presionar la tecla resaltada. ¡Tú puedes!</p>
      </footer>
    </div>
  );
};

export default GameScreen;