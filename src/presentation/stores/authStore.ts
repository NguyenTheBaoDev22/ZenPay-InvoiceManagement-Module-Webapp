import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AuthState {
  // Authentication state
  isAuthenticated: boolean;
  accessToken: string | null;
  tokenType: string;
  expiresIn: number;
  expiration: string | null;
  
  // User information from JWT token
  taxCode: string | null;
  userId: string | null;
  username: string | null;
  
  // Login state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkTokenExpiry: () => boolean;
  refreshTokenIfNeeded: () => Promise<void>;
}

export interface LoginCredentials {
  usernameOrPhone: string;
  password: string;
}

export interface LoginResponse {
  code: string;
  message: string;
  data: {
    accessToken: string;
    expiration: string;
    tokenType: string;
    expiresIn: number;
  };
  traceId: string;
  timestamp: string;
  isSuccess: boolean;
  errors: Record<string, any>;
}

// JWT token payload interface
interface JWTPayload {
  tax_code?: string;
  sub?: string;
  unique_name?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

// Helper function to decode JWT token
const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

// Helper function to check if token is expired
const isTokenExpired = (expiration: string | null): boolean => {
  if (!expiration) return true;
  return new Date() >= new Date(expiration);
};

// API call to login
const loginAPI = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch('https://localhost:7242/api/app-auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  
  if (!data.isSuccess) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        accessToken: null,
        tokenType: 'Bearer',
        expiresIn: 0,
        expiration: null,
        taxCode: null,
        userId: null,
        username: null,
        isLoading: false,
        error: null,

        // Actions
        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await loginAPI(credentials);
            const { accessToken, expiration, tokenType, expiresIn } = response.data;
            
            // Decode JWT to extract user information
            const payload = decodeJWT(accessToken);
            
            set({
              isAuthenticated: true,
              accessToken,
              tokenType,
              expiresIn,
              expiration,
              taxCode: payload?.tax_code || null,
              userId: payload?.sub || null,
              username: payload?.unique_name || credentials.usernameOrPhone,
              isLoading: false,
              error: null,
            });
            
            console.log('Login successful:', {
              taxCode: payload?.tax_code,
              userId: payload?.sub,
              username: payload?.unique_name,
              expiration,
            });
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            set({
              isLoading: false,
              error: errorMessage,
              isAuthenticated: false,
              accessToken: null,
              expiration: null,
              taxCode: null,
              userId: null,
              username: null,
            });
            throw error;
          }
        },

        logout: () => {
          set({
            isAuthenticated: false,
            accessToken: null,
            tokenType: 'Bearer',
            expiresIn: 0,
            expiration: null,
            taxCode: null,
            userId: null,
            username: null,
            isLoading: false,
            error: null,
          });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        checkTokenExpiry: () => {
          const { expiration } = get();
          return !isTokenExpired(expiration);
        },

        refreshTokenIfNeeded: async () => {
          const { checkTokenExpiry, logout } = get();
          
          if (!checkTokenExpiry()) {
            console.log('Token expired, logging out...');
            logout();
          }
        },
      }),
      {
        name: 'zen-auth-storage',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          accessToken: state.accessToken,
          tokenType: state.tokenType,
          expiresIn: state.expiresIn,
          expiration: state.expiration,
          taxCode: state.taxCode,
          userId: state.userId,
          username: state.username,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);
