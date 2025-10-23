import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DEFENSE_WORDS } from '../constants';
import { playTeleportSound, playIncorrectSound, speak } from '../utils/audio';

const GAME_DURATION = 60; // seconds

const TypingTeleporterScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [gameState, setGameState] = useState<'playing' | 'gameOver'>('playing');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    
    const [currentWord, setCurrentWord] = useState('');
    const [typedValue, setTypedValue] = useState('');
    
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 90 });
    const [portalPosition, setPortalPosition] = useState({ x: 50, y: 10 });
    const [isTeleporting, setIsTeleporting] = useState(false);

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<number>();

    const setupNewWord = useCallback(() => {
        const newWord = DEFENSE_WORDS[Math.floor(Math.random() * DEFENSE_WORDS.length)];
        setCurrentWord(newWord);
        setTypedValue('');

        const gameArea = gameAreaRef.current;
        if (gameArea) {
            const newX = 10 + Math.random() * 80;
            const newY = 10 + Math.random() * 40;
            setPortalPosition({ x: newX, y: newY });
        }
    }, []);

    const resetGame = useCallback(() => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setPlayerPosition({ x: 50, y: 90 });
        setupNewWord();
        setGameState('playing');
        speak('¡Bienvenido al Teleportador de Teclas! Escribe la palabra para saltar al portal. ¡Rápido!');
    }, [setupNewWord]);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    // Game Timer
    useEffect(() => {
        if (gameState !== 'playing') {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameState('gameOver');
                    speak(`¡Tiempo agotado! Tu puntuación final es ${score}`);
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [gameState, score]);

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (gameState !== 'playing' || e.key.length > 1 || isTeleporting) return;

        const key = e.key.toLowerCase();
        
        if (key === currentWord[typedValue.length]) {
            const newTypedValue = typedValue + key;
            setTypedValue(newTypedValue);

            if (newTypedValue === currentWord) {
                // Success! Teleport.
                playTeleportSound();
                setScore(prev => prev + currentWord.length * 10);
                setIsTeleporting(true);
                setTimeout(() => {
                    setPlayerPosition(portalPosition);
                    setupNewWord();
                    setIsTeleporting(false);
                }, 300);
            }
        } else {
            playIncorrectSound();
        }
    }, [gameState, currentWord, typedValue, isTeleporting, portalPosition, setupNewWord]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const renderTypedWord = () => {
        return currentWord.split('').map((char, index) => {
            let color = 'text-gray-500';
            if (index < typedValue.length) {
                color = 'text-green-400';
            }
            return <span key={index} className={color}>{char}</span>
        });
    };

    return (
        <div className="relative w-screen h-screen bg-gray-900 text-white overflow-hidden font-mono flex flex-col select-none"
             style={{
                backgroundImage: 'radial-gradient(white 0.5px, transparent 0)',
                backgroundSize: '20px 20px',
             }}
        >
            {gameState === 'gameOver' && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30">
                    <div className="bg-gray-800 border-2 border-orange-500 p-8 rounded-xl shadow-2xl text-center">
                        <h2 className="text-4xl font-bold mb-4 text-orange-400">¡TIEMPO!</h2>
                        <p className="text-xl mb-6 text-white">Puntuación Final: <span className="font-bold text-yellow-400">{score}</span></p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={resetGame} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-500 transition">Jugar de Nuevo</button>
                            <button onClick={onExit} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition">Salir</button>
                        </div>
                    </div>
                </div>
            )}

            {/* HUD */}
            <header className="w-full flex justify-between items-center p-4 bg-black/30 border-b-2 border-orange-500/50">
                <div className="text-2xl">Puntuación: <span className="font-bold text-yellow-300">{score}</span></div>
                <div className="text-4xl font-bold text-red-400">{timeLeft}</div>
            </header>

            {/* Game Area */}
            <main ref={gameAreaRef} className="flex-grow relative">
                {/* Player */}
                <div className={`absolute text-5xl transition-all duration-300 ${isTeleporting ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
                     style={{
                        left: `${playerPosition.x}%`,
                        top: `${playerPosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                     }}
                >
                    🧑‍🚀
                </div>
                
                {/* Portal */}
                {!isTeleporting && (
                    <div className="absolute text-6xl animate-spin-slow"
                         style={{
                            left: `${portalPosition.x}%`,
                            top: `${portalPosition.y}%`,
                            transform: 'translate(-50%, -50%)'
                         }}
                    >
                        🌀
                    </div>
                )}
            </main>

            {/* Input Area */}
            <footer className="w-full p-6 bg-black/30 border-t-2 border-orange-500/50 text-center">
                <p className="text-5xl tracking-widest font-bold" style={{textShadow: '0 0 10px #fff'}}>
                    {renderTypedWord()}
                </p>
            </footer>
        </div>
    );
};

export default TypingTeleporterScreen;