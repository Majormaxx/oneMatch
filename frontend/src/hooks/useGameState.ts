'use client';

import { useState, useEffect, useCallback } from 'react';
import { GRID_CONFIG, SCORING } from '@/lib/constants';
import { generateGameCards, cardsMatch, calculateScore } from '@/lib/game-logic';
import type { GameState, Difficulty, GameCard, GameResult } from '@/types/game';

export function useGameState(
  difficulty: Difficulty, 
  onMatch?: (firstCardId: string, secondCardId: string, streak: number) => void
) {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    mistakes: 0,
    currentStreak: 0,
    bestStreak: 0,
    score: 0,
    timeRemaining: GRID_CONFIG[difficulty].timer,
    gameStatus: 'idle',
    difficulty,
  });

  const [startTime, setStartTime] = useState<number | null>(null);

  // Initialize game
  const initGame = useCallback(() => {
    const cards = generateGameCards(difficulty);
    setGameState({
      cards,
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      mistakes: 0,
      currentStreak: 0,
      bestStreak: 0,
      score: 0,
      timeRemaining: GRID_CONFIG[difficulty].timer,
      gameStatus: 'playing',
      difficulty,
    });
    setStartTime(Date.now());
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          return { ...prev, timeRemaining: 0, gameStatus: 'lost' };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStatus]);

  // Flip card
  const flipCard = useCallback((cardId: string) => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      if (prev.flippedCards.length >= 2) return prev;
      if (prev.flippedCards.includes(cardId)) return prev;

      const card = prev.cards.find(c => c.uniqueId === cardId);
      if (!card || card.isMatched) return prev;

      const newFlippedCards = [...prev.flippedCards, cardId];
      const newCards = prev.cards.map(c =>
        c.uniqueId === cardId ? { ...c, isFlipped: true } : c
      );

      // Check for match if two cards are flipped
      if (newFlippedCards.length === 2) {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = newCards.find(c => c.uniqueId === firstId)!;
        const secondCard = newCards.find(c => c.uniqueId === secondId)!;

        const isMatch = cardsMatch(firstCard, secondCard);
        const newMoves = prev.moves + 1;
        const newMistakes = isMatch ? prev.mistakes : prev.mistakes + 1;
        const newStreak = isMatch ? prev.currentStreak + 1 : 0;
        const newBestStreak = Math.max(prev.bestStreak, newStreak);
        const newMatchedPairs = isMatch ? prev.matchedPairs + 1 : prev.matchedPairs;

        // Check if game is won
        const totalPairs = GRID_CONFIG[prev.difficulty].pairs;
        const gameWon = newMatchedPairs === totalPairs;

        // Calculate current score immediately when there's a match
        let newScore = prev.score;
        if (isMatch) {
          const basePoints = SCORING.BASE_POINTS;
          const multiplier = SCORING.DIFFICULTY_MULTIPLIER[prev.difficulty];
          const matchScore = Math.floor(basePoints * multiplier);
          newScore = prev.score + matchScore;
          
          // Trigger confetti callback
          onMatch?.(firstId, secondId, newStreak);
        }

        setTimeout(() => {
          setGameState(current => {
            const updatedCards = current.cards.map(c => {
              if (isMatch && (c.uniqueId === firstId || c.uniqueId === secondId)) {
                return { ...c, isMatched: true, isFlipped: true };
              }
              if (!isMatch && (c.uniqueId === firstId || c.uniqueId === secondId)) {
                return { ...c, isFlipped: false };
              }
              return c;
            });

            // Final score calculation for game end (if won)
            let finalScore = current.score;
            if (gameWon) {
              const isPerfect = newMistakes === 0;
              finalScore = calculateScore(
                newMatchedPairs,
                prev.difficulty,
                current.timeRemaining,
                newBestStreak,
                newMistakes,
                isPerfect
              );
            }

            return {
              ...current,
              cards: updatedCards,
              flippedCards: [],
              matchedPairs: newMatchedPairs,
              moves: newMoves,
              mistakes: newMistakes,
              currentStreak: newStreak,
              bestStreak: newBestStreak,
              score: finalScore,
              gameStatus: gameWon ? 'won' : current.gameStatus,
            };
          });
        }, isMatch ? 500 : 1000);

        return {
          ...prev,
          cards: newCards,
          flippedCards: newFlippedCards,
          moves: newMoves,
          mistakes: newMistakes,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          matchedPairs: newMatchedPairs,
          score: newScore, // Update score immediately on match
        };
      }

      return {
        ...prev,
        cards: newCards,
        flippedCards: newFlippedCards,
      };
    });
  }, [onMatch]);

  // Get game result
  const getGameResult = useCallback((): GameResult | null => {
    if (gameState.gameStatus !== 'won' && gameState.gameStatus !== 'lost') {
      return null;
    }

    const timeTaken = startTime
      ? Math.floor((Date.now() - startTime) / 1000)
      : GRID_CONFIG[difficulty].timer;

    return {
      score: gameState.score,
      won: gameState.gameStatus === 'won',
      isPerfect: gameState.mistakes === 0 && gameState.gameStatus === 'won',
      difficulty: gameState.difficulty,
      timeTaken,
      moves: gameState.moves,
      mistakes: gameState.mistakes,
    };
  }, [gameState, startTime, difficulty]);

  return {
    gameState,
    initGame,
    flipCard,
    getGameResult,
  };
}
