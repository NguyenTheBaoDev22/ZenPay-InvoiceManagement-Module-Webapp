export interface InvoiceItem {
  stt: string;                    // Số thứ tự
  ma: string;                     // Mã hàng hóa
  kmai: string;                   // Khuyến mãi
  ten: string;                    // Tên hàng hóa/dịch vụ
  mdvtinh: string;                // Đơn vị tính
  sluong: number;                 // Số lượng
  dgia: number;                   // Đơn giá
  thtien: number;                 // Thành tiền
  tlckhau: number;                // Tỷ lệ chiết khấu
  stckhau: number;                // Số tiền chiết khấu
  tthue: number;                  // Tiền thuế
  tgtien: number;                 // Tổng tiền
  tsuat: string;                  // Thuế suất
}

export interface InvoiceItemDetail {
  data: InvoiceItem[];
}
