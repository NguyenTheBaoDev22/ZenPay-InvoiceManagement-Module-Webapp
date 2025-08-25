import React, { useState } from 'react';
import { ZenButton } from '../zenshop/ZenButton';
import { ZenStatusChip } from '../zenshop/ZenStatusChip';
import { motion } from 'motion/react';
import { 
  ZapIcon, 
  StarIcon, 
  CrownIcon,
  CheckIcon,
  XIcon,
  QrCodeIcon,
  Loader2Icon,
  CheckCircleIcon
} from 'lucide-react';

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
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success'>('pending');

  const handleSelectPackage = (pkg: QuotaPackage) => {
    setSelectedPackage(pkg);
    setShowPayment(true);
  };

  const handleClosePayment = () => {
    setShowPayment(false);
    setPaymentStatus('pending');
  };

  // Simulate payment success after 3 seconds
  React.useEffect(() => {
    if (showPayment && paymentStatus === 'pending') {
      const timer = setTimeout(() => {
        setPaymentStatus('success');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPayment, paymentStatus]);

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

      {/* Payment Modal */}
      {showPayment && selectedPackage && (
        <PaymentModal
          package={selectedPackage}
          status={paymentStatus}
          onClose={handleClosePayment}
        />
      )}
    </div>
  );
};

interface PaymentModalProps {
  package: QuotaPackage;
  status: 'pending' | 'success';
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ package: pkg, status, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
      >
        {/* Header */}
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1F2937]">Complete Your Purchase</h3>
            <button
              onClick={onClose}
              className="p-1 text-[#6B7280] hover:text-[#374151] rounded"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-[#F8FAFC] p-4 rounded-lg mb-6">
            <h4 className="font-medium text-[#1F2937] mb-3">Order Summary</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#6B7280]">{pkg.name} Package</span>
              <span className="font-medium text-[#1F2937]">${pkg.price}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#6B7280]">Invoices Included</span>
              <span className="font-medium text-[#1F2937]">{pkg.invoices}</span>
            </div>
            <div className="border-t border-[#E5E7EB] pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#1F2937]">Total</span>
                <span className="text-xl font-bold text-[#1F2937]">${pkg.price}</span>
              </div>
            </div>
          </div>

          {status === 'pending' ? (
            /* QR Code Payment */
            <div className="text-center">
              <div className="mb-4">
                <QrCodeIcon className="h-32 w-32 text-[#1F2937] mx-auto mb-4" />
                <p className="font-medium text-[#1F2937] mb-2">Scan to Pay</p>
                <p className="text-sm text-[#6B7280]">
                  Use your banking app or payment wallet to scan the QR code above
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-center gap-2 p-3 bg-[#F59E0B]/10 rounded-lg">
                <Loader2Icon className="h-4 w-4 text-[#F59E0B] animate-spin" />
                <span className="text-sm font-medium text-[#F59E0B]">Waiting for Payment...</span>
              </div>

              <p className="text-xs text-[#6B7280] mt-3">
                Payment typically processes within 30 seconds
              </p>
            </div>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-[#22C55E]" />
              </div>
              <h4 className="text-lg font-semibold text-[#1F2937] mb-2">Payment Successful!</h4>
              <p className="text-[#6B7280] mb-6">
                Your {pkg.name} package has been activated. You can now issue up to {pkg.invoices} invoices.
              </p>
              
              <div className="bg-[#22C55E]/10 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">New Quota Balance:</span>
                  <span className="font-medium text-[#22C55E]">{pkg.invoices} invoices</span>
                </div>
              </div>

              <ZenButton onClick={onClose} className="w-full">
                Continue to Dashboard
              </ZenButton>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};