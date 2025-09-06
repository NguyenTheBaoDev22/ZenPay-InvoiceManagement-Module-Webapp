import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle, XCircle, QrCode, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { useCreateAndTrackOrder, useMerchantInvoiceOrderStatus } from '../../presentation/hooks/useMerchantInvoiceOrder';
import { useAuth } from '../../presentation/hooks/useAuth';

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData: {
    provider: string;
    packageName: string;
    price: string;
    type: 'quota' | 'certificate';
  };
  onSuccess: (transactionId: string) => void;
}

type PaymentStatus = 'waiting' | 'processing' | 'success' | 'failed' | 'expired';

// Helper function to decode Base64 QR data from backend
const decodeQrData = (base64String: string): string => {
  try {
    // If it's already a valid QR data string, return as is
    if (base64String.startsWith('00020101') || base64String.includes('VietQR')) {
      return base64String;
    }

    // Try to decode Base64
    const decoded = atob(base64String);
    return decoded;
  } catch (error) {
    console.warn('Failed to decode QR data:', error);
    // Return a fallback VietQR string for demo
    return '00020101021238570010A00000072701270006970454011234567890208QRIBFTTA53037045802VN5925NGUYEN VAN A6304';
  }
};

export function CheckoutModal({ open, onOpenChange, packageData, onSuccess }: CheckoutModalProps) {
  const { taxCode } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('waiting');
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [orderId, setOrderId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string>('');

  const { createAndTrack } = useCreateAndTrackOrder();
  const [qrCode, setQrCode] = useState<string>('');

  // Calculate totals
  const priceValue = parseInt(packageData.price.replace(/[^\d]/g, ''));
  const vatAmount = Math.round(priceValue * 0.1);
  const totalAmount = priceValue + vatAmount;

  // Polling for order status - only when modal is open and waiting
  console.log('🔍 [POLLING CONDITIONS]', {
    open,
    orderId,
    paymentStatus,
    enabled: open && !!orderId && paymentStatus === 'waiting'
  });

  const { data: statusData } = useMerchantInvoiceOrderStatus(orderId, {
    enabled: open && !!orderId && paymentStatus === 'waiting', // ✅ Only poll when modal open
    refetchInterval: 5000, // ✅ Increased to 5 seconds
  });

  // ✅ Watch for status changes using useEffect
  useEffect(() => {
    if (statusData?.data) {
      console.log('🔍 [CHECKOUT] Status data received:', statusData);
      console.log('🔍 [CHECKOUT] Status value:', (statusData as any).data.status);

      // ✅ Convert number status to string enum
      const statusString = (statusData as any).data.status === 1 ? 'PENDING' :
                         (statusData as any).data.status === 2 ? 'COMPLETED' : 'UNKNOWN';
      console.log('🔍 [CHECKOUT] Converted status:', statusString);

      if (statusString === 'COMPLETED') {
        console.log('🎉 Payment completed successfully!');
        setPaymentStatus('success');

        // Show success toast
        toast.success('Thanh toán thành công! 🎉', {
          description: 'Đơn hàng của bạn đã được xử lý thành công',
          duration: 3000,
        });

        // Close modal and navigate after delay
        setTimeout(() => {
          onOpenChange(false); // Close modal
          onSuccess(transactionId || `TXN-${Date.now()}`);

          // Navigate to Quotas page (using app's internal navigation)
          // Since this is a SPA, we need to trigger the navigation through the parent
          // For now, we'll use a custom event or callback
          if (window.location.pathname.includes('test-dedicated-page.html')) {
            // For test page
            (window as any).showPage?.('quotas');
          } else {
            // For React app - trigger navigation via custom event
            window.dispatchEvent(new CustomEvent('navigate-to-quotas'));
          }
        }, 2000);
      }
    }
  }, [statusData, onOpenChange, onSuccess, transactionId]);

  // Timer effect
  useEffect(() => {
    if (!open || paymentStatus !== 'waiting') return;

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          setPaymentStatus('expired');
          toast.error('QR Code đã hết hạn', {
            description: 'Vui lòng thử lại để tạo mã QR mới'
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, paymentStatus]);

  // Create order when modal opens - ONLY ONCE
  useEffect(() => {
    if (!open || !taxCode || orderId) return; // ✅ Don't create if already have orderId

    let isCreating = false; // ✅ Prevent double creation

    const createOrder = async () => {
      if (isCreating) return; // ✅ Guard against concurrent calls
      isCreating = true;

      try {
        console.log('🚀 Creating order for taxCode:', taxCode);
        setPaymentStatus('waiting');
        const result = await createAndTrack(
          { taxCode },
          (newOrderId: string, paymentInfo: any) => {
            console.log('✅ Order created successfully:', newOrderId);
            setOrderId(newOrderId);
            setQrCode(paymentInfo.qrCode);
            setTransactionId(paymentInfo.transactionId);
            setTimeLeft(paymentInfo.expirationInMinutes * 60);
          }
        );

        if (!result.success) {
          setPaymentStatus('failed');
          toast.error('Không thể tạo đơn hàng', {
            description: 'Vui lòng thử lại sau'
          });
        }
      } catch (error) {
        console.error('❌ Error creating order:', error);
        setPaymentStatus('failed');
        toast.error('Có lỗi xảy ra', {
          description: 'Không thể tạo đơn hàng, vui lòng thử lại'
        });
      } finally {
        isCreating = false;
      }
    };

    createOrder();
  }, [open, taxCode, orderId]); // ✅ Added orderId to prevent re-creation

  // ✅ Cleanup when modal closes
  useEffect(() => {
    if (!open) {
      // Reset all states when modal closes
      setPaymentStatus('waiting');
      setOrderId(null);
      setTransactionId('');
      setQrCode('');
      setTimeLeft(5 * 60);
    }
  }, [open]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setPaymentStatus('waiting');
      setTimeLeft(5 * 60);
      setOrderId(null);
      setTransactionId('');
    }
  }, [open]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast.success('Order ID copied to clipboard');
    }
  };

  const getStatusDisplay = () => {
    switch (paymentStatus) {
      case 'waiting':
        return {
          text: 'Waiting for payment...',
          icon: <Clock className="h-4 w-4 animate-pulse" />,
          color: 'text-blue-600'
        };
      case 'processing':
        return {
          text: 'Processing payment...',
          icon: <div className="h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />,
          color: 'text-orange-600'
        };
      case 'success':
        return {
          text: 'Payment Successful! ✅',
          icon: <CheckCircle className="h-4 w-4" />,
          color: 'text-green-600'
        };
      case 'failed':
        return {
          text: 'Payment Failed. Please try again. ❌',
          icon: <XCircle className="h-4 w-4" />,
          color: 'text-red-600'
        };
      case 'expired':
        return {
          text: 'QR Code Expired. Please refresh.',
          icon: <XCircle className="h-4 w-4" />,
          color: 'text-red-600'
        };
      default:
        return {
          text: 'Unknown status',
          icon: <Clock className="h-4 w-4" />,
          color: 'text-gray-600'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">Checkout</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Column - Order Summary */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                {/* Package Details */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{packageData.provider}</p>
                    <p className="text-sm text-muted-foreground">{packageData.packageName}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {packageData.type === 'quota' ? 'Quota' : 'Certificate'}
                  </Badge>
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Package Price</span>
                    <span>{packageData.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (10%)</span>
                    <span>{vatAmount.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>TOTAL</span>
                    <span className="text-lg">{totalAmount.toLocaleString('vi-VN')} VND</span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Order ID</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyOrderId}
                      className="h-6 px-2 text-xs font-mono"
                    >
                      {orderId || 'Đang tạo...'}
                      <Copy className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Payment */}
          <div className="p-6 bg-muted/20 border-l border-border space-y-6">
            <div className="text-center">
              <h3 className="font-medium mb-2">Scan to Pay</h3>
              <p className="text-sm text-muted-foreground">
                Use your banking app to scan the QR code
              </p>
            </div>

            {paymentStatus !== 'success' ? (
              <>
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-xl shadow-sm border">
                    {qrCode ? (
                      <QRCodeSVG
                        value={decodeQrData(qrCode)}
                        size={192}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        level="M"
                        marginSize={4}
                        title="Payment QR Code"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                        <div className="text-center">
                          <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Đang tạo QR code...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Details */}
                <div className="text-center space-y-2">
                  <div className="flex justify-center">
                    <Badge variant="outline" className="font-mono">
                      VietQR • {packageData.provider}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Amount: {totalAmount.toLocaleString('vi-VN')} VND
                  </p>
                </div>

                {/* Timer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Expires in {formatTime(timeLeft)}</span>
                  </div>
                  <Progress 
                    value={(timeLeft / (15 * 60)) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Status */}
                <div className={`flex items-center justify-center gap-2 text-sm ${statusDisplay.color}`}>
                  {statusDisplay.icon}
                  <span>{statusDisplay.text}</span>
                </div>

                {/* 🧪 DEBUG: Test success button */}
                {paymentStatus === 'waiting' && orderId && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('🧪 [TEST] Simulating payment success');
                        setPaymentStatus('success');
                        toast.success('Thanh toán thành công! 🎉', {
                          description: 'Đơn hàng của bạn đã được xử lý thành công',
                          duration: 3000,
                        });
                        setTimeout(() => {
                          onOpenChange(false);
                          window.dispatchEvent(new CustomEvent('navigate-to-quotas'));
                        }, 2000);
                      }}
                      className="text-xs"
                    >
                      🧪 Test Success
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Success State */
              <div className="text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-green-900">
                    Purchase Complete!
                  </h3>
                  <p className="text-sm text-green-700">
                    Thank you! Your new {packageData.packageName.toLowerCase()} has been successfully activated.
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-800">
                    Transaction ID: TXN-{Date.now()}
                  </p>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => onOpenChange(false)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Back to Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    Download Receipt
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
