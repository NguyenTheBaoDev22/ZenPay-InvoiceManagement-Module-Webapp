import React, { useState } from 'react';
import { ZenButton } from '../zenshop/ZenButton';
import { ZenStatusChip } from '../zenshop/ZenStatusChip';
import { ZenTimeline } from '../zenshop/ZenTimeline';
import { ZenCodeViewer } from '../zenshop/ZenCodeViewer';
import { 
  ArrowLeftIcon,
  DownloadIcon,
  SendIcon,
  EditIcon,
  MoreHorizontalIcon,
  FileTextIcon,
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  CreditCardIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon
} from 'lucide-react';

export const InvoiceDetail: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'json' | 'xml'>('details');

  // Mock invoice data
  const invoiceData = {
    id: 'INV-2024-001',
    status: 'paid',
    customer: {
      name: 'Acme Corporation',
      email: 'billing@acmecorp.com',
      address: '123 Business St, Suite 100, New York, NY 10001',
      taxId: 'US123456789',
    },
    amount: '$2,500.00',
    issueDate: '2024-01-15',
    dueDate: '2024-02-14',
    series: 'A',
    currency: 'USD',
    lineItems: [
      { description: 'Web Development Services', quantity: 1, rate: '$2,000.00', amount: '$2,000.00' },
      { description: 'Domain Registration (1 year)', quantity: 1, rate: '$25.00', amount: '$25.00' },
      { description: 'SSL Certificate', quantity: 1, rate: '$100.00', amount: '$100.00' },
    ],
    subtotal: '$2,125.00',
    tax: '$375.00',
    total: '$2,500.00',
  };

  // Mock timeline data
  const timelineEvents = [
    {
      id: '1',
      title: 'Payment Received',
      description: 'Payment of $2,500.00 received via bank transfer',
      timestamp: '2 hours ago',
      type: 'paid' as const,
      icon: CreditCardIcon,
    },
    {
      id: '2',
      title: 'Invoice Viewed',
      description: 'Customer viewed the invoice',
      timestamp: '1 day ago',
      type: 'viewed' as const,
      icon: EyeIcon,
    },
    {
      id: '3',
      title: 'Invoice Sent',
      description: 'Invoice sent to billing@acmecorp.com',
      timestamp: '2 days ago',
      type: 'sent' as const,
      icon: SendIcon,
    },
    {
      id: '4',
      title: 'Invoice Created',
      description: 'Invoice INV-2024-001 created in draft status',
      timestamp: '3 days ago',
      type: 'created' as const,
      icon: FileTextIcon,
    },
  ];

  // Mock JSON data
  const jsonData = {
    "invoice": {
      "id": "INV-2024-001",
      "series": "A",
      "number": "001",
      "issueDate": "2024-01-15",
      "dueDate": "2024-02-14",
      "currency": "USD",
      "status": "paid",
      "customer": {
        "name": "Acme Corporation",
        "email": "billing@acmecorp.com",
        "address": "123 Business St, Suite 100, New York, NY 10001",
        "taxId": "US123456789"
      },
      "lineItems": [
        {
          "description": "Web Development Services",
          "quantity": 1,
          "unitPrice": 2000.00,
          "totalPrice": 2000.00
        }
      ],
      "totals": {
        "subtotal": 2125.00,
        "tax": 375.00,
        "total": 2500.00
      }
    }
  };

  // Mock XML data
  const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:invoice:1.0">
  <InvoiceHeader>
    <ID>INV-2024-001</ID>
    <IssueDate>2024-01-15</IssueDate>
    <DueDate>2024-02-14</DueDate>
    <Currency>USD</Currency>
    <Status>paid</Status>
  </InvoiceHeader>
  <Customer>
    <Name>Acme Corporation</Name>
    <Email>billing@acmecorp.com</Email>
    <Address>123 Business St, Suite 100, New York, NY 10001</Address>
    <TaxID>US123456789</TaxID>
  </Customer>
  <LineItems>
    <LineItem>
      <Description>Web Development Services</Description>
      <Quantity>1</Quantity>
      <UnitPrice>2000.00</UnitPrice>
      <TotalPrice>2000.00</TotalPrice>
    </LineItem>
  </LineItems>
  <Totals>
    <Subtotal>2125.00</Subtotal>
    <Tax>375.00</Tax>
    <Total>2500.00</Total>
  </Totals>
