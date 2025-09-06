import React, { useState } from 'react';
import { cn } from '../ui/utils';
import {
  BarChart3Icon,
  FileTextIcon,
  CreditCardIcon,
  SettingsIcon,
  DatabaseIcon,
  HelpCircleIcon,
  BellIcon,
  UserIcon,
  LogOutIcon,
  ChevronDownIcon
} from 'lucide-react';
import { useAuth } from '../../presentation/hooks/useAuth';

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
  const { username, taxCode, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3Icon },
    { id: 'invoices', label: 'Quản lý hoá đơn', icon: FileTextIcon, badge: 3 },
    { id: 'quota', label: 'Mua hạn mức', icon: CreditCardIcon },
    { id: 'quotas', label: 'Nhật ký hạn mức', icon: DatabaseIcon },
    { id: 'settings', label: 'Cấu hình', icon: SettingsIcon },
    { id: 'logs', label: 'Logs', icon: DatabaseIcon },
    { id: 'help', label: 'Help', icon: HelpCircleIcon },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

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

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] rounded-lg transition-colors"
              >
                <UserIcon className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-sm font-medium">{username || 'User'}</div>
                  {taxCode && (
                    <div className="text-xs text-[#9CA3AF]">MST: {taxCode}</div>
                  )}
                </div>
                <ChevronDownIcon className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 z-50">
                  <div className="px-4 py-2 border-b border-[#E5E7EB]">
                    <div className="text-sm font-medium text-[#1F2937]">{username}</div>
                    {taxCode && (
                      <div className="text-xs text-[#6B7280]">Mã số thuế: {taxCode}</div>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};