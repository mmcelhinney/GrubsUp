// Test backend connectivity
import api from './api.js';
import { getApiUrl } from './getApiUrl.js';

export async function testBackendConnection() {
  const apiUrl = getApiUrl();
  console.log('🔍 Testing backend connection...');
  console.log('   Using API URL:', apiUrl);
  console.log('   Current location:', window.location.href);
  
  try {
    const response = await api.get('/health');
    console.log('✅ Backend is reachable:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    console.error('   Request URL:', error.config?.url);
    console.error('   Base URL:', error.config?.baseURL);
    
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      return {
        success: false,
        error: `Cannot reach backend server via proxy. Make sure:
1. Backend is running on port 5000
2. Frontend dev server is running on port 3000
3. You're accessing via: ${window.location.origin}`
      };
    }
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
}

