
import { ScoreEntry, Garden, ShopItem, GardenItem } from '../types';

const LEADERBOARD_KEY = 'typingGameLeaderboard';
const PLAYER_NAME_KEY = 'typingGamePlayerName';
const GARDEN_STATE_KEY = 'wordGardenState_Complex'; // Use a distinct key

// --- Basic Game Storage ---

export const loadLeaderboard = (): ScoreEntry[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    const leaderboard = data ? JSON.parse(data) : [];
    return leaderboard.sort((a: ScoreEntry, b: ScoreEntry) => b.score - a.score);
  } catch (error) {
    console.error("Could not load leaderboard:", error);
    return [];
  }
};

export const saveLeaderboard = (leaderboard: ScoreEntry[]): void => {
  try {
    const sorted = leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sorted));
  } catch (error) {
    console.error("Could not save leaderboard:", error);
  }
};

export const updateLeaderboard = (name: string, score: number): ScoreEntry[] => {
  const leaderboard = loadLeaderboard();
  const playerIndex = leaderboard.findIndex(p => p.name === name);

  if (playerIndex > -1) {
    if (score > leaderboard[playerIndex].score) {
      leaderboard[playerIndex].score = score;
    }
  } else {
    leaderboard.push({ name, score });
  }

  saveLeaderboard(leaderboard);
  return leaderboard.sort((a, b) => b.score - a.score);
};


export const savePlayerName = (name: string): void => {
  try {
    localStorage.setItem(PLAYER_NAME_KEY, name);
  } catch (error) {
    console.error("Could not save player name:", error);
  }
};

export const loadPlayerName = (): string | null => {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY);
  } catch (error) {
    console.error("Could not load player name:", error);
    return null;
  }
};

// --- Word Garden Storage (COMPLEX) ---

export interface FullGardenState {
    suns: number;
    water: number;
    gardens: Garden[];
    almanacDiscovered: number[]; // Store shop IDs
    isVip: boolean;
    isAdmin: boolean;
    isBioEngineer: boolean;
    hasTeleporter: boolean;
    customPlants: ShopItem[];
}

export const saveFullGardenState = (state: FullGardenState): void => {
    try {
        const stateString = JSON.stringify(state);
        localStorage.setItem(GARDEN_STATE_KEY, stateString);
    } catch (error) {
        console.error("Could not save full garden state:", error);
    }
};

export const loadFullGardenState = (): FullGardenState | null => {
    try {
        const stateString = localStorage.getItem(GARDEN_STATE_KEY);
        if (stateString) {
            const state = JSON.parse(stateString);
            // Ensure all properties exist to prevent crashes from old save formats
            return {
                suns: state.suns ?? 500,
                water: state.water ?? 10,
                gardens: state.gardens ?? [{ id: 1, items: [] }],
                almanacDiscovered: state.almanacDiscovered ?? [],
                isVip: state.isVip ?? false,
                isAdmin: state.isAdmin ?? false,
                isBioEngineer: state.isBioEngineer ?? false,
                hasTeleporter: state.hasTeleporter ?? false,
                customPlants: state.customPlants ?? [],
            };
        }
        return null;
    } catch (error) {
        console.error("Could not load full garden state:", error);
        return null;
    }
};
