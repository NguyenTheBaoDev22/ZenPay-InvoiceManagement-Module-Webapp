import React from 'react';
import { cn } from '../ui/utils';
import { LoaderIcon } from 'lucide-react';

// Spinner Component
interface ZenSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ZenSpinner: React.FC<ZenSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <LoaderIcon 
      className={cn(
        'animate-spin text-[#FF6A3D]',
        sizes[size],
        className
      )} 
    />
  );
};

// Table Skeleton Loader
interface ZenTableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export const ZenTableSkeleton: React.FC<ZenTableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
}) => {
  return (
    <div className={cn('bg-white border border-[#E5E7EB] rounded-lg overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {showHeader && (
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <th key={colIndex} className="px-4 py-3">
                    <div className="h-4 bg-[#E5E7EB] rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-[#E5E7EB]">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <div 
                      className="h-4 bg-[#E5E7EB] rounded animate-pulse"
                      style={{ 
                        width: `${60 + Math.random() * 40}%`,
                        animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s`
                      }}
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Card Skeleton Loader
interface ZenCardSkeletonProps {
  className?: string;
}

export const ZenCardSkeleton: React.FC<ZenCardSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('bg-white border border-[#E5E7EB] rounded-lg p-6 animate-pulse', className)}>
      <div className="space-y-4">
        {/* Title */}
        <div className="h-6 bg-[#E5E7EB] rounded w-3/4"></div>
        
        {/* Content lines */}
        <div className="space-y-2">
          <div className="h-4 bg-[#E5E7EB] rounded w-full"></div>
          <div className="h-4 bg-[#E5E7EB] rounded w-5/6"></div>
          <div className="h-4 bg-[#E5E7EB] rounded w-2/3"></div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-[#E5E7EB] rounded w-1/4"></div>
          <div className="h-8 bg-[#E5E7EB] rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

// Form Skeleton Loader
interface ZenFormSkeletonProps {
  fields?: number;
  className?: string;
}

export const ZenFormSkeleton: React.FC<ZenFormSkeletonProps> = ({ 
  fields = 4, 
  className 
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2 animate-pulse">
          {/* Label */}
          <div className="h-4 bg-[#E5E7EB] rounded w-1/4"></div>
          
          {/* Input */}
          <div className="h-10 bg-[#E5E7EB] rounded w-full"></div>
          
          {/* Optional help text */}
          {Math.random() > 0.7 && (
            <div className="h-3 bg-[#E5E7EB] rounded w-1/3"></div>
          )}
        </div>
      ))}
      
      {/* Button */}
      <div className="pt-4">
        <div className="h-10 bg-[#E5E7EB] rounded w-32 animate-pulse"></div>
      </div>
    </div>
  );
};

// List Item Skeleton
interface ZenListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}

export const ZenListSkeleton: React.FC<ZenListSkeletonProps> = ({
  items = 5,
  showAvatar = true,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 animate-pulse">
          {showAvatar && (
            <div className="h-10 w-10 bg-[#E5E7EB] rounded-full"></div>
          )}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#E5E7EB] rounded w-3/4"></div>
            <div className="h-3 bg-[#E5E7EB] rounded w-1/2"></div>
          </div>
          <div className="h-6 w-16 bg-[#E5E7EB] rounded"></div>
        </div>
      ))}
    </div>
  );
};

// Page Loading Component
interface ZenPageLoaderProps {
  message?: string;
  className?: string;
}

export const ZenPageLoader: React.FC<ZenPageLoaderProps> = ({
  message = 'Loading...',
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <ZenSpinner size="lg" className="mb-4" />
      <p className="text-[#6B7280] text-sm">{message}</p>
    </div>
  );
};