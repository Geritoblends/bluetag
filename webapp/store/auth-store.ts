import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, LoginData, SignupData } from '@/lib/api';

interface AuthState {
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  setAuth: (token: string, userId: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isAuthenticated: false,

      login: async (data: LoginData) => {
        const response = await authAPI.login(data);
        // Decode JWT to get userId (simple base64 decode of payload)
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        set({ token: response.token, userId: payload.userId, isAuthenticated: true });
      },

      signup: async (data: SignupData) => {
        const response = await authAPI.signup(data);
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        set({ token: response.token, userId: payload.userId, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, userId: null, isAuthenticated: false });
      },

      setAuth: (token: string, userId: number) => {
        set({ token, userId, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
