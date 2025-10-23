// Fix: Removed an incorrect import of `GameState` from './App'. The `GameState` type is defined in this file, and the import was causing a circular dependency error.

// Fix: Create type definitions for Level and ScoreEntry.
export type GameState = 'start' | 'nameInput' | 'modeSelect' | 'levelSelect' | 'playing' | 'levelComplete' | 'multiplayer-game' | 'multiplayer-result' | 'typingDefense' | 'guessTheWord' | 'rhythmTyping' | 'typingTeleporter' | 'wordGarden' | 'storyTeller';

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
    // Fix: Add opponentName to the RaceResult interface to store the opponent's name for the results screen.
    opponentName: string;
}

export interface GardenItem {
  id: number;
  name: string;
  finalEmoji: string;
  x: number; // percentage
  y: number; // percentage
  stage: 'seed' | 'sprout' | 'full';
  type?: 'special_plant'; // for distinguishing special items like sunflowers
}

export interface ShopItem {
    id: string;
    name: string;
    emoji: string;
    cost: number;
    description: string;
    type: 'consumable' | 'animal' | 'special_plant' | 'plant';
}

export interface AnimalItem {
    id: number;
    type: 'rabbit' | 'bee' | 'butterfly';
    emoji: string;
    x: number;
    y: number;
}