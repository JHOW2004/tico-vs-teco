import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { X } from 'lucide-react';

interface ResetPasswordProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function ResetPassword({ onClose, onSwitchToLogin }: ResetPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] border-4 border-[#E15F00] rounded-lg p-8 max-w-md w-full relative shadow-[0_0_30px_rgba(225,95,0,0.5)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#E15F00] hover:text-[#00E1C8] transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-[#E15F00] mb-6 text-center uppercase tracking-wider">
          Recuperar Senha
        </h2>

        {error && (
          <div className="bg-red-500/20 border-2 border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-500/20 border-2 border-green-500 text-green-200 px-4 py-3 rounded">
              Email de recuperação enviado! Verifique sua caixa de entrada.
            </div>
            <button
              onClick={onSwitchToLogin}
              className="w-full bg-[#E15F00] hover:bg-[#00E1C8] text-white font-bold py-3 rounded uppercase tracking-wider transition-all transform hover:scale-105"
            >
              Voltar ao Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#E15F00] mb-2 font-bold uppercase text-sm">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border-2 border-[#E15F00] rounded px-4 py-3 text-white focus:border-[#00E1C8] focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E15F00] hover:bg-[#00E1C8] text-white font-bold py-3 rounded uppercase tracking-wider transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(225,95,0,0.3)]"
            >
              {loading ? 'Enviando...' : 'Enviar Email'}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-6 text-center text-gray-400">
            Lembrou a senha?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#E15F00] hover:text-[#00E1C8] transition-colors font-bold"
            >
              Fazer Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
