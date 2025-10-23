import React, { useState, useEffect, useCallback } from 'react';
import { GUESS_THE_WORD_WORDS } from '../constants';
import Keyboard from './Keyboard';
import { playCorrectSound, playIncorrectSound, speak } from '../utils/audio';

interface GuessTheWordScreenProps {
  onExit: () => void;
}

const MAX_MISTAKES = 6;

const GuessTheWordScreen: React.FC<GuessTheWordScreenProps> = ({ onExit }) => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  const setupNewGame = useCallback(() => {
    const newWord = GUESS_THE_WORD_WORDS[Math.floor(Math.random() * GUESS_THE_WORD_WORDS.length)];
    setWord(newWord);
    setGuessedLetters(new Set());
    setMistakes(0);
    setGameState('playing');
    speak('Adivina la palabra secreta. Tienes 6 vidas. ¡Buena suerte!');
  }, []);

  useEffect(() => {
    setupNewGame();
  }, [setupNewGame]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    const key = e.key.toUpperCase();
    if (!/^[A-ZÑ]$/.test(key)) return; // Only allow letters

    if (guessedLetters.has(key)) return; // Already guessed

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(key);
    setGuessedLetters(newGuessedLetters);

    if (word.includes(key)) {
      playCorrectSound();
      const wordGuessed = word.split('').every(letter => newGuessedLetters.has(letter));
      if (wordGuessed) {
        setGameState('won');
        speak(`¡Sí! La palabra era ${word}. ¡Has ganado!`);
      }
    } else {
      playIncorrectSound();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= MAX_MISTAKES) {
        setGameState('lost');
        speak(`¡Oh, no! La palabra correcta era ${word}. Mejor suerte la próxima vez.`);
      }
    }
  }, [gameState, word, guessedLetters, mistakes]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const renderWord = () => {
    return word.split('').map((letter, index) => (
      <span key={index} className="inline-block text-center w-12 h-16 sm:w-16 sm:h-20 bg-white border-b-4 border-gray-400 text-4xl sm:text-5xl font-bold flex items-center justify-center mx-1 rounded-t-lg">
        {guessedLetters.has(letter) ? letter : ''}
      </span>
    ));
  };
  
  const getKeyClass = (key: string) => {
    const upperKey = key.toUpperCase();
    if (!guessedLetters.has(upperKey)) {
        return 'bg-white hover:bg-gray-200';
    }
    if (word.includes(upperKey)) {
        return 'bg-green-400 text-white scale-95';
    }
    return 'bg-gray-400 text-white scale-95 opacity-70';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-red-50 p-4">
        {gameState !== 'playing' && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
                    <h2 className={`text-4xl font-bold mb-4 ${gameState === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                        {gameState === 'won' ? '¡Has Ganado!' : '¡Has Perdido!'}
                    </h2>
                    <p className="text-lg text-gray-700 mb-6">La palabra era: <span className="font-bold">{word}</span></p>
                    <div className="flex gap-4">
                        <button onClick={setupNewGame} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition">Jugar de Nuevo</button>
                        <button onClick={onExit} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition">Salir</button>
                    </div>
                </div>
            </div>
        )}
      <header className="w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold text-red-800">Palabra o Peligro</h1>
        <div className="flex justify-center items-center gap-2 mt-4 text-4xl">
            {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
                <span key={i} className={`transition-opacity duration-300 ${i < (MAX_MISTAKES - mistakes) ? 'opacity-100' : 'opacity-20'}`}>
                    ❤️
                </span>
            ))}
        </div>
      </header>

      <main className="flex flex-wrap justify-center my-8">
        {renderWord()}
      </main>

      <footer className="w-full">
         <div className="w-full max-w-4xl mx-auto p-4 bg-gray-200 rounded-xl shadow-inner">
            <div className="flex flex-col items-center gap-2">
            {[
                ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
                ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
            ].map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2">
                {row.map((key) => (
                  <div
                    key={key}
                    className={`font-mono font-bold rounded-lg shadow-md transition-all duration-100 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 ${getKeyClass(key)}`}
                  >
                    {key}
                  </div>
                ))}
              </div>
            ))}
            </div>
         </div>
         <button onClick={onExit} className="mt-6 mx-auto block bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Volver al Menú</button>
      </footer>
    </div>
  );
};

export default GuessTheWordScreen;
