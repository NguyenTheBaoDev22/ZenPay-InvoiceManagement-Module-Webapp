import { CreateInvoicePayload, InvoiceApiResponse } from '../entities/Invoice';

export interface InvoiceRepository {
  createInvoice(payload: CreateInvoicePayload): Promise<InvoiceApiResponse>;
  issueInvoice(payload: CreateInvoicePayload): Promise<InvoiceApiResponse>;
}

export const INVOICE_REPOSITORY_TOKEN = Symbol('InvoiceRepository');
