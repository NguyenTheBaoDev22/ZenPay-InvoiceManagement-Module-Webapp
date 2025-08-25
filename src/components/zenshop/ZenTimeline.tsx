import React from 'react';
import { cn } from '../ui/utils';
import { LucideIcon } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'created' | 'sent' | 'viewed' | 'paid' | 'failed' | 'cancelled';
  icon?: LucideIcon;
}

interface ZenTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const ZenTimeline: React.FC<ZenTimelineProps> = ({ events, className }) => {
  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'created':
        return 'bg-[#0EA5E9]';
      case 'sent':
        return 'bg-[#F59E0B]';
      case 'viewed':
        return 'bg-[#6B7280]';
      case 'paid':
        return 'bg-[#22C55E]';
      case 'failed':
        return 'bg-[#EF4444]';
      case 'cancelled':
        return 'bg-[#6B7280]';
      default:
        return 'bg-[#6B7280]';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {events.map((event, index) => {
        const Icon = event.icon;
        const isLast = index === events.length - 1;
        
        return (
          <div key={event.id} className="relative flex gap-4">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-4 top-8 w-0.5 h-full bg-[#E5E7EB]" />
            )}
            
            {/* Event icon */}
            <div className={cn(
              'relative z-10 flex items-center justify-center w-8 h-8 rounded-full',
              getEventColor(event.type)
            )}>
              {Icon ? (
                <Icon className="h-4 w-4 text-white" />
              ) : (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            
            {/* Event content */}
            <div className="flex-1 min-w-0 pb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-[#1F2937]">{event.title}</h4>
                  <p className="text-sm text-[#6B7280] mt-1">{event.description}</p>
                </div>
                <time className="text-xs text-[#6B7280] ml-4 whitespace-nowrap">
                  {event.timestamp}
                </time>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};