</Invoice>`;

  const tabs = [
    { id: 'details', label: 'Details', icon: FileTextIcon },
    { id: 'history', label: 'History', icon: ClockIcon },
    { id: 'json', label: 'JSON', icon: FileTextIcon },
    { id: 'xml', label: 'XML', icon: FileTextIcon },
  ] as const;

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ZenButton variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Invoices
            </ZenButton>
            <div className="h-6 w-px bg-[#E5E7EB]" />
            <div>
              <h1 className="text-xl font-semibold text-[#1F2937]">{invoiceData.id}</h1>
              <div className="flex items-center gap-2 mt-1">
                <ZenStatusChip status={invoiceData.status as any} size="sm" />
                <span className="text-sm text-[#6B7280]">{invoiceData.customer.name}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ZenButton variant="secondary" size="sm">
              <DownloadIcon className="h-4 w-4" />
              Download PDF
            </ZenButton>
            <ZenButton variant="secondary" size="sm">
              <SendIcon className="h-4 w-4" />
              Resend
            </ZenButton>
            <ZenButton size="sm">
              <EditIcon className="h-4 w-4" />
              Edit
            </ZenButton>
            <button className="p-2 text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] rounded-lg transition-colors">
              <MoreHorizontalIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - PDF Preview */}
        <div className="flex-1 bg-white border-r border-[#E5E7EB] p-8">
          <div className="h-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileTextIcon className="h-16 w-16 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#1F2937] mb-2">PDF Preview</h3>
              <p className="text-[#6B7280] mb-4">Invoice PDF would be rendered here</p>
              <ZenButton variant="secondary">
                <DownloadIcon className="h-4 w-4" />
                Download PDF
              </ZenButton>
            </div>
          </div>
        </div>

        {/* Right Panel - Tabbed Interface */}
        <div className="w-96 bg-white flex flex-col">
          {/* Tab Navigation */}
          <div className="border-b border-[#E5E7EB]">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#FF6A3D] text-[#FF6A3D]'
                        : 'border-transparent text-[#6B7280] hover:text-[#374151]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'details' && (
              <div className="p-6 space-y-6">
                {/* Invoice Summary */}
                <div>
                  <h3 className="font-medium text-[#1F2937] mb-4">Invoice Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Total Amount:</span>
                      <span className="font-medium text-[#1F2937]">{invoiceData.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Issue Date:</span>
                      <span className="text-[#1F2937]">{invoiceData.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Due Date:</span>
                      <span className="text-[#1F2937]">{invoiceData.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Series:</span>
                      <span className="text-[#1F2937]">{invoiceData.series}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="font-medium text-[#1F2937] mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <UserIcon className="h-4 w-4 text-[#6B7280] mt-0.5" />
                      <div>
                        <div className="font-medium text-[#1F2937]">{invoiceData.customer.name}</div>
                        <div className="text-[#6B7280]">{invoiceData.customer.email}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-4 w-4 text-[#6B7280] mt-0.5" />
                      <div className="text-[#6B7280]">{invoiceData.customer.address}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileTextIcon className="h-4 w-4 text-[#6B7280]" />
                      <span className="text-[#6B7280]">Tax ID: {invoiceData.customer.taxId}</span>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <h3 className="font-medium text-[#1F2937] mb-4">Line Items</h3>
                  <div className="space-y-3">
                    {invoiceData.lineItems.map((item, index) => (
                      <div key={index} className="p-3 bg-[#F8FAFC] rounded-lg">
                        <div className="font-medium text-[#1F2937] mb-1">{item.description}</div>
                        <div className="flex justify-between text-sm text-[#6B7280]">
                          <span>Qty: {item.quantity} × {item.rate}</span>
                          <span className="font-medium text-[#1F2937]">{item.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Subtotal:</span>
                      <span className="text-[#1F2937]">{invoiceData.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Tax:</span>
                      <span className="text-[#1F2937]">{invoiceData.tax}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-[#1F2937]">Total:</span>
                      <span className="text-[#1F2937]">{invoiceData.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="p-6">
                <h3 className="font-medium text-[#1F2937] mb-4">Invoice Timeline</h3>
                <ZenTimeline events={timelineEvents} />
              </div>
            )}

            {activeTab === 'json' && (
              <div className="p-6">
                <ZenCodeViewer
                  code={JSON.stringify(jsonData, null, 2)}
                  language="json"
                  title="Invoice JSON Data"
                />
              </div>
            )}

            {activeTab === 'xml' && (
              <div className="p-6">
                <ZenCodeViewer
                  code={xmlData}
                  language="xml"
                  title="Invoice XML Data"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};