import React from 'react';
import { FileTextIcon } from 'lucide-react';
import { useInvoiceWizard } from '../../../hooks/useInvoiceWizard';

export const OrderSourceStep: React.FC = () => {
  const { orderSource, setOrderSource } = useInvoiceWizard();

  const sources = [
    { 
      id: 'manual' as const, 
      name: 'Manual Entry', 
      description: 'Create invoice from scratch',
      enabled: true 
    },
    { 
      id: 'csv' as const, 
      name: 'CSV Import', 
      description: 'Upload customer data from CSV file',
      enabled: false 
    },
    { 
      id: 'api' as const, 
      name: 'API Integration', 
      description: 'Pull data from connected system',
      enabled: false 
    },
    { 
      id: 'template' as const, 
      name: 'From Template', 
      description: 'Use existing invoice template',
      enabled: false 
    }
  ];

  // Auto-select manual entry on mount using modern useEffect pattern
  React.useEffect(() => {
    if (orderSource !== 'manual') {
      setOrderSource('manual');
    }
  }, []); // Empty dependency array since we only want this to run once

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileTextIcon className="h-12 w-12 text-[#FF6A3D] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#1F2937]">Choose Your Data Source</h3>
        <p className="text-[#6B7280] mt-2">Select how you'd like to import or create invoice data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((source) => (
          <div
            key={source.id}
            onClick={() => source.enabled && setOrderSource(source.id)}
            className={`
              p-4 border-2 rounded-lg transition-all relative
              ${source.enabled 
                ? 'cursor-pointer hover:border-[#FF6A3D]/50' 
                : 'cursor-not-allowed opacity-50'
              }
              ${orderSource === source.id && source.enabled
                ? 'border-[#FF6A3D] bg-[#FF6A3D]/5' 
                : 'border-[#E5E7EB]'
              }
            `}
          >
            {!source.enabled && (
              <div className="absolute inset-0 bg-gray-100/50 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded">
                  Coming Soon
                </span>
              </div>
            )}
            <h4 className={`font-medium ${source.enabled ? 'text-[#1F2937]' : 'text-[#9CA3AF]'}`}>
              {source.name}
            </h4>
            <p className={`text-sm mt-1 ${source.enabled ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              {source.description}
            </p>
          </div>
        ))}
      </div>

      {orderSource === 'manual' && (
        <div className="mt-6 p-4 bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#0EA5E9] rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-medium text-[#1F2937] mb-1">Manual Entry Selected</h4>
              <p className="text-sm text-[#6B7280]">
                You'll be able to enter customer information and invoice items manually in the next step.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
