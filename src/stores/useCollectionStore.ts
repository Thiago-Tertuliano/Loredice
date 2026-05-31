import { create } from 'zustand';
import type { AppError } from '../errors/app-error';
import type { GameFormData } from '../services/collection';

export type Game = GameFormData & { id: number };

interface CollectionState {
  games: Game[];
  isLoading: boolean;
  error: AppError | null;
  filterFavoritos: boolean;

  setGames: (games: Game[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AppError | null) => void;
  toggleFavoritos: () => void;
  addGame: (game: Game) => void;
  updateGame: (id: number, data: Partial<Game>) => void;
  removeGame: (id: number) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  games: [],
  isLoading: false,
  error: null,
  filterFavoritos: false,

  setGames: (games) => set({ games }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  toggleFavoritos: () => set((s) => ({ filterFavoritos: !s.filterFavoritos })),
  addGame: (game) => set((s) => ({ games: [...s.games, game] })),
  updateGame: (id, data) =>
    set((s) => ({
      games: s.games.map((g) => (g.id === id ? { ...g, ...data } : g)),
    })),
  removeGame: (id) => set((s) => ({ games: s.games.filter((g) => g.id !== id) })),
}));
