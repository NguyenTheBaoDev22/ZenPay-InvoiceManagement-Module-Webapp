import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../presentation/stores/authStore';
import { ZenButton } from '../zenshop/ZenButton';
import { ZenInput } from '../zenshop/ZenFormInputs';
import { EyeIcon, EyeOffIcon, LoaderIcon, ShieldCheckIcon } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    usernameOrPhone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isLoading, error, clearError } = useAuthStore();

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    if (error) {
      clearError();
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.usernameOrPhone?.trim() || !formData.password?.trim()) {
      return;
    }

    try {
      await login({
        usernameOrPhone: formData.usernameOrPhone.trim(),
        password: formData.password,
      });

      // Login successful, call the success callback
      onLoginSuccess();
    } catch (error) {
      // Error is already handled in the store
      console.error('Login failed:', error);
      // Don't reset form on error - keep the entered values
    }
  };

  const isFormValid = Boolean(formData.usernameOrPhone?.trim() && formData.password?.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3B82F6] rounded-2xl mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937] mb-2">
            ZenShop Invoice Management
          </h1>
          <p className="text-[#6B7280] text-sm">
            Đăng nhập để truy cập hệ thống quản lý hóa đơn
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-[#EF4444]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-[#EF4444]">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Username/Phone Field */}
            <div>
              <label htmlFor="usernameOrPhone" className="block text-sm font-medium text-[#374151] mb-2">
                Tên đăng nhập hoặc số điện thoại
              </label>
              <ZenInput
                id="usernameOrPhone"
                name="usernameOrPhone"
                type="text"
                placeholder="Nhập tên đăng nhập hoặc số điện thoại"
                value={formData.usernameOrPhone}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#374151] mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <ZenInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#374151] transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 text-[#3B82F6] focus:ring-[#3B82F6] border-[#D1D5DB] rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-[#6B7280]">
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Login Button */}
            <ZenButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isFormValid || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoaderIcon className="w-5 h-5 animate-spin mr-2" />
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </ZenButton>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#6B7280]">
              Bằng việc đăng nhập, bạn đồng ý với{' '}
              <a href="#" className="text-[#3B82F6] hover:text-[#2563EB] underline">
                Điều khoản sử dụng
              </a>{' '}
              và{' '}
              <a href="#" className="text-[#3B82F6] hover:text-[#2563EB] underline">
                Chính sách bảo mật
              </a>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-[#F3F4F6] rounded-lg p-4">
          <h3 className="text-sm font-medium text-[#374151] mb-2">Thông tin đăng nhập demo:</h3>
          <div className="text-xs text-[#6B7280] space-y-1">
            <p><strong>Tên đăng nhập:</strong> 0937127023</p>
            <p><strong>Mật khẩu:</strong> Admin@123456</p>
          </div>
        </div>
      </div>
    </div>
  );
};
