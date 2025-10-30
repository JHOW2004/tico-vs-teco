import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { X } from 'lucide-react';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export function Register({ onClose, onSwitchToLogin, onSuccess }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        age: parseInt(age),
        country,
        points: 0,
        createdAt: Date.now()
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] border-4 border-[#C200E0] rounded-lg p-8 max-w-md w-full relative shadow-[0_0_30px_rgba(194,0,224,0.5)] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#C200E0] hover:text-[#E15F00] transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-[#C200E0] mb-6 text-center uppercase tracking-wider">
          Registrar
        </h2>

        {error && (
          <div className="bg-red-500/20 border-2 border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#C200E0] mb-2 font-bold uppercase text-sm">
              Nome do Jogador
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border-2 border-[#C200E0] rounded px-4 py-3 text-white focus:border-[#E15F00] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[#C200E0] mb-2 font-bold uppercase text-sm">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border-2 border-[#C200E0] rounded px-4 py-3 text-white focus:border-[#E15F00] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[#C200E0] mb-2 font-bold uppercase text-sm">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border-2 border-[#C200E0] rounded px-4 py-3 text-white focus:border-[#E15F00] focus:outline-none transition-colors"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-[#C200E0] mb-2 font-bold uppercase text-sm">
              Idade
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-black border-2 border-[#C200E0] rounded px-4 py-3 text-white focus:border-[#E15F00] focus:outline-none transition-colors"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-[#C200E0] mb-2 font-bold uppercase text-sm">
              País
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-black border-2 border-[#C200E0] rounded px-4 py-3 text-white focus:border-[#E15F00] focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C200E0] hover:bg-[#E15F00] text-white font-bold py-3 rounded uppercase tracking-wider transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(194,0,224,0.3)]"
          >
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Já tem conta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#C200E0] hover:text-[#E15F00] transition-colors font-bold"
          >
            Fazer Login
          </button>
        </div>
      </div>
    </div>
  );
}
