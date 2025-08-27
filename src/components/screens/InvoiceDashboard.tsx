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



interface InvoiceDashboardProps {
  onCreateInvoice?: () => void;
  onNavigate?: (view: string) => void;
}

export const InvoiceDashboard: React.FC<InvoiceDashboardProps> = ({ onCreateInvoice, onNavigate }) => {

  // Mock quota status - low quota to trigger purchase flow
  const quotaUsed = 2847;
  const quotaTotal = 3000;
  const quotaPercentage = (quotaUsed / quotaTotal) * 100;
  const quotaRemaining = quotaTotal - quotaUsed;
  const isQuotaLow = quotaPercentage > 90;

  // Mock data for KPI tiles
  const kpiData = [
    {
      title: 'Invoices Today',
      value: '24',
      change: { value: '12%', type: 'increase' as const },
      icon: FileTextIcon,
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: { value: '2.1%', type: 'increase' as const },
      icon: TrendingUpIcon,
    },
    {
      title: 'Quota Remaining',
      value: '1,456',
      change: { value: '156', type: 'decrease' as const },
      icon: TargetIcon,
    },
    {
      title: 'Certificate Expiry',
      value: '45 days',
      change: { value: '15 days', type: 'neutral' as const },
      icon: ShieldCheckIcon,
    },
  ];

  // Mock data for bar chart
  const invoicesByDay = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 22 },
    { name: 'Fri', value: 28 },
    { name: 'Sat', value: 8 },
    { name: 'Sun', value: 5 },
  ];



  // Mock data for recent invoices
  const recentInvoices = [
    {
      id: 'INV-2025-000123',
      customer: 'Công ty ABC',
      amount: '₫23,089,000',
      status: 'paid',
      date: '24/08/2025'
    },
    {
      id: 'INV-2025-000124',
      customer: 'Công ty XYZ',
      amount: '₫15,500,000',
      status: 'pending',
      date: '24/08/2025'
    },
    {
      id: 'INV-2025-000125',
      customer: 'Doanh nghiệp DEF',
      amount: '₫8,750,000',
      status: 'overdue',
      date: '22/08/2025'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: { variant: 'default', icon: CheckCircle, label: 'Đã thanh toán' },
      pending: { variant: 'secondary', icon: Clock, label: 'Chờ thanh toán' },
      overdue: { variant: 'destructive', icon: XCircle, label: 'Quá hạn' }
    };

    const config = variants[status as keyof typeof variants];
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

      {/* Low Quota Alert */}
      {isQuotaLow && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-amber-800">
              <strong>Quota sắp hết!</strong> Bạn chỉ còn {quotaRemaining} hóa đơn.
              Mua thêm quota để không bị gián đoạn dịch vụ.
            </span>
            <Button
              size="sm"
              onClick={handleNavigateToResourceCenter}
              className="bg-primary hover:bg-primary/90 ml-4"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Mua ngay
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <ZenKPITile
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Charts and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Invoices by Day */}
        <ZenBarChart
          data={invoicesByDay}
          title="Invoices by Day"
          className="lg:col-span-2"
        />

        {/* Alerts Center */}
        <ZenAlertCenter alerts={alerts} />
      </div>

      {/* Recent Invoices and AI/Quota Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
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
                      <Button variant="ghost" size="sm">
                        <Send className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                  Còn lại {quotaRemaining.toLocaleString()} hóa đơn trong tháng này
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
        </div>
      </div>


    </div>
  );
};