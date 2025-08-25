import React from 'react';
import { cn } from '../ui/utils';
import { SearchIcon, XIcon } from 'lucide-react';

interface ZenSearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showClearButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ZenSearchField = React.forwardRef<HTMLInputElement, ZenSearchFieldProps>(
  ({ className, onClear, showClearButton = true, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-8 pl-8 pr-8 text-sm',
      md: 'h-10 pl-10 pr-10 text-base',
      lg: 'h-12 pl-12 pr-12 text-lg',
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const iconPositions = {
      sm: 'left-2',
      md: 'left-3',
      lg: 'left-4',
    };

    const clearPositions = {
      sm: 'right-2',
      md: 'right-3',
      lg: 'right-4',
    };

    return (
      <div className="relative">
        <SearchIcon 
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none',
            iconSizes[size],
            iconPositions[size]
          )} 
        />
        <input
          ref={ref}
          className={cn(
            'w-full bg-white border border-[#E5E7EB] rounded-lg transition-all duration-150',
            'placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-offset-0',
            'focus:border-[#FF6A3D] focus:ring-[#FF6A3D]/20 hover:border-[#D1D5DB]',
            'disabled:bg-[#F9FAFB] disabled:border-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed',
            sizes[size],
            className
          )}
          {...props}
        />
        {showClearButton && props.value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151] transition-colors',
              clearPositions[size]
            )}
          >
            <XIcon className={iconSizes[size]} />
          </button>
        )}
      </div>
    );
  }
);

ZenSearchField.displayName = 'ZenSearchField';