'use client';

interface GameActionsProps {
  onPause?: () => void;
  onViewWin?: () => void;
  showViewWin?: boolean;
}

export function GameActions({ onPause, onViewWin, showViewWin }: GameActionsProps) {
  return (
    <div className="flex gap-3 justify-center mt-4">
      {onPause && (
        <button className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-6 py-3 rounded-lg font-semibold backdrop-blur-sm border border-red-400/30 transition-all">
          Pause
        </button>
      )}
      {showViewWin && onViewWin && (
        <button 
          onClick={onViewWin}
          className="bg-green-500/20 hover:bg-green-500/30 text-green-200 px-6 py-3 rounded-lg font-semibold backdrop-blur-sm border border-green-400/30 transition-all"
        >
          View Win Screen
        </button>
      )}
    </div>
  );
}
