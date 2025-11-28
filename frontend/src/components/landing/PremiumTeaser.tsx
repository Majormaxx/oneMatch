'use client';

import React, { useState } from 'react';
import { Zap, Palette, TrendingUp, Lock } from 'lucide-react';

/**
 * Premium Teaser Section
 * "OneMatch Pro - Coming Soon" with waitlist
 */
export function PremiumTeaser() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const features = [
    { icon: Zap, title: 'Unlimited Energy', description: 'Play as much as you want. No daily limits.' },
    { icon: Palette, title: 'Exclusive Themes', description: 'Custom card designs and board styles.' },
    { icon: TrendingUp, title: '2x XP Boost', description: 'Level up twice as fast. Reach Legend tier.' },
    { icon: Lock, title: 'Pro-Only Tournaments', description: 'Compete for premium NFTs and prizes.' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send to backend/email service
    console.log('Waitlist signup:', email);
    setSubmitted(true);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-navy to-purple-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-brand-cyan rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-navy px-4 py-2 rounded-full font-bold text-sm mb-4">
            COMING SOON
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            OneMatch Pro
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mt-2">
              Launching Q1 2026
            </span>
          </h2>
          <p className="text-xl text-platinum/80 max-w-2xl mx-auto">
            The ultimate experience for serious players. Join the waitlist to get exclusive launch benefits.
          </p>
        </div>

        {/* Features Grid (Blurred/Teaser) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="glass rounded-2xl p-6 backdrop-blur-sm relative"
                style={{ opacity: 0.7 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
                <Icon className="w-8 h-8 text-brand-cyan mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-platinum/60 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Pricing Teaser */}
        <div className="text-center mb-8">
          <p className="text-platinum/60 mb-2">Estimated: $2.99/month or $19.99/year</p>
          <p className="text-brand-cyan font-semibold">Waitlist members get 50% off first year</p>
        </div>

        {/* Waitlist Form */}
        <div className="max-w-md mx-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="glass-navy rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                Join the Waitlist - Get 50% Off
              </h3>
              <div className="space-y-4">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-platinum/20 text-white placeholder-platinum/50 focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-navy font-bold px-6 py-3 rounded-lg transition-all"
                >
                  Join Waitlist
                </button>
              </div>
              <div className="mt-4 space-y-2 text-sm text-platinum/60">
                <p className="flex items-center gap-2">
                  <span className="text-success">✓</span> Be first to know when Pro launches
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-success">✓</span> Lock in exclusive launch pricing
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-success">✓</span> Get 30 days free when we launch
                </p>
              </div>
            </form>
          ) : (
            <div className="glass-navy rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">You&apos;re on the list!</h3>
              <p className="text-platinum/70">
                We&apos;ll email you 1 week before launch with your exclusive 50% off code.
              </p>
            </div>
          )}
        </div>

        {/* Social Proof */}
        <p className="text-center text-platinum/50 text-sm mt-6">
          Join 2,347+ players waiting for Pro access
        </p>
      </div>
    </section>
  );
}
