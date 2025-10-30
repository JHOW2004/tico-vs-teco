import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { GameRoom } from '../../types/game';
import { ArrowLeft, Plus, Loader, Users, Trash2 } from 'lucide-react';

interface RoomListProps {
  onBack: () => void;
  userId: string;
  onJoinRoom: (roomId: string) => void;
}

export function RoomList({ onBack, userId, onJoinRoom }: RoomListProps) {
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'rooms'),
      where('status', 'in', ['waiting', 'playing'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GameRoom));
      setRooms(roomsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createRoom = async () => {
    setCreating(true);
    try {
      const newRoom: Omit<GameRoom, 'id'> = {
        hostId: userId,
        guestId: null,
        board: Array(9).fill(null),
        currentTurn: userId,
        winner: null,
        status: 'waiting',
        createdAt: Date.now(),
        hostSymbol: 'X',
        guestSymbol: 'O',
        rematchRequested: null
      };

      const docRef = await addDoc(collection(db, 'rooms'), newRoom);
      onJoinRoom(docRef.id);
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setCreating(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        guestId: userId,
        status: 'playing'
      });
      onJoinRoom(roomId);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      await deleteDoc(doc(db, 'rooms', roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#00E1C8] hover:text-[#E15F00] transition-colors font-bold uppercase"
          >
            <ArrowLeft size={24} />
            Voltar
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#00E1C8] uppercase tracking-wider text-center">
            Salas Online
          </h1>

          <button
            onClick={createRoom}
            disabled={creating}
            className="flex items-center gap-2 bg-[#00E1C8] hover:bg-[#E15F00] text-black font-bold py-2 px-4 rounded uppercase transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {creating ? <Loader className="animate-spin" size={20} /> : <Plus size={20} />}
            Criar
          </button>
        </div>

        <div className="bg-black/50 border-2 border-[#00E1C8] rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-[#00E1C8]" size={48} />
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-gray-500" size={64} />
              <p className="text-xl text-gray-400">Nenhuma sala disponível</p>
              <p className="text-sm text-gray-500 mt-2">Crie uma sala para começar!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rooms.map(room => {
                const isMyRoom = room.hostId === userId;
                const canJoin = !isMyRoom && room.status === 'waiting';
                const isPlaying = room.status === 'playing';

                return (
                  <div
                    key={room.id}
                    className="bg-black border-2 border-[#00E1C8] rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Users className="text-[#00E1C8]" size={32} />
                      <div>
                        <p className="text-white font-bold">
                          Sala #{room.id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-400">
                          {room.status === 'waiting' ? 'Aguardando jogador...' : 'Em jogo'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isMyRoom && room.status === 'waiting' && (
                        <button
                          onClick={() => deleteRoom(room.id)}
                          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded uppercase transition-all"
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      )}

                      {canJoin && (
                        <button
                          onClick={() => joinRoom(room.id)}
                          className="bg-[#00E1C8] hover:bg-[#E15F00] text-black font-bold py-2 px-6 rounded uppercase transition-all transform hover:scale-105"
                        >
                          Entrar
                        </button>
                      )}

                      {isMyRoom && isPlaying && (
                        <button
                          onClick={() => onJoinRoom(room.id)}
                          className="bg-[#C200E0] hover:bg-[#E15F00] text-white font-bold py-2 px-6 rounded uppercase transition-all transform hover:scale-105"
                        >
                          Continuar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
