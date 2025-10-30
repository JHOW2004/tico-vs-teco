export type GameMode = 'local' | 'bot' | 'online' | null;

export interface UserProfile {
  uid: string;
  name: string;
  age: number;
  country: string;
  points: number;
}

export interface GameRoom {
  id: string;
  hostId: string;
  guestId: string | null;
  board: (string | null)[];
  currentTurn: string;
  winner: string | null;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: number;
  hostSymbol: string;
  guestSymbol: string;
  rematchRequested?: string | null;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
}

export interface RankingEntry {
  uid: string;
  name: string;
  points: number;
  country: string;
}
