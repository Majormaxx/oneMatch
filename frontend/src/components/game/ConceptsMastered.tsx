'use client';

import { GameCard } from '@/types/game';
import { CATEGORY_CONFIG } from '@/lib/constants';

interface ConceptsMasteredProps {
  cards: GameCard[];
}

export function ConceptsMastered({ cards }: ConceptsMasteredProps) {
  // Get unique terms from matched cards
  const uniqueTerms = Array.from(
    new Set(
      cards
        .filter(card => card.type === 'term')
        .map(card => ({ text: card.displayText, category: card.category }))
    )
  ).slice(0, 5); // Show max 5 concepts

  if (uniqueTerms.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/50 rounded-xl p-4 mb-4">
      <div className="text-green-300 font-bold mb-2">🧠 Concepts Mastered:</div>
      <div className="flex flex-wrap gap-2">
        {uniqueTerms.map((term, index) => {
          const categoryConfig = CATEGORY_CONFIG[term.category];
          return (
            <span 
              key={index}
              className={`bg-${categoryConfig.color.split('-')[1]}-500/20 ${categoryConfig.textColor} px-3 py-1 rounded-full text-xs`}
            >
              {term.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
