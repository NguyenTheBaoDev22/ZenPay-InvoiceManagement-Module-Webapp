import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { 
  merchantInvoiceOrderApi, 
  CreateMerchantInvoiceOrderRequest,
  GetMerchantInvoiceOrderWithPaginationRequest 
} from '../../infrastructure/api/merchantInvoiceOrderApi';

/**
 * Hook để tạo MerchantInvoiceOrder
 */
export const useCreateMerchantInvoiceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateMerchantInvoiceOrderRequest) => 
      merchantInvoiceOrderApi.createMerchantInvoiceOrder(request),
    onSuccess: (data) => {
      console.log('✅ MerchantInvoiceOrder created successfully:', data);
      toast.success('Đơn hàng đã được tạo thành công!', {
        description: `Mã đơn hàng: ${data.data?.orderCode || 'N/A'}`,
      });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['merchantInvoiceOrders'] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to create MerchantInvoiceOrder:', error);

      // Handle specific error types
      if (error?.response?.status === 429) {
        toast.error('Server đang quá tải', {
          description: 'Vui lòng thử lại sau ít phút',
        });
      } else if (error?.code === 'ERR_NETWORK') {
        toast.error('Lỗi kết nối mạng', {
          description: 'Kiểm tra kết nối internet và thử lại',
        });
      } else {
        toast.error('Không thể tạo đơn hàng', {
          description: error.message || 'Có lỗi xảy ra khi tạo đơn hàng',
        });
      }
    },
    meta: {
      action: 'create-merchant-invoice-order',
      module: 'merchant-invoice-order',
    },
  });
};

/**
 * Hook để lấy trạng thái MerchantInvoiceOrder với polling
 */
export const useMerchantInvoiceOrderStatus = (
  orderId: string | null,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
    onStatusChange?: (status: 'PENDING' | 'COMPLETED') => void;
  }
) => {
  const query = useQuery({
    queryKey: ['merchantInvoiceOrderStatus', orderId],
    queryFn: () => {
      if (!orderId) throw new Error('Order ID is required');
      return merchantInvoiceOrderApi.getMerchantInvoiceOrderStatus(orderId);
    },
    enabled: !!orderId && (options?.enabled !== false), // ✅ Re-enable with fixed URL
    staleTime: 2000, // ✅ 2 seconds stale time
    cacheTime: 5 * 60 * 1000, // ✅ 5 minutes cache
    refetchOnWindowFocus: false, // ❌ STOP window focus refetch
    refetchOnReconnect: false, // ❌ STOP network reconnect refetch
    refetchInterval: (data) => {
      // ✅ Stop polling when completed (status = 2)
      if (data?.data?.status === 2) return false;
      return options?.refetchInterval || 10000; // Poll every 10 seconds (reduced from 3)
    },
    refetchIntervalInBackground: false, // ❌ STOP background polling
    onError: (error: Error) => {
      console.error('❌ Failed to get MerchantInvoiceOrder status:', error);
    },
    meta: {
      action: 'get-merchant-invoice-order-status',
      module: 'merchant-invoice-order',
    },
  });

  return query;
};

/**
 * Hook để lấy danh sách MerchantInvoiceOrder có phân trang
 */
export const useMerchantInvoiceOrderList = (
  request: GetMerchantInvoiceOrderWithPaginationRequest = {},
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['merchantInvoiceOrders', request],
    queryFn: () => merchantInvoiceOrderApi.getMerchantInvoiceOrderWithPagination(request),
    enabled: options?.enabled !== false, // ✅ Re-enable with fixed URL
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes (increased from 30s)
    cacheTime: 10 * 60 * 1000, // ✅ 10 minutes cache
    refetchOnWindowFocus: false, // ❌ STOP window focus refetch
    refetchOnReconnect: false, // ❌ STOP network reconnect refetch
    refetchInterval: false, // ❌ STOP interval refetch
    refetchIntervalInBackground: false, // ❌ STOP background refetch
    onError: (error: any) => {
      console.error('❌ Failed to get MerchantInvoiceOrder list:', error);

      // Don't show toast for API unavailable
      if (error?.response?.status !== 404 && error?.code !== 'ERR_NETWORK') {
        toast.error('Không thể tải danh sách đơn hàng', {
          description: error.message || 'Có lỗi xảy ra khi tải danh sách',
        });
      }
    },
    meta: {
      action: 'get-merchant-invoice-order-list',
      module: 'merchant-invoice-order',
    },
  });
};

/**
 * Hook để tạo đơn hàng và theo dõi trạng thái thanh toán
 */
export const useCreateAndTrackOrder = () => {
  const createMutation = useCreateMerchantInvoiceOrder();

  // ✅ Memoize function to prevent infinite re-renders
  const createAndTrack = useCallback(async (
    request: CreateMerchantInvoiceOrderRequest,
    onOrderCreated?: (orderId: string, paymentInfo: any) => void,
    onPaymentCompleted?: (orderId: string) => void,
    onPaymentFailed?: (orderId: string) => void
  ) => {
    try {
      // Tạo đơn hàng
      const result = await createMutation.mutateAsync(request);

      if (result.code === '00' && result.data) {
        const { orderId, paymentInfo } = result.data;

        // Callback khi đơn hàng được tạo thành công
        if (onOrderCreated) {
          onOrderCreated(orderId, paymentInfo);
        }

        return {
          success: true,
          orderId,
          paymentInfo,
          data: result.data
        };
      } else {
        throw new Error(result.message || 'Không thể tạo đơn hàng');
      }
    } catch (error) {
      console.error('❌ Error in createAndTrack:', error);
      throw error;
    }
  }, [createMutation.mutateAsync]); // ✅ Stable dependency

  return {
    createAndTrack,
    isLoading: createMutation.isPending,
    error: createMutation.error,
  };
};
