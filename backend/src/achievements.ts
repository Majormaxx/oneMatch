/**
 * Achievement Types matching the branding document
 */
export type AchievementType =
  | 'first_victory'
  | 'perfect_memory'
  | 'speed_demon'
  | 'streak_7'
  | 'onechain_expert';

export type NFTRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  type: AchievementType;
  rarity: NFTRarity;
  name: string;
  description: string;
  criteria: {
    description: string;
    validator: (data: GameResult) => boolean;
  };
}

export interface GameResult {
  walletAddress: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  timeElapsed: number; // in seconds
  mistakes: number;
  matchedPairs: number;
  perfectGame: boolean; // 0 mistakes
}

/**
 * Achievement definitions based on branding document Section 6
 */
export const ACHIEVEMENTS: Record<AchievementType, Achievement> = {
  first_victory: {
    type: 'first_victory',
    rarity: 'common',
    name: 'First Victory',
    description: 'Complete your first game and begin your OneChain journey',
    criteria: {
      description: 'Complete any game',
      validator: (data) => data.matchedPairs > 0,
    },
  },

  perfect_memory: {
    type: 'perfect_memory',
    rarity: 'rare',
    name: 'Perfect Memory Badge',
    description: 'Zero mistakes, pure skill - achieved by only 8% of players',
    criteria: {
      description: 'Complete a game with 0 mistakes',
      validator: (data) => data.mistakes === 0 && data.perfectGame,
    },
  },

  speed_demon: {
    type: 'speed_demon',
    rarity: 'rare',
    name: 'Speed Demon Medal',
    description: 'Lightning-fast reflexes and sharp memory combined',
    criteria: {
      description: 'Complete Easy under 60s, Medium under 90s, or Hard under 120s',
      validator: (data) => {
        const timeLimits = { easy: 60, medium: 90, hard: 120 };
        return data.timeElapsed <= timeLimits[data.difficulty] && data.perfectGame;
      },
    },
  },

  streak_7: {
    type: 'streak_7',
    rarity: 'epic',
    name: '7-Day Streak Trophy',
    description: 'Dedication and consistency - most people quit after day 1',
    criteria: {
      description: 'Play games on 7 consecutive days',
      validator: () => {
        // This would require database tracking of play dates
        // For now, return false - will be validated separately
        return false;
      },
    },
  },

  onechain_expert: {
    type: 'onechain_expert',
    rarity: 'legendary',
    name: 'OneChain Expert Certificate',
    description: 'Mastered the entire OneChain ecosystem - join the elite',
    criteria: {
      description: 'Complete Hard mode with a perfect game',
      validator: (data) =>
        data.difficulty === 'hard' && data.perfectGame && data.mistakes === 0,
    },
  },
};

/**
 * Validate if a player is eligible for an achievement
 */
export function validateAchievement(
  achievementType: AchievementType,
  gameResult: GameResult
): boolean {
  const achievement = ACHIEVEMENTS[achievementType];
  if (!achievement) return false;

  return achievement.criteria.validator(gameResult);
}

/**
 * Get all achievements unlocked from a game result
 */
export function getUnlockedAchievements(gameResult: GameResult): Achievement[] {
  const unlocked: Achievement[] = [];

  for (const achievementType of Object.keys(ACHIEVEMENTS) as AchievementType[]) {
    // Skip streak_7 as it requires separate tracking
    if (achievementType === 'streak_7') continue;

    if (validateAchievement(achievementType, gameResult)) {
      unlocked.push(ACHIEVEMENTS[achievementType]);
    }
  }

  return unlocked;
}

/**
 * Calculate achievement score bonus (for future use)
 */
export function getAchievementBonus(achievements: Achievement[]): number {
  const bonusMap: Record<NFTRarity, number> = {
    common: 100,
    rare: 500,
    epic: 1000,
    legendary: 2500,
  };

  return achievements.reduce((total, ach) => total + bonusMap[ach.rarity], 0);
}
