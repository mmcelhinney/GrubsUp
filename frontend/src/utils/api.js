import axios from 'axios';
import { getApiUrl } from './getApiUrl.js';

// Get API URL - ensure it's relative for proxy to work
let API_URL = getApiUrl();

// FORCE relative URL in development mode (for proxy to work from any device)
if (import.meta.env.DEV) {
  if (API_URL.startsWith('http')) {
    console.warn('⚠️  API URL is absolute, forcing to relative "/api" for proxy');
    API_URL = '/api';
  }
}

console.log('🌐 API Client initialized');
console.log('   baseURL:', API_URL);
console.log('   Current origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A');
if (typeof window !== 'undefined') {
  console.log('   Full API URL will be:', window.location.origin + API_URL);
}

// Use the (now guaranteed relative) API_URL
const baseURL = API_URL;

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Override axios default to prevent it from constructing absolute URLs incorrectly
api.defaults.baseURL = baseURL;

// Add request logging in development
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      // Log the actual URL that will be requested
      const baseURL = config.baseURL || '';
      const url = config.url || '';
      let fullUrl;
      
      if (baseURL.startsWith('http')) {
        // Absolute URL
        fullUrl = baseURL + url;
      } else {
        // Relative URL - will use current origin
        fullUrl = window.location.origin + baseURL + url;
      }
      
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${fullUrl}`);
      console.log('   baseURL:', baseURL);
      console.log('   url:', url);
      console.log('   Will be sent to:', fullUrl);
      return config;
    },
    (error) => {
      console.error('❌ API Request Error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log(`📥 API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.error('❌ NETWORK ERROR');
        console.error('   Request URL:', error.config?.baseURL + error.config?.url);
        console.error('   This could mean:');
        console.error('   1. Backend server is not running (check backend terminal)');
        console.error('   2. Vite proxy is not working (check frontend terminal)');
        console.error('   3. Firewall blocking connection');
        console.error('   Full error:', error.message);
        console.error('   Error code:', error.code);
      } else {
        console.error(`❌ API Error: ${error.response?.status || 'Network'} ${error.config?.url}`);
        console.error('   Error details:', error.response?.data || error.message);
      }
      return Promise.reject(error);
    }
  );
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state?.accessToken) {
          config.headers.Authorization = `Bearer ${authData.state.accessToken}`;
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth on 401
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

