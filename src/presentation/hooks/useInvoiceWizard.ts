import { useInvoiceWizardStore } from '../stores/invoiceWizardStore';
import { useCreateInvoice, useIssueInvoice } from './useCreateInvoice';
import { CreateInvoicePayload } from '../../core/entities/Invoice';

export const useInvoiceWizard = () => {
  const store = useInvoiceWizardStore();
  const createInvoiceMutation = useCreateInvoice();
  const issueInvoiceMutation = useIssueInvoice();

  const buildInvoicePayload = (): CreateInvoicePayload => {
    const { customer, items, invoiceInfo } = store;
    
    // Calculate totals
    const totalAmount = store.getTotalAmount();
    const totalTax = store.getTotalTax();
    const finalAmount = store.getFinalAmount();
    
    // Convert number to Vietnamese text (simplified)
    const numberToVietnameseText = (num: number): string => {
      // This is a simplified version - in production, use a proper library
      return `${num.toLocaleString('vi-VN')} đồng.`;
    };

    return {
      username: "trungquocnguy@gmail.com", // Fixed as requested
      password: "zZ53wYR!Lu", // Fixed as requested
      taxCode: "0123456789", // Fixed as requested
      invoiceRequest: {
        editmode: 1,
        data: [
          {
            cctbao_id: "34c2f34b-10f5-43d7-b6e4-3cd3480304b6", // Fixed ID
            nlap: invoiceInfo.nlap,
            khieu: invoiceInfo.khieu,
            sdhang: "",
            dvtte: invoiceInfo.dvtte,
            docngoaitetv: 0,
            tgia: invoiceInfo.tgia,
            htttoan: invoiceInfo.htttoan,
            stknban: "",
            tnhban: "",
            mnmua: customer.mnmua,
            mst: customer.mst,
            tnmua: customer.tnmua,
            email: customer.email,
            ten: customer.ten,
            dchi: customer.dchi,
            stknmua: customer.stknmua,
            tnhmua: customer.tnhmua,
            sdtnmua: customer.sdtnmua,
            ttcktmai: 0,
            tgtcthue: totalAmount,
            tgtthue: totalTax,
            tgtttbso: finalAmount,
            tkcktmn: 0,
            tgtphi: 0,
            tgtttbso_last: finalAmount,
            tgtttbchu: numberToVietnameseText(finalAmount),
            mdvi: "",
            details: [
              {
                data: items.map(item => ({
                  ...item,
                  // Recalculate item totals
                  thtien: item.sluong * item.dgia,
                  tthue: (item.sluong * item.dgia) * (parseFloat(item.tsuat) / 100),
                  tgtien: (item.sluong * item.dgia) + ((item.sluong * item.dgia) * (parseFloat(item.tsuat) / 100)),
                }))
              }
            ],
            is_hdcma: 0
          }
        ]
      }
    };
  };

  const submitInvoice = async () => {
    try {
      store.setLoading(true);
      store.setError(null);

      const payload = buildInvoicePayload();

      // Use mutateAsync for promise-based handling
      const result = store.issueOption === 'create'
        ? await createInvoiceMutation.mutateAsync(payload)
        : await issueInvoiceMutation.mutateAsync(payload);

      // Extract result data
      const invoiceData = result.data?.data?.[0]?.data;
      if (invoiceData) {
        store.setResult({
          invoiceNumber: invoiceData.shdon,
          status: invoiceData.tthai,
          amount: invoiceData.tgtttbso,
          response: result,
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      store.setError(errorMessage);
      throw error;
    } finally {
      store.setLoading(false);
    }
  };

  return {
    ...store,
    submitInvoice,
    isSubmitting: createInvoiceMutation.isPending || issueInvoiceMutation.isPending,
  };
};
