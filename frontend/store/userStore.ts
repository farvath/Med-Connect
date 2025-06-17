import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  name: string;
  specialty: string;
  icon: string;
  setUser: (user: { name: string; specialty: string; icon: string }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: '',
      specialty: '',
      icon: '',
      setUser: (user: { name: string; specialty: string; icon: string }) => set(user),
      clearUser: () => set({ name: '', specialty: '', icon: '' }),
    }),
    { name: 'user-store' }
  )
);
