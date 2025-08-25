import React from 'react';
import { cn } from '../ui/utils';
import { 
  BarChart3Icon,
  FileTextIcon, 
  CreditCardIcon,
  SettingsIcon, 
  DatabaseIcon,
  HelpCircleIcon,
  BellIcon,
  UserIcon
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface ZenNavigationProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
  className?: string;
}

export const ZenNavigation: React.FC<ZenNavigationProps> = ({
  currentView,
  onNavigate,
  className,
}) => {
  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3Icon },
    { id: 'invoices', label: 'Invoices', icon: FileTextIcon, badge: 3 },
    { id: 'quota', label: 'Buy Quota', icon: CreditCardIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'logs', label: 'Logs', icon: DatabaseIcon },
    { id: 'help', label: 'Help', icon: HelpCircleIcon },
  ];

  return (
    <nav className={cn('bg-white border-b border-[#E5E7EB]', className)}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF6A3D] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <h1 className="text-xl font-semibold text-[#1F2937]">ZenShop E-Invoice</h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#FF6A3D] text-white'
                      : 'text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      'absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs font-medium rounded-full',
                      isActive
                        ? 'bg-white text-[#FF6A3D]'
                        : 'bg-[#FF6A3D] text-white'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] rounded-lg transition-colors">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
            </button>
            
            <button className="flex items-center gap-2 p-2 text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] rounded-lg transition-colors">
              <UserIcon className="h-5 w-5" />
              <span className="text-sm font-medium">John Doe</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};