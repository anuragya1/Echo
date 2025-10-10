import { create } from 'zustand';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  username: string;
  image: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logOut: () => void;
}

// Initialize user from cookie if token exists
const token = Cookies.get('access_token');
let initialUser: User | null = null;

if (token) {
  try {
    const { username, id, image }: any = jwtDecode(token);
    initialUser = { username, id, image };
  } catch (error) {
    console.error('Invalid token:', error);
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  setUser: (user) => set({ user }),
  logOut: () => set({ user: null }),
}));
