import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Simple persistence helper
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('auth-storage');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (state) => {
  try {
    localStorage.setItem('auth-storage', JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
};

const useAuthStore = create(
  (set, get) => {
    // Load initial state from storage
    const stored = loadFromStorage();
    const initialState = stored || {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    };

    // Set axios header if token exists
    if (initialState.accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${initialState.accessToken}`;
    }

    return {
      ...initialState,

      setAuth: (user, accessToken, refreshToken) => {
        const newState = {
          user,
          accessToken,
          refreshToken,
          isAuthenticated: !!user
        };
        set(newState);
        saveToStorage(newState);
        // Set default authorization header
        if (accessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
      },

      clearAuth: () => {
        const newState = {
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false
        };
        set(newState);
        saveToStorage(newState);
        delete axios.defaults.headers.common['Authorization'];
      },

      login: async (username, password) => {
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            username,
            password
          });

          const { user, accessToken, refreshToken } = response.data;
          get().setAuth(user, accessToken, refreshToken);

          return { success: true, user };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.error || 'Login failed'
          };
        }
      },

      register: async (username, email, password) => {
        try {
          const response = await axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password
          });

          const { user, accessToken, refreshToken } = response.data;
          get().setAuth(user, accessToken, refreshToken);

          return { success: true, user };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.error || 'Registration failed'
          };
        }
      },

      logout: async () => {
        try {
          await axios.post(`${API_URL}/auth/logout`);
        } catch (error) {
          // Ignore errors on logout
        } finally {
          get().clearAuth();
        }
      },

      checkAuth: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          get().clearAuth();
          return false;
        }

        try {
          const response = await axios.get(`${API_URL}/auth/me`);
          set({ user: response.data.user });
          return true;
        } catch (error) {
          get().clearAuth();
          return false;
        }
      }
    };
  }
);

// Initialize axios defaults on store creation
const { accessToken } = useAuthStore.getState();
if (accessToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

export default useAuthStore;

