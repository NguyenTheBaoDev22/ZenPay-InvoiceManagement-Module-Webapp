import React from 'react';
import { MapPinIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { ZenInput, ZenSelect } from '../../../../components/zenshop/ZenFormInputs';
import { ZenButton } from '../../../../components/zenshop/ZenButton';
import { useInvoiceWizard } from '../../../hooks/useInvoiceWizard';

export const DataMappingStep: React.FC = () => {
  const {
    customer,
    setCustomer,
    invoiceInfo,
    setInvoiceInfo,
    items,
    addItem,
    updateItem,
    removeItem,
    getTotalAmount,
    getTotalTax,
    getFinalAmount,
  } = useInvoiceWizard();

  const handleItemChange = React.useCallback((index: number, field: string, value: any) => {
    const updatedItem = { ...items[index], [field]: value };
    
    // Recalculate totals when quantity, price, or tax rate changes
    if (field === 'sluong' || field === 'dgia' || field === 'tsuat') {
      const quantity = field === 'sluong' ? value : updatedItem.sluong;
      const price = field === 'dgia' ? value : updatedItem.dgia;
      const taxRate = field === 'tsuat' ? value : updatedItem.tsuat;
      
      const subtotal = quantity * price;
      const taxAmount = subtotal * (taxRate / 100);
      const total = subtotal + taxAmount;
      
      updatedItem.thtien = subtotal;
      updatedItem.tthue = taxAmount;
      updatedItem.tgtien = total;
    }

    updateItem(index, updatedItem);
  }, [items, updateItem]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <MapPinIcon className="h-12 w-12 text-[#FF6A3D] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#1F2937]">Map & Verify Data</h3>
        <p className="text-[#6B7280] mt-2">Enter customer information and invoice details</p>
      </div>

      {/* Invoice Information */}
      <div className="bg-[#F8FAFC] p-4 rounded-lg">
        <h4 className="font-medium text-[#1F2937] mb-4">Invoice Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ZenInput
            label="Ngày lập *"
            type="date"
            value={invoiceInfo.nlap}
            onChange={(e: any) => setInvoiceInfo({ nlap: e.target.value })}
          />
          <ZenInput
            label="Ký hiệu *"
            value={invoiceInfo.khieu}
            onChange={(e: any) => setInvoiceInfo({ khieu: e.target.value })}
            placeholder="1C25TYZ"
          />
          <ZenSelect
            label="Hình thức thanh toán *"
            value={invoiceInfo.htttoan}
            onChange={(e: any) => setInvoiceInfo({ htttoan: e.target.value })}
          >
            <option value="Tiền mặt/Chuyển khoản">Tiền mặt/Chuyển khoản</option>
            <option value="Tiền mặt">Tiền mặt</option>
            <option value="Chuyển khoản">Chuyển khoản</option>
            <option value="Thẻ tín dụng">Thẻ tín dụng</option>
          </ZenSelect>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-[#F8FAFC] p-4 rounded-lg">
        <h4 className="font-medium text-[#1F2937] mb-4">Customer Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ZenInput
            label="Tên khách hàng *"
            value={customer.tnmua}
            onChange={(e: any) => setCustomer({ tnmua: e.target.value })}
            placeholder="CÔNG TY CỔ PHẦN TẬP ĐOÀN HDPAY"
          />
          <ZenInput
            label="Mã số thuế *"
            value={customer.mst}
            onChange={(e: any) => setCustomer({ mst: e.target.value })}
            placeholder="0109740404"
          />
          <ZenInput
            label="Email"
            type="email"
            value={customer.email}
            onChange={(e: any) => setCustomer({ email: e.target.value })}
            placeholder="customer@company.com"
          />
          <ZenInput
            label="Số điện thoại"
            value={customer.sdtnmua}
            onChange={(e: any) => setCustomer({ sdtnmua: e.target.value })}
            placeholder="0123456789"
          />
        </div>
        <div className="mt-4">
          <ZenInput
            label="Địa chỉ *"
            value={customer.dchi}
            onChange={(e: any) => setCustomer({ dchi: e.target.value })}
            placeholder="Số 6 ngách 629/25 phố Kim Mã, Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội, Việt Nam"
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-[#F8FAFC] p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-[#1F2937]">Line Items</h4>
          <ZenButton variant="secondary" size="sm" onClick={addItem}>
            <PlusIcon className="h-4 w-4" />
            Add Item
          </ZenButton>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {items.map((item, index) => (
            <div key={index} className="p-3 bg-white rounded-lg border border-[#E5E7EB]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-4">
                  <ZenInput
                    label="Tên hàng hóa/dịch vụ *"
                    value={item.ten}
                    onChange={(e: any) => handleItemChange(index, 'ten', e.target.value)}
                    placeholder="Tiền thuê máy tháng 07/2025"
                  />
                </div>
                <div className="md:col-span-2">
                  <ZenInput
                    label="Đơn vị tính *"
                    value={item.mdvtinh}
                    onChange={(e: any) => handleItemChange(index, 'mdvtinh', e.target.value)}
                    placeholder="Máy"
                  />
                </div>
                <div className="md:col-span-1">
                  <ZenInput
                    label="Số lượng *"
                    type="number"
                    value={item.sluong}
                    onChange={(e: any) => handleItemChange(index, 'sluong', Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="md:col-span-2">
                  <ZenInput
                    label="Đơn giá *"
                    type="number"
                    value={item.dgia}
                    onChange={(e: any) => handleItemChange(index, 'dgia', Number(e.target.value))}
                    min="0"
                  />
                </div>
                <div className="md:col-span-1">
                  <ZenSelect
                    label="Thuế suất"
                    value={item.tsuat}
                    onChange={(e: any) => handleItemChange(index, 'tsuat', e.target.value)}
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="8">8%</option>
                    <option value="10">10%</option>
                  </ZenSelect>
                </div>
                <div className="md:col-span-1">
                  <ZenButton
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </ZenButton>
                </div>
              </div>
              
              {/* Item totals display */}
              <div className="mt-3 pt-3 border-t border-[#E5E7EB] grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-[#6B7280]">Thành tiền: </span>
                  <span className="font-medium">{item.thtien.toLocaleString('vi-VN')} VND</span>
                </div>
                <div>
                  <span className="text-[#6B7280]">Tiền thuế: </span>
                  <span className="font-medium">{item.tthue.toLocaleString('vi-VN')} VND</span>
                </div>
                <div>
                  <span className="text-[#6B7280]">Tổng tiền: </span>
                  <span className="font-medium text-[#FF6A3D]">{item.tgtien.toLocaleString('vi-VN')} VND</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="bg-[#FF6A3D]/5 border border-[#FF6A3D]/20 p-4 rounded-lg">
        <h4 className="font-medium text-[#1F2937] mb-3">Invoice Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Tổng tiền chưa thuế:</span>
            <span className="font-medium">{getTotalAmount().toLocaleString('vi-VN')} VND</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Tổng tiền thuế:</span>
            <span className="font-medium">{getTotalTax().toLocaleString('vi-VN')} VND</span>
          </div>
          <div className="flex justify-between border-t border-[#FF6A3D]/20 pt-2">
            <span className="font-medium text-[#1F2937]">Tổng thanh toán:</span>
            <span className="font-semibold text-[#FF6A3D] text-lg">{getFinalAmount().toLocaleString('vi-VN')} VND</span>
          </div>
        </div>
      </div>
    </div>
  );
};
