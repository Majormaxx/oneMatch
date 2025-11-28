import { SCORING, DIFFICULTY, GRID_CONFIG, TERM_DEFINITION_PAIRS } from './constants';
import type { Difficulty, GameCard, Card, GameResult } from '@/types/game';

/**
 * Calculate final score based on game performance
 */
export function calculateScore(
  matchedPairs: number,
  difficulty: Difficulty,
  timeRemaining: number,
  bestStreak: number,
  mistakes: number,
  isPerfect: boolean
): number {
  // Base points
  const basePoints = matchedPairs * SCORING.BASE_POINTS;
  
  // Difficulty multiplier
  const multiplier = SCORING.DIFFICULTY_MULTIPLIER[difficulty];
  const difficultyScore = Math.floor(basePoints * multiplier);
  
  // Time bonus
  const timeBonus = timeRemaining * SCORING.TIME_BONUS_PER_SECOND;
  
  // Streak bonus
  let streakBonus = 0;
  if (bestStreak >= 4) streakBonus = SCORING.STREAK_BONUS[4];
  else if (bestStreak >= 3) streakBonus = SCORING.STREAK_BONUS[3];
  else if (bestStreak >= 2) streakBonus = SCORING.STREAK_BONUS[2];
  
  // Mistake penalty
  const mistakePenalty = mistakes * SCORING.MISTAKE_PENALTY;
  
  // Perfect game bonus
  const perfectBonus = isPerfect ? SCORING.PERFECT_GAME_BONUS : 0;
  
  const totalScore = difficultyScore + timeBonus + streakBonus - mistakePenalty + perfectBonus;
  
  return Math.max(0, totalScore);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate game cards for a given difficulty
 * Creates randomized term-definition pairs
 */
export function generateGameCards(difficulty: Difficulty): GameCard[] {
  const config = GRID_CONFIG[difficulty];
  const pairsNeeded = config.pairs;
  
  // Shuffle and select random pairs
  const selectedPairs = shuffleArray([...TERM_DEFINITION_PAIRS]).slice(0, pairsNeeded);
  
  // Create term and definition cards for each pair
  const cardPairs: GameCard[] = [];
  selectedPairs.forEach((pair, index) => {
    // Term card
    cardPairs.push({
      pairId: pair.pairId,
      displayText: pair.term,
      type: 'term',
      category: pair.category,
      uniqueId: `${pair.pairId}-term-${index}`,
      isFlipped: false,
      isMatched: false,
    });
    // Definition card
    cardPairs.push({
      pairId: pair.pairId,
      displayText: pair.definition,
      type: 'definition',
      category: pair.category,
      uniqueId: `${pair.pairId}-def-${index}`,
      isFlipped: false,
      isMatched: false,
    });
  });
  
  // Shuffle all cards
  return shuffleArray(cardPairs);
}

/**
 * Check if two cards match (same pairId, different cards)
 */
export function cardsMatch(card1: GameCard, card2: GameCard): boolean {
  return card1.pairId === card2.pairId && card1.uniqueId !== card2.uniqueId;
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check achievement eligibility
 */
export function checkAchievements(
  result: GameResult,
  stats: { gamesPlayed: number; timeTaken: number }
): string[] {
  const earned: string[] = [];
  
  // First Match
  if (stats.gamesPlayed === 1) {
    earned.push('FIRST_MATCH');
  }
  
  // Speed Learner
  if (result.difficulty === DIFFICULTY.EASY && stats.timeTaken < 60 && result.won) {
    earned.push('SPEED_LEARNER');
  }
  
  // Perfect Memory
  if (result.isPerfect && result.won) {
    earned.push('PERFECT_MEMORY');
  }
  
  // OneChain Expert
  if (result.difficulty === DIFFICULTY.HARD && result.score >= 1500 && result.won) {
    earned.push('ONECHAIN_EXPERT');
  }
  
  return earned;
}

/**
 * Calculate NFT drop probability based on score and difficulty
 */
export function calculateNFTDropChance(score: number, difficulty: Difficulty): number {
  if (difficulty === DIFFICULTY.HARD && score > 2000) {
    return 0.05; // 5% for legendary
  }
  if (score > 1500) {
    return 0.15; // 15% for rare
  }
  if (score > 1000) {
    return 0.30; // 30% for common
  }
  return 0;
}

/**
 * Check if NFT should drop
 */
export function shouldDropNFT(score: number, difficulty: Difficulty): boolean {
  const chance = calculateNFTDropChance(score, difficulty);
  return Math.random() < chance;
}
