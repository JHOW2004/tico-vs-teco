import { useState } from 'react';
import { GameBoard } from './GameBoard';
import { checkWinner, isBoardFull } from '../utils/gameLogic';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface LocalGameProps {
  onBack: () => void;
}

export function LocalGame({ onBack }: LocalGameProps) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);

  const handleCellClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const { winner: gameWinner, line } = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      setGameOver(true);
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameOver(false);
    setWinner(null);
    setWinningLine([]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#00E1C8] hover:text-[#E15F00] transition-colors font-bold uppercase"
          >
            <ArrowLeft size={24} />
            Voltar
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#00E1C8] uppercase tracking-wider text-center">
            Jogo Local
          </h1>

          <button
            onClick={resetGame}
            className="flex items-center gap-2 text-[#C200E0] hover:text-[#E15F00] transition-colors font-bold uppercase"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        <div className="bg-black/50 border-2 border-[#00E1C8] rounded-lg p-6 text-center">
          {gameOver ? (
            <div className="space-y-4">
              {winner ? (
                <p className="text-2xl sm:text-3xl font-bold text-[#00E1C8] animate-pulse">
                  Jogador {winner} Venceu!
                </p>
              ) : (
                <p className="text-2xl sm:text-3xl font-bold text-[#E15F00]">Empate!</p>
              )}
              <button
                onClick={resetGame}
                className="bg-[#00E1C8] hover:bg-[#E15F00] text-black font-bold py-3 px-8 rounded uppercase tracking-wider transition-all transform hover:scale-105"
              >
                Jogar Novamente
              </button>
            </div>
          ) : (
            <p className="text-xl sm:text-2xl font-bold text-white">
              Vez do Jogador:{' '}
              <span className={currentPlayer === 'X' ? 'text-[#E15F00]' : 'text-[#C200E0]'}>
                {currentPlayer}
              </span>
            </p>
          )}
        </div>

        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          winner={winner}
          winningLine={winningLine}
        />
      </div>
    </div>
  );
}
