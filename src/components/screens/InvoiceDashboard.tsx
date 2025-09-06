import React from 'react';
import { ZenKPITile } from '../zenshop/ZenKPITile';
import { ZenBarChart } from '../zenshop/ZenCharts';
import { ZenAlertCenter } from '../zenshop/ZenAlertCenter';
import {
  FileTextIcon,
  TrendingUpIcon,
  TargetIcon,
  ShieldCheckIcon,
  AlertTriangle,
  ShoppingCart,
  Send,
  Download,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useDashboardData } from '../../presentation/hooks/useDashboardData';
import { useAuth } from '../../presentation/hooks/useAuth';
import {
  KPITileLoading,
  ChartLoading,
  RecentInvoicesLoading,
  QuotaStatusLoading,
  SectionLoading,
  LoadingSpinner
} from '../ui/loading';



interface InvoiceDashboardProps {
  onCreateInvoice?: () => void;
  onNavigate?: (view: string) => void;
}

export const InvoiceDashboard: React.FC<InvoiceDashboardProps> = ({ onNavigate }) => {
  // Get taxCode from auth, similar to InvoiceList
  const { taxCode } = useAuth();

  // Use taxCode from auth, fallback to test value for development
  const effectiveTaxCode = taxCode || '0123456789'; // Fallback for development
  const merchantBranchId = 'eb7be434-7e2c-4f0b-a7f6-cdb73970a912'; // Test GUID - replace with actual merchant branch ID

  // Use dashboard data hook with taxCode
  const { data, loading, error, refetch, resendInvoice } = useDashboardData(merchantBranchId, effectiveTaxCode);

  // Transform API data to component format
  const kpiData = data.kpi ? [
    {
      title: 'Invoices Today',
      value: data.kpi.invoicesToday.value,
      change: data.kpi.invoicesToday.change,
      icon: FileTextIcon,
    },
    {
      title: 'Success Rate',
      value: data.kpi.successRate.value,
      change: data.kpi.successRate.change,
      icon: TrendingUpIcon,
    },
    {
      title: 'Quota Remaining',
      value: data.kpi.quotaRemaining.value,
      change: data.kpi.quotaRemaining.change,
      icon: TargetIcon,
    },
    {
      title: 'Certificate Expiry',
      value: data.kpi.certificateExpiry.value,
      change: data.kpi.certificateExpiry.change,
      icon: ShieldCheckIcon,
    },
  ] : [];

  // Chart data from API
  const invoicesByDay = data.charts || [];

  // Recent invoices from API - handle different response structures
  const recentInvoices = (() => {
    if (!data.recentInvoices) return [];
    if (Array.isArray(data.recentInvoices)) return data.recentInvoices;
    // Handle nested data structure from ZenInvoice API response
    const apiData = data.recentInvoices as any;
    const invoiceList = apiData?.data?.data || apiData?.data || [];

    // Map ZenInvoice API data to dashboard format
    return invoiceList.map((invoice: any) => ({
      id: invoice.invoiceId || invoice.id,
      customer: invoice.customerName || 'N/A',
      date: invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('vi-VN') : 'N/A',
      amount: invoice.totalAmount ? `${invoice.totalAmount.toLocaleString('vi-VN')} VND` : '0 VND',
      status: invoice.invoiceStatus || 'unknown',
      canResend: true // Default to true for now
    }));
  })();

  // Quota data from API
  const quotaData = data.quotaStatus;
  const quotaUsed = quotaData?.quotaUsed || 0;
  const quotaTotal = quotaData?.quotaTotal || 0;
  const quotaPercentage = quotaData?.quotaPercentage || 0;
  const quotaRemaining = quotaData?.quotaRemaining || 0;
  const isQuotaLow = quotaData?.isQuotaLow || false;

  const getStatusBadge = (status: string) => {
    // Map various status types to dashboard display status
    const statusMapping: Record<string, string> = {
      // Payment/Order status
      'Completed': 'paid',
      'Delivered': 'paid',
      'COMPLETED': 'paid',
      'Signed': 'paid',
      'CodeAssigned': 'paid',

      // Pending status
      'Pending': 'pending',
      'PENDING': 'pending',
      'WaitingConfirmation': 'pending',
      'Confirmed': 'pending',
      'Preparing': 'pending',
      'Shipping': 'pending',
      'PendingSignature': 'pending',
      'PendingCodeAssignment': 'pending',
      'PendingResponse': 'pending',
      'Original': 'pending',

      // Overdue/Problem status
      'Cancelled': 'overdue',
      'FailedDelivery': 'overdue',
      'InvalidFormat': 'overdue',
      'CodeNotAssigned': 'overdue',
      'NotAccepted': 'overdue',
      'TbssRejected': 'overdue',

      // Default fallback
      'unknown': 'unknown'
    };

    const variants = {
      paid: { variant: 'default', icon: CheckCircle, label: 'Đã thanh toán' },
      pending: { variant: 'secondary', icon: Clock, label: 'Chờ thanh toán' },
      overdue: { variant: 'destructive', icon: XCircle, label: 'Quá hạn' },
      unknown: { variant: 'outline', icon: Clock, label: 'Không xác định' }
    };

    // Map the status to display status, fallback to unknown
    const displayStatus = statusMapping[status] || 'unknown';
    const config = variants[displayStatus as keyof typeof variants];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant as any} className="gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleNavigateToResourceCenter = () => {
    if (onNavigate) {
      onNavigate('quota');
    }
  };

  const handleResendInvoice = async (invoiceId: string) => {
    const success = await resendInvoice(invoiceId);
    if (success) {
      // Could show success toast here
      console.log(`Invoice ${invoiceId} resent successfully`);
    } else {
      // Could show error toast here
      console.error(`Failed to resend invoice ${invoiceId}`);
    }
  };

  // Mock data for alerts
  const alerts = [
    {
      id: '1',
      type: 'warning' as const,
      title: 'Certificate Expiring Soon',
      message: 'Your e-invoice certificate will expire in 45 days. Please renew to avoid service interruption.',
      timestamp: '2 hours ago',
      isRead: false,
    },
    {
      id: '2',
      type: 'error' as const,
      title: 'Failed Invoice Transmission',
      message: 'Invoice INV-2024-001 failed to transmit to tax authority. Retry required.',
      timestamp: '4 hours ago',
      isRead: false,
    },
    {
      id: '3',
      type: 'success' as const,
      title: 'Batch Processing Complete',
      message: '15 invoices successfully processed and transmitted.',
      timestamp: '6 hours ago',
      isRead: true,
    },
    {
      id: '4',
      type: 'info' as const,
      title: 'System Maintenance',
      message: 'Scheduled maintenance window this Sunday 2-4 AM EST.',
      timestamp: '1 day ago',
      isRead: true,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1F2937]">Dashboard</h1>
        <p className="text-[#6B7280] mt-1">Monitor your e-invoice performance and system status</p>
      </div>

      {/* Low Quota Alert - Always show to encourage quota purchase */}
      <SectionLoading
        isLoading={loading.quotaStatus}
        error={null} // Don't show error for this promotional alert
        onRetry={refetch.quotaStatus}
        loadingComponent={
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-amber-800">
                <strong>Đang tải thông tin quota...</strong>
              </span>
              <Button
                size="sm"
                disabled
                className="bg-primary hover:bg-primary/90 ml-4"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Mua ngay
              </Button>
            </AlertDescription>
          </Alert>
        }
      >
        <Alert className={`border-amber-200 bg-amber-50 ${isQuotaLow ? 'border-red-200 bg-red-50' : ''}`}>
          <AlertTriangle className={`h-4 w-4 ${isQuotaLow ? 'text-red-600' : 'text-amber-600'}`} />
          <AlertDescription className="flex items-center justify-between">
            <span className={`${isQuotaLow ? 'text-red-800' : 'text-amber-800'}`}>
              {isQuotaLow ? (
                <>
                  <strong>Quota sắp hết!</strong> Bạn chỉ còn {quotaRemaining.toLocaleString()} hóa đơn.
                  Mua thêm quota để không bị gián đoạn dịch vụ.
                </>
              ) : (
                <>
                  <strong>Tối ưu hóa chi phí!</strong> Bạn còn {quotaRemaining.toLocaleString()} hóa đơn.
                  Mua thêm quota với giá ưu đãi để tiết kiệm hơn.
                </>
              )}
            </span>
            <Button
              size="sm"
              onClick={handleNavigateToResourceCenter}
              className={`ml-4 ${isQuotaLow ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isQuotaLow ? 'Mua ngay' : 'Mua thêm'}
            </Button>
          </AlertDescription>
        </Alert>
      </SectionLoading>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SectionLoading
          isLoading={loading.kpi}
          error={error.kpi}
          onRetry={refetch.kpi}
          loadingComponent={
            <>
              <KPITileLoading />
              <KPITileLoading />
              <KPITileLoading />
              <KPITileLoading />
            </>
          }
        >
          {kpiData.map((kpi, index) => (
            <ZenKPITile
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon}
            />
          ))}
        </SectionLoading>
      </div>

      {/* Charts and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Invoices by Day */}
        <SectionLoading
          isLoading={loading.charts}
          error={error.charts}
          onRetry={refetch.charts}
          loadingComponent={<ChartLoading />}
        >
          <ZenBarChart
            data={invoicesByDay}
            title="Invoices by Day"
            className="lg:col-span-2"
          />
        </SectionLoading>

        {/* Alerts Center - Keep mock data as requested */}
        <ZenAlertCenter alerts={alerts} />
      </div>

      {/* Recent Invoices and AI/Quota Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <SectionLoading
          isLoading={loading.recentInvoices}
          error={error.recentInvoices}
          onRetry={refetch.recentInvoices}
          loadingComponent={<RecentInvoicesLoading />}
        >
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Hóa đơn gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{invoice.id}</span>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.customer} • {invoice.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{invoice.amount}</p>
                      <div className="flex gap-1 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!invoice.canResend || loading.resendingInvoice === invoice.id}
                          onClick={() => handleResendInvoice(invoice.id)}
                        >
                          {loading.resendingInvoice === invoice.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Send className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!invoice.canDownload}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </SectionLoading>

        {/* Quick Actions & AI */}
        <div className="space-y-6">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">AI</span>
                </div>
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Chứng thư sắp hết hạn</p>
                  <p className="text-xs text-muted-foreground">
                    Certificate VNCA-2026 hết hạn trong 15 ngày
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                <TrendingUpIcon className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Doanh thu tăng trưởng tốt</p>
                  <p className="text-xs text-muted-foreground">
                    Tăng 12% so với cùng kỳ năm trước
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Xem tất cả insights
              </Button>
            </CardContent>
          </Card>

          {/* Quota Status */}
          <SectionLoading
            isLoading={loading.quotaStatus}
            error={error.quotaStatus}
            onRetry={refetch.quotaStatus}
            loadingComponent={<QuotaStatusLoading />}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quota sử dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Hóa đơn đã sử dụng</span>
                      <span>{quotaUsed.toLocaleString()} / {quotaTotal.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={quotaPercentage}
                      className={`h-2 ${isQuotaLow ? '[&>div]:bg-amber-500' : ''}`}
                    />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Còn lại {quotaRemaining.toLocaleString()} hóa đơn trong {quotaData?.currentPeriod || 'tháng này'}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleNavigateToResourceCenter}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Mua thêm quota
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SectionLoading>
        </div>
      </div>


    </div>
  );
};