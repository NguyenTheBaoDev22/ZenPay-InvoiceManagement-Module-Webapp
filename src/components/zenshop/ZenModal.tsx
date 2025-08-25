import React from 'react';
import { cn } from '../ui/utils';
import { XIcon } from 'lucide-react';
import { ZenButton } from './ZenButton';

interface ZenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const ZenModal: React.FC<ZenModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  closeOnOverlayClick = true,
  className,
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal */}
      <div
        className={cn(
          'relative w-full bg-white rounded-lg shadow-xl transform transition-all',
          sizes[size],
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
            <h3 className="text-lg font-semibold text-[#1F2937]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] rounded-md transition-colors"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Side Drawer Component
interface ZenDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const ZenDrawer: React.FC<ZenDrawerProps> = ({
  isOpen,
  onClose,
  title,
  position = 'right',
  size = 'md',
  children,
  footer,
  closeOnOverlayClick = true,
  className,
}) => {
  const sizes = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[32rem]',
  };

  const positionStyles = {
    left: {
      container: 'justify-start',
      panel: 'translate-x-0',
      closed: '-translate-x-full',
    },
    right: {
      container: 'justify-end',
      panel: 'translate-x-0',
      closed: 'translate-x-full',
    },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Drawer Container */}
      <div className={cn('relative flex w-full', positionStyles[position].container)}>
        {/* Drawer Panel */}
        <div
          className={cn(
            'relative h-full bg-white shadow-xl transform transition-transform flex flex-col',
            sizes[size],
            isOpen ? positionStyles[position].panel : positionStyles[position].closed,
            className
          )}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0">
              <h3 className="text-lg font-semibold text-[#1F2937]">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] rounded-md transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};