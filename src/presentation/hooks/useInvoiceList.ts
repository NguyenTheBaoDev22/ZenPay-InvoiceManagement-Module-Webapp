import { useQuery } from '@tanstack/react-query';
import { invoiceApi } from '../../infrastructure/api/invoiceApi';
import { InvoiceListRequest, InvoiceListResponse } from '../../core/entities/Invoice';

export const useInvoiceList = (params: InvoiceListRequest) => {
  return useQuery({
    queryKey: ['invoices', 'list', params],
    queryFn: () => invoiceApi.getInvoicesByTaxCodeAndBranch(params),
    enabled: !!(params.taxCode && params.merchantBranchId),
    staleTime: 30000, // 30 seconds
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      action: 'get-invoice-list',
      module: 'invoice-list',
    },
  });
};

// Helper hook for status mapping
export const useInvoiceStatusMapping = () => {
  const mapStatus = (status: number | string): 'paid' | 'pending' | 'sent' | 'draft' | 'failed' | 'overdue' => {
    // Handle number status codes
    if (typeof status === 'number') {
      switch (status) {
        case 0:
          return 'draft';
        case 1:
          return 'pending';
        case 2:
          return 'sent';
        case 3:
          return 'paid';
        case 4:
          return 'failed';
        case 5:
          return 'overdue';
        default:
          return 'draft';
      }
    }

    // Handle string status (legacy)
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'paid';
      case 'pending':
      case 'processing':
        return 'pending';
      case 'sent':
      case 'issued':
        return 'sent';
      case 'draft':
      case 'created':
        return 'draft';
      case 'failed':
      case 'error':
        return 'failed';
      case 'overdue':
      case 'expired':
        return 'overdue';
      default:
        return 'draft';
    }
  };

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return { mapStatus, formatCurrency, formatDate };
};
