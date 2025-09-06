import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { InvoiceItem } from '../../core/entities/InvoiceItem';
import { Customer } from '../../core/entities/Customer';

export interface InvoiceWizardState {
  // Step 1: Order Source
  orderSource: 'manual' | 'csv' | 'api' | 'template';
  
  // Step 2: Invoice Data
  customer: Customer;
  items: InvoiceItem[];
  invoiceInfo: {
    nlap: string;           // Ngày lập
    khieu: string;          // Ký hiệu
    htttoan: string;        // Hình thức thanh toán
    dvtte: string;          // Đơn vị tiền tệ
    tgia: string;           // Tỷ giá
  };
  
  // Step 3: Template & Series
  template: 'classic' | 'modern' | 'creative';
  series: string;
  
  // Step 4: Issue Options
  issueOption: 'create' | 'create_and_issue';
  
  // Step 5: Result
  result: {
    invoiceNumber?: string;
    status?: string;
    amount?: number;
    response?: any;
  } | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setOrderSource: (source: InvoiceWizardState['orderSource']) => void;
  setCustomer: (customer: Partial<Customer>) => void;
  setInvoiceInfo: (info: Partial<InvoiceWizardState['invoiceInfo']>) => void;
  addItem: () => void;
  updateItem: (index: number, item: Partial<InvoiceItem>) => void;
  removeItem: (index: number) => void;
  setTemplate: (template: InvoiceWizardState['template']) => void;
  setSeries: (series: string) => void;
  setIssueOption: (option: InvoiceWizardState['issueOption']) => void;
  setResult: (result: InvoiceWizardState['result']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  
  // Computed values
  getTotalAmount: () => number;
  getTotalTax: () => number;
  getFinalAmount: () => number;
}

const initialCustomer: Customer = {
  mnmua: '',
  mst: '',
  tnmua: '',
  email: '',
  ten: '',
  dchi: '',
  stknmua: '',
  tnhmua: '',
  sdtnmua: '',
};

const initialItem: InvoiceItem = {
  stt: '1',
  ma: '',
  kmai: '0',
  ten: '',
  mdvtinh: '',
  sluong: 1,
  dgia: 0,
  thtien: 0,
  tlckhau: 0,
  stckhau: 0,
  tthue: 0,
  tgtien: 0,
  tsuat: '10',
};

const initialInvoiceInfo = {
  nlap: new Date().toISOString().split('T')[0], // Today's date
  khieu: '1C25TYZ',
  htttoan: 'Tiền mặt/Chuyển khoản',
  dvtte: 'VND',
  tgia: '1',
};

// State creator function for better organization
const createInvoiceWizardStore: StateCreator<InvoiceWizardState> = (set, get) => ({
  // Initial state
  orderSource: 'manual',
  customer: initialCustomer,
  items: [{ ...initialItem }],
  invoiceInfo: initialInvoiceInfo,
  template: 'classic',
  series: '1C25TYZ',
  issueOption: 'create',
  result: null,
  isLoading: false,
  error: null,
  
  // Actions
  setOrderSource: (source) => set({ orderSource: source }),
  
  setCustomer: (customer) => set((state) => ({
    customer: { ...state.customer, ...customer }
  })),
  
  setInvoiceInfo: (info) => set((state) => ({
    invoiceInfo: { ...state.invoiceInfo, ...info }
  })),
  
  addItem: () => set((state) => ({
    items: [...state.items, { ...initialItem, stt: (state.items.length + 1).toString() }]
  })),
  
  updateItem: (index, item) => set((state) => ({
    items: state.items.map((existingItem, i) => 
      i === index ? { ...existingItem, ...item } : existingItem
    )
  })),
  
  removeItem: (index) => set((state) => ({
    items: state.items.filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, stt: (i + 1).toString() }))
  })),
  
  setTemplate: (template) => set({ template }),
  setSeries: (series) => set({ series }),
  setIssueOption: (option) => set({ issueOption: option }),
  setResult: (result) => set({ result }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  reset: () => set({
    orderSource: 'manual',
    customer: initialCustomer,
    items: [{ ...initialItem }],
    invoiceInfo: initialInvoiceInfo,
    template: 'classic',
    series: '1C25TYZ',
    issueOption: 'create',
    result: null,
    isLoading: false,
    error: null,
  }),
  
  // Computed values
  getTotalAmount: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.thtien, 0);
  },
  
  getTotalTax: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.tthue, 0);
  },
  
  getFinalAmount: () => {
    const { getTotalAmount, getTotalTax } = get();
    return getTotalAmount() + getTotalTax();
  },
});

// Create store with devtools middleware for better debugging
export const useInvoiceWizardStore = create<InvoiceWizardState>()(
  process.env.NODE_ENV === 'development'
    ? devtools(createInvoiceWizardStore, { name: 'invoice-wizard-store' })
    : createInvoiceWizardStore
);
