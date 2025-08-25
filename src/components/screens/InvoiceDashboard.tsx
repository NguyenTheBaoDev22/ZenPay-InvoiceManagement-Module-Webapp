import React from 'react';
import { ZenKPITile } from '../zenshop/ZenKPITile';
import { ZenBarChart, ZenPieChart } from '../zenshop/ZenCharts';
import { ZenAlertCenter } from '../zenshop/ZenAlertCenter';
import { 
  FileTextIcon, 
  TrendingUpIcon, 
  TargetIcon, 
  ShieldCheckIcon 
} from 'lucide-react';

interface InvoiceDashboardProps {
  onCreateInvoice?: () => void;
}

export const InvoiceDashboard: React.FC<InvoiceDashboardProps> = ({ onCreateInvoice }) => {
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

  // Mock data for pie chart
  const statusBreakdown = [
    { name: 'Paid', value: 45, color: '#22C55E' },
    { name: 'Pending', value: 23, color: '#F59E0B' },
    { name: 'Sent', value: 18, color: '#0EA5E9' },
    { name: 'Draft', value: 8, color: '#6B7280' },
    { name: 'Failed', value: 6, color: '#EF4444' },
  ];

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

      {/* Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ZenPieChart
          data={statusBreakdown}
          title="Status Breakdown"
        />

        {/* Additional metrics or quick actions could go here */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <h3 className="text-lg font-medium text-[#1F2937] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-[#F8FAFC] hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <div className="font-medium text-[#1F2937]">Generate Monthly Report</div>
              <div className="text-sm text-[#6B7280]">Export detailed analytics for January</div>
            </button>
            <button className="w-full text-left p-3 bg-[#F8FAFC] hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <div className="font-medium text-[#1F2937]">Check System Status</div>
              <div className="text-sm text-[#6B7280]">View current API status and uptime</div>
            </button>
            <button className="w-full text-left p-3 bg-[#F8FAFC] hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <div className="font-medium text-[#1F2937]">Update Certificate</div>
              <div className="text-sm text-[#6B7280]">Manage e-invoice certificates</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};