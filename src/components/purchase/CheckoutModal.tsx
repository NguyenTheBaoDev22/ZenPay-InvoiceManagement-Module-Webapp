import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle, XCircle, QrCode, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';

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

export function CheckoutModal({ open, onOpenChange, packageData, onSuccess }: CheckoutModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('waiting');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [qrCode] = useState(`data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <rect x="20" y="20" width="20" height="20" fill="black"/>
      <rect x="60" y="20" width="20" height="20" fill="black"/>
      <rect x="100" y="20" width="20" height="20" fill="black"/>
      <rect x="140" y="20" width="20" height="20" fill="black"/>
      <rect x="20" y="60" width="20" height="20" fill="black"/>
      <rect x="100" y="60" width="20" height="20" fill="black"/>
      <rect x="140" y="60" width="20" height="20" fill="black"/>
      <rect x="20" y="100" width="20" height="20" fill="black"/>
      <rect x="60" y="100" width="20" height="20" fill="black"/>
      <rect x="140" y="100" width="20" height="20" fill="black"/>
      <rect x="60" y="140" width="20" height="20" fill="black"/>
      <rect x="100" y="140" width="20" height="20" fill="black"/>
      <rect x="140" y="140" width="20" height="20" fill="black"/>
      <rect x="20" y="180" width="20" height="20" fill="black"/>
      <rect x="100" y="180" width="20" height="20" fill="black"/>
      <rect x="140" y="180" width="20" height="20" fill="black"/>
    </svg>
  `)}`);

  // Calculate totals
  const priceValue = parseInt(packageData.price.replace(/[^\d]/g, ''));
  const vatAmount = Math.round(priceValue * 0.1);
  const totalAmount = priceValue + vatAmount;
  const orderId = `ORD-${Date.now()}`;

  // Timer effect
  useEffect(() => {
    if (!open || paymentStatus !== 'waiting') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPaymentStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, paymentStatus]);

  // Simulate payment flow
  useEffect(() => {
    if (!open) return;

    // Simulate payment detection after random time
    const paymentTimer = setTimeout(() => {
      if (paymentStatus === 'waiting') {
        setPaymentStatus('processing');
        
        setTimeout(() => {
          // 90% success rate
          if (Math.random() > 0.1) {
            setPaymentStatus('success');
            setTimeout(() => {
              onSuccess(`TXN-${Date.now()}`);
            }, 2000);
          } else {
            setPaymentStatus('failed');
          }
        }, 3000);
      }
    }, Math.random() * 30000 + 10000); // Random between 10-40 seconds

    return () => clearTimeout(paymentTimer);
  }, [open, paymentStatus, onSuccess]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setPaymentStatus('waiting');
      setTimeLeft(15 * 60);
    }
  }, [open]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID copied to clipboard');
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
                      {orderId}
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
                    <img 
                      src={qrCode} 
                      alt="Payment QR Code" 
                      className="w-48 h-48"
                    />
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
