import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { RankingEntry } from "../types/game";
import { Trophy, Users, Bot, Gamepad2, User, Loader } from "lucide-react";
import Icon from "../assets/icon.png";

interface MainMenuProps {
  onSelectMode: (mode: "local" | "bot" | "online") => void;
  onViewRanking: () => void;
  onViewProfile: () => void;
  isAuthenticated: boolean;
}

export function MainMenu({
  onSelectMode,
  onViewRanking,
  onViewProfile,
  isAuthenticated,
}: MainMenuProps) {
  const [topRankings, setTopRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopRankings();
  }, []);

  const loadTopRankings = async () => {
    try {
      const q = query(
        collection(db, "users"),
        orderBy("points", "desc"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data() as RankingEntry);
      setTopRankings(data);
    } catch (error) {
      console.error("Error loading top rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex flex-row items-center justify-center">
            <h1 className="text-5xl sm:text-7xl font-bold uppercase tracking-wider animate-pulse-glow text-[#E15F00]">
              Tico vs Teco
            </h1>
            <img src={Icon} alt="Logo" className="w-auto max-w-56 h-auto"/>
          </div>
          <p className="text-xl sm:text-2xl text-[#00E1C8] uppercase tracking-widest">
            Jogo da Velha Arcade
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00E1C8] uppercase tracking-wider flex items-center gap-2">
              <Gamepad2 size={32} />
              Modos de Jogo
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => onSelectMode("local")}
                className="w-full bg-gradient-to-r from-[#00E1C8] to-[#00A89C] hover:from-[#E15F00] hover:to-[#B84D00] text-black font-bold py-6 px-8 rounded-lg uppercase tracking-wider transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(0,225,200,0.5)] hover:shadow-[0_0_40px_rgba(225,95,0,0.6)] flex items-center justify-center gap-3"
              >
                <Users size={32} />
                <div className="text-left">
                  <div className="text-xl">Jogo Local</div>
                  <div className="text-xs opacity-80 normal-case">
                    2 Jogadores
                  </div>
                </div>
              </button>

              <button
                onClick={() => onSelectMode("bot")}
                className="w-full bg-gradient-to-r from-[#C200E0] to-[#8B00A3] hover:from-[#E15F00] hover:to-[#B84D00] text-white font-bold py-6 px-8 rounded-lg uppercase tracking-wider transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(194,0,224,0.5)] hover:shadow-[0_0_40px_rgba(225,95,0,0.6)] flex items-center justify-center gap-3"
              >
                <Bot size={32} />
                <div className="text-left">
                  <div className="text-xl">vs Tico Teco Bot</div>
                  <div className="text-xs opacity-80 normal-case">IA</div>
                </div>
              </button>

              <button
                onClick={() => onSelectMode("online")}
                className="w-full bg-gradient-to-r from-[#E15F00] to-[#B84D00] hover:from-[#00E1C8] hover:to-[#00A89C] text-white font-bold py-6 px-8 rounded-lg uppercase tracking-wider transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(225,95,0,0.5)] hover:shadow-[0_0_40px_rgba(0,225,200,0.6)] flex items-center justify-center gap-3"
              >
                <Trophy size={32} />
                <div className="text-left">
                  <div className="text-xl">Multiplayer Online</div>
                  <div className="text-xs opacity-80 normal-case">
                    Pontos de Ranking
                  </div>
                </div>
              </button>
            </div>

            {isAuthenticated && (
              <button
                onClick={onViewProfile}
                className="w-full bg-black border-2 border-[#00E1C8] hover:border-[#E15F00] text-[#00E1C8] hover:text-[#E15F00] font-bold py-4 px-6 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-3"
              >
                <User size={24} />
                Meu Perfil
              </button>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={onViewRanking}
              className="w-full text-2xl font-bold text-[#00E1C8] uppercase tracking-wider flex items-center gap-2 hover:text-[#E15F00] transition-colors"
            >
              <Trophy size={32} />
              Top 10 Ranking
            </button>

            <div className="bg-black/70 border-4 border-[#00E1C8] rounded-lg p-6 shadow-[0_0_30px_rgba(0,225,200,0.4)] max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader className="animate-spin text-[#00E1C8]" size={48} />
                </div>
              ) : topRankings.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Nenhum jogador no ranking
                </div>
              ) : (
                <div className="space-y-2">
                  {topRankings.map((entry, index) => (
                    <div
                      key={entry.uid}
                      className={`
                        bg-black/50 border-2 rounded p-3 flex items-center justify-between
                        transition-all hover:scale-[1.02]
                        ${
                          index < 3
                            ? "border-yellow-400"
                            : "border-[#00E1C8]/30"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span
                          className={`text-lg font-bold ${
                            index === 0
                              ? "text-yellow-400"
                              : index === 1
                              ? "text-gray-300"
                              : index === 2
                              ? "text-orange-400"
                              : "text-[#00E1C8]"
                          }`}
                        >
                          #{index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold truncate">
                            {entry.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {entry.country}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          entry.points >= 0 ? "text-[#00E1C8]" : "text-red-500"
                        }`}
                      >
                        {entry.points}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onViewRanking}
              className="w-full bg-[#C200E0] hover:bg-[#E15F00] text-white font-bold py-3 px-6 rounded-lg uppercase tracking-wider transition-all transform hover:scale-105"
            >
              Ver Ranking Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
