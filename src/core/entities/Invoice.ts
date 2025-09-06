import { Customer } from './Customer';
import { InvoiceItemDetail } from './InvoiceItem';

export interface InvoiceData {
  cctbao_id: string;              // ID chứng chỉ
  nlap: string;                   // Ngày lập (YYYY-MM-DD)
  khieu: string;                  // Ký hiệu
  sdhang: string;                 // Số đơn hàng
  dvtte: string;                  // Đơn vị tiền tệ
  docngoaitetv: number;           // Độc ngoại tệ TV
  tgia: string;                   // Tỷ giá
  htttoan: string;                // Hình thức thanh toán
  stknban: string;                // Số tài khoản người bán
  tnhban: string;                 // Tên ngân hàng người bán
  ttcktmai: number;               // Tổng tiền chiết khấu thương mại
  tgtcthue: number;               // Tổng tiền chưa thuế
  tgtthue: number;                // Tổng tiền thuế
  tgtttbso: number;               // Tổng tiền thanh toán bằng số
  tkcktmn: number;                // Tiền khuyến mãi
  tgtphi: number;                 // Tổng tiền phí
  tgtttbso_last: number;          // Tổng tiền thanh toán cuối cùng
  tgtttbchu: string;              // Tổng tiền bằng chữ
  mdvi: string;                   // Mã đơn vị
  details: InvoiceItemDetail[];   // Chi tiết hàng hóa
  is_hdcma: number;               // Là hóa đơn chữ ký số
  
  // Customer information (flattened)
  mnmua: string;
  mst: string;
  tnmua: string;
  email: string;
  ten: string;
  dchi: string;
  stknmua: string;
  tnhmua: string;
  sdtnmua: string;
}

export interface InvoiceRequest {
  editmode: number;               // Chế độ chỉnh sửa
  data: InvoiceData[];
}

export interface CreateInvoicePayload {
  username: string;
  password: string;
  taxCode: string;
  invoiceRequest: InvoiceRequest;
}

// Response types
export interface InvoiceResponseData {
  id: string;
  hdon_id: string;
  cctbao_id: string;
  tthai: string;                  // Trạng thái
  khieu: string;
  shdon: string;                  // Số hóa đơn
  tdlap: string;                  // Thời điểm lập
  tnmua: string;
  mst: string;
  dchi: string;
  tgtcthue: number;
  tgtthue: number;
  tgtttbso: number;
  tgtttbchu: string;
}

export interface InvoiceApiResponse {
  code: string;
  message: string;
  data: {
    code: string;
    message: string;
    errors: any;
    traceId: string;
    data: Array<{
      data: InvoiceResponseData;
      ok: string;
    }>;
    isSuccess: boolean;
  };
  traceId: string;
  timestamp: string;
  isSuccess: boolean;
  errors: any;
}

// New types for Invoice List API
export interface InvoiceListRequest {
  pageIndex: number;
  pageSize: number;
  taxCode: string;
  merchantBranchId: string;
  cqtInvoiceStatus?: string;
  invoiceStatus?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface InvoiceListItem {
  id: string;
  invoiceId: string | null;
  invoiceNumber: string | null;
  invoiceSeries: string | null;
  cqtInvoiceStatus: number;
  invoiceStatus: number;
  totalAmount: number | null;
  taxAmount: number | null;
  customerName: string | null;
  customerTaxCode: string | null;
  invoiceDate: string | null;
  signedDate: string | null;
  sentToCqtDate: string | null;
  errorMessage: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  merchantInvoiceOrderId: string;
  taxCode: string;
  merchantBranchId: string;
  merchantBranchName: string | null;
  merchantInvoiceOrder: {
    id: string;
    status: string;
    totalInvoiceQuantity: number;
    remainingInvoiceQuantity: number;
    createdAt: string;
  } | null;
}

export interface InvoiceListResponse {
  code: string;
  message: string;
  data: {
    data: InvoiceListItem[];
    total: number;
    pageIndex: number;
    pageSize: number;
    code: string;
    message: string;
  };
  traceId: string;
  timestamp: string;
  isSuccess: boolean;
  errors: any;
}
