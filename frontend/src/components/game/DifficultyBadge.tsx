'use client';

interface DifficultyBadgeProps {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const getColor = () => {
    switch (difficulty) {
      case 'EASY':
        return 'from-green-500 to-emerald-500';
      case 'MEDIUM':
        return 'from-orange-500 to-red-500';
      case 'HARD':
        return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <div className={`bg-gradient-to-r ${getColor()} text-white px-6 py-2 rounded-full font-bold shadow-lg`}>
        {difficulty} DIFFICULTY - Match Terms to Definitions
      </div>
    </div>
  );
}
