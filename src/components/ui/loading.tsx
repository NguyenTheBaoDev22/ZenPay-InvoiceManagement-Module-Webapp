import React from 'react';
import { Card, CardContent, CardHeader } from './card';
import { Skeleton } from './skeleton';

// Loading spinner component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
    </div>
  );
};

// KPI Tile Loading Skeleton
export const KPITileLoading: React.FC = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

// Chart Loading Skeleton
export const ChartLoading: React.FC = () => (
  <Card className="lg:col-span-2">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-end justify-between h-48">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <Skeleton className={`w-8 bg-gray-200`} style={{ height: `${Math.random() * 120 + 40}px` }} />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Recent Invoices Loading Skeleton
export const RecentInvoicesLoading: React.FC = () => (
  <Card className="lg:col-span-2">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-1">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Quota Status Loading Skeleton
export const QuotaStatusLoading: React.FC = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-24" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-full rounded" />
      </div>
    </CardContent>
  </Card>
);

// Error Display Component
export const ErrorDisplay: React.FC<{ 
  message: string; 
  onRetry?: () => void;
  className?: string;
}> = ({ message, onRetry, className = '' }) => (
  <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
    <div className="text-red-500 mb-2">
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p className="text-sm text-gray-600 mb-3">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Thử lại
      </button>
    )}
  </div>
);

// Section Loading Wrapper
export const SectionLoading: React.FC<{
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  loadingComponent: React.ReactNode;
  children: React.ReactNode;
}> = ({ isLoading, error, onRetry, loadingComponent, children }) => {
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={onRetry} />;
  }

  return <>{children}</>;
};
