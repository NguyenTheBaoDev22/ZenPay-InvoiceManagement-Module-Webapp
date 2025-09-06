import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateInvoiceUseCase, IssueInvoiceUseCase } from '../../core/usecases/CreateInvoiceUseCase';
import { ApiInvoiceRepository } from '../../infrastructure/repositories/ApiInvoiceRepository';
import { CreateInvoicePayload, InvoiceApiResponse } from '../../core/entities/Invoice';

// Create repository instance
const invoiceRepository = new ApiInvoiceRepository();

// Create use case instances
const createInvoiceUseCase = new CreateInvoiceUseCase(invoiceRepository);
const issueInvoiceUseCase = new IssueInvoiceUseCase(invoiceRepository);

export const useCreateInvoice = () => {
  return useMutation({
    mutationFn: (payload: CreateInvoicePayload) => createInvoiceUseCase.execute(payload),
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: (data: InvoiceApiResponse) => {
      console.log('✅ Invoice created successfully:', data);
      toast.success('Hóa đơn đã được tạo thành công!', {
        description: `Số hóa đơn: ${data.data?.data?.[0]?.data?.shdon || 'N/A'}`,
      });
    },
    onError: (error: Error) => {
      console.error('❌ Failed to create invoice:', error);
      toast.error('Không thể tạo hóa đơn', {
        description: error.message || 'Có lỗi xảy ra khi tạo hóa đơn',
      });
    },
    meta: {
      action: 'create-invoice',
      module: 'invoice-wizard',
    },
  });
};

export const useIssueInvoice = () => {
  return useMutation({
    mutationFn: (payload: CreateInvoicePayload) => issueInvoiceUseCase.execute(payload),
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: (data: InvoiceApiResponse) => {
      console.log('✅ Invoice issued successfully:', data);
      toast.success('Hóa đơn đã được tạo và phát hành thành công!', {
        description: `Số hóa đơn: ${data.data?.data?.[0]?.data?.shdon || 'N/A'}`,
      });
    },
    onError: (error: Error) => {
      console.error('❌ Failed to issue invoice:', error);
      toast.error('Không thể tạo và phát hành hóa đơn', {
        description: error.message || 'Có lỗi xảy ra khi tạo và phát hành hóa đơn',
      });
    },
    meta: {
      action: 'issue-invoice',
      module: 'invoice-wizard',
    },
  });
};
