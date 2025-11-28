'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Footer Component
 * Professional footer with links, social, and legal
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy border-t border-platinum/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="md:col-span-1">
            <Image 
              src="/logo/onematch-logo-white.svg" 
              alt="OneMatch" 
              width={150} 
              height={50}
              className="mb-4"
            />
            <p className="text-platinum/60 text-sm mb-4">
              Learn. Match. Earn.
            </p>
            <p className="text-platinum/40 text-xs">
              The easiest way to master OneChain concepts through addictive gameplay.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-platinum/60 hover:text-brand-cyan transition-colors text-sm">About</Link></li>
              <li><Link href="/how-to-play" className="text-platinum/60 hover:text-brand-cyan transition-colors text-sm">How to Play</Link></li>
              <li><Link href="/nfts" className="text-platinum/60 hover:text-brand-cyan transition-colors text-sm">NFT Gallery</Link></li>
              <li><Link href="/leaderboard" className="text-platinum/60 hover:text-brand-cyan transition-colors text-sm">Leaderboard</Link></li>
              <li><Link href="/community" className="text-platinum/60 hover:text-brand-cyan transition-colors text-sm">Community</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com/onematch" target="_blank" rel="noopener noreferrer" className="text-platinum/60 hover:text-brand-cyan transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://discord.gg/onematch" target="_blank" rel="noopener noreferrer" className="text-platinum/60 hover:text-brand-cyan transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                  Discord
                </a>
              </li>
              <li>
                <a href="https://t.me/onematch" target="_blank" rel="noopener noreferrer" className="text-platinum/60 hover:text-brand-cyan transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-platinum/60 hover:text-brand-cyan transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-platinum/60 hover:text-brand-cyan transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-platinum/60 hover:text-brand-cyan transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-platinum/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-platinum/40 text-sm">
            © {currentYear} OneMatch. Built on OneChain. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-platinum/40 text-xs">Powered by</span>
            <span className="text-brand-cyan font-semibold">OneChain</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
