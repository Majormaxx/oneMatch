'use client';

import { DIFFICULTY } from '@/lib/constants';
import type { Difficulty } from '@/types/game';

interface DifficultySelectProps {
  selected: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

export function DifficultySelect({ selected, onChange, disabled }: DifficultySelectProps) {
  const difficulties = [
    { value: DIFFICULTY.EASY, label: 'Easy', desc: '4×3', icon: '🌱' },
    { value: DIFFICULTY.MEDIUM, label: 'Medium', desc: '4×4', icon: '🎋' },
    { value: DIFFICULTY.HARD, label: 'Hard', desc: '6×4', icon: '🎍' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full max-w-3xl mx-auto px-2">
      {difficulties.map(({ value, label, desc, icon }) => (
        <button
          key={value}
          onClick={() => onChange(value as Difficulty)}
          disabled={disabled}
          className={`
            difficulty-tile
            ${selected === value ? 'selected' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="text-2xl sm:text-3xl mb-1">{icon}</div>
          <div className="text-base sm:text-lg font-bold text-gray-800">{label}</div>
          <div className="text-xs sm:text-sm text-gray-600">{desc} grid</div>
        </button>
      ))}
    </div>
  );
}
