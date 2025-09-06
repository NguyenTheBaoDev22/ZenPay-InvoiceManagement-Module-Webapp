import { InvoiceRepository } from '../repositories/InvoiceRepository';
import { CreateInvoicePayload, InvoiceApiResponse } from '../entities/Invoice';

export class CreateInvoiceUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(payload: CreateInvoicePayload): Promise<InvoiceApiResponse> {
    try {
      // Validate payload
      this.validatePayload(payload);
      
      // Call repository
      const result = await this.invoiceRepository.createInvoice(payload);
      
      // Validate response
      if (!result.isSuccess) {
        throw new Error(result.message || 'Failed to create invoice');
      }
      
      return result;
    } catch (error) {
      console.error('CreateInvoiceUseCase error:', error);
      throw error;
    }
  }

  private validatePayload(payload: CreateInvoicePayload): void {
    if (!payload.username) {
      throw new Error('Username is required');
    }
    if (!payload.password) {
      throw new Error('Password is required');
    }
    if (!payload.taxCode) {
      throw new Error('Tax code is required');
    }
    if (!payload.invoiceRequest?.data?.length) {
      throw new Error('Invoice data is required');
    }
  }
}

export class IssueInvoiceUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(payload: CreateInvoicePayload): Promise<InvoiceApiResponse> {
    try {
      // Validate payload
      this.validatePayload(payload);
      
      // Call repository
      const result = await this.invoiceRepository.issueInvoice(payload);
      
      // Validate response
      if (!result.isSuccess) {
        throw new Error(result.message || 'Failed to issue invoice');
      }
      
      return result;
    } catch (error) {
      console.error('IssueInvoiceUseCase error:', error);
      throw error;
    }
  }

  private validatePayload(payload: CreateInvoicePayload): void {
    if (!payload.username) {
      throw new Error('Username is required');
    }
    if (!payload.password) {
      throw new Error('Password is required');
    }
    if (!payload.taxCode) {
      throw new Error('Tax code is required');
    }
    if (!payload.invoiceRequest?.data?.length) {
      throw new Error('Invoice data is required');
    }
  }
}
