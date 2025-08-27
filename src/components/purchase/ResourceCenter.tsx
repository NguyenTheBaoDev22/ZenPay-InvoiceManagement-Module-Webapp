import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Shield, 
  Check, 
  Star,
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface PricingCardProps {
  provider: string;
  providerLogo: string;
  packageName: string;
  price: string;
  originalPrice?: string;
  validity: string;
  features: string[];
  recommended?: boolean;
  popular?: boolean;
  onSelect: () => void;
}

function PricingCard({ 
  provider, 
  providerLogo, 
  packageName, 
  price, 
  originalPrice,
  validity, 
  features, 
  recommended = false,
  popular = false,
  onSelect 
}: PricingCardProps) {
  return (
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${
      recommended ? 'border-primary shadow-sm' : ''
    } ${popular ? 'scale-105' : ''}`}>
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      {/* Recommended Badge */}
      {recommended && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
            <Star className="h-4 w-4 fill-current" />
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium">{providerLogo}</span>
            </div>
            <div>
              <h4 className="font-semibold text-lg">{provider}</h4>
              <p className="text-base text-muted-foreground">{packageName}</p>
            </div>
          </div>
          
          {recommended && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">AI</span>
              </div>
              <span>Recommended</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{price}</span>
            {originalPrice && (
              <span className="text-base text-muted-foreground line-through">{originalPrice}</span>
            )}
          </div>
          <p className="text-base text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {validity}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-base">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            onClick={onSelect}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            Choose Package
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ResourceCenterProps {
  onSelectPackage: (packageData: any) => void;
}

export function ResourceCenter({ onSelectPackage }: ResourceCenterProps) {
  const [activeTab, setActiveTab] = useState('quotas');

  const invoicePackages = [
    {
      provider: 'Viettel',
      providerLogo: 'VT',
      packageName: '500 Invoices',
      price: '350,000 VND',
      validity: 'Valid for 12 months',
      features: [
        '500 electronic invoices',
        'Digital signature included',
        'Email delivery',
        'PDF & XML export',
        '24/7 support'
      ],
      recommended: true
    },
    {
      provider: 'FPT',
      providerLogo: 'FPT',
      packageName: '1,000 Invoices',
      price: '650,000 VND',
      originalPrice: '700,000 VND',
      validity: 'Valid for 12 months',
      features: [
        '1,000 electronic invoices',
        'Advanced reporting',
        'API integration',
        'Bulk operations',
        'Priority support'
      ],
      popular: true
    },
    {
      provider: 'VNPT',
      providerLogo: 'VNPT',
      packageName: '2,500 Invoices',
      price: '1,450,000 VND',
      validity: 'Valid for 12 months',
      features: [
        '2,500 electronic invoices',
        'Enterprise features',
        'Custom templates',
        'Webhook integration',
        'Dedicated support'
      ]
    }
  ];

  const certificatePackages = [
    {
      provider: 'CA Vietnam',
      providerLogo: 'CA',
      packageName: 'USB Token',
      price: '800,000 VND',
      validity: 'Valid for 1 year',
      features: [
        'Hardware security token',
        'Personal certificate',
        'Digital signature',
        'Government approved',
        'Setup assistance'
      ]
    },
    {
      provider: 'VNCA',
      providerLogo: 'VNCA',
      packageName: 'HSM Certificate',
      price: '2,400,000 VND',
      validity: 'Valid for 3 years',
      features: [
        'Cloud HSM security',
        'Enterprise certificate',
        'High availability',
        'Automatic backup',
        'Premium support'
      ],
      recommended: true,
      popular: true
    }
  ];

  const handleSelectPackage = (pkg: any, type: 'quota' | 'certificate') => {
    onSelectPackage({
      ...pkg,
      type,
      id: `${type}-${pkg.provider.toLowerCase()}`
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-semibold">Resource Center</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Purchase additional quotas and certificates to keep your business running smoothly
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto h-12">
          <TabsTrigger value="quotas" className="flex items-center gap-2 text-base">
            <ShoppingCart className="h-5 w-5" />
            Buy Invoice Quota
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5" />
            Buy/Renew Certificate
          </TabsTrigger>
        </TabsList>

        {/* Invoice Quota Tab */}
        <TabsContent value="quotas" className="space-y-8 mt-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-3">Invoice Quota Packages</h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Choose the right package based on your monthly invoice volume
            </p>
          </div>

          {/* AI Recommendation */}
          <Card className="bg-blue-50/50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">AI</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Boo Boo's Recommendation
                  </p>
                  <p className="text-xs text-blue-700">
                    Based on your last 3 months of usage, the 500 invoice package is the most cost-effective choice for your business.
                  </p>
                </div>
                <Zap className="h-4 w-4 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {invoicePackages.map((pkg, index) => (
              <PricingCard
                key={index}
                {...pkg}
                onSelect={() => handleSelectPackage(pkg, 'quota')}
              />
            ))}
          </div>
        </TabsContent>

        {/* Digital Certificate Tab */}
        <TabsContent value="certificates" className="space-y-8 mt-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-3">Digital Certificates</h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Secure digital certificates for signing your electronic invoices
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {certificatePackages.map((pkg, index) => (
              <PricingCard
                key={index}
                {...pkg}
                onSelect={() => handleSelectPackage(pkg, 'certificate')}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
