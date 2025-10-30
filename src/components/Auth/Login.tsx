import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { X } from 'lucide-react';

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToResetPassword: () => void;
  onSuccess: () => void;
}

export function Login({ onClose, onSwitchToRegister, onSwitchToResetPassword, onSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] border-4 border-[#00E1C8] rounded-lg p-8 max-w-md w-full relative shadow-[0_0_30px_rgba(0,225,200,0.5)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#00E1C8] hover:text-[#E15F00] transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-[#00E1C8] mb-6 text-center uppercase tracking-wider">
          Login
        </h2>

        {error && (
          <div className="bg-red-500/20 border-2 border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#00E1C8] mb-2 font-bold uppercase text-sm">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border-2 border-[#00E1C8] rounded px-4 py-3 text-white focus:border-[#E15F00] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[#00E1C8] mb-2 font-bold uppercase text-sm">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border-2 border-[#00E1C8] rounded px-4 py-3 text-white focus:border-[#E15F00] focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00E1C8] hover:bg-[#E15F00] text-black font-bold py-3 rounded uppercase tracking-wider transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,225,200,0.3)]"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={onSwitchToResetPassword}
            className="text-[#C200E0] hover:text-[#E15F00] transition-colors text-sm underline"
          >
            Esqueci minha senha
          </button>

          <div className="text-gray-400">
            Não tem conta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[#00E1C8] hover:text-[#E15F00] transition-colors font-bold"
            >
              Registrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
