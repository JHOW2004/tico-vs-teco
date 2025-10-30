import { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { checkWinner, isBoardFull } from '../utils/gameLogic';
import { getBotMove } from '../lib/gemini';
import { ArrowLeft, RotateCcw, Loader } from 'lucide-react';

interface BotGameProps {
  onBack: () => void;
}

export function BotGame({ onBack }: BotGameProps) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [botThinking, setBotThinking] = useState(false);

  const playerSymbol = 'X';
  const botSymbol = 'O';

  useEffect(() => {
    if (currentPlayer === botSymbol && !gameOver) {
      setBotThinking(true);
      const timer = setTimeout(async () => {
        try {
          const move = await getBotMove(board, botSymbol, playerSymbol);
          handleBotMove(move);
        } catch (error) {
          console.error('Bot move error:', error);
        } finally {
          setBotThinking(false);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver, board]);

  const handleBotMove = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = botSymbol;
    setBoard(newBoard);

    const { winner: gameWinner, line } = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      setGameOver(true);
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
    } else {
      setCurrentPlayer(playerSymbol);
    }
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameOver || currentPlayer !== playerSymbol || botThinking) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);

    const { winner: gameWinner, line } = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      setGameOver(true);
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
    } else {
      setCurrentPlayer(botSymbol);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(playerSymbol);
    setGameOver(false);
    setWinner(null);
    setWinningLine([]);
    setBotThinking(false);
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

          <h1 className="text-2xl sm:text-4xl font-bold text-[#C200E0] uppercase tracking-wider text-center">
            vs Tico Teco Bot
          </h1>

          <button
            onClick={resetGame}
            className="flex items-center gap-2 text-[#C200E0] hover:text-[#E15F00] transition-colors font-bold uppercase"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        <div className="bg-black/50 border-2 border-[#C200E0] rounded-lg p-6 text-center">
          {gameOver ? (
            <div className="space-y-4">
              {winner ? (
                <p className="text-2xl sm:text-3xl font-bold animate-pulse">
                  {winner === playerSymbol ? (
                    <span className="text-[#00E1C8]">Você Venceu!</span>
                  ) : (
                    <span className="text-[#E15F00]">Tico Teco Bot Venceu!</span>
                  )}
                </p>
              ) : (
                <p className="text-2xl sm:text-3xl font-bold text-[#E15F00]">Empate!</p>
              )}
              <button
                onClick={resetGame}
                className="bg-[#C200E0] hover:bg-[#E15F00] text-white font-bold py-3 px-8 rounded uppercase tracking-wider transition-all transform hover:scale-105"
              >
                Jogar Novamente
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              {botThinking && <Loader className="animate-spin text-[#C200E0]" size={24} />}
              <p className="text-xl sm:text-2xl font-bold text-white">
                {botThinking ? (
                  <span className="text-[#C200E0]">Bot pensando...</span>
                ) : currentPlayer === playerSymbol ? (
                  <span className="text-[#00E1C8]">Sua vez!</span>
                ) : (
                  <span className="text-[#C200E0]">Vez do Bot</span>
                )}
              </p>
            </div>
          )}
        </div>

        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          disabled={currentPlayer !== playerSymbol || botThinking}
          winner={winner}
          winningLine={winningLine}
        />
      </div>
    </div>
  );
}
