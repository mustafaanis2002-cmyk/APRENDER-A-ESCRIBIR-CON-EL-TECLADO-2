import React from 'react';
import { RaceResult } from '../types';

interface MultiplayerResultModalProps {
  result: RaceResult;
  onPlayAgain: () => void;
  onExit: () => void;
}

const MultiplayerResultModal: React.FC<MultiplayerResultModalProps> = ({ result, onPlayAgain, onExit }) => {
  const { winner, playerTime, opponentTime, opponentName } = result;
  
  const getMessage = () => {
    switch(winner) {
      case 'player': return { title: '¡Ganaste!', color: 'text-green-500', icon: '🏆' };
      case 'opponent': return { title: '¡Perdiste!', color: 'text-red-500', icon: '😢' };
      case 'tie': return { title: '¡Empate!', color: 'text-yellow-500', icon: '🤝' };
    }
  };

  const message = getMessage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full animate-jump-in">
        <h2 className={`text-5xl font-bold ${message.color} mb-2`}>
            {message.icon} {message.title}
        </h2>
        
        <div className="grid grid-cols-2 gap-4 my-6 text-left">
            <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-lg text-blue-800">Tu Tiempo</p>
                <p className="text-3xl font-bold text-blue-600">{playerTime.toFixed(2)}s</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
                <p className="text-lg text-red-800">Tiempo de {opponentName}</p>
                <p className="text-3xl font-bold text-red-600">{opponentTime.toFixed(2)}s</p>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onPlayAgain}
              className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Jugar Otra Vez
            </button>
            <button
              onClick={onExit}
              className="bg-gray-500 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              Salir
            </button>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerResultModal;
