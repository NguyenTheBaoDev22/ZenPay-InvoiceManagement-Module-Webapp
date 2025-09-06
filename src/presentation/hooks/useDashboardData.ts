import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '../../infrastructure/api/dashboardApi';
import {
  DashboardData,
  DashboardLoadingState,
  DashboardErrorState,
  UseDashboardDataReturn,
  ApiError,
} from '../../core/entities/dashboard';

// Default merchant branch ID and tax code - should be passed as parameter in real app
const DEFAULT_MERCHANT_BRANCH_ID = '123e4567-e89b-12d3-a456-426614174000';
const DEFAULT_TAX_CODE = '0123456789';

export const useDashboardData = (
  merchantBranchId: string = DEFAULT_MERCHANT_BRANCH_ID,
  taxCode: string = DEFAULT_TAX_CODE
): UseDashboardDataReturn => {
  // State management
  const [data, setData] = useState<DashboardData>({
    kpi: null,
    charts: null,
    recentInvoices: null,
    quotaStatus: null,
  });

  const [loading, setLoading] = useState<DashboardLoadingState>({
    kpi: false,
    charts: false,
    recentInvoices: false,
    quotaStatus: false,
    resendingInvoice: null,
  });

  const [error, setError] = useState<DashboardErrorState>({
    kpi: null,
    charts: null,
    recentInvoices: null,
    quotaStatus: null,
    resendInvoice: null,
  });

  // Helper function to handle errors
  const handleError = (section: keyof DashboardErrorState, apiError: ApiError) => {
    setError(prev => ({
      ...prev,
      [section]: apiError.message,
    }));
    console.error(`Dashboard ${section} error:`, apiError);
  };

  // Fetch KPI data
  const fetchKPIData = useCallback(async () => {
    setLoading(prev => ({ ...prev, kpi: true }));
    setError(prev => ({ ...prev, kpi: null }));
    
    try {
      const response = await dashboardApi.getKPIData({ merchantBranchId });
      setData(prev => ({ ...prev, kpi: response.data }));
    } catch (apiError) {
      handleError('kpi', apiError as ApiError);
    } finally {
      setLoading(prev => ({ ...prev, kpi: false }));
    }
  }, [merchantBranchId]);

  // Fetch charts data
  const fetchChartsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, charts: true }));
    setError(prev => ({ ...prev, charts: null }));
    
    try {
      const response = await dashboardApi.getInvoicesByDay({ 
        merchantBranchId,
        days: 7 
      });
      setData(prev => ({ ...prev, charts: response.data }));
    } catch (apiError) {
      handleError('charts', apiError as ApiError);
    } finally {
      setLoading(prev => ({ ...prev, charts: false }));
    }
  }, [merchantBranchId]);

  // Fetch recent invoices
  const fetchRecentInvoices = useCallback(async () => {
    setLoading(prev => ({ ...prev, recentInvoices: true }));
    setError(prev => ({ ...prev, recentInvoices: null }));

    try {
      const response = await dashboardApi.getRecentInvoices({
        merchantBranchId,
        taxCode,
        limit: 5
      });
      setData(prev => ({ ...prev, recentInvoices: response.data }));
    } catch (apiError) {
      handleError('recentInvoices', apiError as ApiError);
    } finally {
      setLoading(prev => ({ ...prev, recentInvoices: false }));
    }
  }, [merchantBranchId, taxCode]);

  // Fetch quota status
  const fetchQuotaStatus = useCallback(async () => {
    setLoading(prev => ({ ...prev, quotaStatus: true }));
    setError(prev => ({ ...prev, quotaStatus: null }));

    try {
      const response = await dashboardApi.getQuotaStatus({ merchantBranchId, taxCode });
      setData(prev => ({ ...prev, quotaStatus: response.data }));
    } catch (apiError) {
      handleError('quotaStatus', apiError as ApiError);
    } finally {
      setLoading(prev => ({ ...prev, quotaStatus: false }));
    }
  }, [merchantBranchId, taxCode]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchKPIData(),
      fetchChartsData(),
      fetchRecentInvoices(),
      fetchQuotaStatus(),
    ]);
  }, [fetchKPIData, fetchChartsData, fetchRecentInvoices, fetchQuotaStatus]);

  // Resend invoice function
  const resendInvoice = useCallback(async (invoiceId: string): Promise<boolean> => {
    setLoading(prev => ({ ...prev, resendingInvoice: invoiceId }));
    setError(prev => ({ ...prev, resendInvoice: null }));
    
    try {
      const response = await dashboardApi.resendInvoice(invoiceId);
      
      // Refresh recent invoices after successful resend
      await fetchRecentInvoices();
      
      return response.isSuccess;
    } catch (apiError) {
      handleError('resendInvoice', apiError as ApiError);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, resendingInvoice: null }));
    }
  }, [fetchRecentInvoices]);

  // Initial data fetch on mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    data,
    loading,
    error,
    refetch: {
      kpi: fetchKPIData,
      charts: fetchChartsData,
      recentInvoices: fetchRecentInvoices,
      quotaStatus: fetchQuotaStatus,
      all: fetchAllData,
    },
    resendInvoice,
  };
};
