'use client';

import React from 'react';
import { Brain, Target, Trophy } from 'lucide-react';

/**
 * How It Works Section
 * Three-step process: Match Concepts → Master Skills → Earn NFTs
 */
export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Brain,
      title: 'Match Concepts',
      description: 'Flip cards to match terms with definitions. Learn OneChain ecosystem and DeFi fundamentals through gameplay.',
      color: 'from-brand-cyan to-brand-blue',
    },
    {
      number: '02',
      icon: Target,
      title: 'Master Skills',
      description: 'Progress through Easy, Medium, and Hard difficulties. Track your improvement with stats and achievements.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '03',
      icon: Trophy,
      title: 'Earn NFTs',
      description: 'Claim real NFT badges for your accomplishments. Your skills become verifiable on-chain assets.',
      color: 'from-success to-emerald-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-navy to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Three Steps to Blockchain Mastery
          </h2>
          <p className="text-xl text-platinum/80 max-w-2xl mx-auto">
            Simple gameplay, powerful learning, real rewards
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="glass-navy rounded-2xl p-8 hover:scale-105 transition-all duration-300"
              >
                {/* Step Number */}
                <div className="text-brand-cyan/30 text-6xl font-black mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${step.color} mb-6`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-platinum/70 leading-relaxed">
                  {step.description}
                </p>

                {/* Connection Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-brand-cyan/30" />
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a 
            href="/play"
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-all border border-platinum/30"
          >
            Try a Demo Game →
          </a>
        </div>
      </div>
    </section>
  );
}
