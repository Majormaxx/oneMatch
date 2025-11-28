'use client';

import { useRef, useEffect } from 'react';
import { GameCard as GameCardType } from '@/types/game';
import { Card } from '../Card';
import { triggerConfetti, triggerStreakConfetti } from '../ConfettiEffect';

interface GameGridProps {
  cards: GameCardType[];
  onCardClick: (cardId: string) => void;
  disabled: boolean;
  matchedCards?: { firstId: string; secondId: string; streak: number } | null;
}

export function GameGrid({ cards, onCardClick, disabled, matchedCards }: GameGridProps) {
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Trigger confetti when cards match
  useEffect(() => {
    if (!matchedCards) return;

    const { firstId, secondId, streak } = matchedCards;
    
    // Get card positions
    const firstCardEl = cardRefs.current.get(firstId);
    const secondCardEl = cardRefs.current.get(secondId);

    if (firstCardEl && secondCardEl) {
      const rect1 = firstCardEl.getBoundingClientRect();
      const rect2 = secondCardEl.getBoundingClientRect();

      // Calculate normalized positions (0 to 1)
      const x1 = (rect1.left + rect1.width / 2) / window.innerWidth;
      const y1 = (rect1.top + rect1.height / 2) / window.innerHeight;
      const x2 = (rect2.left + rect2.width / 2) / window.innerWidth;
      const y2 = (rect2.top + rect2.height / 2) / window.innerHeight;

      // Trigger confetti at both card positions
      setTimeout(() => {
        triggerConfetti({ x: x1, y: y1, duration: 1000 });
        triggerConfetti({ x: x2, y: y2, duration: 1000 });
      }, 200);

      // Trigger streak confetti for 3+ streaks
      if (streak >= 3) {
        setTimeout(() => {
          triggerStreakConfetti(streak);
        }, 400);
      }
    }
  }, [matchedCards]);

  const setCardRef = (cardId: string, el: HTMLButtonElement | null) => {
    if (el) {
      cardRefs.current.set(cardId, el);
    } else {
      cardRefs.current.delete(cardId);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => (
        <Card
          key={card.uniqueId}
          card={card}
          onClick={() => onCardClick(card.uniqueId)}
          disabled={disabled}
          cardRef={(el) => setCardRef(card.uniqueId, el)}
        />
      ))}
    </div>
  );
}
