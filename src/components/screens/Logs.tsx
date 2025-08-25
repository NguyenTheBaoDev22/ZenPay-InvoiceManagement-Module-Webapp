import React, { useState } from 'react';
import { ZenButton } from '../zenshop/ZenButton';
import { ZenSearchField } from '../zenshop/ZenSearchField';
import { ZenSelect, ZenDateRangePicker } from '../zenshop/ZenFormInputs';
import { ZenDataGrid, ZenColumn } from '../zenshop/ZenDataGrid';
import { ZenStatusChip } from '../zenshop/ZenStatusChip';
import { 
  FilterIcon, 
  DownloadIcon, 
  RefreshCwIcon,
  AlertTriangleIcon,
  InfoIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DatabaseIcon
} from 'lucide-react';

type LogLevel = 'info' | 'warning' | 'error' | 'success';
type LogCategory = 'invoice' | 'auth' | 'api' | 'system' | 'payment';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  correlationId: string;
  userId?: string;
  httpStatus?: number;
  latencyMs?: number;
  details?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-16 10:32:15',
    level: 'info',
    category: 'invoice',
    message: 'Invoice INV-2024-007 created successfully',
    correlationId: 'req_abc123',
    userId: 'user_456',
    httpStatus: 201,
    latencyMs: 245,
    details: 'Customer: Acme Corp, Amount: $2,500.00'
  },
  {
    id: '2',
    timestamp: '2024-01-16 10:31:48',
    level: 'warning',
    category: 'auth',
    message: 'Failed login attempt from IP 192.168.1.100',
    correlationId: 'req_def456',
    httpStatus: 401,
    latencyMs: 120,
    details: 'Username: john@example.com, Reason: Invalid password'
  },
  {
    id: '3',
    timestamp: '2024-01-16 10:30:22',
    level: 'error',
    category: 'api',
    message: 'External API timeout - Certificate validation failed',
    correlationId: 'req_ghi789',
    httpStatus: 504,
    latencyMs: 30000,
    details: 'Endpoint: /api/v1/certificates/validate, Timeout: 30s'
  },
  {
    id: '4',
    timestamp: '2024-01-16 10:29:55',
    level: 'success',
    category: 'payment',
    message: 'Payment processed for quota purchase',
    correlationId: 'req_jkl012',
    userId: 'user_789',
    httpStatus: 200,
    latencyMs: 1250,
    details: 'Package: Professional, Amount: $99.00'
  },
  {
    id: '5',
    timestamp: '2024-01-16 10:28:33',
    level: 'info',
    category: 'system',
    message: 'Database backup completed successfully',
    correlationId: 'sys_backup_001',
    latencyMs: 45000,
    details: 'Size: 2.3GB, Location: s3://backups/2024-01-16/'
  },
  {
    id: '6',
    timestamp: '2024-01-16 10:27:11',
    level: 'error',
    category: 'invoice',
    message: 'Digital signature generation failed',
    correlationId: 'req_mno345',
    userId: 'user_123',
    httpStatus: 500,
    latencyMs: 5500,
    details: 'Certificate expired, Invoice: INV-2024-006'
  }
];

