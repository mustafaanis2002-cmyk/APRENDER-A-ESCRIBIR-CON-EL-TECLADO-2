import React from 'react';

interface LevelCompleteModalProps {
  level: number;
  score: number;
  mistakes: number;
  onClose: () => void;
  isLastLevel: boolean;
}

const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({ level, score, mistakes, onClose, isLastLevel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full animate-jump-in">
        <h2 className="text-4xl font-bold text-yellow-500 mb-2">
            {isLastLevel ? '¡Juego Completado!' : `¡Nivel ${level} Superado!`}
        </h2>
        <p className="text-gray-600 mb-6 text-lg">¡Excelente trabajo!</p>
        
        <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-lg text-blue-800">Puntuación Total</p>
                <p className="text-3xl font-bold text-blue-600">{score}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
                <p className="text-lg text-red-800">Errores</p>
                <p className="text-3xl font-bold text-red-600">{mistakes}</p>
            </div>
        </div>

        <button
          onClick={onClose}
          className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {isLastLevel ? 'Jugar de Nuevo' : 'Ver Niveles'}
        </button>
      </div>
    </div>
  );
};

export default LevelCompleteModal;
