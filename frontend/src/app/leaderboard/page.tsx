'use client';

import { useEffect, useState } from 'react';
import { useGameContract } from '@/hooks/useGameContract';
import { Trophy } from 'lucide-react';

// Define a type for the leaderboard entry if possible, or use any with comment
interface LeaderboardEntry {
  player: string;
  score: number;
  difficulty: number;
  timestamp: number;
}

export default function LeaderboardPage() {
  const { getDailyLeaderboard } = useGameContract();
  const [dailyScores, setDailyScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getDailyLeaderboard();
        console.log('Leaderboard data:', data);
        setDailyScores(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [getDailyLeaderboard]);

  return (
    <div className="min-h-screen bg-navy py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4">
            Global Leaderboards
          </h1>
          <p className="text-platinum/70">
            Compete for glory and exclusive NFT rewards
          </p>
        </div>

        <div className="glass-navy rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-brand-gradient rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Daily Top Scores</h2>
          </div>

          {loading ? (
            <div className="text-center py-12 text-platinum/50">
              Loading rankings...
            </div>
          ) : dailyScores.length > 0 ? (
            <div className="space-y-4">
              {dailyScores.map((score, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-brand-cyan">#{index + 1}</span>
                    <div>
                      <p className="text-white font-semibold">Player</p>
                      <p className="text-xs text-platinum/50 font-mono">
                        {score.player.slice(0, 6)}...{score.player.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{score.score}</p>
                    <p className="text-xs text-platinum/50">Points</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-platinum/50">
              No scores submitted today yet. Be the first!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
