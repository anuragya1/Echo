import { create } from 'zustand';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  username: string;
  image: string;
}

interface DecodedUser extends User {
  exp?: number;
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
    const { username, id, image, exp } = jwtDecode<DecodedUser>(token);
    const isExpired = exp ? exp * 1000 <= Date.now() : false;

    if (isExpired) {
      Cookies.remove('access_token');
    } else {
      initialUser = { username, id, image };
    }
  } catch (error) {
    Cookies.remove('access_token');
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  setUser: (user) => set({ user }),
  logOut: () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    set({ user: null });
  },
}));
