import React from 'react';
import { PenToolIcon, CheckCircleIcon, ClockIcon, SendIcon } from 'lucide-react';
import { ZenButton } from '../../../../components/zenshop/ZenButton';
import { useInvoiceWizard } from '../../../hooks/useInvoiceWizard';

interface SignIssueStepProps {
  onComplete: () => void;
}

export const SignIssueStep: React.FC<SignIssueStepProps> = ({ onComplete }) => {
  const { 
    issueOption, 
    setIssueOption, 
    submitInvoice, 
    isSubmitting, 
    error,
    getFinalAmount 
  } = useInvoiceWizard();

  const handleSubmit = React.useCallback(async () => {
    try {
      await submitInvoice();
      onComplete();
    } catch (error) {
      console.error('Failed to submit invoice:', error);
      // Error is already handled by the mutation hooks with toast notifications
    }
  }, [submitInvoice, onComplete]);

  const issueOptions = [
    {
      id: 'create' as const,
      title: 'Tạo',
      description: 'Lưu hóa đơn dưới dạng nháp để xem xét và gửi thủ công',
      icon: <ClockIcon className="h-5 w-5" />,
      color: 'text-[#0EA5E9]',
      bgColor: 'bg-[#0EA5E9]/5',
      borderColor: 'border-[#0EA5E9]/20'
    },
    {
      id: 'create_and_issue' as const,
      title: 'Tạo và phát hành',
      description: 'Gửi hóa đơn ngay lập tức cho khách hàng',
      icon: <SendIcon className="h-5 w-5" />,
      color: 'text-[#FF6A3D]',
      bgColor: 'bg-[#FF6A3D]/5',
      borderColor: 'border-[#FF6A3D]/20'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <PenToolIcon className="h-12 w-12 text-[#FF6A3D] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#1F2937]">Sign & Issue Invoice</h3>
        <p className="text-[#6B7280] mt-2">Apply digital signature and choose issuing options</p>
      </div>

      {/* Digital Signature Status */}
      <div className="bg-[#F8FAFC] p-4 rounded-lg">
        <h4 className="font-medium text-[#1F2937] mb-4">Digital Signature</h4>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#22C55E]/20">
          <CheckCircleIcon className="h-5 w-5 text-[#22C55E] flex-shrink-0" />
          <div>
            <p className="font-medium text-[#1F2937]">Certificate Connected</p>
            <p className="text-sm text-[#6B7280]">ZenShop Digital Certificate (Valid until 2025-12-31)</p>
          </div>
        </div>
      </div>

      {/* Issue Options */}
      <div>
        <h4 className="font-medium text-[#1F2937] mb-4">Issue Options</h4>
        <div className="space-y-3">
          {issueOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setIssueOption(option.id)}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-opacity-50
                ${issueOption === option.id 
                  ? `border-[#FF6A3D] ${option.bgColor}` 
                  : 'border-[#E5E7EB] hover:border-[#FF6A3D]/30'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`${option.color} mt-0.5`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-[#1F2937] mb-1">{option.title}</h5>
                  <p className="text-sm text-[#6B7280]">{option.description}</p>
                </div>
                {issueOption === option.id && (
                  <CheckCircleIcon className="h-5 w-5 text-[#FF6A3D] flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="bg-[#F8FAFC] p-4 rounded-lg">
        <h4 className="font-medium text-[#1F2937] mb-3">Invoice Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Total Amount:</span>
            <span className="font-medium">{getFinalAmount().toLocaleString('vi-VN')} VND</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Action:</span>
            <span className="font-medium">
              {issueOptions.find(opt => opt.id === issueOption)?.title}
            </span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-[#FEF2F2] border border-[#EF4444]/20 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#EF4444] rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-medium text-[#EF4444] mb-1">Error</h4>
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <ZenButton
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-4 w-4" />
              Complete
            </>
          )}
        </ZenButton>
      </div>

      {/* Processing Info */}
      {isSubmitting && (
        <div className="bg-[#F0F9FF] border border-[#0EA5E9]/20 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#0EA5E9] rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
            <div>
              <h4 className="font-medium text-[#1F2937] mb-1">Processing Invoice</h4>
              <p className="text-sm text-[#6B7280]">
                {issueOption === 'create' 
                  ? 'Creating invoice draft...' 
                  : 'Creating and issuing invoice...'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
