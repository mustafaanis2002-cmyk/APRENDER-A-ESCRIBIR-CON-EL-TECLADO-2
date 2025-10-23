import React, { useState, useEffect, useCallback } from 'react';
import Keyboard from './Keyboard';
import ProgressBar from './ProgressBar';
import TypingHands from './TypingHands';
import { playCorrectSound, playIncorrectSound, speak } from '../utils/audio';
import { GoogleGenAI, Type } from "@google/genai";

interface StoryTellerScreenProps {
  onExit: () => void;
}

const FALLBACK_SENTENCES = [
    "El sol brilla en el cielo azul.",
    "Un gato juguetón persigue una mariposa.",
    "El valiente caballero rescató a la princesa.",
    "Los pájaros cantan felices en los árboles.",
    "Me encanta comer pizza con mucho queso."
];

const StoryTellerScreen: React.FC<StoryTellerScreenProps> = ({ onExit }) => {
    const [sentences, setSentences] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sentenceIndex, setSentenceIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [pressedKey, setPressedKey] = useState<string | null>(null);

    const currentSentence = sentences[sentenceIndex] || '';
    const targetKey = currentSentence[charIndex] || '';

    const fetchSentences = useCallback(async () => {
        setIsLoading(true);
        setSentenceIndex(0);
        setCharIndex(0);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const promptToAI = `Generate a JSON object containing a list of 10 simple, fun, and kid-friendly sentences in Spanish for a typing game. The sentences should be grammatically correct, use simple vocabulary, and be engaging for children. The response must be a valid JSON object with a single key "sentences" which is an array of strings.`;
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: promptToAI,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            sentences: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            }
                        }
                    }
                }
            });
            const jsonStr = response.text.trim();
            const result = JSON.parse(jsonStr);
            setSentences(result.sentences);
            speak("¡Es hora de escribir una historia! Escribe la frase que aparece en pantalla.");
        } catch (error) {
            console.error("Error fetching sentences from AI, using fallback:", error);
            setSentences(FALLBACK_SENTENCES);
            speak("¡Vamos a escribir! Escribe la frase que aparece en pantalla.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSentences();
    }, [fetchSentences]);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (isLoading || !targetKey) return;
        
        const key = event.key;
        if (event.ctrlKey || event.altKey || event.metaKey || (key.length > 1 && key !== ' ')) {
            return;
        }
        event.preventDefault();
        
        setPressedKey(key);
        setTimeout(() => setPressedKey(null), 150);
        
        if (key === targetKey) {
            playCorrectSound();
            setScore(prev => prev + 10);
            if (charIndex + 1 < currentSentence.length) {
                setCharIndex(charIndex + 1);
            } else {
                // Sentence completed
                const nextSentenceIndex = sentenceIndex + 1;
                if (nextSentenceIndex < sentences.length) {
                    setSentenceIndex(nextSentenceIndex);
                } else {
                    // All sentences completed, fetch more
                    fetchSentences();
                    // Reset local counters immediately
                    setScore(0);
                    setMistakes(0);
                }
                setCharIndex(0);
            }
        } else {
            playIncorrectSound();
            setMistakes(prev => prev + 1);
        }
    }, [isLoading, targetKey, charIndex, sentenceIndex, currentSentence.length, sentences.length, fetchSentences]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    const progress = currentSentence ? (charIndex / currentSentence.length) * 100 : 0;
    
    if (isLoading) {
        return (
            <div className="w-screen h-screen bg-teal-50 flex flex-col items-center justify-center text-teal-800">
                <div className="text-6xl animate-bounce">📖</div>
                <h1 className="text-4xl font-bold mt-4">Buscando una nueva historia...</h1>
                <p className="text-xl mt-2">¡Prepárate para escribir!</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-between p-6 min-h-screen bg-teal-50">
            <header className="w-full grid grid-cols-3 items-center gap-4 mb-8">
                <div className="p-3 bg-teal-500 rounded-xl text-white text-center shadow-lg">
                    <span className="text-xl font-bold">Frase {sentenceIndex + 1}/{sentences.length}</span>
                </div>
                <div className="p-3 bg-white rounded-xl text-gray-700 text-center shadow-lg">
                    <span className="text-xl font-bold">Puntos: {score}</span>
                </div>
                <div className="p-3 bg-red-100 rounded-xl text-red-700 text-center shadow-lg">
                    <span className="text-xl font-bold">Errores: {mistakes}</span>
                </div>
                <div className="col-span-3 mt-4">
                    <ProgressBar progress={progress} color="bg-teal-500" />
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center w-full">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center mb-8 w-full min-h-[150px] flex items-center justify-center">
                    <p className="text-4xl font-mono tracking-wide leading-relaxed">
                        {currentSentence.split('').map((char, index) => {
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

            <footer className="w-full mt-8 flex justify-center">
                 <button onClick={onExit} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition">Volver al Menú</button>
            </footer>
        </div>
    );
};

export default StoryTellerScreen;
