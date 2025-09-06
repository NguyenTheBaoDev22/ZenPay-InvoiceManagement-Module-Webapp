import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  RefreshCwIcon
} from 'lucide-react';
import { useMerchantInvoiceOrderList } from '../../presentation/hooks/useMerchantInvoiceOrder';
import { MerchantInvoiceOrderListItem } from '../../infrastructure/api/merchantInvoiceOrderApi';

export const Quotas: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'COMPLETED' | undefined>(undefined);

  const { data, isLoading, error, refetch } = useMerchantInvoiceOrderList({
    pageIndex: currentPage,
    pageSize,
    status: statusFilter
  });

  const quotaOrders = data?.data?.items || [];
  const pagination = data?.data?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilter = (status: 'PENDING' | 'COMPLETED' | undefined) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: 'PENDING' | 'COMPLETED') => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      default:
        return <XCircleIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: 'PENDING' | 'COMPLETED') => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">Không thể tải danh sách đơn hàng</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCwIcon className="h-4 w-4" />
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotas</h1>
          <p className="text-gray-600">Quản lý danh sách đơn hàng mua quota hóa đơn</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleStatusFilter(undefined)}
            className={`px-3 py-1 text-sm rounded-full border ${
              statusFilter === undefined
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => handleStatusFilter('PENDING')}
            className={`px-3 py-1 text-sm rounded-full border ${
              statusFilter === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            Chờ xử lý
          </button>
          <button
            onClick={() => handleStatusFilter('COMPLETED')}
            className={`px-3 py-1 text-sm rounded-full border ${
              statusFilter === 'COMPLETED'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            Hoàn thành
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <RefreshCwIcon className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && quotaOrders.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-gray-600">Bạn chưa có đơn hàng mua quota nào</p>
        </div>
      )}

      {/* Orders List */}
      {!isLoading && quotaOrders.length > 0 && (
        <div className="space-y-4">
          {quotaOrders.map((order: MerchantInvoiceOrderListItem, index: number) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">Đơn hàng #{order.id.slice(-8)}</h3>
                    <p className="text-sm text-gray-600">Mã số thuế: {order.taxCode}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                  {order.statusDisplayName}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Tổng số hóa đơn</p>
                  <p className="font-medium text-gray-900">{order.totalInvoiceQuantity.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số hóa đơn còn lại</p>
                  <p className="font-medium text-gray-900">{order.remainingInvoiceQuantity.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hiệu lực đến</p>
                  <p className="font-medium text-gray-900">{formatDate(order.effectiveDateTo)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Tạo lúc: {formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>Cập nhật: {formatDate(order.updatedAt)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} 
            trong tổng số {pagination.totalItems} đơn hàng
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevious}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      page === pagination.currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
