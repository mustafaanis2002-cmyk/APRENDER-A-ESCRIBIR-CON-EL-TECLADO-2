import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Opponent, RaceResult } from '../types';
import Keyboard from './Keyboard';
import TypingHands from './TypingHands';
import { playCorrectSound, playIncorrectSound } from '../utils/audio';

interface MultiplayerGameScreenProps {
  challengeText: string;
  opponent: Opponent;
  onRaceComplete: (result: RaceResult) => void;
  playerName: string;
}

const Countdown: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (count > 0) {
            const timer = setTimeout(() => setCount(count - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(onComplete, 1000);
            return () => clearTimeout(timer);
        }
    }, [count, onComplete]);
    
    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="text-white text-9xl font-bold animate-ping">{count > 0 ? count : '¡YA!'}</div>
        </div>
    );
};


const MultiplayerGameScreen: React.FC<MultiplayerGameScreenProps> = ({ challengeText, opponent, onRaceComplete, playerName }) => {
  const [playerTyped, setPlayerTyped] = useState('');
  const [opponentTyped, setOpponentTyped] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState<'countdown' | 'racing' | 'finished'>('countdown');

  const timerRef = useRef<number | null>(null);

  const startRace = useCallback(() => {
    setStatus('racing');
    setStartTime(Date.now());
  }, []);

  // Timer for the race
  useEffect(() => {
    if (status === 'racing') {
      timerRef.current = window.setInterval(() => {
        setElapsedTime((Date.now() - (startTime ?? Date.now())) / 1000);
      }, 100);
    }
    return () => {
      if(timerRef.current) clearInterval(timerRef.current);
    }
  }, [status, startTime]);

  // Opponent typing simulation
  useEffect(() => {
      if (status !== 'racing') return;
      
      const opponentInterval = 1000 / opponent.cps;
      const typingTimer = setInterval(() => {
          setOpponentTyped(prev => {
              if (prev.length >= challengeText.length) {
                  clearInterval(typingTimer);
                  return prev;
              }
              return challengeText.substring(0, prev.length + 1);
          });
      }, opponentInterval);

      return () => clearInterval(typingTimer);
  }, [status, opponent, challengeText]);

  // Check for winner
  useEffect(() => {
      if (status !== 'racing') return;

      const playerWon = playerTyped.length === challengeText.length;
      const opponentWon = opponentTyped.length === challengeText.length;

      if (playerWon || opponentWon) {
          setStatus('finished');
          if(timerRef.current) clearInterval(timerRef.current);
          const finalTime = (Date.now() - (startTime ?? Date.now())) / 1000;
          
          let result: RaceResult;
          if (playerWon && opponentWon) {
            result = { winner: 'tie', playerTime: finalTime, opponentTime: finalTime, opponentName: opponent.name };
          } else if (playerWon) {
            result = { winner: 'player', playerTime: finalTime, opponentTime: finalTime, opponentName: opponent.name };
          } else {
            result = { winner: 'opponent', playerTime: finalTime, opponentTime: finalTime, opponentName: opponent.name };
          }
          onRaceComplete(result);
      }

  }, [playerTyped, opponentTyped, challengeText, status, startTime, onRaceComplete, opponent.name]);


  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (status !== 'racing') return;
    
    const key = event.key;
    if (event.ctrlKey || event.altKey || event.metaKey || key.length > 1 && key !== ' ') {
      return;
    }
    event.preventDefault();
    
    const targetKey = challengeText[playerTyped.length];
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);
    
    if (key === targetKey) {
      playCorrectSound();
      setPlayerTyped(prev => prev + key);
    } else {
      playIncorrectSound();
      setMistakes(prev => prev + 1);
    }
  }, [status, challengeText, playerTyped]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
  
  const getProgress = (typed: string) => (typed.length / challengeText.length) * 100;

  const renderText = (text: string, typed: string) => {
    return text.split('').map((char, index) => {
      let colorClass = 'text-gray-400';
      if (index < typed.length) {
        colorClass = 'text-green-500';
      } else if (index === typed.length) {
        colorClass = 'text-blue-600 underline';
      }
      return <span key={index} className={colorClass}>{char}</span>;
    });
  };

  const targetKey = challengeText[playerTyped.length] || '';

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100 p-4">
      {status === 'countdown' && <Countdown onComplete={startRace} />}
      <header className="w-full text-center p-4">
        <h1 className="text-4xl font-bold text-purple-600">¡Carrera de Teclado!</h1>
        <div className="text-2xl font-semibold mt-2 text-gray-700">{elapsedTime.toFixed(1)}s</div>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Player Screen */}
        <div className="flex flex-col border-4 border-blue-400 bg-blue-50 rounded-xl p-4">
            <h2 className="text-2xl font-bold text-blue-800">{playerName} (Tú)</h2>
            <div className="w-full bg-gray-200 rounded-full h-4 my-2 shadow-inner">
                <div className="bg-blue-500 h-4 rounded-full" style={{width: `${getProgress(playerTyped)}%`}}></div>
            </div>
            <div className="bg-white p-4 rounded-lg flex-grow font-mono text-2xl tracking-wider leading-relaxed">
                {renderText(challengeText, playerTyped)}
            </div>
        </div>

        {/* Opponent Screen */}
        <div className="flex flex-col border-4 border-red-400 bg-red-50 rounded-xl p-4">
            <h2 className="text-2xl font-bold text-red-800">{opponent.icon} {opponent.name}</h2>
            <div className="w-full bg-gray-200 rounded-full h-4 my-2 shadow-inner">
                <div className="bg-red-500 h-4 rounded-full" style={{width: `${getProgress(opponentTyped)}%`}}></div>
            </div>
            <div className="bg-white p-4 rounded-lg flex-grow font-mono text-2xl tracking-wider leading-relaxed">
                {renderText(challengeText, opponentTyped)}
            </div>
        </div>
      </main>

      <footer className="mt-4">
        <div className="relative">
            <TypingHands targetKey={targetKey} />
            <Keyboard targetKey={targetKey} pressedKey={pressedKey} />
        </div>
      </footer>
    </div>
  );
};

export default MultiplayerGameScreen;
