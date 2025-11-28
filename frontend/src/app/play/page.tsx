'use client';

import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { DIFFICULTY, SCORING } from '@/lib/constants';
import type { Difficulty } from '@/types/game';
import { useGameContract } from '@/hooks/useGameContract';
import { useCurrentAccount } from '@mysten/dapp-kit';

// Game components
import { StatsBar } from '@/components/game/StatsBar';
import { CategoryLegend } from '@/components/game/CategoryLegend';
import { InfoBanner } from '@/components/game/InfoBanner';
import { GameGrid } from '@/components/game/GameGrid';
import { DifficultyBadge } from '@/components/game/DifficultyBadge';
import { GameActions } from '@/components/game/GameActions';
import { WinModal } from '@/components/game/WinModal';
import { WalletConnect } from '@/components/WalletConnect';

export default function GamePage() {
  const account = useCurrentAccount();
  const [difficulty] = useState<Difficulty>(DIFFICULTY.MEDIUM);
  const [showWinModal, setShowWinModal] = useState(false);
  const [matchedCards, setMatchedCards] = useState<{ firstId: string; secondId: string; streak: number } | null>(null);
  const { submitGameResult, getProfile, createProfile } = useGameContract();
  
  const handleMatch = (firstId: string, secondId: string, streak: number) => {
    setMatchedCards({ firstId, secondId, streak });
    // Clear after animation completes
    setTimeout(() => setMatchedCards(null), 1500);
  };
  
  const { gameState, initGame, flipCard } = useGameState(difficulty, handleMatch);

  const handleNewGame = () => {
    initGame();
    setShowWinModal(false);
  };

  // Show win modal when game is won
  const isGameWon = gameState.gameStatus === 'won';
  if (isGameWon && !showWinModal) {
    setShowWinModal(true);
    
    // Submit game result
    const submitResult = async () => {
      try {
        const profile = await getProfile();
        const profileId = profile?.objectId;

        if (!profileId) {
          // Auto-create profile if it doesn't exist
          // Note: In a real app, might want to ask user confirmation
          const result = await createProfile();
          // We'd need to wait for the transaction to be indexed to get the new ID
          // For now, we'll just log it. In production, we'd poll for the new object.
          console.log('Profile created:', result);
          return; 
        }

        // Mock proof for now (backend will generate real proof)
        // const mockProof = Array.from({ length: 64 }, () => 0); 

        await submitGameResult(
          profileId,
          gameState.score,
          difficulty,
          true, // won
          gameState.mistakes === 0 // isPerfect
        );
        console.log('Game result submitted successfully');
      } catch (error) {
        console.error('Failed to submit game result:', error);
      }
    };

    submitResult();
  }

  const isPlaying = gameState.gameStatus === 'playing';
  // const config = GRID_CONFIG[difficulty]; // Unused
  
  // Calculate score breakdown for win modal
  const baseScore = gameState.matchedPairs * SCORING.BASE_POINTS;
  const timeBonus = gameState.timeRemaining * SCORING.TIME_BONUS_PER_SECOND;
  let streakBonus = 0;
  if (gameState.bestStreak >= 4) streakBonus = SCORING.STREAK_BONUS[4];
  else if (gameState.bestStreak >= 3) streakBonus = SCORING.STREAK_BONUS[3];
  else if (gameState.bestStreak >= 2) streakBonus = SCORING.STREAK_BONUS[2];
  const mistakePenalty = gameState.mistakes * SCORING.MISTAKE_PENALTY;

  const getDifficultyLabel = (): 'EASY' | 'MEDIUM' | 'HARD' => {
    if (difficulty === DIFFICULTY.EASY) return 'EASY';
    if (difficulty === DIFFICULTY.HARD) return 'HARD';
    return 'MEDIUM';
  };

  // Wallet gate - show connect wallet screen if not connected
  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-4 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-md">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-cyan-200 mb-6">
            You need to connect your OneWallet to play OneMatch and earn NFT rewards!
          </p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-2 sm:p-4 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {/* Removed duplicate Header - using global Navbar instead */}
        
        {/* Info Banner - responsive height */}
        {isPlaying && (
          <div className="mb-2 sm:mb-3">
            <InfoBanner />
          </div>
        )}

        {/* Stats Bar */}
        {isPlaying && (
          <div className="mb-2 sm:mb-3">
            <StatsBar
              score={gameState.score}
              timeLeft={gameState.timeRemaining}
              streak={gameState.currentStreak}
              moves={gameState.moves}
            />
          </div>
        )}

        {/* Legend */}
        {isPlaying && (
          <div className="mb-2 sm:mb-3">
            <CategoryLegend />
          </div>
        )}

        {/* Game Grid or Start Screen - Takes remaining space */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="w-full max-w-2xl">
            {isPlaying ? (
              <div className="flex flex-col items-center">
                <GameGrid
                  cards={gameState.cards}
                  onCardClick={flipCard}
                  disabled={gameState.flippedCards.length >= 2}
                  matchedCards={matchedCards}
                />
                <div className="mt-2 sm:mt-4">
                  <DifficultyBadge difficulty={getDifficultyLabel()} />
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎮</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                  {gameState.gameStatus === 'idle' ? 'Ready to Learn?' : 'Game Over'}
                </h2>
                <p className="text-cyan-200 text-sm sm:text-base mb-4 sm:mb-6">
                  {gameState.gameStatus === 'idle' 
                    ? 'Match terms with their definitions to master OneChain concepts!'
                    : `You scored ${gameState.score} points!`
                  }
                </p>
                <button 
                  onClick={handleNewGame}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all shadow-lg text-sm sm:text-base"
                >
                  {gameState.gameStatus === 'idle' ? 'Start Game' : 'Play Again'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions - Only in dev mode */}
        {isPlaying && process.env.NODE_ENV === 'development' && (
          <div className="mt-2">
            <GameActions 
              showViewWin={true}
              onViewWin={() => setShowWinModal(true)}
            />
          </div>
        )}
      </div>

      {/* Win Modal */}
      <WinModal
        isOpen={showWinModal}
        onClose={() => setShowWinModal(false)}
        score={gameState.score}
        baseScore={baseScore}
        timeBonus={timeBonus}
        streakBonus={streakBonus}
        mistakePenalty={mistakePenalty}
        matchedCards={gameState.cards.filter(c => c.isMatched)}
        onPlayAgain={handleNewGame}
      />
    </div>
  );
}
