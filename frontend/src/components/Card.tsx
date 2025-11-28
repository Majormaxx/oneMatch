'use client';

import { GameCard } from '@/types/game';
import { CATEGORY_CONFIG } from '@/lib/constants';

interface CardProps {
  card: GameCard;
  onClick: () => void;
  disabled: boolean;
  cardRef?: (el: HTMLButtonElement | null) => void;
}

export function Card({ card, onClick, disabled, cardRef }: CardProps) {
  const { displayText, type, category, isFlipped, isMatched } = card;
  const categoryConfig = CATEGORY_CONFIG[category];
  const isTerm = type === 'term';

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      disabled={disabled || isMatched}
      className={`
        aspect-square rounded-xl transition-all duration-300 transform shadow-lg relative
        ${
          isMatched 
            ? `bg-gradient-to-br ${categoryConfig.color} opacity-60 cursor-not-allowed animate-pulse-once scale-105` 
            : isFlipped
            ? `bg-gradient-to-br ${categoryConfig.color} hover:scale-105`
            : 'bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:border-cyan-400 hover:scale-105'
        }
        ${disabled && !isMatched ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={isFlipped ? displayText : 'Hidden card'}
    >
      {/* Flipped content */}
      <div className={`w-full h-full flex flex-col items-center justify-center p-2 transition-opacity duration-300 ${
        isFlipped ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="text-2xl mb-1">{categoryConfig.icon}</div>
        <div className="text-white text-xs sm:text-sm font-bold text-center leading-tight">
          {displayText}
        </div>
        {isTerm && (
          <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">
            TERM
          </div>
        )}
      </div>
      
      {/* Back of card */}
      {!isFlipped && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl sm:text-5xl font-bold text-white/40">?</div>
        </div>
      )}
    </button>
  );
}
