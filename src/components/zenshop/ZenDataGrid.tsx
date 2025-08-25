import React from 'react';
import { cn } from '../ui/utils';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export interface ZenColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface ZenDataGridProps {
  columns: ZenColumn[];
  data: Record<string, any>[];
  loading?: boolean;
  selectedRows?: string[];
  onRowSelect?: (rowId: string) => void;
  onSelectAll?: (selected: boolean) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: Record<string, any>) => void;
  className?: string;
}

export const ZenDataGrid: React.FC<ZenDataGridProps> = ({
  columns,
  data,
  loading = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  sortField,
  sortDirection,
  onSort,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onRowClick,
  className,
}) => {
  const handleSort = (field: string) => {
    if (!onSort) return;
    
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4" />
    ) : (
      <ChevronDownIcon className="h-4 w-4" />
    );
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn('bg-white border border-[#E5E7EB] rounded-lg overflow-hidden', className)}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB] sticky top-0 z-10">
            <tr>
              {onRowSelect && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="h-4 w-4 text-[#FF6A3D] border-[#D1D5DB] rounded focus:ring-[#FF6A3D]/20"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-[#374151] select-none',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer hover:bg-[#F3F4F6] transition-colors'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="text-[#9CA3AF]">
                        {getSortIcon(column.key) || <ChevronUpIcon className="h-4 w-4 opacity-30" />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Body */}
          <tbody className="divide-y divide-[#E5E7EB]">
            {loading ? (
              // Loading skeleton
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {onRowSelect && (
                    <td className="px-4 py-3">
                      <div className="h-4 w-4 bg-[#E5E7EB] rounded"></div>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      <div className="h-4 bg-[#E5E7EB] rounded max-w-[150px]"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onRowSelect ? 1 : 0)}
                  className="px-4 py-12 text-center text-[#6B7280]"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={cn(
                    'hover:bg-[#F9FAFB] transition-colors',
                    selectedRows.includes(row.id) && 'bg-[#FEF3F2]',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {onRowSelect && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => onRowSelect(row.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 text-[#FF6A3D] border-[#D1D5DB] rounded focus:ring-[#FF6A3D]/20"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3 text-sm text-[#1F2937]',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="text-sm text-[#6B7280]">
            Showing {startItem} to {endItem} of {totalItems} entries
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                'p-2 text-sm border border-[#E5E7EB] rounded-lg transition-colors',
                currentPage === 1
                  ? 'text-[#9CA3AF] bg-[#F9FAFB] cursor-not-allowed'
                  : 'text-[#374151] bg-white hover:bg-[#F9FAFB]'
              )}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange?.(pageNum)}
                    className={cn(
                      'px-3 py-1 text-sm border rounded-lg transition-colors',
                      pageNum === currentPage
                        ? 'bg-[#FF6A3D] text-white border-[#FF6A3D]'
                        : 'bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                'p-2 text-sm border border-[#E5E7EB] rounded-lg transition-colors',
                currentPage === totalPages
                  ? 'text-[#9CA3AF] bg-[#F9FAFB] cursor-not-allowed'
                  : 'text-[#374151] bg-white hover:bg-[#F9FAFB]'
              )}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};