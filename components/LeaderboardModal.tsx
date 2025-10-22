import React from 'react';
import { ScoreEntry } from '../types';

interface LeaderboardModalProps {
  scores: ScoreEntry[];
  currentPlayerName: string | null;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ scores, currentPlayerName, onClose }) => {
  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return <span className="font-mono w-6 inline-block text-center">{index + 1}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 text-center max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-blue-600">Ranking</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Cerrar ranking"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
        
        <div className="max-h-80 overflow-y-auto pr-2">
          {scores.length > 0 ? (
            <ul className="space-y-2">
              {scores.map((entry, index) => (
                <li
                  key={`${entry.name}-${index}`}
                  className={`flex items-center p-3 rounded-lg ${
                    entry.name === currentPlayerName ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mr-4">{getMedal(index)}</span>
                  <span className="text-lg font-semibold text-gray-800 truncate">{entry.name}</span>
                  <span className="ml-auto text-xl font-bold text-blue-500">{entry.score}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 py-8">¡Aún no hay puntuaciones! ¡Sé el primero en el ranking!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;
