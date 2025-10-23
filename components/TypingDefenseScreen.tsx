import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DEFENSE_WORDS } from '../constants';
import { playCorrectSound, playIncorrectSound, speak } from '../utils/audio';

const INITIAL_LIVES = 5;
const INITIAL_SPAWN_RATE = 2500; // ms (más lento)
const INITIAL_FALL_SPEED = 0.25; // (más lento)

interface Word {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
}

const TypingDefenseScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameState, setGameState] = useState<'playing' | 'gameOver'>('playing');
  const [level, setLevel] = useState(1);

  const gameLoopRef = useRef<number>();
  const wordSpawnerRef = useRef<number>();

  const spawnWord = useCallback(() => {
    const text = DEFENSE_WORDS[Math.floor(Math.random() * DEFENSE_WORDS.length)];
    const newWord: Word = {
      id: Date.now() + Math.random(),
      text,
      x: Math.random() * 90, // %
      y: -10, // Start off-screen
      speed: INITIAL_FALL_SPEED + level * 0.05, // Aumento de velocidad más suave
    };
    setWords(prev => [...prev, newWord]);
  }, [level]);

  const resetGame = useCallback(() => {
    // Fix: Replaced unnecessary functional state updates with direct value setting.
    setWords([]);
    setInputValue('');
    setScore(0);
    setLives(INITIAL_LIVES);
    setLevel(1);
    setGameState('playing');
    speak('¡Defiende la ciudad! Escribe las palabras para destruir los meteoritos.');
  }, []);
  
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = () => {
      setWords(prevWords => {
        let newLives = lives;
        const updatedWords = prevWords.map(word => ({
          ...word,
          y: word.y + word.speed / 10,
        })).filter(word => {
          if (word.y >= 95) {
            newLives--;
            return false;
          }
          return true;
        });
        
        if (newLives < lives) {
            setLives(newLives);
            playIncorrectSound();
            if (newLives <= 0) {
              setGameState('gameOver');
              speak('¡La ciudad ha caído! Fin del juego.');
            }
        }
        return updatedWords;
      });
      gameLoopRef.current = requestAnimationFrame(loop);
    };
    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current!);
  }, [gameState, lives]);
  
  // Word Spawner
  useEffect(() => {
      if (gameState !== 'playing') return;

      const spawnRate = Math.max(800, INITIAL_SPAWN_RATE - level * 100);
      wordSpawnerRef.current = window.setInterval(spawnWord, spawnRate);
      
      return () => clearInterval(wordSpawnerRef.current!);
  }, [gameState, spawnWord, level]);

  // Level up
  useEffect(() => {
    if (score > 0 && score % 100 === 0) {
      setLevel(prev => prev + 1);
    }
  }, [score]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const targetWordIndex = words.findIndex(word => word.text === inputValue);
    if (targetWordIndex !== -1) {
      const word = words[targetWordIndex];
      setScore(prev => prev + word.text.length * 10);
      setWords(prev => prev.filter((_, i) => i !== targetWordIndex));
      setInputValue('');
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  };

  return (
    <div className="relative w-screen h-screen bg-gray-900 text-white overflow-hidden font-mono flex flex-col">
      {gameState === 'gameOver' && (
         <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30">
             <div className="bg-gray-800 border-2 border-red-500 p-8 rounded-xl shadow-2xl text-center">
                <h2 className="text-4xl font-bold mb-4 text-red-400">GAME OVER</h2>
                <p className="text-xl mb-2 text-white">Puntuación Final: <span className="font-bold text-yellow-400">{score}</span></p>
                <p className="text-lg mb-6 text-gray-300">Nivel Alcanzado: {level}</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={resetGame} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-500 transition">Jugar de Nuevo</button>
                    <button onClick={onExit} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition">Salir</button>
                </div>
            </div>
        </div>
      )}
      {/* Game Area */}
      <div className="flex-grow relative">
        {words.map(word => (
          <div key={word.id} className="absolute text-center" style={{ left: `${word.x}%`, top: `${word.y}%`, transform: 'translateX(-50%)' }}>
            <span className="text-2xl text-red-400">☄️</span>
            <p className="bg-black/50 px-2 py-1 rounded text-lg font-bold tracking-widest">{word.text}</p>
          </div>
        ))}
        {/* City skyline */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-gray-800 to-transparent flex items-end justify-around">
            <div className="w-8 h-8 bg-gray-600"></div>
            <div className="w-12 h-16 bg-gray-600"></div>
            <div className="w-8 h-12 bg-gray-600"></div>
            <div className="w-16 h-10 bg-gray-600"></div>
            <div className="w-10 h-20 bg-gray-600"></div>
        </div>
      </div>
      {/* HUD & Input */}
      <div className="bg-black/50 p-4 border-t-2 border-cyan-400">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-4">
            <div><span className="font-bold">Puntuación:</span> {score}</div>
            <div><span className="font-bold">Nivel:</span> {level}</div>
            <div className="flex items-center gap-2">
                <span className="font-bold">Escudos:</span>
                {Array.from({ length: lives }).map((_, i) => <span key={i} className="text-cyan-400 text-xl">🛡️</span>)}
            </div>
        </div>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border-2 border-gray-600 text-white text-2xl text-center p-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 transition tracking-widest"
                autoFocus
                placeholder="Escribe aquí..."
                disabled={gameState === 'gameOver'}
            />
        </form>
      </div>
    </div>
  );
};

export default TypingDefenseScreen;