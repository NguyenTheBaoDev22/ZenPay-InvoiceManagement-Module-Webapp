export const API_ENDPOINTS = {
  INVOICE: {
    CREATE: '/zen-invoice/MobiFone/create-invoice',
    ISSUE: '/zen-invoice/MobiFone/issue-invoice', // Endpoint cho "Tạo và phát hành"
    LIST_BY_TAX_CODE_AND_BRANCH: '/zen-invoice/invoices/by-tax-code-and-branch', // API mới - fixed slugify
  },
  DASHBOARD: {
    KPI: '/invoice-dashboard/kpi',
    CHARTS_INVOICES_BY_DAY: '/invoice-dashboard/charts/invoices-by-day',
    RECENT_INVOICES: '/invoice-dashboard/recent-invoices',
    QUOTA_STATUS: '/invoice-dashboard/quota/status',
    RESEND_INVOICE: (invoiceId: string) => `/invoice-dashboard/invoices/${invoiceId}/resend`,
    DEBUG: '/invoice-dashboard/debug',
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
