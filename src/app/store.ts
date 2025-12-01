import { create } from "zustand";

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AppState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
