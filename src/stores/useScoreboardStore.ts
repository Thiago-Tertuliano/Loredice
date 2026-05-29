import { create } from 'zustand';

interface Player {
  id: string;
  name: string;
  score: number;
}

interface ScoreboardState {
  mode: 'truco' | 'universal' | null;
  players: Player[];
  limit: number;
  isRunning: boolean;
  elapsedSeconds: number;
  winnerId: string | null;

  setMode: (mode: ScoreboardState['mode']) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  incrementScore: (playerId: string, amount?: number) => void;
  decrementScore: (playerId: string, amount?: number) => void;
  setLimit: (limit: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  reset: () => void;
  checkWinner: () => string | null;
}

export const useScoreboardStore = create<ScoreboardState>((set, get) => ({
  mode: null,
  players: [],
  limit: 12,
  isRunning: false,
  elapsedSeconds: 0,
  winnerId: null,

  setMode: (mode) => set({ mode, players: [], winnerId: null, elapsedSeconds: 0 }),

  addPlayer: (name) =>
    set((state) => ({
      players: [...state.players, { id: crypto.randomUUID(), name, score: 0 }],
    })),

  removePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    })),

  incrementScore: (playerId, amount = 1) =>
    set((state) => {
      const newPlayers = state.players.map((p) =>
        p.id === playerId ? { ...p, score: p.score + amount } : p,
      );
      const updated = { players: newPlayers };
      const winner = newPlayers.find((p) => p.score >= state.limit);
      if (winner) {
        return { ...updated, winnerId: winner.id, isRunning: false };
      }
      return updated;
    }),

  decrementScore: (playerId, amount = 1) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, score: Math.max(0, p.score - amount) } : p,
      ),
    })),

  setLimit: (limit) => set({ limit }),

  startTimer: () => set({ isRunning: true }),
  stopTimer: () => set({ isRunning: false }),
  resetTimer: () => set({ elapsedSeconds: 0, isRunning: false }),
  tick: () => set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 })),

  reset: () => set({ players: [], winnerId: null, elapsedSeconds: 0, isRunning: false }),

  checkWinner: () => {
    const { players, limit } = get();
    const winner = players.find((p) => p.score >= limit);
    return winner?.id ?? null;
  },
}));
