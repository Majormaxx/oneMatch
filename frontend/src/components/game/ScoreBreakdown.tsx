'use client';

interface ScoreBreakdownProps {
  baseScore: number;
  timeBonus: number;
  streakBonus: number;
  mistakePenalty: number;
  finalScore: number;
}

export function ScoreBreakdown({ 
  baseScore, 
  timeBonus, 
  streakBonus, 
  mistakePenalty, 
  finalScore 
}: ScoreBreakdownProps) {
  return (
    <div className="bg-white/10 rounded-xl p-6 mb-6 space-y-3">
      <div className="flex justify-between text-white">
        <span>Base Score</span>
        <span className="font-bold">{baseScore}</span>
      </div>
      <div className="flex justify-between text-white">
        <span>Time Bonus</span>
        <span className="font-bold text-green-400">+{timeBonus}</span>
      </div>
      <div className="flex justify-between text-white">
        <span>Streak Bonus</span>
        <span className="font-bold text-yellow-400">+{streakBonus}</span>
      </div>
      {mistakePenalty > 0 && (
        <div className="flex justify-between text-white">
          <span>Mistakes</span>
          <span className="font-bold text-red-400">-{mistakePenalty}</span>
        </div>
      )}
      <div className="border-t border-white/20 pt-3 flex justify-between text-xl font-bold text-cyan-300">
        <span>Final Score</span>
        <span>{finalScore.toLocaleString()}</span>
      </div>
    </div>
  );
}
