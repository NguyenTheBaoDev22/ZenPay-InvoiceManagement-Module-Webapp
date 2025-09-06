import { apiClient } from './client';

// Types for API requests and responses
export interface CreateMerchantInvoiceOrderRequest {
  taxCode: string;
}

export interface MerchantInvoiceOrderPaymentInfo {
  transactionId: string;
  qrCode: string;
  expirationInMinutes: number;
  bankAccountNumber: string;
  bankName: string;
  bankAccountHolder: string;
}

export interface MerchantInvoiceOrderResponse {
  orderId: string;
  orderCode: string;
  taxCode: string;
  totalInvoiceQuantity: number;
  remainingInvoiceQuantity: number;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  description: string;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  paymentInfo: MerchantInvoiceOrderPaymentInfo;
}

export interface MerchantInvoiceOrderStatusResponse {
  orderId: string;
  status: 'PENDING' | 'COMPLETED';
  statusDisplayName: string;
  updatedAt: string;
}

export interface MerchantInvoiceOrderListItem {
  id: string;
  taxCode: string;
  totalInvoiceQuantity: number;
  remainingInvoiceQuantity: number;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  status: 'PENDING' | 'COMPLETED';
  statusDisplayName: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetMerchantInvoiceOrderWithPaginationRequest {
  pageIndex?: number;
  pageSize?: number;
  taxCode?: string;
  status?: 'PENDING' | 'COMPLETED';
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface BaseResponse<T> {
  code: string;
  message: string;
  data: T;
  traceId?: string;
  timestamp: string;
}

// API functions
export const merchantInvoiceOrderApi = {
  /**
   * Tạo MerchantInvoiceOrder mới
   */
  async createMerchantInvoiceOrder(request: CreateMerchantInvoiceOrderRequest): Promise<BaseResponse<MerchantInvoiceOrderResponse>> {
    const response = await apiClient.post<BaseResponse<MerchantInvoiceOrderResponse>>(
      '/merchant-invoice-order', // ✅ Fixed URL
      request
    );
    return response.data;
  },

  /**
   * Lấy trạng thái của MerchantInvoiceOrder
   */
  async getMerchantInvoiceOrderStatus(orderId: string): Promise<BaseResponse<MerchantInvoiceOrderStatusResponse>> {
    console.log('🔍 [API] Getting MerchantInvoiceOrder status for:', orderId);
    const response = await apiClient.get<BaseResponse<MerchantInvoiceOrderStatusResponse>>(
      `/merchant-invoice-order/${orderId}/status` // ✅ Fixed URL
    );
    console.log('✅ [API] MerchantInvoiceOrder status response:', response.data);
    return response.data;
  },

  /**
   * Lấy danh sách MerchantInvoiceOrder có phân trang
   */
  async getMerchantInvoiceOrderWithPagination(
    request: GetMerchantInvoiceOrderWithPaginationRequest = {}
  ): Promise<BaseResponse<PaginatedResult<MerchantInvoiceOrderListItem>>> {
    console.log('🔍 [API] Getting MerchantInvoiceOrder list with params:', request);
    const params = new URLSearchParams();

    if (request.pageIndex) params.append('pageIndex', request.pageIndex.toString());
    if (request.pageSize) params.append('pageSize', request.pageSize.toString());
    if (request.taxCode) params.append('taxCode', request.taxCode);
    if (request.status) params.append('status', request.status);

    const response = await apiClient.get<BaseResponse<PaginatedResult<MerchantInvoiceOrderListItem>>>(
      `/merchant-invoice-order?${params.toString()}` // ✅ Fixed URL
    );
    console.log('✅ [API] MerchantInvoiceOrder list response:', response.data);
    return response.data;
  }
};

export default merchantInvoiceOrderApi;
