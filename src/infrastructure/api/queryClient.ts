import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // ✅ Conservative retry with proper error handling
        if (error instanceof Error && 'status' in error &&
            typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
          return false; // Don't retry 4xx errors
        }
        return failureCount < 1; // Only 1 retry
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // ❌ STOP reconnect refetch
      networkMode: 'online',
    },
    mutations: {
      retry: false, // ❌ STOP mutation retries to prevent spam
      networkMode: 'online',
    },
  },
});
