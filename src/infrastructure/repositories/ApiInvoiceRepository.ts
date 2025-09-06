import { InvoiceRepository } from '../../core/repositories/InvoiceRepository';
import { CreateInvoicePayload, InvoiceApiResponse } from '../../core/entities/Invoice';
import { invoiceApi } from '../api/invoiceApi';

export class ApiInvoiceRepository implements InvoiceRepository {
  async createInvoice(payload: CreateInvoicePayload): Promise<InvoiceApiResponse> {
    try {
      return await invoiceApi.createInvoice(payload);
    } catch (error) {
      console.error('ApiInvoiceRepository.createInvoice error:', error);
      throw error;
    }
  }

  async issueInvoice(payload: CreateInvoicePayload): Promise<InvoiceApiResponse> {
    try {
      return await invoiceApi.issueInvoice(payload);
    } catch (error) {
      console.error('ApiInvoiceRepository.issueInvoice error:', error);
      throw error;
    }
  }
}
