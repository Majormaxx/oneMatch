'use client';

import { useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { ScoreBreakdown } from './ScoreBreakdown';
import { ConceptsMastered } from './ConceptsMastered';
import { ShareActions } from './ShareActions';
import { GameCard } from '@/types/game';
import { triggerWinConfetti, triggerPerfectGameConfetti } from '../ConfettiEffect';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  baseScore: number;
  timeBonus: number;
  streakBonus: number;
  mistakePenalty: number;
  matchedCards: GameCard[];
  onPlayAgain: () => void;
}

export function WinModal({ 
  isOpen, 
  onClose, 
  score,
  baseScore,
  timeBonus,
  streakBonus,
  mistakePenalty,
  matchedCards,
  onPlayAgain 
}: WinModalProps) {
  const isPerfect = mistakePenalty === 0;

  // Trigger confetti when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isPerfect) {
        triggerPerfectGameConfetti();
      } else {
        triggerWinConfetti();
      }
    }
  }, [isOpen, isPerfect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-8 max-w-md w-full border-2 border-cyan-400 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{isPerfect ? '🌟' : '🎉'}</div>
          <h2 className="text-4xl font-bold text-white mb-2">
            {isPerfect ? 'Perfect Game!' : 'Victory!'}
          </h2>
          <p className="text-cyan-300">
            {isPerfect ? 'Flawless performance!' : 'You mastered OneChain concepts!'}
          </p>
        </div>

        {/* Score Breakdown */}
        <ScoreBreakdown
          baseScore={baseScore}
          timeBonus={timeBonus}
          streakBonus={streakBonus}
          mistakePenalty={mistakePenalty}
          finalScore={score}
        />

        {/* Concepts Learned */}
        <ConceptsMastered cards={matchedCards} />

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          <div className="text-5xl">⭐</div>
          <div className="text-5xl">⭐</div>
          <div className="text-5xl">⭐</div>
        </div>

        {/* NFT Reward */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏆</div>
            <div>
              <div className="text-yellow-300 font-bold">Achievement Unlocked!</div>
              <div className="text-white text-sm">OneChain Expert Badge NFT</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg">
            🎁 Claim NFT Reward
          </button>
          
          <ShareActions />

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={onPlayAgain}
              className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-all border border-white/20"
            >
              Play Again
            </button>
            <button 
              onClick={onClose}
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 py-3 rounded-lg font-semibold transition-all border border-purple-400/30"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
