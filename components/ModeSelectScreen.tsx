import React from 'react';

interface ModeSelectScreenProps {
  onSelectPractice: () => void;
  onSelectRivals: () => void;
  onSelectTypingDefense: () => void;
  onSelectGuessTheWord: () => void;
  onSelectRhythmTyping: () => void;
  onSelectTypingTeleporter: () => void;
  onSelectWordGarden: () => void;
  onSelectStoryTeller: () => void;
  onSelectTypingKitchen: () => void;
  playerName: string | null;
}

const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({ 
    onSelectPractice, 
    onSelectRivals, 
    onSelectTypingDefense, 
    onSelectGuessTheWord, 
    onSelectRhythmTyping, 
    onSelectTypingTeleporter,
    onSelectWordGarden,
    onSelectStoryTeller,
    onSelectTypingKitchen,
    playerName 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-2xl max-w-7xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">¡Hola, {playerName || 'Jugador'}!</h1>
        <p className="text-gray-600 text-lg mb-8">¿Qué te gustaría hacer hoy?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 justify-center gap-6">
          <button
            onClick={onSelectPractice}
            className="group relative w-full h-48 bg-green-500 text-white p-6 rounded-2xl shadow-lg hover:bg-green-600 transform hover:-translate-y-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 overflow-hidden"
          >
            <div className="text-left">
              <h2 className="text-2xl font-bold">Modo Práctica</h2>
              <p className="mt-2 opacity-90">Mejora tu velocidad y precisión a través de niveles.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:scale-125 transition-transform duration-300">
              🎯
            </div>
          </button>
          <button
            onClick={onSelectRivals}
            className="group relative w-full h-48 bg-purple-500 text-white p-6 rounded-2xl shadow-lg hover:bg-purple-600 transform hover:-translate-y-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300 overflow-hidden"
          >
             <div className="text-left">
              <h2 className="text-2xl font-bold">Carrera de Rivales</h2>
              <p className="mt-2 opacity-90">Compite contra un oponente en una carrera de velocidad.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:scale-125 transition-transform duration-300">
              🏁
            </div>
          </button>
          <button
            onClick={onSelectTypingDefense}
            className="group relative w-full h-48 bg-cyan-500 text-white p-6 rounded-2xl shadow-lg hover:bg-cyan-600 transform hover:-translate-y-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300 overflow-hidden"
          >
             <div className="text-left">
              <h2 className="text-2xl font-bold">Defensa de Teclado</h2>
              <p className="mt-2 opacity-90">Destruye meteoritos tecleando las palabras.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:scale-125 transition-transform duration-300">
              👾
            </div>
          </button>
           <button
            onClick={onSelectGuessTheWord}
            className="group relative w-full h-48 bg-red-500 text-white p-6 rounded-2xl shadow-lg hover:bg-red-600 transform hover:-translate-y-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300 overflow-hidden"
          >
             <div className="text-left">
              <h2 className="text-2xl font-bold">Palabra o Peligro</h2>
              <p className="mt-2 opacity-90">Adivina la palabra antes de que se acaben tus vidas.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:scale-125 transition-transform duration-300">
              💀
            </div>
          </button>
          <button
            onClick={onSelectRhythmTyping}
            className="group relative w-full h-48 bg-pink-500 text-white p-6 rounded-2xl shadow-lg hover:bg-pink-600 transform hover:-translate-y-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-300 overflow-hidden"
          >
             <div className="text-left">
              <h2 className="text-2xl font-bold">Sinfonía de Teclas</h2>
              <p className="mt-2 opacity-90">Sigue el ritmo y presiona las teclas al compás.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:scale-125 transition-transform duration-300">
              🎶
            </div>
          </button>
          <button
            onClick={onSelectTypingTeleporter}
            className="group relative w-full h-48 bg-orange-500 text-white p-6 rounded-2xl shadow-lg hover:bg-orange-600 transform hover:-translate-y-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-300 overflow-hidden"
          >
             <div className="text-left">
              <h2 className="text-2xl font-bold">Teleportador de Teclas</h2>
              <p className="mt-2 opacity-90">Escribe para saltar entre portales antes que se acabe el tiempo.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:scale-125 transition-transform duration-300">
              ✨
            </div>
          </button>
          <button
            onClick={onSelectWordGarden}
            className="group relative w-full h-48 bg-lime-500 text-white p-6 rounded-2xl shadow-lg hover:bg-lime-600 transform hover:-translate-y-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-lime-300 overflow-hidden"
          >
             <div className="text-left">
              <h2 className="text-2xl font-bold">Jardín de Palabras</h2>
              <p className="mt-2 opacity-90">Usa tu imaginación para crear un jardín con tus palabras.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:scale-125 transition-transform duration-300">
              🌱
            </div>
          </button>
          <button
            onClick={onSelectStoryTeller}
            className="group relative w-full h-48 bg-teal-500 text-white p-6 rounded-2xl shadow-lg hover:bg-teal-600 transform hover:-translate-y-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-300 overflow-hidden"
          >
            <div className="text-left">
              <h2 className="text-2xl font-bold">Cuentacuentos</h2>
              <p className="mt-2 opacity-90">Completa frases divertidas y descubre historias.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:scale-125 transition-transform duration-300">
              📖
            </div>
          </button>
           <button
            onClick={onSelectTypingKitchen}
            className="group relative w-full h-48 bg-amber-500 text-white p-6 rounded-2xl shadow-lg hover:bg-amber-600 transform hover:-translate-y-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-300 overflow-hidden"
          >
            <div className="text-left">
              <h2 className="text-2xl font-bold">Cocina de Teclas</h2>
              <p className="mt-2 opacity-90">¡Escribe los ingredientes para cocinar platos deliciosos!</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:scale-125 transition-transform duration-300">
              🍳
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelectScreen;
