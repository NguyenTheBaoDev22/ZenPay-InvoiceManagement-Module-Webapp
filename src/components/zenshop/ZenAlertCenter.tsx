import React from 'react';
import { cn } from '../ui/utils';
import { AlertTriangleIcon, InfoIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
}

interface ZenAlertCenterProps {
  alerts: Alert[];
  className?: string;
  onMarkAsRead?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
}

export const ZenAlertCenter: React.FC<ZenAlertCenterProps> = ({
  alerts,
  className,
  onMarkAsRead,
  onDismiss,
}) => {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return XCircleIcon;
      case 'warning':
        return AlertTriangleIcon;
      case 'info':
        return InfoIcon;
      case 'success':
        return CheckCircleIcon;
      default:
        return InfoIcon;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return 'text-[#EF4444]';
      case 'warning':
        return 'text-[#F59E0B]';
      case 'info':
        return 'text-[#0EA5E9]';
      case 'success':
        return 'text-[#22C55E]';
      default:
        return 'text-[#6B7280]';
    }
  };

  const getAlertBg = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return 'bg-[#FEE2E2]';
      case 'warning':
        return 'bg-[#FEF3C7]';
      case 'info':
        return 'bg-[#E0F2FE]';
      case 'success':
        return 'bg-[#DCFCE7]';
      default:
        return 'bg-[#F3F4F6]';
    }
  };

  return (
    <div className={cn('bg-white border border-[#E5E7EB] rounded-lg', className)}>
      <div className="px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-lg font-medium text-[#1F2937]">Alerts Center</h3>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircleIcon className="h-12 w-12 text-[#22C55E] mx-auto mb-3" />
            <p className="text-sm text-[#6B7280]">All clear! No alerts at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {alerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 hover:bg-[#F9FAFB] transition-colors',
                    !alert.isRead && 'bg-[#F8FAFC]'
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn('p-1 rounded-full', getAlertBg(alert.type))}>
                      <Icon className={cn('h-4 w-4', getAlertColor(alert.type))} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={cn(
                            'text-sm font-medium',
                            alert.isRead ? 'text-[#6B7280]' : 'text-[#1F2937]'
                          )}>
                            {alert.title}
                          </h4>
                          <p className="text-sm text-[#6B7280] mt-1">{alert.message}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                            <ClockIcon className="h-3 w-3" />
                            {alert.timestamp}
                          </div>
                          
                          {!alert.isRead && onMarkAsRead && (
                            <button
                              onClick={() => onMarkAsRead(alert.id)}
                              className="w-2 h-2 bg-[#FF6A3D] rounded-full"
                              title="Mark as read"
                            />
                          )}
                        </div>
                      </div>
                      
                      {onDismiss && (
                        <button
                          onClick={() => onDismiss(alert.id)}
                          className="text-xs text-[#6B7280] hover:text-[#374151] mt-2 transition-colors"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};