import React, { useState, useEffect } from 'react';
import { LEVELS } from '../constants';
import { Level, ScoreEntry } from '../types';
import { speak } from '../utils/audio';
import LeaderboardModal from './LeaderboardModal';

interface LevelSelectScreenProps {
  onSelectLevel: (level: Level) => void;
  totalScore: number;
  leaderboard: ScoreEntry[];
  currentPlayerName: string | null;
}

const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ onSelectLevel, totalScore, leaderboard, currentPlayerName }) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  useEffect(() => {
    speak("Elige un nivel para empezar a practicar. ¡Buena suerte!");
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-4">
        <header className="text-center mb-8">
            <h1 className="text-5xl font-bold text-blue-600">Elige tu Nivel</h1>
            <p className="text-gray-600 text-lg mt-2">Tu puntuación más alta: <span className="font-bold text-yellow-500">{totalScore}</span> puntos.</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
          {LEVELS.map((level) => {
            const isUnlocked = totalScore >= level.pointsToUnlock;
            return (
              <button
                key={level.level}
                onClick={() => isUnlocked && onSelectLevel(level)}
                disabled={!isUnlocked}
                className={`p-6 rounded-xl shadow-lg text-white text-left transform transition-transform duration-200 ${
                  isUnlocked 
                    ? `${level.color} hover:scale-105 cursor-pointer` 
                    : `${level.color} opacity-60 cursor-not-allowed`
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold">Nivel {level.level}</span>
                  {!isUnlocked && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-4">{level.title}</h3>
                {isUnlocked ? (
                  <p className="text-sm opacity-90">¡Listo para jugar!</p>
                ) : (
                  <p className="text-sm font-bold">Necesitas {level.pointsToUnlock} puntos</p>
                )}
              </button>
            );
          })}
        </main>
        
        <footer className="mt-8">
            <button
              onClick={() => setShowLeaderboard(true)}
              className="bg-yellow-400 text-yellow-900 font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300"
            >
              🏆 Ver Ranking
            </button>
        </footer>
      </div>
      {showLeaderboard && (
        <LeaderboardModal 
          scores={leaderboard} 
          onClose={() => setShowLeaderboard(false)}
          currentPlayerName={currentPlayerName}
        />
      )}
    </>
  );
};

export default LevelSelectScreen;