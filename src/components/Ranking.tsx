import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RankingEntry } from '../types/game';
import { ArrowLeft, Trophy, Loader, Medal } from 'lucide-react';

interface RankingProps {
  onBack: () => void;
  showFull?: boolean;
}

export function Ranking({ onBack, showFull = false }: RankingProps) {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRankings();
  }, [showFull]);

  const loadRankings = async () => {
    try {
      const q = showFull
        ? query(collection(db, 'users'), orderBy('points', 'desc'))
        : query(collection(db, 'users'), orderBy('points', 'desc'), limit(10));

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data() as RankingEntry);
      setRankings(data);
    } catch (error) {
      console.error('Error loading rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (position: number) => {
    if (position === 0) return 'text-yellow-400';
    if (position === 1) return 'text-gray-300';
    if (position === 2) return 'text-orange-400';
    return 'text-[#00E1C8]';
  };

  const getMedalIcon = (position: number) => {
    if (position < 3) {
      return <Medal className={getMedalColor(position)} size={32} />;
    }
    return <span className="text-2xl font-bold text-[#00E1C8]">#{position + 1}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader className="animate-spin text-[#00E1C8]" size={64} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#00E1C8] hover:text-[#E15F00] transition-colors font-bold uppercase"
          >
            <ArrowLeft size={24} />
            Voltar
          </button>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#00E1C8] uppercase tracking-wider text-center flex items-center gap-3">
            <Trophy size={48} />
            Ranking {showFull ? 'Completo' : 'Top 10'}
          </h1>

          <div className="w-20"></div>
        </div>

        <div className="bg-black/50 border-4 border-[#00E1C8] rounded-lg p-6 shadow-[0_0_40px_rgba(0,225,200,0.4)] max-h-[70vh] overflow-y-auto">
          {rankings.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="mx-auto mb-4 text-gray-500" size={64} />
              <p className="text-xl text-gray-400">Nenhum jogador no ranking ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rankings.map((entry, index) => (
                <div
                  key={entry.uid}
                  className={`
                    bg-black border-2 rounded-lg p-4 flex items-center justify-between
                    transition-all hover:scale-[1.02]
                    ${index < 3 ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'border-[#00E1C8]'}
                  `}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 flex justify-center">
                      {getMedalIcon(index)}
                    </div>

                    <div className="flex-1">
                      <p className="text-xl font-bold text-white">{entry.name}</p>
                      <p className="text-sm text-gray-400">{entry.country}</p>
                    </div>

                    <div className="text-right">
                      <p className={`text-2xl font-bold ${entry.points >= 0 ? 'text-[#00E1C8]' : 'text-red-500'}`}>
                        {entry.points} pts
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!showFull && rankings.length >= 10 && (
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#C200E0] hover:bg-[#E15F00] text-white font-bold py-4 rounded uppercase tracking-wider transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(194,0,224,0.3)]"
          >
            Ver Ranking Completo
          </button>
        )}
      </div>
    </div>
  );
}
