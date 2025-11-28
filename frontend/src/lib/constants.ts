// Game constants
export const DIFFICULTY = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
} as const;

export const GRID_CONFIG = {
  [DIFFICULTY.EASY]: { rows: 3, cols: 4, pairs: 6, timer: 90 },
  [DIFFICULTY.MEDIUM]: { rows: 4, cols: 4, pairs: 8, timer: 120 },
  [DIFFICULTY.HARD]: { rows: 4, cols: 6, pairs: 12, timer: 180 },
} as const;

// Scoring constants
export const SCORING = {
  BASE_POINTS: 100,
  DIFFICULTY_MULTIPLIER: {
    [DIFFICULTY.EASY]: 1.0,
    [DIFFICULTY.MEDIUM]: 1.5,
    [DIFFICULTY.HARD]: 2.0,
  },
  TIME_BONUS_PER_SECOND: 10,
  STREAK_BONUS: {
    2: 50,
    3: 100,
    4: 200,
  },
  MISTAKE_PENALTY: 20,
  PERFECT_GAME_BONUS: 1000,
} as const;

// Card types - Term-Definition pairs for OneChain ecosystem & DeFi concepts
export const TERM_DEFINITION_PAIRS = [
  // OneChain ecosystem
  { pairId: 'A', term: 'OneWallet', definition: 'Self-custody wallet with MPC security', category: 'ecosystem' },
  { pairId: 'B', term: 'OneDEX', definition: 'Decentralized exchange for trading tokens', category: 'ecosystem' },
  { pairId: 'C', term: 'USDO', definition: 'Yield-generating stablecoin on OneChain', category: 'ecosystem' },
  { pairId: 'D', term: 'OneRWA', definition: 'Real World Assets platform on OneChain', category: 'ecosystem' },
  { pairId: 'E', term: 'OneTransfer', definition: 'Cross-chain asset transfer protocol', category: 'ecosystem' },
  { pairId: 'F', term: 'OneChain', definition: 'Layer-1 blockchain for decentralized apps', category: 'ecosystem' },
  
  // DeFi concepts
  { pairId: 'G', term: 'Staking', definition: 'Locking tokens to secure network and earn rewards', category: 'defi' },
  { pairId: 'H', term: 'AMM', definition: 'Automated market maker using algorithms', category: 'defi' },
  { pairId: 'I', term: 'Liquidity Pool', definition: 'Token reserves enabling decentralized trading', category: 'defi' },
  { pairId: 'J', term: 'Yield Farming', definition: 'Earning rewards by providing liquidity', category: 'defi' },
  { pairId: 'K', term: 'Bridge', definition: 'Protocol connecting different blockchains', category: 'defi' },
  
  // Blockchain concepts
  { pairId: 'L', term: 'Smart Contract', definition: 'Self-executing code with agreement terms', category: 'blockchain' },
  { pairId: 'M', term: 'Gas Fee', definition: 'Cost to execute transactions on blockchain', category: 'blockchain' },
  { pairId: 'N', term: 'Block', definition: 'Data structure containing transaction records', category: 'blockchain' },
  { pairId: 'O', term: 'Consensus', definition: 'Agreement mechanism for validating transactions', category: 'blockchain' },
  
  // Advanced concepts
  { pairId: 'P', term: 'RWA', definition: 'Real World Assets represented on blockchain', category: 'advanced' },
  { pairId: 'Q', term: 'MPC', definition: 'Multi-Party Computation for secure key management', category: 'advanced' },
  { pairId: 'R', term: 'TVL', definition: 'Total Value Locked in DeFi protocols', category: 'advanced' },
  { pairId: 'S', term: 'Slippage', definition: 'Price difference between expected and executed trade', category: 'advanced' },
] as const;

// Category metadata
export const CATEGORY_CONFIG = {
  ecosystem: {
    color: 'from-cyan-400 to-blue-500',
    borderColor: 'border-cyan-400/30',
    textColor: 'text-cyan-300',
    icon: '🔗',
    name: 'OneChain',
  },
  defi: {
    color: 'from-purple-400 to-pink-500',
    borderColor: 'border-purple-400/30',
    textColor: 'text-purple-300',
    icon: '💰',
    name: 'DeFi',
  },
  blockchain: {
    color: 'from-green-400 to-emerald-500',
    borderColor: 'border-green-400/30',
    textColor: 'text-green-300',
    icon: '⛓️',
    name: 'Blockchain',
  },
  advanced: {
    color: 'from-orange-400 to-red-500',
    borderColor: 'border-orange-400/30',
    textColor: 'text-orange-300',
    icon: '🚀',
    name: 'Advanced',
  },
} as const;

// Achievement types
export const ACHIEVEMENTS = {
  FIRST_MATCH: {
    id: 'FIRST_MATCH',
    name: 'First Match',
    description: 'Complete your first game',
    icon: '🎮',
  },
  SPEED_LEARNER: {
    id: 'SPEED_LEARNER',
    name: 'Speed Learner',
    description: 'Complete Easy mode under 60 seconds',
    icon: '⚡',
  },
  PERFECT_MEMORY: {
    id: 'PERFECT_MEMORY',
    name: 'Perfect Memory',
    description: 'Complete any difficulty with zero mistakes',
    icon: '🧠',
  },
  ONECHAIN_EXPERT: {
    id: 'ONECHAIN_EXPERT',
    name: 'OneChain Expert',
    description: 'Complete Hard mode with 1500+ score',
    icon: '👑',
  },
  DAILY_DEDICATION: {
    id: 'DAILY_DEDICATION',
    name: 'Daily Dedication',
    description: 'Play 3 games in one day',
    icon: '📅',
  },
  WEEK_WARRIOR: {
    id: 'WEEK_WARRIOR',
    name: 'Week Warrior',
    description: 'Play on 7 different days',
    icon: '🏆',
  },
  SOCIAL_CHAMPION: {
    id: 'SOCIAL_CHAMPION',
    name: 'Social Champion',
    description: 'Share your score 3 times',
    icon: '📢',
  },
} as const;

// Smart contract addresses
export const CONTRACT = {
  PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID!,
  GAME_REGISTRY_ID: process.env.NEXT_PUBLIC_GAME_REGISTRY_ID!,
  DAILY_LEADERBOARD_ID: process.env.NEXT_PUBLIC_DAILY_LEADERBOARD_ID!,
  ALL_TIME_LEADERBOARD_ID: process.env.NEXT_PUBLIC_ALL_TIME_LEADERBOARD_ID!,
  NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK as 'testnet' | 'mainnet',
} as const;
