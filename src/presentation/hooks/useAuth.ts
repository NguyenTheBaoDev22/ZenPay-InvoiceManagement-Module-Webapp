import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const {
    isAuthenticated,
    accessToken,
    taxCode,
    userId,
    username,
    isLoading,
    error,
    login,
    logout,
    checkTokenExpiry,
    refreshTokenIfNeeded,
    clearError,
  } = useAuthStore();

  // Check token expiry on mount and periodically
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated && accessToken) {
        await refreshTokenIfNeeded();
      }
    };

    // Check immediately
    checkAuth();

    // Set up periodic check every 5 minutes
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, accessToken, refreshTokenIfNeeded]);

  // Auto-logout when token expires
  useEffect(() => {
    if (isAuthenticated && !checkTokenExpiry()) {
      console.log('Token expired, auto-logout');
      logout();
    }
  }, [isAuthenticated, checkTokenExpiry, logout]);

  return {
    // State
    isAuthenticated,
    accessToken,
    taxCode,
    userId,
    username,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    clearError,
    
    // Computed
    isTokenValid: checkTokenExpiry(),
    
    // Helper to get auth headers for API calls
    getAuthHeaders: () => ({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }),
  };
};

// Hook to require authentication
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    shouldShowLogin: !isAuthenticated && !isLoading,
  };
};
