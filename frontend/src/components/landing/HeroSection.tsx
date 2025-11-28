'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Hero Section - Landing Page
 * Brand messaging: "Match Your Way to Web3 Mastery"
 */
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-navy overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-blue-900 to-purple-900 opacity-50" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{
             backgroundImage: `radial-gradient(circle, #00E5FF 1px, transparent 1px)`,
             backgroundSize: '50px 50px'
           }} 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo/onematch-logo-full-color.svg" 
              alt="OneMatch Logo" 
              width={400} 
              height={120}
              priority
            />
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight">
            Match Your Way to
            <span className="block text-brand-gradient mt-2">
              Web3 Mastery
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-platinum max-w-3xl mx-auto leading-relaxed">
            Learn OneChain concepts through addictive gameplay.{' '}
            <span className="text-brand-cyan font-semibold">Earn real NFT achievements.</span>{' '}
            Compete globally. All in 3-minute sessions.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/play"
              className="bg-brand-gradient hover:bg-brand-gradient-hover text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-lg w-full sm:w-auto"
            >
              Start Playing Free
            </Link>
            <Link 
              href="#how-it-works"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all border-2 border-platinum/30 text-lg w-full sm:w-auto"
            >
              How It Works
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-12 flex items-center justify-center gap-6 text-platinum/70 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>Free to Play</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-platinum/30" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-cyan rounded-full animate-pulse" />
              <span>Real NFT Rewards</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-platinum/30" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
              <span>32+ Blockchain Concepts</span>
            </div>
          </div>

          {/* Animated Preview (placeholder for now) */}
          <div className="pt-16">
            <div className="glass-navy rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-brand-cyan/20 to-brand-blue/20 rounded-xl flex items-center justify-center">
                <p className="text-platinum/50 text-lg">Animated Game Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-platinum/50">
          <span className="text-xs uppercase tracking-wider">Scroll to Learn More</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
