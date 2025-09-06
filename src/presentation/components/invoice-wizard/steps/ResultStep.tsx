import React from 'react';
import { CheckCircleIcon, EyeIcon, DownloadIcon, RefreshCwIcon } from 'lucide-react';
import { ZenButton } from '../../../../components/zenshop/ZenButton';
import { ZenStatusChip } from '../../../../components/zenshop/ZenStatusChip';
import { useInvoiceWizard } from '../../../hooks/useInvoiceWizard';

interface ResultStepProps {
  onComplete: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({ onComplete }) => {
  const { result, reset, issueOption } = useInvoiceWizard();

  const getStatusChipStatus = React.useCallback((status: string) => {
    switch (status?.toLowerCase()) {
      case 'chờ ký':
        return 'pending' as const;
      case 'đã ký':
        return 'sent' as const;
      case 'đã gửi':
        return 'sent' as const;
      case 'hoàn thành':
        return 'completed' as const;
      default:
        return 'draft' as const;
    }
  }, []);

  const handleCreateAnother = React.useCallback(() => {
    reset();
    onComplete();
  }, [reset, onComplete]);

  if (!result) {
    return (
      <div className="space-y-6 text-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="h-8 w-8 text-[#EF4444]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1F2937]">No Result Available</h3>
          <p className="text-[#6B7280] mt-2">Something went wrong. Please try again.</p>
        </div>
        
        <div className="flex gap-3 justify-center">
          <ZenButton variant="secondary" onClick={onComplete}>
            Go Back
          </ZenButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="h-8 w-8 text-[#22C55E]" />
        </div>
        <h3 className="text-lg font-semibold text-[#1F2937]">
          {issueOption === 'create' ? 'Invoice Created Successfully!' : 'Invoice Created & Issued Successfully!'}
        </h3>
        <p className="text-[#6B7280] mt-2">
          {issueOption === 'create' 
            ? 'Your invoice has been created and saved as draft' 
            : 'Your invoice has been processed and issued'
          }
        </p>
      </div>

      {/* Invoice Details */}
      <div className="bg-[#F8FAFC] p-6 rounded-lg">
        <div className="text-left space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280]">Invoice Number:</span>
            <span className="font-medium text-[#1F2937] font-mono">
              {result.invoiceNumber || 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280]">Status:</span>
            <ZenStatusChip 
              status={getStatusChipStatus(result.status || '')} 
              size="sm" 
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280]">Amount:</span>
            <span className="font-medium text-[#1F2937]">
              {result.amount?.toLocaleString('vi-VN') || '0'} VND
            </span>
          </div>

          {result.response?.data?.data?.[0]?.data && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Invoice ID:</span>
                <span className="font-medium text-[#1F2937] font-mono text-sm">
                  {result.response.data.data[0].data.id}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Created At:</span>
                <span className="font-medium text-[#1F2937]">
                  {new Date(result.response.data.data[0].data.tdlap).toLocaleString('vi-VN')}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Success Message Details */}
      {result.response?.message && (
        <div className="bg-[#F0F9FF] border border-[#0EA5E9]/20 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#0EA5E9] rounded-full mt-2 flex-shrink-0"></div>
            <div className="text-left">
              <h4 className="font-medium text-[#1F2937] mb-1">System Response</h4>
              <p className="text-sm text-[#6B7280]">{result.response.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        <ZenButton variant="secondary" className="gap-2">
          <EyeIcon className="h-4 w-4" />
          View Invoice
        </ZenButton>
        
        <ZenButton variant="secondary" className="gap-2">
          <DownloadIcon className="h-4 w-4" />
          Download PDF
        </ZenButton>
        
        <ZenButton onClick={handleCreateAnother} className="gap-2">
          <RefreshCwIcon className="h-4 w-4" />
          Create Another
        </ZenButton>
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && result.response && (
        <details className="text-left">
          <summary className="cursor-pointer text-sm text-[#6B7280] hover:text-[#1F2937]">
            Debug: View Full Response
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(result.response, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};
