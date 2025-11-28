'use client';

import Link from 'next/link';
import { WalletConnect } from '@/components/WalletConnect';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">OneMatch</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/play" className="text-platinum/80 hover:text-white transition-colors text-sm font-medium">
              Play Now
            </Link>
            <Link href="/leaderboard" className="text-platinum/80 hover:text-white transition-colors text-sm font-medium">
              Leaderboard
            </Link>
            <Link href="/nfts" className="text-platinum/80 hover:text-white transition-colors text-sm font-medium">
              My NFTs
            </Link>
          </div>

          {/* Wallet Connection */}
          <div>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
