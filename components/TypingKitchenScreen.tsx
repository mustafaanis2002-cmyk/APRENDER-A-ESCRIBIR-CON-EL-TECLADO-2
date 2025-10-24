import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KITCHEN_RECIPES } from '../constants';
import { playChopSound, playIncorrectSound, playRecipeCompleteSound, speak } from '../utils/audio';

interface Ingredient {
    id: number;
    name: string;
    x: number;
    y: number;
}

const TypingKitchenScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'recipeComplete'>('playing');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
    
    const [fallingIngredients, setFallingIngredients] = useState<Ingredient[]>([]);
    const [neededIngredients, setNeededIngredients] = useState<string[]>([]);
    const [collectedIngredients, setCollectedIngredients] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    
    const gameLoopRef = useRef<number>();
    const spawnerRef = useRef<number>();
    const timerRef = useRef<number>();

    const currentRecipe = KITCHEN_RECIPES[currentRecipeIndex];

    const setupRecipe = useCallback((recipeIndex: number) => {
        const recipe = KITCHEN_RECIPES[recipeIndex % KITCHEN_RECIPES.length];
        setNeededIngredients(recipe.ingredients);
        setCollectedIngredients([]);
        setFallingIngredients([]);
        setCurrentRecipeIndex(recipeIndex % KITCHEN_RECIPES.length);
        setTimeLeft(prev => Math.min(90, prev + recipe.timeLimit / 2)); // Add half recipe time as bonus
    }, []);
    
    const resetGame = useCallback(() => {
        setScore(0);
        setTimeLeft(60);
        setGameState('playing');
        setInputValue('');
        setupRecipe(0);
        speak("¡Bienvenido a la Cocina de Teclas! Escribe los ingredientes para cocinar.");
    }, [setupRecipe]);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    // Game Timer
    useEffect(() => {
        if (gameState !== 'playing') {
            if(timerRef.current) clearInterval(timerRef.current);
            return;
        }
        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameState('gameOver');
                    speak(`¡Oh no, se quemó la comida! Puntuación final: ${score}`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [gameState, score]);
    
    // Game Loop & Spawner
    useEffect(() => {
        if (gameState !== 'playing') {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            if (spawnerRef.current) clearInterval(spawnerRef.current);
            return;
        }

        const loop = () => {
            setFallingIngredients(prev => 
                prev.map(ing => ({ ...ing, y: ing.y + 1 })).filter(ing => ing.y < 500)
            );
            gameLoopRef.current = requestAnimationFrame(loop);
        };
        gameLoopRef.current = requestAnimationFrame(loop);
        
        spawnerRef.current = window.setInterval(() => {
            const recipe = KITCHEN_RECIPES[currentRecipeIndex % KITCHEN_RECIPES.length];
            const name = recipe.ingredients[Math.floor(Math.random() * recipe.ingredients.length)];
            const newIngredient: Ingredient = {
                id: Date.now() + Math.random(),
                name,
                x: Math.random() * 90,
                y: -50,
            };
            setFallingIngredients(prev => [...prev, newIngredient]);
        }, 1500);

        return () => {
            cancelAnimationFrame(gameLoopRef.current!);
            clearInterval(spawnerRef.current!);
        };
    }, [gameState, currentRecipeIndex]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const typed = inputValue.trim().toLowerCase();
        if (!typed) return;

        const foundIndex = fallingIngredients.findIndex(ing => ing.name === typed);
        
        if (neededIngredients.includes(typed) && !collectedIngredients.includes(typed)) {
             playChopSound();
             setScore(prev => prev + typed.length * 10);
             const newCollected = [...collectedIngredients, typed];
             setCollectedIngredients(newCollected);
             
             if(foundIndex > -1) {
                setFallingIngredients(prev => prev.filter((_, i) => i !== foundIndex));
             }

             if (newCollected.length === neededIngredients.length) {
                playRecipeCompleteSound();
                setGameState('recipeComplete');
                setTimeout(() => {
                    setupRecipe(currentRecipeIndex + 1);
                    setGameState('playing');
                }, 2000);
             }

        } else {
            playIncorrectSound();
        }
        setInputValue('');
    };

    return (
    <div className="w-screen h-screen bg-amber-100 font-mono flex flex-col items-center justify-between overflow-hidden">
        {gameState !== 'playing' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                <div className="bg-white p-8 rounded-xl shadow-2xl text-center border-4 border-amber-500">
                    {gameState === 'gameOver' && <>
                        <h2 className="text-4xl font-bold text-red-600 mb-4">¡TIEMPO!</h2>
                        <p className="text-2xl mb-6">Puntuación Final: <span className="font-bold text-amber-700">{score}</span></p>
                    </>}
                    {gameState === 'recipeComplete' && <>
                        <h2 className="text-4xl font-bold text-green-600 mb-4 animate-bounce">¡Plato Terminado!</h2>
                        <p className="text-6xl">{currentRecipe.emoji}</p>
                    </>}
                     <div className="flex gap-4 justify-center mt-6">
                        <button onClick={resetGame} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600">Jugar de Nuevo</button>
                        <button onClick={onExit} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600">Salir</button>
                    </div>
                </div>
            </div>
        )}

        {/* HUD */}
        <header className="w-full max-w-4xl mx-auto flex justify-between items-center p-4 text-amber-800">
            <div className="text-2xl">Puntuación: <span className="font-bold">{score}</span></div>
            <div className="text-4xl font-bold">{timeLeft}s</div>
        </header>

        {/* Game Area */}
        <main className="w-full flex-grow relative bg-white/50 border-y-4 border-amber-300">
            {fallingIngredients.map(ing => (
                <div key={ing.id} className="absolute bg-white p-2 rounded-full shadow-lg" style={{ left: `${ing.x}%`, top: `${ing.y}px`}}>
                    {ing.name}
                </div>
            ))}
        </main>

        {/* Kitchen Counter */}
        <footer className="w-full bg-stone-300 p-4 border-t-8 border-stone-500">
            <div className="w-full max-w-4xl mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
                    <h2 className="text-2xl font-bold text-center">Receta: {currentRecipe.name} {currentRecipe.emoji}</h2>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {neededIngredients.map(ing => (
                            <span key={ing} className={`px-2 py-1 rounded-full text-sm ${collectedIngredients.includes(ing) ? 'bg-green-200 text-green-800 line-through' : 'bg-gray-200 text-gray-800'}`}>
                                {ing}
                            </span>
                        ))}
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full p-4 text-3xl text-center rounded-lg shadow-md border-2 border-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-400"
                        placeholder="Escribe el ingrediente..."
                        autoFocus
                        disabled={gameState !== 'playing'}
                    />
                </form>
            </div>
        </footer>
    </div>
    );
};

export default TypingKitchenScreen;
