'use client';

import { Wallet } from 'lucide-react';

interface HeaderProps {
  walletAddress?: string;
}

export function Header({ walletAddress }: HeaderProps) {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          O
        </div>
        <span className="text-white text-2xl font-bold">OneMatch</span>
      </div>
      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm border border-white/20 transition-all">
        <Wallet size={18} />
        <span className="hidden sm:inline">{walletAddress ? truncateAddress(walletAddress) : 'Connect Wallet'}</span>
      </button>
    </div>
  );
}
