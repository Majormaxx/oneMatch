'use client';

import { Brain } from 'lucide-react';
import { useEffect, useState } from 'react';

export function InfoBanner() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/50 rounded-xl p-4 mb-4 animate-pulse">
      <div className="flex items-center gap-3">
        <Brain className="text-cyan-300" size={24} />
        <div>
          <div className="text-white font-bold">Match Terms with Definitions!</div>
          <div className="text-cyan-200 text-sm">Learn about OneChain ecosystem & DeFi concepts</div>
        </div>
      </div>
    </div>
  );
}
