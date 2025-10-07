import React, { useState, useMemo } from 'react';
import { ZenButton } from '../zenshop/ZenButton';
import { ZenSearchField } from '../zenshop/ZenSearchField';
import { ZenDateRangePicker } from '../zenshop/ZenFormInputs';
import { ZenDataGrid, ZenColumn } from '../zenshop/ZenDataGrid';
import { ZenDrawer } from '../zenshop/ZenModal';
import { ZenStatusChip } from '../zenshop/ZenStatusChip';
import { ZenSelect, ZenInput } from '../zenshop/ZenFormInputs';
import { useInvoiceList, useInvoiceStatusMapping } from '../../presentation/hooks/useInvoiceList';
import { InvoiceListRequest, InvoiceListItem } from '../../core/entities/Invoice';
import { useAuth } from '../../presentation/hooks/useAuth';
import {
  FilterIcon,
  PlusIcon,
  DownloadIcon,
  TrashIcon,
  MoreHorizontalIcon,
  EyeIcon,
  EditIcon,
  SendIcon,
  LoaderIcon
} from 'lucide-react';

export const InvoiceList: React.FC<{
  onViewInvoice?: (invoice: InvoiceListItem) => void;
  onCreateInvoice?: () => void;
}> = ({ onViewInvoice, onCreateInvoice }) => {
  const { taxCode } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Use taxCode from auth, fallback to test value for development
  const effectiveTaxCode = taxCode || '0123456789'; // Fallback for development
  const merchantBranchId = 'eb7be434-7e2c-4f0b-a7f6-cdb73970a912'; // Test GUID - replace with actual merchant branch ID

  // API parameters
  const apiParams: InvoiceListRequest = useMemo(() => ({
    pageIndex: currentPage,
    pageSize,
    taxCode: effectiveTaxCode,
    merchantBranchId,
    searchTerm: searchQuery || undefined,
    sortBy: sortField,
    sortDescending: sortDirection === 'desc',
  }), [currentPage, pageSize, searchQuery, sortField, sortDirection, effectiveTaxCode]);

  // API call
  const { data: apiResponse, isLoading, error, refetch } = useInvoiceList(apiParams);
  const { mapStatus, formatCurrency, formatDate } = useInvoiceStatusMapping();

  // ActionDropdown component defined first
  const ActionDropdown = ({ invoiceId }: { invoiceId: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleViewDetails = () => {
      // Find the invoice data from API response
      const invoice = apiResponse?.data?.data?.find(inv => inv.id === invoiceId);
      if (invoice && onViewInvoice) {
        onViewInvoice(invoice);
      } else {
        console.log('View invoice details:', invoiceId);
      }
      setIsOpen(false);
    };

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
                <button
                  onClick={handleViewDetails}
                  className="w-full text-left px-3 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2"
                >
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

  // Transform API data for DataGrid
  const columns: ZenColumn[] = [
    { key: 'invoice', label: 'Invoice #', sortable: true, width: '130px', align: 'left' },
    { key: 'customer', label: 'Customer', sortable: true, width: '180px', align: 'left' },
    { key: 'customerTaxCode', label: 'Tax Code', sortable: true, width: '130px', align: 'left' },
    { key: 'amount', label: 'Amount', sortable: true, align: 'right', width: '130px' },
    { key: 'taxAmount', label: 'Tax Amount', sortable: true, align: 'right', width: '130px' },
    { key: 'status', label: 'Status', width: '120px', align: 'center' },
    { key: 'date', label: 'Date', sortable: true, width: '130px', align: 'left' },
    { key: 'series', label: 'Series', width: '100px', align: 'left' },
    { key: 'actions', label: '', width: '80px', align: 'center' },
  ];

  // Transform API data to grid format
  const invoiceData = useMemo(() => {
    if (!apiResponse?.data?.data) return [];

    return apiResponse.data.data.map((invoice) => ({
      id: invoice.id,
      invoice: invoice.invoiceNumber || invoice.invoiceId || '-',
      customer: invoice.customerName || '-',
      customerTaxCode: invoice.customerTaxCode || '-',
      amount: (
        <div className="text-right">
          {formatCurrency(invoice.totalAmount)}
        </div>
      ),
      taxAmount: (
        <div className="text-right">
          {formatCurrency(invoice.taxAmount)}
        </div>
      ),
      status: (
        <div className="flex justify-center">
          <ZenStatusChip status={mapStatus(invoice.invoiceStatus)} size="sm" />
        </div>
      ),
      date: formatDate(invoice.invoiceDate),
      series: invoice.invoiceSeries || '-',
      actions: (
        <div className="flex justify-center">
          <ActionDropdown invoiceId={invoice.id} />
        </div>
      ),
    }));
  }, [apiResponse?.data, formatCurrency, formatDate, mapStatus]);

  const handleRowSelect = (rowId: string) => {
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedRows(selected ? invoiceData.map(invoice => invoice.id) : []);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Invoices</h1>
          <p className="text-[#6B7280] mt-1">
            Manage and track all your e-invoices
            {apiResponse?.data?.total !== undefined && (
              <span className="ml-2 text-sm">({apiResponse.data.total} total)</span>
            )}
          </p>
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
                placeholder="Search by invoice ID or customer name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Reset to first page when searching
                  setCurrentPage(1);
                }}
                onClear={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoaderIcon className="h-8 w-8 animate-spin text-[#6B7280]" />
          <span className="ml-2 text-[#6B7280]">Loading invoices...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Failed to load invoices. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Data Grid */}
      {!isLoading && !error && (
        <ZenDataGrid
          columns={columns}
          data={invoiceData}
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
          totalPages={Math.ceil((apiResponse?.data?.total || 0) / pageSize)}
          totalItems={apiResponse?.data?.total || 0}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
          onRowClick={(row) => {
            // Find the original invoice data from API response
            const invoice = apiResponse?.data?.data?.find(inv => inv.id === row.id);
            if (invoice && onViewInvoice) {
              onViewInvoice(invoice);
            } else {
              console.log('View invoice:', row);
            }
          }}
        />
      )}

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