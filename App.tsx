import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import LevelSelectScreen from './components/LevelSelectScreen';
import GameScreen from './components/GameScreen';
import LevelCompleteModal from './components/LevelCompleteModal';
import NameInputScreen from './components/NameInputScreen';
import ModeSelectScreen from './components/ModeSelectScreen';
import MultiplayerGameScreen from './components/MultiplayerGameScreen';
import MultiplayerResultModal from './components/MultiplayerResultModal';

import { Level, ScoreEntry, Opponent, RaceResult, GameState } from './types';
import { loadLeaderboard, updateLeaderboard, savePlayerName, loadPlayerName } from './utils/storage';
import { playLevelCompleteSound } from './utils/audio';
import { LEVELS, OPPONENTS, RACE_CHALLENGES } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [playerName, setPlayerName] = useState<string>('Jugador');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Multiplayer state
  const [currentOpponent, setCurrentOpponent] = useState<Opponent | null>(null);
  const [raceChallenge, setRaceChallenge] = useState<string>('');
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null);

  useEffect(() => {
    const loadedName = loadPlayerName();
    const loadedLeaderboard = loadLeaderboard();
    setLeaderboard(loadedLeaderboard);

    if (loadedName) {
      setPlayerName(loadedName);
      const playerScore = loadedLeaderboard.find(p => p.name === loadedName)?.score || 0;
      setTotalScore(playerScore);
      setGameState('modeSelect');
    }
    setIsInitialized(true);
  }, []);

  const handleStart = () => {
    setGameState('nameInput');
  };
  
  const handleNameSubmit = (name: string) => {
    const trimmedName = name.trim();
    setPlayerName(trimmedName);
    savePlayerName(trimmedName);
    const updatedLeaderboard = updateLeaderboard(trimmedName, 0);
    setLeaderboard(updatedLeaderboard);
    setTotalScore(0);
    setGameState('modeSelect');
  };

  const handleSelectPractice = () => {
    setGameState('levelSelect');
  };

  const startRace = useCallback(() => {
    const randomOpponent = OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
    const randomChallenge = RACE_CHALLENGES[Math.floor(Math.random() * RACE_CHALLENGES.length)];
    setCurrentOpponent(randomOpponent);
    setRaceChallenge(randomChallenge);
    setRaceResult(null);
    setGameState('multiplayer-game');
  }, []);

  const handleSelectRivals = () => {
    startRace();
  };

  const handleRaceComplete = (result: RaceResult) => {
    setRaceResult(result);
    setGameState('multiplayer-result');
  };

  const handleExitRace = () => {
    setGameState('modeSelect');
  };

  const handleSelectLevel = (level: Level) => {
    setCurrentLevel(level);
    setGameState('playing');
  };

  const handleLevelComplete = useCallback((score: number, finalMistakes: number) => {
    playLevelCompleteSound();
    setTotalScore(score);
    setMistakes(finalMistakes);
    const updatedLeaderboard = updateLeaderboard(playerName, score);
    setLeaderboard(updatedLeaderboard);
    setGameState('levelComplete');
  }, [playerName]);

  const handleCloseModal = () => {
    const isLastLevel = getScoreTarget() === null;
    if (isLastLevel) {
        setGameState('start');
    } else {
        setCurrentLevel(null);
        setGameState('levelSelect');
    }
  };
  
  const getScoreTarget = () => {
      if (!currentLevel) return null;
      const nextLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level) + 1;
      if (nextLevelIndex < LEVELS.length) {
          return LEVELS[nextLevelIndex].pointsToUnlock;
      }
      return null;
  };

  const renderScreen = () => {
    if (!isInitialized) {
        return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>;
    }

    switch (gameState) {
      case 'start':
        return <StartScreen onStart={handleStart} />;
      case 'nameInput':
        return <NameInputScreen onNameSubmit={handleNameSubmit} />;
      case 'modeSelect':
        return <ModeSelectScreen onSelectPractice={handleSelectPractice} onSelectRivals={handleSelectRivals} playerName={playerName} />;
      case 'levelSelect':
        return <LevelSelectScreen onSelectLevel={handleSelectLevel} totalScore={totalScore} leaderboard={leaderboard} currentPlayerName={playerName} />;
      case 'playing':
        if (currentLevel) {
          return <GameScreen level={currentLevel} onLevelComplete={handleLevelComplete} initialScore={totalScore} scoreTarget={getScoreTarget()} />;
        }
        return null; 
      case 'levelComplete':
          return (
            <>
              <LevelSelectScreen onSelectLevel={handleSelectLevel} totalScore={totalScore} leaderboard={leaderboard} currentPlayerName={playerName} />
              {currentLevel && (
                  <LevelCompleteModal
                      level={currentLevel.level}
                      score={totalScore}
                      mistakes={mistakes}
                      onClose={handleCloseModal}
                      isLastLevel={getScoreTarget() === null}
                  />
              )}
            </>
          );
      case 'multiplayer-game':
          if (currentOpponent && raceChallenge) {
              return <MultiplayerGameScreen 
                challengeText={raceChallenge} 
                opponent={currentOpponent} 
                onRaceComplete={handleRaceComplete}
                playerName={playerName}
              />
          }
          return null;
      case 'multiplayer-result':
          if (raceResult) {
              return <MultiplayerResultModal result={raceResult} onPlayAgain={startRace} onExit={handleExitRace} />
          }
          return null;
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return <div className="font-sans bg-gray-50 min-h-screen">{renderScreen()}</div>;
};

export default App;
