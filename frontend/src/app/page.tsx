'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CompeteSection } from '@/components/landing/CompeteSection';
import { NFTShowcase } from '@/components/landing/NFTShowcase';

export default function Home() {
  return (
    <main className="min-h-screen bg-navy">
      <HeroSection />
      <HowItWorks />
      <CompeteSection />
      <NFTShowcase />
    </main>
  );
}
