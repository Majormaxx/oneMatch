'use client';

import { Trophy, Clock, Zap, Award } from 'lucide-react';

interface StatsBarProps {
  score: number;
  timeLeft: number;
  streak: number;
  moves: number;
}

export function StatsBar({ score, timeLeft, streak, moves }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="flex items-center gap-2 text-cyan-300 mb-1">
          <Trophy size={18} />
          <span className="text-sm font-medium">Score</span>
        </div>
        <div className="text-2xl font-bold text-white">{score.toLocaleString()}</div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="flex items-center gap-2 text-orange-300 mb-1">
          <Clock size={18} />
          <span className="text-sm font-medium">Time</span>
        </div>
        <div className="text-2xl font-bold text-white">{timeLeft}s</div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="flex items-center gap-2 text-yellow-300 mb-1">
          <Zap size={18} />
          <span className="text-sm font-medium">Streak</span>
        </div>
        <div className="text-2xl font-bold text-white">{streak}x</div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="flex items-center gap-2 text-purple-300 mb-1">
          <Award size={18} />
          <span className="text-sm font-medium">Moves</span>
        </div>
        <div className="text-2xl font-bold text-white">{moves}</div>
      </div>
    </div>
  );
}
