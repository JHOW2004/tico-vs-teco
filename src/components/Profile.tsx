import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { UserProfile } from '../types/game';
import { ArrowLeft, Save, LogOut, Loader } from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
  userId: string;
}

export function Profile({ onBack, userId }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        setProfile(data);
        setName(data.name);
        setAge(data.age.toString());
        setCountry(data.country);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateDoc(doc(db, 'users', userId), {
        name,
        age: parseInt(age),
        country
      });

      setMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onBack();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader className="animate-spin text-[#00E1C8]" size={64} />
      </div>
    );
  }

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
            Perfil
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors font-bold uppercase"
          >
            <LogOut size={24} />
          </button>
        </div>

        <div className="bg-black/50 border-4 border-[#00E1C8] rounded-lg p-8 shadow-[0_0_40px_rgba(0,225,200,0.3)]">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-[#00E1C8] rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl font-bold text-black">
                {profile?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#C200E0]">
              Pontos: {profile?.points || 0}
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded border-2 ${
              message.includes('sucesso')
                ? 'bg-green-500/20 border-green-500 text-green-200'
                : 'bg-red-500/20 border-red-500 text-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[#00E1C8] mb-2 font-bold uppercase text-sm">
                Nome do Jogador
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border-2 border-[#00E1C8] rounded px-4 py-3 text-white focus:border-[#E15F00] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[#00E1C8] mb-2 font-bold uppercase text-sm">
                Idade
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-black border-2 border-[#00E1C8] rounded px-4 py-3 text-white focus:border-[#E15F00] focus:outline-none transition-colors"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-[#00E1C8] mb-2 font-bold uppercase text-sm">
                País
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-black border-2 border-[#00E1C8] rounded px-4 py-3 text-white focus:border-[#E15F00] focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-[#00E1C8] hover:bg-[#E15F00] text-black font-bold py-4 rounded uppercase tracking-wider transition-all transform hover:scale-105 disabled:opacity-50 shadow-[0_0_20px_rgba(0,225,200,0.3)]"
            >
              {saving ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
