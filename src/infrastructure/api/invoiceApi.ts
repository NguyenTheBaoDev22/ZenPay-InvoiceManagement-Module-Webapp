import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { CreateInvoicePayload, InvoiceApiResponse, InvoiceListRequest, InvoiceListResponse } from '../../core/entities/Invoice';

export const invoiceApi = {
  createInvoice: async (payload: CreateInvoicePayload): Promise<InvoiceApiResponse> => {
    const response = await apiClient.post<InvoiceApiResponse>(
      API_ENDPOINTS.INVOICE.CREATE,
      payload
    );
    return response.data;
  },

  issueInvoice: async (payload: CreateInvoicePayload): Promise<InvoiceApiResponse> => {
    const response = await apiClient.post<InvoiceApiResponse>(
      API_ENDPOINTS.INVOICE.ISSUE,
      payload
    );
    return response.data;
  },

  getInvoicesByTaxCodeAndBranch: async (params: InvoiceListRequest): Promise<InvoiceListResponse> => {
    const response = await apiClient.get<InvoiceListResponse>(
      API_ENDPOINTS.INVOICE.LIST_BY_TAX_CODE_AND_BRANCH,
      { params }
    );
    return response.data;
  },
};
