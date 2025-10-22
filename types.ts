// Fix: Create type definitions for Level and ScoreEntry.
export type GameState = 'start' | 'nameInput' | 'modeSelect' | 'levelSelect' | 'playing' | 'levelComplete' | 'multiplayer-game' | 'multiplayer-result';

export interface Level {
  level: number;
  title: string;
  challenges: string[];
  pointsPerCharacter: number;
  pointsToUnlock: number;
  color: string;
}

export interface ScoreEntry {
  name: string;
  score: number;
}

export interface Opponent {
    name: string;
    icon: string;
    cps: number; // characters per second
}

export interface RaceResult {
    winner: 'player' | 'opponent' | 'tie';
    playerTime: number;
    opponentTime: number;
    opponentName: string;
}
