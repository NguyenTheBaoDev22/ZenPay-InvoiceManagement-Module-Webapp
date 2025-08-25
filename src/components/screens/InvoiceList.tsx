import React, { useState } from 'react';
import { ZenButton } from '../zenshop/ZenButton';
import { ZenSearchField } from '../zenshop/ZenSearchField';
import { ZenDateRangePicker } from '../zenshop/ZenFormInputs';
import { ZenDataGrid, ZenColumn } from '../zenshop/ZenDataGrid';
import { ZenDrawer } from '../zenshop/ZenModal';
import { ZenStatusChip } from '../zenshop/ZenStatusChip';
import { ZenSelect, ZenInput } from '../zenshop/ZenFormInputs';
import { 
  FilterIcon, 
  PlusIcon, 
  DownloadIcon, 
  TrashIcon, 
  MoreHorizontalIcon,
  EyeIcon,
  EditIcon,
  SendIcon
} from 'lucide-react';

export const InvoiceList: React.FC<{ 
  onViewInvoice?: () => void;
  onCreateInvoice?: () => void;
}> = ({ onViewInvoice, onCreateInvoice }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // ActionDropdown component defined first
  const ActionDropdown = ({ invoiceId }: { invoiceId: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] rounded transition-colors"
        >
          <MoreHorizontalIcon className="h-4 w-4" />
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-20">
              <div className="py-1">
                <button className="w-full text-left px-3 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                  <EyeIcon className="h-4 w-4" />
                  View Details
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                  <EditIcon className="h-4 w-4" />
                  Edit
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                  <SendIcon className="h-4 w-4" />
                  Send
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                  <DownloadIcon className="h-4 w-4" />
                  Download PDF
                </button>
                <hr className="my-1 border-[#E5E7EB]" />
                <button className="w-full text-left px-3 py-2 text-sm text-[#EF4444] hover:bg-[#FEE2E2] flex items-center gap-2">
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Mock data for DataGrid
  const columns: ZenColumn[] = [
    { key: 'invoice', label: 'Invoice #', sortable: true, width: '140px' },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, align: 'right', width: '120px' },
    { key: 'status', label: 'Status', width: '100px', align: 'center' },
    { key: 'date', label: 'Date', sortable: true, width: '120px' },
    { key: 'series', label: 'Series', width: '80px' },
    { key: 'actions', label: '', width: '50px', align: 'center' },
  ];

  const mockInvoices = [
    {
      id: '1',
      invoice: 'INV-2024-001',
      customer: 'Acme Corporation',
      amount: '$2,500.00',
      status: <ZenStatusChip status="paid" size="sm" />,
      date: '2024-01-15',
      series: 'A',
      actions: <ActionDropdown invoiceId="1" />,
    },
    {
      id: '2',
      invoice: 'INV-2024-002',
      customer: 'Tech Solutions Ltd',
      amount: '$1,750.00',
      status: <ZenStatusChip status="pending" size="sm" />,
      date: '2024-01-14',
      series: 'A',
      actions: <ActionDropdown invoiceId="2" />,
    },
    {
      id: '3',
      invoice: 'INV-2024-003',
      customer: 'Digital Marketing Agency',
      amount: '$3,200.00',
      status: <ZenStatusChip status="overdue" size="sm" />,
      date: '2024-01-10',
      series: 'B',
      actions: <ActionDropdown invoiceId="3" />,
    },
    {
      id: '4',
      invoice: 'INV-2024-004',
      customer: 'Startup Innovations Inc',
      amount: '$890.00',
      status: <ZenStatusChip status="draft" size="sm" />,
      date: '2024-01-16',
      series: 'A',
      actions: <ActionDropdown invoiceId="4" />,
    },
    {
      id: '5',
      invoice: 'INV-2024-005',
      customer: 'Enterprise Solutions Co',
      amount: '$5,500.00',
      status: <ZenStatusChip status="sent" size="sm" />,
      date: '2024-01-12',
      series: 'C',
      actions: <ActionDropdown invoiceId="5" />,
    },
    {
      id: '6',
      invoice: 'INV-2024-006',
      customer: 'Global Services LLC',
      amount: '$1,200.00',
      status: <ZenStatusChip status="failed" size="sm" />,
      date: '2024-01-11',
      series: 'A',
      actions: <ActionDropdown invoiceId="6" />,
    },
  ];

  const handleRowSelect = (rowId: string) => {
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedRows(selected ? mockInvoices.map(invoice => invoice.id) : []);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Invoices</h1>
          <p className="text-[#6B7280] mt-1">Manage and track all your e-invoices</p>
        </div>
        <ZenButton onClick={onCreateInvoice}>
          <PlusIcon className="h-4 w-4" />
          Issue New Invoice
        </ZenButton>
      </div>

      {/* Top Bar with Search and Actions */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex-1 max-w-md">
              <ZenSearchField
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
              />
            </div>
            
            <div className="flex gap-2">
              <ZenButton
                variant="secondary"
                onClick={() => setIsFiltersOpen(true)}
              >
                <FilterIcon className="h-4 w-4" />
                Advanced Filters
              </ZenButton>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg">
              <span className="text-sm text-[#6B7280]">
                {selectedRows.length} selected
              </span>
              <div className="flex gap-2">
                <ZenButton size="sm" variant="secondary">
                  <SendIcon className="h-4 w-4" />
                  Send
                </ZenButton>
                <ZenButton size="sm" variant="secondary">
                  <DownloadIcon className="h-4 w-4" />
                  Export
                </ZenButton>
                <ZenButton size="sm" variant="danger">
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </ZenButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Grid */}
      <ZenDataGrid
        columns={columns}
        data={mockInvoices}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={(field, direction) => {
          setSortField(field);
          setSortDirection(direction);
        }}
        currentPage={currentPage}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
        onRowClick={(row) => onViewInvoice ? onViewInvoice() : console.log('View invoice:', row.invoice)}
      />

      {/* Advanced Filters Drawer */}
      <ZenDrawer
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        title="Advanced Filters"
        size="md"
        footer={
          <>
            <ZenButton variant="ghost" onClick={() => setIsFiltersOpen(false)}>
              Clear All
            </ZenButton>
            <ZenButton onClick={() => setIsFiltersOpen(false)}>
              Apply Filters
            </ZenButton>
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-[#1F2937] mb-4">Filter Criteria</h4>
            <div className="space-y-4">
              <ZenSelect label="Status" placeholder="All statuses">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
                <option value="failed">Failed</option>
                <option value="overdue">Overdue</option>
              </ZenSelect>

              <ZenSelect label="Series" placeholder="All series">
                <option value="A">Series A</option>
                <option value="B">Series B</option>
                <option value="C">Series C</option>
              </ZenSelect>

              <ZenSelect label="Payment Method" placeholder="All methods">
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
              </ZenSelect>

              <ZenDateRangePicker label="Date Range" />

              <div className="grid grid-cols-2 gap-3">
                <ZenInput label="Min Amount" placeholder="0.00" />
                <ZenInput label="Max Amount" placeholder="999,999.99" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-[#1F2937] mb-4">Customer Filters</h4>
            <div className="space-y-4">
              <ZenInput label="Customer Name" placeholder="Enter customer name" />
              <ZenInput label="Customer Email" placeholder="Enter email address" />
              <ZenSelect label="Customer Type" placeholder="All types">
                <option value="business">Business</option>
                <option value="individual">Individual</option>
              </ZenSelect>
            </div>
          </div>
        </div>
      </ZenDrawer>
    </div>
  );
};