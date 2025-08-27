import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { ResourceCenter } from '../purchase/ResourceCenter';
import { CheckoutModal } from '../purchase/CheckoutModal';
import { toast } from 'sonner';

interface ResourceCenterPageProps {
  onNavigate: (view: string) => void;
}

export const ResourceCenterPage: React.FC<ResourceCenterPageProps> = ({ onNavigate }) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const handleSelectPackage = (packageData: any) => {
    console.log('Package selected:', packageData);

    // Set selected package and open checkout modal
    setSelectedPackage(packageData);
    setShowCheckoutModal(true);
  };

  const handleCheckoutSuccess = (transactionId: string) => {
    console.log('Checkout successful:', transactionId);

    // Close modal
    setShowCheckoutModal(false);
    setSelectedPackage(null);

    // Show success toast
    toast.success('Thanh toán thành công!', {
      description: `Gói ${selectedPackage?.packageName} đã được kích hoạt. Transaction ID: ${transactionId}`,
      duration: 4000,
    });

    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      onNavigate('dashboard');
    }, 2000);
  };

  const handleCheckoutCancel = () => {
    setShowCheckoutModal(false);
    setSelectedPackage(null);
  };

  const handleBackToDashboard = () => {
    onNavigate('dashboard');
  };

  return (
    <>
      {/* Main Page Content */}
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button & Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Quay về Dashboard</span>
              </Button>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Resource Center</h1>
                  <p className="text-sm text-gray-500 hidden sm:block">Mua quota và chứng thư số</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToDashboard}
                className="hidden sm:flex"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResourceCenter onSelectPackage={handleSelectPackage} />
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              <p>Cần hỗ trợ? Liên hệ <a href="#" className="text-orange-600 hover:text-orange-700">support@zenshop.vn</a></p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700">Điều khoản sử dụng</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700">Chính sách bảo mật</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700">Hướng dẫn thanh toán</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Checkout Modal */}
    {selectedPackage && (
      <CheckoutModal
        open={showCheckoutModal}
        onOpenChange={handleCheckoutCancel}
        packageData={selectedPackage}
        onSuccess={handleCheckoutSuccess}
      />
    )}
    </>
  );
};
