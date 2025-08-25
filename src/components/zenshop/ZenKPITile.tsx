import React from 'react';
import { cn } from '../ui/utils';
import { LucideIcon } from 'lucide-react';

interface ZenKPITileProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: LucideIcon;
  className?: string;
}

export const ZenKPITile: React.FC<ZenKPITileProps> = ({
  title,
  value,
  change,
  icon: Icon,
  className,
}) => {
  return (
    <div className={cn('bg-white border border-[#E5E7EB] rounded-lg p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#6B7280] mb-1">{title}</p>
          <p className="text-2xl font-semibold text-[#1F2937]">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  'text-sm font-medium',
                  change.type === 'increase' && 'text-[#22C55E]',
                  change.type === 'decrease' && 'text-[#EF4444]',
                  change.type === 'neutral' && 'text-[#6B7280]'
                )}
              >
                {change.type === 'increase' && '+'}
                {change.value}
              </span>
              <span className="text-sm text-[#6B7280] ml-1">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-[#F8FAFC] rounded-lg">
            <Icon className="h-6 w-6 text-[#FF6A3D]" />
          </div>
        )}
      </div>
    </div>
  );
};