import { useState, useEffect, useRef } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ChatMessage } from '../../types/game';
import { Send, MessageCircle } from 'lucide-react';

interface ChatBoxProps {
  roomId: string;
  userId: string;
  userName: string;
  messages: ChatMessage[];
}

export function ChatBox({ roomId, userId, userName, messages }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${userId}`,
      userId,
      userName,
      message: message.trim(),
      timestamp: Date.now()
    };

    try {
      await updateDoc(doc(db, 'rooms', roomId), {
        messages: arrayUnion(newMessage)
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="bg-black/50 border-2 border-[#00E1C8] rounded-lg overflow-hidden flex flex-col" style={{ height: '400px' }}>
      <div className="bg-[#00E1C8] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-black" />
          <h3 className="font-bold text-black uppercase text-sm">Chat</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-black hover:text-[#E15F00] transition-colors font-bold text-xs"
        >
          {isOpen ? 'Minimizar' : 'Expandir'}
        </button>
      </div>

      {isOpen && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center text-sm">Nenhuma mensagem ainda</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.userId === userId ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-xs font-bold ${msg.userId === userId ? 'text-[#00E1C8]' : 'text-[#C200E0]'}`}>
                      {msg.userId === userId ? 'Você' : msg.userName}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] break-words ${
                      msg.userId === userId
                        ? 'bg-[#00E1C8] text-black'
                        : 'bg-[#C200E0]/20 text-white border border-[#C200E0]'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-black/30 border-t border-[#00E1C8]">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-black border border-[#00E1C8] rounded px-3 py-2 text-white text-sm focus:border-[#E15F00] focus:outline-none transition-colors placeholder-gray-500"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-[#00E1C8] hover:bg-[#E15F00] text-black font-bold px-4 py-2 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
