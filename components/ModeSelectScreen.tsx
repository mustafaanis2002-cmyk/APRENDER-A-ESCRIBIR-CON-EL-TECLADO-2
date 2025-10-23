import React from 'react';

interface ModeSelectScreenProps {
  onSelectPractice: () => void;
  onSelectRivals: () => void;
  onSelectTypingDefense: () => void;
  onSelectGuessTheWord: () => void;
  onSelectTreasureHunt: () => void;
  playerName: string | null;
}

const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({ onSelectPractice, onSelectRivals, onSelectTypingDefense, onSelectGuessTheWord, onSelectTreasureHunt, playerName }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">¡Hola, {playerName || 'Jugador'}!</h1>
        <p className="text-gray-600 text-lg mb-8">¿Qué te gustaría hacer hoy?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-6">
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
            onClick={onSelectTreasureHunt}
            className="md:col-span-2 group relative w-full h-48 bg-yellow-500 text-white p-6 rounded-2xl shadow-lg hover:bg-yellow-600 transform hover:-translate-y-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300 overflow-hidden"
          >
             <div className="text-left">
              <h2 className="text-2xl font-bold">Búsqueda del Tesoro 3D</h2>
              <p className="mt-2 opacity-90">Explora un mundo abierto en 3D para encontrar las letras escondidas.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:scale-125 transition-transform duration-300">
              🗺️
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelectScreen;