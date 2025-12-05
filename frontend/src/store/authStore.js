import { create } from 'zustand';
import api from '../utils/api.js';

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

    // Note: Auth headers are handled by api interceptor

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
        // Auth headers are handled by api interceptor
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
        // Auth headers are handled by api interceptor
      },

      login: async (username, password) => {
        try {
          console.log('🔐 Attempting login...');
          const response = await api.post('/auth/login', {
            username,
            password
          });

          const { user, accessToken, refreshToken } = response.data;
          get().setAuth(user, accessToken, refreshToken);

          return { success: true, user };
        } catch (error) {
          console.error('❌ Login error:', error);
          console.error('❌ Error response:', error.response);
          return {
            success: false,
            error: error.response?.data?.error || error.message || 'Login failed'
          };
        }
      },

      register: async (username, email, password) => {
        try {
          const response = await api.post('/auth/register', {
            username,
            email,
            password
          });

          const { user, accessToken, refreshToken } = response.data;
          get().setAuth(user, accessToken, refreshToken);

          return { success: true, user };
        } catch (error) {
          console.error('❌ Registration error:', error);
          return {
            success: false,
            error: error.response?.data?.error || error.message || 'Registration failed'
          };
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
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
          const response = await api.get('/auth/me');
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

// Note: Authorization headers are now handled by the api interceptor

export default useAuthStore;

