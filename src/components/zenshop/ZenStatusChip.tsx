import React from 'react';
import { cn } from '../ui/utils';

interface ZenStatusChipProps {
  status: 'paid' | 'pending' | 'failed' | 'draft' | 'sent' | 'overdue';
  size?: 'sm' | 'md';
  className?: string;
}

export const ZenStatusChip: React.FC<ZenStatusChipProps> = ({ 
  status, 
  size = 'md', 
  className 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap';
  
  const statusStyles = {
    paid: 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]',
    pending: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]',
    failed: 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]',
    draft: 'bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]',
    sent: 'bg-[#E0F2FE] text-[#0C4A6E] border border-[#BAE6FD]',
    overdue: 'bg-[#FEE2E2] text-[#7F1D1D] border border-[#FECACA]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs h-5 min-w-[3rem]',
    md: 'px-3 py-1 text-sm h-6 min-w-[4rem]',
  };

  const statusLabels = {
    paid: 'Paid',
    pending: 'Pending',
    failed: 'Failed',
    draft: 'Draft',
    sent: 'Sent',
    overdue: 'Overdue',
  };

  return (
    <span className={cn(baseStyles, statusStyles[status], sizes[size], className)}>
      {statusLabels[status]}
    </span>
  );
};