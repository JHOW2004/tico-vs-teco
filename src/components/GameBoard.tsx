import { useState, useEffect } from 'react';
import { X as XIcon, Circle } from 'lucide-react';

interface GameBoardProps {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  disabled?: boolean;
  winner?: string | null;
  winningLine?: number[];
}

export function GameBoard({ board, onCellClick, disabled, winner, winningLine = [] }: GameBoardProps) {
  const [animatingCell, setAnimatingCell] = useState<number | null>(null);

  useEffect(() => {
    const lastMove = board.findLastIndex(cell => cell !== null);
    if (lastMove !== -1) {
      setAnimatingCell(lastMove);
      const timer = setTimeout(() => setAnimatingCell(null), 600);
      return () => clearTimeout(timer);
    }
  }, [board]);

  const renderSymbol = (symbol: string | null, index: number) => {
    if (!symbol) return null;

    const isAnimating = animatingCell === index;
    const isWinning = winningLine.includes(index);

    if (symbol === 'X') {
      return (
        <XIcon
          size={60}
          className={`${isAnimating ? 'animate-draw-x' : ''} ${
            isWinning ? 'text-[#00E1C8] animate-pulse' : 'text-[#E15F00]'
          }`}
          strokeWidth={4}
        />
      );
    } else {
      return (
        <Circle
          size={60}
          className={`${isAnimating ? 'animate-draw-o' : ''} ${
            isWinning ? 'text-[#00E1C8] animate-pulse' : 'text-[#C200E0]'
          }`}
          strokeWidth={4}
        />
      );
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 bg-[#0A0A0A] p-4 rounded-lg border-4 border-[#00E1C8] shadow-[0_0_40px_rgba(0,225,200,0.4)]">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={disabled || cell !== null || winner !== null}
          className={`
            aspect-square bg-black border-2 rounded-lg
            flex items-center justify-center
            transition-all duration-200
            ${
              cell === null && !disabled && !winner
                ? 'border-[#00E1C8] hover:bg-[#00E1C8]/10 hover:scale-105 cursor-pointer'
                : 'border-gray-700 cursor-not-allowed'
            }
            ${winningLine.includes(index) ? 'bg-[#00E1C8]/20 shadow-[0_0_20px_rgba(0,225,200,0.6)]' : ''}
            min-h-[80px] sm:min-h-[100px]
          `}
        >
          {renderSymbol(cell, index)}
        </button>
      ))}
    </div>
  );
}
