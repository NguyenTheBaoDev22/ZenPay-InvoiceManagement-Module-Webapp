// Dashboard API Types and Interfaces

// Base API Response wrapper
export interface BaseApiResponse<T> {
  code: string;
  message: string;
  data: T;
  traceId?: string;
  timestamp: string;
  isSuccess: boolean;
  errors?: Record<string, any>;
}

// KPI Data Types
export interface KPIChangeData {
  value: string;
  type: 'increase' | 'decrease' | 'neutral';
}

export interface KPIItemData {
  value: string;
  change: KPIChangeData;
}

export interface KPIData {
  invoicesToday: KPIItemData;
  successRate: KPIItemData;
  quotaRemaining: KPIItemData;
  certificateExpiry: KPIItemData;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
}

export type InvoicesByDayData = ChartDataPoint[];

// Recent Invoices Types
export interface RecentInvoice {
  id: string;
  customer: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  canResend: boolean;
  canDownload: boolean;
}

export type RecentInvoicesData = RecentInvoice[];

// Quota Status Types
export interface QuotaStatusData {
  quotaUsed: number;
  quotaTotal: number;
  quotaPercentage: number;
  quotaRemaining: number;
  isQuotaLow: boolean;
  currentPeriod: string;
  nextRenewal: string;
}

// Invoice Resend Types
export interface InvoiceResendData {
  invoiceId: string;
  status: string;
  message: string;
  transmissionId: string;
  timestamp: string;
}

// API Request Parameters
export interface DashboardKPIParams {
  merchantBranchId: string;
  date?: string;
}

export interface InvoicesByDayParams {
  merchantBranchId: string;
  days?: number;
}

export interface RecentInvoicesParams {
  merchantBranchId: string;
  taxCode: string;
  limit?: number;
}

export interface QuotaStatusParams {
  merchantBranchId: string;
  taxCode: string;
}

// API Response Types
export type KPIResponse = BaseApiResponse<KPIData>;
export type InvoicesByDayResponse = BaseApiResponse<InvoicesByDayData>;
export type RecentInvoicesResponse = BaseApiResponse<RecentInvoicesData>;
export type QuotaStatusResponse = BaseApiResponse<QuotaStatusData>;
export type InvoiceResendResponse = BaseApiResponse<InvoiceResendData>;

// Component State Types
export interface DashboardLoadingState {
  kpi: boolean;
  charts: boolean;
  recentInvoices: boolean;
  quotaStatus: boolean;
  resendingInvoice: string | null; // Invoice ID being resent
}

export interface DashboardErrorState {
  kpi: string | null;
  charts: string | null;
  recentInvoices: string | null;
  quotaStatus: string | null;
  resendInvoice: string | null;
}

export interface DashboardData {
  kpi: KPIData | null;
  charts: InvoicesByDayData | null;
  recentInvoices: RecentInvoicesData | null;
  quotaStatus: QuotaStatusData | null;
}

// API Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Hook Return Types
export interface UseDashboardDataReturn {
  data: DashboardData;
  loading: DashboardLoadingState;
  error: DashboardErrorState;
  refetch: {
    kpi: () => Promise<void>;
    charts: () => Promise<void>;
    recentInvoices: () => Promise<void>;
    quotaStatus: () => Promise<void>;
    all: () => Promise<void>;
  };
  resendInvoice: (invoiceId: string) => Promise<boolean>;
}
