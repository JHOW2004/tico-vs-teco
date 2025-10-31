import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, deleteDoc, getDoc, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { GameRoom } from '../../types/game';
import { GameBoard } from '../GameBoard';
import { ChatBox } from './ChatBox';
import { checkWinner, isBoardFull } from '../../utils/gameLogic';
import { ArrowLeft, RotateCcw, Loader, CheckCircle, XCircle } from 'lucide-react';

interface OnlineGameRoomProps {
  roomId: string;
  userId: string;
  onLeave: () => void;
}

export function OnlineGameRoom({ roomId, userId, onLeave }: OnlineGameRoomProps) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [pointsUpdated, setPointsUpdated] = useState(false);
  const [userName, setUserName] = useState('Jogador');

  const isHost = room?.hostId === userId;
  const mySymbol = isHost ? room?.hostSymbol : room?.guestSymbol;
  const isMyTurn = room?.currentTurn === userId;

  useEffect(() => {
    loadUserName();
  }, [userId]);

  const loadUserName = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserName(userDoc.data().name || 'Jogador');
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  useEffect(() => {
    const roomRef = doc(db, 'rooms', roomId);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const roomData = { id: snapshot.id, ...snapshot.data() } as GameRoom;
        setRoom(roomData);

        // ★ FIX (1/2): se uma revanche foi aceita em QUALQUER cliente,
        // e a sala voltou para "playing" com winner nulo / tabuleiro zerado,
        // reseta SEMPRE os estados locais em AMBOS os clientes.
        const isBoardCleared = Array.isArray(roomData.board) && roomData.board.every((c) => c === null);
        const shouldResetLocal =
          roomData.status === 'playing' &&
          roomData.winner == null &&
          isBoardCleared;

        if (shouldResetLocal) {
          setWinner(null);
          setWinningLine([]);
          setPointsUpdated(false);
        }

        const { winner: gameWinner, line } = checkWinner(roomData.board);
        if (gameWinner && !pointsUpdated) {
          setWinner(gameWinner);
          setWinningLine(line);
          updatePoints(gameWinner, roomData);
        } else if (isBoardFull(roomData.board) && !gameWinner) {
          setWinner('draw');
        }

        setLoading(false);
      } else {
        onLeave();
      }
    });

    return () => unsubscribe();
    // ★ FIX (2/2): adicionamos 'roomId' e 'pointsUpdated' já existia; mantemos.
    // Não precisamos de 'winner' nas deps porque o reset é baseado no snapshot (roomData), não no estado anterior.
  }, [roomId, pointsUpdated, onLeave]);

  const updatePoints = async (winnerSymbol: string, roomData: GameRoom) => {
    if (pointsUpdated) return;

    const winnerId = winnerSymbol === roomData.hostSymbol ? roomData.hostId : roomData.guestId;
    const loserId = winnerSymbol === roomData.hostSymbol ? roomData.guestId : roomData.hostId;

    try {
      if (winnerId) {
        await updateDoc(doc(db, 'users', winnerId), {
          points: increment(10)
        });
      }

      if (loserId) {
        await updateDoc(doc(db, 'users', loserId), {
          points: increment(-2)
        });
      }

      await updateDoc(doc(db, 'rooms', roomId), {
        status: 'finished',
        winner: winnerSymbol
      });

      setPointsUpdated(true);
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  const handleCellClick = async (index: number) => {
    if (!room || !isMyTurn || room.board[index] !== null || winner) return;

    const newBoard = [...room.board];
    newBoard[index] = mySymbol!;

    const nextTurn = isHost ? room.guestId : room.hostId;

    try {
      await updateDoc(doc(db, 'rooms', roomId), {
        board: newBoard,
        currentTurn: nextTurn
      });
    } catch (error) {
      console.error('Error updating board:', error);
    }
  };

  const requestRematch = async () => {
    try {
      await updateDoc(doc(db, 'rooms', roomId), {
        rematchRequested: userId
      });
    } catch (error) {
      console.error('Error requesting rematch:', error);
    }
  };

  const acceptRematch = async () => {
    try {
      await updateDoc(doc(db, 'rooms', roomId), {
        board: Array(9).fill(null),
        currentTurn: room!.hostId,
        winner: null,
        status: 'playing',
        rematchRequested: null
      });
      // Mantemos os resets locais aqui também (quem aceitar já fica pronto),
      // mas o FIX garante que o OUTRO jogador seja resetado via snapshot.
      setWinner(null);
      setWinningLine([]);
      setPointsUpdated(false);
    } catch (error) {
      console.error('Error accepting rematch:', error);
    }
  };

  const declineRematch = async () => {
    try {
      await deleteDoc(doc(db, 'rooms', roomId));
      onLeave();
    } catch (error) {
      console.error('Error declining rematch:', error);
    }
  };

  const leaveRoom = async () => {
    try {
      await deleteDoc(doc(db, 'rooms', roomId));
      onLeave();
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  if (loading || !room) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader className="animate-spin text-[#00E1C8]" size={64} />
      </div>
    );
  }

  if (room.status === 'waiting') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="text-4xl font-bold text-[#00E1C8] uppercase tracking-wider">
            Aguardando...
          </h1>
          <div className="bg-black/50 border-2 border-[#00E1C8] rounded-lg p-8">
            <Loader className="animate-spin text-[#00E1C8] mx-auto mb-4" size={64} />
            <p className="text-xl text-white">Esperando outro jogador entrar</p>
            <p className="text-sm text-gray-400 mt-2">Sala #{roomId.slice(-6).toUpperCase()}</p>
          </div>
          <button
            onClick={leaveRoom}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded uppercase tracking-wider transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  const getWinnerText = () => {
    if (winner === 'draw') return 'Empate!';
    if (winner === mySymbol) return 'Você Venceu! +10 pontos';
    return 'Você Perdeu! -2 pontos';
  };

  const getWinnerColor = () => {
    if (winner === 'draw') return 'text-[#E15F00]';
    if (winner === mySymbol) return 'text-[#00E1C8]';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={leaveRoom}
            className="flex items-center gap-2 text-[#00E1C8] hover:text-[#E15F00] transition-colors font-bold uppercase"
          >
            <ArrowLeft size={24} />
            Sair
          </button>

          <h1 className="text-2xl sm:text-4xl font-bold text-[#00E1C8] uppercase tracking-wider text-center">
            Online
          </h1>

          <div className="w-20"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-black/50 border-2 border-[#00E1C8] rounded-lg p-6 text-center">
              {winner ? (
                <div className="space-y-4">
                  <p className={`text-2xl sm:text-3xl font-bold animate-pulse ${getWinnerColor()}`}>
                    {getWinnerText()}
                  </p>

                  {room.rematchRequested ? (
                    room.rematchRequested === userId ? (
                      <p className="text-lg text-[#C200E0]">Aguardando resposta da revanche...</p>
                    ) : (
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={acceptRematch}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded uppercase transition-all"
                        >
                          <CheckCircle size={20} />
                          Aceitar Revanche
                        </button>
                        <button
                          onClick={declineRematch}
                          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded uppercase transition-all"
                        >
                          <XCircle size={20} />
                          Recusar
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={requestRematch}
                        className="flex items-center gap-2 bg-[#00E1C8] hover:bg-[#E15F00] text-black font-bold py-3 px-6 rounded uppercase transition-all"
                      >
                        <RotateCcw size={20} />
                        Revanche
                      </button>
                      <button
                        onClick={leaveRoom}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded uppercase transition-all"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {isMyTurn ? (
                    <span className="text-[#00E1C8]">Sua vez! ({mySymbol})</span>
                  ) : (
                    <span className="text-[#C200E0]">Vez do oponente</span>
                  )}
                </p>
              )}
            </div>

            <GameBoard
              board={room.board}
              onCellClick={handleCellClick}
              disabled={!isMyTurn}
              winner={winner}
              winningLine={winningLine}
            />
          </div>

          <div>
            <ChatBox
              roomId={roomId}
              userId={userId}
              userName={userName}
              messages={room.messages || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
