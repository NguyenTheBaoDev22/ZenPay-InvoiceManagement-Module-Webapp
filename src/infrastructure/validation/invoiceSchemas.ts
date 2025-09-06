import { z } from 'zod';

export const InvoiceItemSchema = z.object({
  stt: z.string(),
  ma: z.string(),
  kmai: z.string(),
  ten: z.string().min(1, 'Tên hàng hóa/dịch vụ là bắt buộc'),
  mdvtinh: z.string().min(1, 'Đơn vị tính là bắt buộc'),
  sluong: z.number().positive('Số lượng phải lớn hơn 0'),
  dgia: z.number().positive('Đơn giá phải lớn hơn 0'),
  thtien: z.number(),
  tlckhau: z.number().min(0).max(100),
  stckhau: z.number().min(0),
  tthue: z.number().min(0),
  tgtien: z.number().positive(),
  tsuat: z.string(),
});

export const InvoiceItemDetailSchema = z.object({
  data: z.array(InvoiceItemSchema),
});

export const CustomerSchema = z.object({
  mnmua: z.string(),
  mst: z.string().min(1, 'Mã số thuế là bắt buộc'),
  tnmua: z.string().min(1, 'Tên người mua là bắt buộc'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  ten: z.string(),
  dchi: z.string().min(1, 'Địa chỉ là bắt buộc'),
  stknmua: z.string(),
  tnhmua: z.string(),
  sdtnmua: z.string(),
});

export const InvoiceDataSchema = z.object({
  cctbao_id: z.string().min(1, 'ID chứng chỉ là bắt buộc'),
  nlap: z.string().min(1, 'Ngày lập là bắt buộc'),
  khieu: z.string().min(1, 'Ký hiệu là bắt buộc'),
  sdhang: z.string(),
  dvtte: z.string().default('VND'),
  docngoaitetv: z.number().default(0),
  tgia: z.string().default('1'),
  htttoan: z.string().min(1, 'Hình thức thanh toán là bắt buộc'),
  stknban: z.string(),
  tnhban: z.string(),
  ttcktmai: z.number().default(0),
  tgtcthue: z.number().positive('Tổng tiền chưa thuế phải lớn hơn 0'),
  tgtthue: z.number().min(0),
  tgtttbso: z.number().positive('Tổng tiền thanh toán phải lớn hơn 0'),
  tkcktmn: z.number().default(0),
  tgtphi: z.number().default(0),
  tgtttbso_last: z.number().positive(),
  tgtttbchu: z.string(),
  mdvi: z.string(),
  details: z.array(InvoiceItemDetailSchema),
  is_hdcma: z.number().default(0),
  
  // Customer fields
  mnmua: z.string(),
  mst: z.string().min(1, 'Mã số thuế là bắt buộc'),
  tnmua: z.string().min(1, 'Tên người mua là bắt buộc'),
  email: z.string(),
  ten: z.string(),
  dchi: z.string().min(1, 'Địa chỉ là bắt buộc'),
  stknmua: z.string(),
  tnhmua: z.string(),
  sdtnmua: z.string(),
});

export const InvoiceRequestSchema = z.object({
  editmode: z.number().default(1),
  data: z.array(InvoiceDataSchema),
});

export const CreateInvoicePayloadSchema = z.object({
  username: z.string().min(1, 'Username là bắt buộc'),
  password: z.string().min(1, 'Password là bắt buộc'),
  taxCode: z.string().min(1, 'Tax code là bắt buộc'),
  invoiceRequest: InvoiceRequestSchema,
});

export type InvoiceItemFormData = z.infer<typeof InvoiceItemSchema>;
export type CustomerFormData = z.infer<typeof CustomerSchema>;
export type InvoiceDataFormData = z.infer<typeof InvoiceDataSchema>;
export type CreateInvoiceFormData = z.infer<typeof CreateInvoicePayloadSchema>;
