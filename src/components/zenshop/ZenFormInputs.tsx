import React from 'react';
import { cn } from '../ui/utils';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';

// Base Input Component
interface ZenInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  variant?: 'default' | 'error';
}

export const ZenInput = React.forwardRef<HTMLInputElement, ZenInputProps>(
  ({ className, label, error, helpText, variant = 'default', ...props }, ref) => {
    const inputStyles = cn(
      'w-full px-3 py-2 text-base bg-white border rounded-lg transition-all duration-150',
      'placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-offset-0',
      variant === 'error' || error
        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
        : 'border-[#E5E7EB] focus:border-[#FF6A3D] focus:ring-[#FF6A3D]/20 hover:border-[#D1D5DB]',
      'disabled:bg-[#F9FAFB] disabled:border-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed',
      className
    );

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-[#1F2937]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={inputStyles}
          {...props}
        />
        {error && (
          <p className="text-sm text-[#EF4444]">{error}</p>
        )}
        {helpText && !error && (
          <p className="text-sm text-[#6B7280]">{helpText}</p>
        )}
      </div>
    );
  }
);

ZenInput.displayName = 'ZenInput';

// Textarea Component
interface ZenTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  variant?: 'default' | 'error';
}

export const ZenTextarea = React.forwardRef<HTMLTextAreaElement, ZenTextareaProps>(
  ({ className, label, error, helpText, variant = 'default', ...props }, ref) => {
    const textareaStyles = cn(
      'w-full px-3 py-2 text-base bg-white border rounded-lg transition-all duration-150 resize-vertical min-h-[80px]',
      'placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-offset-0',
      variant === 'error' || error
        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
        : 'border-[#E5E7EB] focus:border-[#FF6A3D] focus:ring-[#FF6A3D]/20 hover:border-[#D1D5DB]',
      'disabled:bg-[#F9FAFB] disabled:border-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed',
      className
    );

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-[#1F2937]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={textareaStyles}
          {...props}
        />
        {error && (
          <p className="text-sm text-[#EF4444]">{error}</p>
        )}
        {helpText && !error && (
          <p className="text-sm text-[#6B7280]">{helpText}</p>
        )}
      </div>
    );
  }
);

ZenTextarea.displayName = 'ZenTextarea';

// Select Component
interface ZenSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  variant?: 'default' | 'error';
  placeholder?: string;
}

export const ZenSelect = React.forwardRef<HTMLSelectElement, ZenSelectProps>(
  ({ className, label, error, helpText, variant = 'default', placeholder, children, ...props }, ref) => {
    const selectStyles = cn(
      'w-full px-3 py-2 text-base bg-white border rounded-lg transition-all duration-150 appearance-none cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      variant === 'error' || error
        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
        : 'border-[#E5E7EB] focus:border-[#FF6A3D] focus:ring-[#FF6A3D]/20 hover:border-[#D1D5DB]',
      'disabled:bg-[#F9FAFB] disabled:border-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed',
      className
    );

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-[#1F2937]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={selectStyles}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
        </div>
        {error && (
          <p className="text-sm text-[#EF4444]">{error}</p>
        )}
        {helpText && !error && (
          <p className="text-sm text-[#6B7280]">{helpText}</p>
        )}
      </div>
    );
  }
);

ZenSelect.displayName = 'ZenSelect';

// Date Range Picker Component
interface ZenDateRangePickerProps {
  label?: string;
  error?: string;
  helpText?: string;
  variant?: 'default' | 'error';
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
}

export const ZenDateRangePicker: React.FC<ZenDateRangePickerProps> = ({
  label,
  error,
  helpText,
  variant = 'default',
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const inputStyles = cn(
    'w-full px-3 py-2 text-base bg-white border rounded-lg transition-all duration-150',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    variant === 'error' || error
      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
      : 'border-[#E5E7EB] focus:border-[#FF6A3D] focus:ring-[#FF6A3D]/20 hover:border-[#D1D5DB]'
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-[#1F2937]">
          {label}
        </label>
      )}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange?.(e.target.value)}
            className={inputStyles}
          />
          <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
        </div>
        <span className="text-[#6B7280] text-sm">to</span>
        <div className="relative flex-1">
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange?.(e.target.value)}
            className={inputStyles}
          />
          <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-[#EF4444]">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-sm text-[#6B7280]">{helpText}</p>
      )}
    </div>
  );
};