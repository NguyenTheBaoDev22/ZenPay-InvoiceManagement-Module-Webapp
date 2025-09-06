import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '../../presentation/stores/authStore';

// Base API configuration
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7242/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const authState = useAuthStore.getState();
    if (authState.accessToken) {
      config.headers.Authorization = `Bearer ${authState.accessToken}`;
    }

    if (import.meta.env.VITE_ENABLE_API_LOGGING === 'true') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.VITE_ENABLE_API_LOGGING === 'true') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    
    // Handle common error cases
    if (error.response?.status === 401) {
      // Handle unauthorized - logout user
      console.error('Unauthorized access - logging out');
      const authState = useAuthStore.getState();
      authState.logout();
    } else if (error.response?.status === 500) {
      // Handle server error
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
