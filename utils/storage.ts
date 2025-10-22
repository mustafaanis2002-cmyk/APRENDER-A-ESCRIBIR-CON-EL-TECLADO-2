import { ScoreEntry } from '../types';

const LEADERBOARD_KEY = 'typing-game-leaderboard';
const PLAYER_NAME_KEY = 'typing-game-player-name';

export const savePlayerName = (name: string): void => {
  try {
    localStorage.setItem(PLAYER_NAME_KEY, name);
  } catch (error) {
    console.error('Error saving player name to localStorage:', error);
  }
};

export const loadPlayerName = (): string | null => {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY);
  } catch (error) {
    console.error('Error loading player name from localStorage:', error);
    return null;
  }
};

export const loadLeaderboard = (): ScoreEntry[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading leaderboard from localStorage:', error);
    return [];
  }
};

export const saveLeaderboard = (leaderboard: ScoreEntry[]): void => {
    try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    } catch (error) {
        console.error('Error saving leaderboard to localStorage:', error);
    }
};

export const updateLeaderboard = (playerName: string, score: number): ScoreEntry[] => {
  let leaderboard = loadLeaderboard();
  const playerIndex = leaderboard.findIndex(entry => entry.name === playerName);

  if (playerIndex > -1) {
    if (score > leaderboard[playerIndex].score) {
      leaderboard[playerIndex].score = score;
    }
  } else {
    leaderboard.push({ name: playerName, score });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  saveLeaderboard(leaderboard);
  return leaderboard;
};
