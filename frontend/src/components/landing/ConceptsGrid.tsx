'use client';

import React from 'react';

/**
 * Concepts Grid Section
 * 32+ blockchain concepts organized by category
 */
export function ConceptsGrid() {
  const categories = [
    {
      icon: '🔗',
      title: 'OneChain Ecosystem',
      color: 'from-brand-cyan to-brand-blue',
      concepts: ['OneWallet', 'OneDEX', 'OneRWA', 'USDO', 'OneTransfer']
    },
    {
      icon: '💰',
      title: 'DeFi Fundamentals',
      color: 'from-purple-500 to-pink-500',
      concepts: ['Staking', 'Liquidity', 'Yield', 'AMM', 'TVL']
    },
    {
      icon: '⛓️',
      title: 'Blockchain Basics',
      color: 'from-success to-emerald-600',
      concepts: ['Smart Contracts', 'Gas Fees', 'Consensus', 'Wallets', 'Transactions']
    },
    {
      icon: '🚀',
      title: 'Advanced Topics',
      color: 'from-warning to-error',
      concepts: ['RWA', 'Oracles', 'Bridges', 'Governance', 'DAOs']
    }
  ];

  return (
    <section className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            32+ Blockchain Concepts,
            <span className="block text-brand-cyan mt-2">Zero Boring Textbooks</span>
          </h2>
          <p className="text-xl text-platinum/80 max-w-2xl mx-auto">
            Master everything from OneChain ecosystem to advanced DeFi
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div 
              key={category.title}
              className="glass-navy rounded-2xl p-8 hover:scale-105 transition-all duration-300"
            >
              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {category.title}
                </h3>
              </div>

              {/* Concept Pills */}
              <div className="flex flex-wrap gap-3">
                {category.concepts.map((concept) => (
                  <span 
                    key={concept}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-platinum/90 border border-platinum/20 transition-all text-sm font-medium"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a 
            href="/concepts"
            className="inline-block text-brand-cyan hover:text-brand-blue font-semibold transition-colors"
          >
            See All Concepts →
          </a>
        </div>
      </div>
    </section>
  );
}
