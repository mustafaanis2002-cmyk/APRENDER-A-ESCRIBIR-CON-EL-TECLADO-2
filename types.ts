
export interface Level {
  level: number;
  title: string;
  color: string;
  challenges: string[];
  pointsPerCharacter: number;
  pointsToUnlock: number;
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

// Fix: Define and export GameState to resolve import/export errors.
export type GameState =
  | 'start'
  | 'nameInput'
  | 'modeSelect'
  | 'levelSelect'
  | 'playing'
  | 'levelComplete'
  | 'multiplayer-game'
  | 'multiplayer-result'
  | 'typingDefense'
  | 'guessTheWord'
  | 'rhythmTyping'
  | 'typingTeleporter'
  | 'wordGarden'
  | 'storyTeller'
  | 'typingKitchen';


// --- Word Garden Specific Types (COMPLEX) ---

export type ItemType = 'plant' | 'animal' | 'pool' | 'object' | 'upgrade' | 'special_plant';
export type ItemSize = 'sm' | 'md' | 'lg' | 'xl' | 'planetary';
export type GrowthStage = 'seed' | 'sprout' | 'full';


export interface ShopItem {
    id: number;
    name: string;
    emoji: string;
    description: string;
    cost: number;
    sunsPerSecond: number;
    type: ItemType;
    size: ItemSize;
    requiresPool?: boolean;
    growthBoost?: number;
    isCustom?: boolean;
    requiresVip?: boolean;
}

export interface GardenItem {
    instanceId: number;
    shopId: number;
    name: string;
    emoji: string;
    x: number;
    y: number;
    size: ItemSize;
    type: ItemType;
    sunsPerSecond: number;
    growthStage: GrowthStage;
}

export interface Garden {
    id: number;
    items: GardenItem[];
}