export const Logs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const levelColors: Record<LogLevel, { bg: string; text: string; icon: React.ReactNode }> = {
    info: { 
      bg: 'bg-[#0EA5E9]/10', 
      text: 'text-[#0EA5E9]', 
      icon: <InfoIcon className="h-3 w-3" /> 
    },
    warning: { 
      bg: 'bg-[#F59E0B]/10', 
      text: 'text-[#F59E0B]', 
      icon: <AlertTriangleIcon className="h-3 w-3" /> 
    },
    error: { 
      bg: 'bg-[#EF4444]/10', 
      text: 'text-[#EF4444]', 
      icon: <XCircleIcon className="h-3 w-3" /> 
    },
    success: { 
      bg: 'bg-[#22C55E]/10', 
      text: 'text-[#22C55E]', 
      icon: <CheckCircleIcon className="h-3 w-3" /> 
    }
  };

  const columns: ZenColumn[] = [
    { 
      key: 'timestamp', 
      label: 'Timestamp', 
      sortable: true, 
      width: '160px',
      render: (value) => (
        <div className="flex items-center gap-2">
          <ClockIcon className="h-3 w-3 text-[#6B7280]" />
          <span className="text-xs font-mono">{value}</span>
        </div>
      )
    },
    { 
      key: 'level', 
      label: 'Level', 
      width: '100px',
      render: (value: LogLevel) => {
        const config = levelColors[value];
        return (
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.icon}
            {value.toUpperCase()}
          </div>
        );
      }
    },
    { 
      key: 'category', 
      label: 'Category', 
      width: '100px',
      render: (value: LogCategory) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#F3F4F6] text-[#6B7280]">
          {value}
        </span>
      )
    },
    { 
      key: 'message', 
      label: 'Message', 
      sortable: true,
      render: (value) => (
        <span className="text-sm text-[#1F2937] line-clamp-2">{value}</span>
      )
    },
    { 
      key: 'correlationId', 
      label: 'Correlation ID', 
      width: '120px',
      render: (value) => (
        <span className="text-xs font-mono text-[#6B7280] bg-[#F3F4F6] px-2 py-1 rounded">
          {value}
        </span>
      )
    },
    { 
      key: 'httpStatus', 
      label: 'Status', 
      width: '80px', 
      align: 'center',
      render: (value?: number) => value ? (
        <span className={`
          text-xs font-medium px-2 py-1 rounded
          ${value < 300 ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
            value < 400 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 
            'bg-[#EF4444]/10 text-[#EF4444]'
          }
        `}>
          {value}
        </span>
      ) : (
        <span className="text-[#9CA3AF]">-</span>
      )
    },
    { 
      key: 'latencyMs', 
      label: 'Latency', 
      width: '80px', 
      align: 'right',
      render: (value?: number) => value ? (
        <span className={`
          text-xs font-mono
          ${value > 5000 ? 'text-[#EF4444]' : 
            value > 1000 ? 'text-[#F59E0B]' : 
            'text-[#6B7280]'
          }
        `}>
          {value}ms
        </span>
      ) : (
        <span className="text-[#9CA3AF]">-</span>
      )
    }
  ];

  const handleRowSelect = (rowId: string) => {
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedRows(selected ? mockLogs.map(log => log.id) : []);
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = !searchQuery || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.correlationId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel || log.level === selectedLevel;
    const matchesCategory = !selectedCategory || log.category === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DatabaseIcon className="h-6 w-6 text-[#FF6A3D]" />
          <div>
            <h1 className="text-2xl font-semibold text-[#1F2937]">Logs & Alerts</h1>
            <p className="text-[#6B7280] mt-1">Monitor system activity and troubleshoot issues</p>
          </div>
        </div>
        <div className="flex gap-3">
          <ZenButton variant="secondary">
            <RefreshCwIcon className="h-4 w-4" />
            Refresh
          </ZenButton>
          <ZenButton variant="secondary">
            <DownloadIcon className="h-4 w-4" />
            Export Logs
          </ZenButton>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Total Events</p>
              <p className="text-2xl font-semibold text-[#1F2937]">1,234</p>
            </div>
            <InfoIcon className="h-8 w-8 text-[#0EA5E9]" />
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Warnings</p>
              <p className="text-2xl font-semibold text-[#F59E0B]">23</p>
            </div>
            <AlertTriangleIcon className="h-8 w-8 text-[#F59E0B]" />
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Errors</p>
              <p className="text-2xl font-semibold text-[#EF4444]">5</p>
            </div>
            <XCircleIcon className="h-8 w-8 text-[#EF4444]" />
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Avg Latency</p>
              <p className="text-2xl font-semibold text-[#1F2937]">245ms</p>
            </div>
            <ClockIcon className="h-8 w-8 text-[#6B7280]" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="flex-1 max-w-md">
            <ZenSearchField
              placeholder="Search logs, correlation IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>
          
          <div className="flex gap-3">
            <ZenSelect 
              value={selectedLevel} 
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="min-w-[120px]"
            >
              <option value="">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </ZenSelect>
            
            <ZenSelect 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="min-w-[120px]"
            >
              <option value="">All Categories</option>
              <option value="invoice">Invoice</option>
              <option value="auth">Authentication</option>
              <option value="api">API</option>
              <option value="system">System</option>
              <option value="payment">Payment</option>
            </ZenSelect>

            <ZenDateRangePicker />
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <ZenDataGrid
        columns={columns}
        data={filteredLogs.map(log => ({ ...log, actions: null }))}
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
        totalPages={10}
        totalItems={filteredLogs.length}
        itemsPerPage={25}
        onPageChange={setCurrentPage}
        onRowClick={(row) => console.log('View log details:', row.correlationId)}
        className="min-h-[400px]"
      />

      {/* Log Details Panel (when row is clicked) */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h4 className="font-medium text-[#1F2937] mb-4">Log Details</h4>
        <div className="bg-[#F8FAFC] p-4 rounded-lg">
          <pre className="text-sm text-[#6B7280] whitespace-pre-wrap font-mono">
            {selectedRows.length > 0 
              ? JSON.stringify(mockLogs.find(log => log.id === selectedRows[0]), null, 2)
              : 'Select a log entry to view details'
            }
          </pre>
        </div>
      </div>
    </div>
  );
};