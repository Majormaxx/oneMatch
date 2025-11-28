'use client';

import React from 'react';
import { Trophy, Calendar, Share2 } from 'lucide-react';

/**
 * Compete & Share Section
 * Daily challenges, leaderboards, social features
 */
export function CompeteSection() {
  const leaderboard = [
    { rank: 1, name: 'ChainMaster', score: 2847, badge: '🥇' },
    { rank: 2, name: 'MemoryKing', score: 2756, badge: '🥈' },
    { rank: 3, name: 'Web3Wizard', score: 2690, badge: '🥉' }
  ];

  return (
    <section className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Global Leaderboards.
            <span className="block text-brand-cyan mt-2">Daily Challenges. Real Competition.</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Daily Challenge */}
          <div className="glass-navy rounded-2xl p-8">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-warning to-orange-500 mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Daily Challenge</h3>
            <p className="text-platinum/70 mb-4">
              New puzzle every 24 hours. Top 3 win exclusive NFTs.
            </p>
            <div className="bg-white/5 rounded-lg p-4 border border-brand-cyan/30">
              <p className="text-sm text-platinum/60 mb-1">Today&apos;s Challenge:</p>
              <p className="text-white font-semibold">Match 8 pairs in under 90 seconds</p>
              <p className="text-brand-cyan text-sm mt-2">⏰ 14h 32m remaining</p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="glass-navy rounded-2xl p-8">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-blue mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Leaderboards</h3>
            <p className="text-platinum/70 mb-4">
              See how you rank globally. Climb from Bronze to Legend tier.
            </p>
            <div className="space-y-2">
              {leaderboard.map((player) => (
                <div key={player.rank} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{player.badge}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{player.name}</p>
                      <p className="text-platinum/50 text-xs">Rank #{player.rank}</p>
                    </div>
                  </div>
                  <span className="text-brand-cyan font-bold">{player.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Sharing */}
          <div className="glass-navy rounded-2xl p-8">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Social Sharing</h3>
            <p className="text-platinum/70 mb-4">
              Flex your scores on Twitter and WhatsApp. Bring friends, earn bonuses.
            </p>
            <div className="space-y-3">
              <button className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
                Share on Twitter
              </button>
              <button className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a 
            href="/play"
            className="inline-block bg-brand-gradient hover:bg-brand-gradient-hover text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-lg"
          >
            Check Today&apos;s Challenge →
          </a>
        </div>
      </div>
    </section>
  );
}
