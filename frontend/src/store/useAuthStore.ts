import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  role: "peternak" | "reseller";
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement login API call
      console.log("Logging in:", email);
    } catch (error) {
      set({ error: "Login failed" });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    set({ user: null, error: null });
  },
}));
