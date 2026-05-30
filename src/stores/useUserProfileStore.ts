import { create } from 'zustand';

/**
 * Store de perfil do usuário — offline-first.
 * Pronto para conectar a um sistema de autenticação no futuro.
 */
export interface UserProfile {
  name: string;
  avatarColor: string;
  isOnline: boolean; // sempre false por agora — futuro: auth check
}

interface UserProfileState {
  profile: UserProfile;
  setName: (name: string) => void;
  setAvatarColor: (color: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Jogador',
  avatarColor: '#8b3fcc',
  isOnline: false,
};

export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: DEFAULT_PROFILE,
  setName: (name) => set((s) => ({ profile: { ...s.profile, name: name.trim() || 'Jogador' } })),
  setAvatarColor: (avatarColor) => set((s) => ({ profile: { ...s.profile, avatarColor } })),
}));

/**
 * Gera as iniciais do nome do usuário (máx. 2 caracteres).
 * Ex: "João Silva" → "JS", "Maria" → "MA"
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '??';
  if (words.length === 1) {
    const w = words[0]!;
    return w.substring(0, 2).toUpperCase();
  }
  return (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase();
}
