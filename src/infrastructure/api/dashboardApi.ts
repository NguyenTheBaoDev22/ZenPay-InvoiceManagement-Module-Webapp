import { AxiosError } from 'axios';
import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import {
  KPIResponse,
  InvoicesByDayResponse,
  RecentInvoicesResponse,
  QuotaStatusResponse,
  InvoiceResendResponse,
  DashboardKPIParams,
  InvoicesByDayParams,
  RecentInvoicesParams,
  QuotaStatusParams,
  ApiError,
} from '../../core/entities/dashboard';

// Helper function to handle API errors
const handleApiError = (error: AxiosError): ApiError => {
  if (error.response?.data) {
    const responseData = error.response.data as any;
    return {
      message: responseData.message || 'An error occurred',
      code: responseData.code || 'UNKNOWN_ERROR',
      status: error.response.status,
    };
  }
  
  if (error.request) {
    return {
      message: 'Network error - please check your connection',
      code: 'NETWORK_ERROR',
      status: 0,
    };
  }
  
  return {
    message: error.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

// Dashboard API Service Class
export class DashboardApiService {
  /**
   * Get KPI data for dashboard tiles
   */
  static async getKPIData(params: DashboardKPIParams): Promise<KPIResponse> {
    try {
      const response = await apiClient.get<KPIResponse>(API_ENDPOINTS.DASHBOARD.KPI, {
        params,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get invoices by day chart data
   */
  static async getInvoicesByDay(params: InvoicesByDayParams): Promise<InvoicesByDayResponse> {
    try {
      const response = await apiClient.get<InvoicesByDayResponse>(
        API_ENDPOINTS.DASHBOARD.CHARTS_INVOICES_BY_DAY,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get recent invoices list - calls ZenInvoice API directly
   */
  static async getRecentInvoices(params: RecentInvoicesParams): Promise<RecentInvoicesResponse> {
    try {
      // Call ZenInvoice API directly instead of dashboard API
      const response = await apiClient.get<RecentInvoicesResponse>(
        API_ENDPOINTS.INVOICE.LIST_BY_TAX_CODE_AND_BRANCH,
        {
          params: {
            taxCode: params.taxCode,
            merchantBranchId: params.merchantBranchId,
            pageIndex: 1,
            pageSize: params.limit || 5,
            sortBy: 'CreatedAt', // Use CreatedAt as per API spec
            sortDescending: true
          }
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get quota status information
   */
  static async getQuotaStatus(params: QuotaStatusParams): Promise<QuotaStatusResponse> {
    try {
      const response = await apiClient.get<QuotaStatusResponse>(
        API_ENDPOINTS.DASHBOARD.QUOTA_STATUS,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Resend an invoice
   */
  static async resendInvoice(invoiceId: string): Promise<InvoiceResendResponse> {
    try {
      const response = await apiClient.post<InvoiceResendResponse>(
        API_ENDPOINTS.DASHBOARD.RESEND_INVOICE(invoiceId)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Debug endpoint to test API connectivity
   */
  static async debug(): Promise<any> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.DEBUG);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }
}

// Export individual functions for easier usage
export const dashboardApi = {
  getKPIData: DashboardApiService.getKPIData,
  getInvoicesByDay: DashboardApiService.getInvoicesByDay,
  getRecentInvoices: DashboardApiService.getRecentInvoices,
  getQuotaStatus: DashboardApiService.getQuotaStatus,
  resendInvoice: DashboardApiService.resendInvoice,
  debug: DashboardApiService.debug,
};

export default dashboardApi;
