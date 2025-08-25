import React from 'react';
import { cn } from '../ui/utils';

interface ZenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const ZenButton = React.forwardRef<HTMLButtonElement, ZenButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg font-medium';
    
    const variants = {
      primary: cn(
        'bg-[#FF6A3D] text-white border border-[#FF6A3D]',
        'hover:bg-[#E85A2E] hover:border-[#E85A2E]',
        'active:bg-[#D14B1F] active:border-[#D14B1F]',
        'focus:ring-[#FF6A3D]/20',
        'disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed'
      ),
      secondary: cn(
        'bg-white text-[#1F2937] border border-[#E5E7EB]',
        'hover:bg-[#F9FAFB] hover:border-[#D1D5DB]',
        'active:bg-[#F3F4F6] active:border-[#9CA3AF]',
        'focus:ring-[#FF6A3D]/20',
        'disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
      ),
      ghost: cn(
        'bg-transparent text-[#1F2937] border border-transparent',
        'hover:bg-[#F9FAFB]',
        'active:bg-[#F3F4F6]',
        'focus:ring-[#FF6A3D]/20',
        'disabled:text-gray-400 disabled:cursor-not-allowed'
      ),
      danger: cn(
        'bg-[#EF4444] text-white border border-[#EF4444]',
        'hover:bg-[#DC2626] hover:border-[#DC2626]',
        'active:bg-[#B91C1C] active:border-[#B91C1C]',
        'focus:ring-[#EF4444]/20',
        'disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed'
      ),
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm h-8',
      md: 'px-4 py-2 text-base h-10',
      lg: 'px-6 py-3 text-base h-12',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ZenButton.displayName = 'ZenButton';