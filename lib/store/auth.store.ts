import { create } from "zustand";
import { IUser } from "../db/models/User";

interface AuthStore {
  auth: IUser | null;
  setAuth: (user: IUser | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  auth: null,
  setAuth: (user: IUser | null) => set({ auth: user }),
  clearAuth: () => set({ auth: null }),
}));
