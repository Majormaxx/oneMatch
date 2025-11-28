'use client';

import { formatTime } from '@/lib/game-logic';

interface GameStatsProps {
  score: number;
  moves: number;
  mistakes: number;
  timeRemaining: number;
  currentStreak: number;
}

export function GameStats({ score, moves, mistakes, timeRemaining, currentStreak }: GameStatsProps) {
  const timeColor = timeRemaining < 30 ? 'text-red-600' : timeRemaining < 60 ? 'text-yellow-600' : 'text-emerald-600';
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4 w-full max-w-5xl mx-auto px-2">
      {/* Score */}
      <div className="stats-panel text-center">
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold">Score</div>
        <div className="text-xl sm:text-2xl font-bold text-white">{score}</div>
      </div>

      {/* Timer */}
      <div className="stats-panel text-center">
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold">Time</div>
        <div className={`text-xl sm:text-2xl font-bold ${timeColor}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Moves */}
      <div className="stats-panel text-center">
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold">Moves</div>
        <div className="text-xl sm:text-2xl font-bold text-blue-600">{moves}</div>
      </div>

      {/* Mistakes */}
      <div className="stats-panel text-center">
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold">Mistakes</div>
        <div className="text-xl sm:text-2xl font-bold text-red-600">{mistakes}</div>
      </div>

      {/* Streak */}
      <div className="stats-panel text-center col-span-2 sm:col-span-1">
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold">Streak</div>
        <div className="text-xl sm:text-2xl font-bold text-purple-600">
          {currentStreak > 0 && '🔥'} {currentStreak}
        </div>
      </div>
    </div>
  );
}
