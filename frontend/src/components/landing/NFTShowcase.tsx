'use client';

import React from 'react';
import { Trophy, Flame, Zap, Award } from 'lucide-react';

/**
 * NFT Showcase Section
 * Display achievement NFTs with rarity badges
 */
export function NFTShowcase() {
  const nfts = [
    {
      name: 'Perfect Memory Badge',
      rarity: 'Rare',
      icon: Trophy,
      description: 'Zero mistakes, pure skill',
      color: 'from-purple-500 to-pink-500',
      rarityColor: 'bg-purple-500'
    },
    {
      name: '7-Day Streak Trophy',
      rarity: 'Epic',
      icon: Flame,
      description: 'Dedication and consistency',
      color: 'from-orange-500 to-red-500',
      rarityColor: 'bg-orange-500'
    },
    {
      name: 'OneChain Expert',
      rarity: 'Legendary',
      icon: Award,
      description: 'Master of the ecosystem',
      color: 'from-yellow-400 to-orange-500',
      rarityColor: 'bg-yellow-400'
    },
    {
      name: 'Speed Demon Medal',
      rarity: 'Rare',
      icon: Zap,
      description: 'Lightning-fast reflexes',
      color: 'from-brand-cyan to-brand-blue',
      rarityColor: 'bg-brand-cyan'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-blue-900 to-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Your Achievements,
            <span className="block text-brand-gradient mt-2">Your Assets</span>
          </h2>
          <p className="text-xl text-platinum/80 max-w-2xl mx-auto">
            Every achievement is a real NFT minted on OneChain. Prove your skills on-chain, trade collectibles, showcase your expertise.
          </p>
        </div>

        {/* NFT Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => {
            const Icon = nft.icon;
            return (
              <div 
                key={nft.name}
                className="glass-navy rounded-2xl p-6 hover:scale-105 transition-all duration-300 group"
              >
                {/* Rarity Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`${nft.rarityColor} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                    {nft.rarity}
                  </span>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${nft.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-12 h-12 text-white" strokeWidth={2} />
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {nft.name}
                </h3>

                {/* Description */}
                <p className="text-platinum/70 text-sm">
                  {nft.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-platinum/60 mb-6">
            + First Victory NFT (Common) for completing your first game
          </p>
          <a 
            href="/nfts"
            className="inline-block bg-brand-gradient hover:bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-lg transition-all"
          >
            View All NFTs →
          </a>
        </div>
      </div>
    </section>
  );
}
