import React, { useState } from 'react';
import { ZenButton } from '../zenshop/ZenButton';
import { ZenStatusChip } from '../zenshop/ZenStatusChip';
import { CheckoutModal } from '../purchase/CheckoutModal';
import { motion } from 'motion/react';
import {
  ZapIcon,
  StarIcon,
  CrownIcon,
  CheckIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface QuotaPackage {
  id: string;
  name: string;
  icon: React.ReactNode;
  invoices: number;
  price: number;
  originalPrice?: number;
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
}

const packages: QuotaPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    icon: <ZapIcon className="h-6 w-6" />,
    invoices: 100,
    price: 29,
    features: [
      '100 E-Invoices',
      'Basic Templates',
      'Email Support',
      'Digital Signature'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: <StarIcon className="h-6 w-6" />,
    invoices: 500,
    price: 99,
    originalPrice: 145,
    popular: true,
    features: [
      '500 E-Invoices',
      'Premium Templates',
      'Priority Support',
      'Advanced Analytics',
      'API Access',
      'Bulk Operations'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: <CrownIcon className="h-6 w-6" />,
    invoices: 2000,
    price: 299,
    originalPrice: 380,
    enterprise: true,
    features: [
      '2000 E-Invoices',
      'Custom Templates',
      'Dedicated Support',
      'White-label Options',
      'Custom Integrations',
      'SLA Guarantee'
    ]
  }
];

export const BuyQuota: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<QuotaPackage | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleSelectPackage = (pkg: QuotaPackage) => {
    setSelectedPackage(pkg);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = (transactionId: string) => {
    toast.success('Thanh toán thành công!', {
      description: `Giao dịch: ${transactionId}`
    });
    setShowCheckout(false);
    setSelectedPackage(null);
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
    setSelectedPackage(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-semibold text-[#1F2937] mb-4">Choose Your Quota Package</h1>
        <p className="text-[#6B7280] text-lg">
          Select the perfect plan for your business needs. All packages include digital signatures, 
          premium templates, and priority support.
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            whileHover={{ scale: 1.02 }}
            className={`
              relative bg-white border-2 rounded-xl p-6 cursor-pointer transition-all
              ${pkg.popular ? 'border-[#FF6A3D] shadow-lg' : 'border-[#E5E7EB] hover:border-[#FF6A3D]/50'}
              ${pkg.enterprise ? 'bg-gradient-to-br from-[#1F2937] to-[#374151] text-white' : ''}
            `}
            onClick={() => handleSelectPackage(pkg)}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#FF6A3D] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
            )}

            {/* Enterprise Badge */}
            {pkg.enterprise && (
              <div className="absolute -top-3 right-4">
                <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#1F2937] px-3 py-1 rounded-full text-sm font-medium">
                  Enterprise
                </div>
              </div>
            )}

            <div className="text-center">
              {/* Icon */}
              <div className={`
                w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center
                ${pkg.enterprise ? 'bg-white/10 text-white' : 'bg-[#FF6A3D]/10 text-[#FF6A3D]'}
              `}>
                {pkg.icon}
              </div>

              {/* Name */}
              <h3 className={`text-xl font-semibold mb-2 ${pkg.enterprise ? 'text-white' : 'text-[#1F2937]'}`}>
                {pkg.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-3xl font-bold ${pkg.enterprise ? 'text-white' : 'text-[#1F2937]'}`}>
                    ${pkg.price}
                  </span>
                  {pkg.originalPrice && (
                    <span className={`text-lg line-through ${pkg.enterprise ? 'text-white/60' : 'text-[#6B7280]'}`}>
                      ${pkg.originalPrice}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${pkg.enterprise ? 'text-white/80' : 'text-[#6B7280]'}`}>
                  {pkg.invoices} invoices
                </p>
              </div>

              {/* Features */}
              <div className="text-left space-y-3 mb-6">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckIcon className={`h-4 w-4 ${pkg.enterprise ? 'text-[#FFD700]' : 'text-[#22C55E]'}`} />
                    <span className={`text-sm ${pkg.enterprise ? 'text-white' : 'text-[#6B7280]'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <ZenButton 
                className="w-full"
                variant={pkg.popular ? 'default' : pkg.enterprise ? 'ghost' : 'secondary'}
              >
                Select {pkg.name}
              </ZenButton>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Checkout Modal */}
      {selectedPackage && (
        <CheckoutModal
          open={showCheckout}
          onOpenChange={setShowCheckout}
          packageData={{
            provider: 'ZenShop',
            packageName: selectedPackage.name,
            price: `${selectedPackage.price.toLocaleString('vi-VN')} VND`,
            type: 'quota'
          }}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
};

