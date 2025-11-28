export type Difficulty = 1 | 2 | 3;

export type CardCategory = 'ecosystem' | 'defi' | 'blockchain' | 'advanced';
export type CardType = 'term' | 'definition';

export interface Card {
  pairId: string;
  displayText: string;
  type: CardType;
  category: CardCategory;
}

export interface GameCard extends Card {
  uniqueId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: GameCard[];
  flippedCards: string[];
  matchedPairs: number;
  moves: number;
  mistakes: number;
  currentStreak: number;
  bestStreak: number;
  score: number;
  timeRemaining: number;
  gameStatus: 'idle' | 'playing' | 'paused' | 'won' | 'lost';
  difficulty: Difficulty;
}

export interface GameResult {
  score: number;
  won: boolean;
  isPerfect: boolean;
  difficulty: Difficulty;
  timeTaken: number;
  moves: number;
  mistakes: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  perfectGames: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerAddress: string;
  score: number;
  difficulty: Difficulty;
  timestamp: number;
}
