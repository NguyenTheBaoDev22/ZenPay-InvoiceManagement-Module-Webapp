import React, { useState } from 'react';
import { ZenButton } from '../zenshop/ZenButton';
import { ZenInput, ZenSelect, ZenTextarea } from '../zenshop/ZenFormInputs';
import { ZenStatusChip } from '../zenshop/ZenStatusChip';
import { 
  LayoutTemplateIcon, 
  HashIcon, 
  ShieldCheckIcon, 
  UsersIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  DownloadIcon,
  UploadIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  SettingsIcon
} from 'lucide-react';

const tabs = [
  { id: 'templates', name: 'Templates', icon: <LayoutTemplateIcon className="h-4 w-4" /> },
  { id: 'numbering', name: 'Numbering Rules', icon: <HashIcon className="h-4 w-4" /> },
  { id: 'certificates', name: 'Certificates', icon: <ShieldCheckIcon className="h-4 w-4" /> },
  { id: 'permissions', name: 'Permissions', icon: <UsersIcon className="h-4 w-4" /> }
];

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'templates':
        return <TemplatesTab />;
      case 'numbering':
        return <NumberingTab />;
      case 'certificates':
        return <CertificatesTab />;
      case 'permissions':
        return <PermissionsTab />;
      default:
        return <TemplatesTab />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-6 w-6 text-[#FF6A3D]" />
          <h1 className="text-2xl font-semibold text-[#1F2937]">Settings</h1>
        </div>
        <p className="text-[#6B7280]">Manage your ZenShop configuration and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
        <div className="border-b border-[#E5E7EB]">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 border-b-2 transition-colors
                  ${activeTab === tab.id 
                    ? 'border-[#FF6A3D] text-[#FF6A3D] bg-[#FF6A3D]/5' 
                    : 'border-transparent text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8FAFC]'
                  }
                `}
              >
                {tab.icon}
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

const TemplatesTab: React.FC = () => {
  const templates = [
    { id: 1, name: 'Modern Invoice', type: 'Invoice', status: 'active', lastModified: '2024-01-15' },
    { id: 2, name: 'Classic Receipt', type: 'Receipt', status: 'active', lastModified: '2024-01-10' },
    { id: 3, name: 'Creative Quote', type: 'Quote', status: 'draft', lastModified: '2024-01-08' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#1F2937]">Invoice Templates</h3>
          <p className="text-[#6B7280]">Design and manage your invoice templates</p>
        </div>
        <ZenButton>
          <PlusIcon className="h-4 w-4" />
          New Template
        </ZenButton>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg overflow-hidden">
            {/* Preview */}
            <div className="h-32 bg-white border-b border-[#E5E7EB] flex items-center justify-center">
              <LayoutTemplateIcon className="h-12 w-12 text-[#6B7280]" />
            </div>
            
            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-[#1F2937]">{template.name}</h4>
                <ZenStatusChip 
                  status={template.status as any} 
                  size="sm" 
                />
              </div>
              <p className="text-sm text-[#6B7280] mb-3">{template.type}</p>
              <p className="text-xs text-[#6B7280] mb-3">Modified: {template.lastModified}</p>
              
              {/* Actions */}
              <div className="flex gap-2">
                <ZenButton size="sm" variant="secondary" className="flex-1">
                  <EditIcon className="h-3 w-3" />
                  Edit
                </ZenButton>
                <ZenButton size="sm" variant="ghost">
                  <TrashIcon className="h-3 w-3" />
                </ZenButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Editor Preview */}
      <div className="bg-[#F8FAFC] p-6 rounded-lg">
        <h4 className="font-medium text-[#1F2937] mb-4">Visual Template Editor</h4>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 min-h-[200px] flex items-center justify-center">
          <div className="text-center text-[#6B7280]">
            <LayoutTemplateIcon className="h-12 w-12 mx-auto mb-2" />
            <p>Select a template to start editing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const NumberingTab: React.FC = () => {
  const series = [
    { id: 'A', name: 'Series A', format: 'A-YYYY-NNN', nextNumber: 15, status: 'active' },
    { id: 'B', name: 'Series B', format: 'B-YYYY-NNN', nextNumber: 8, status: 'active' },
    { id: 'C', name: 'Series C', format: 'C-YYYY-NNN', nextNumber: 1, status: 'inactive' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#1F2937]">Numbering Rules</h3>
          <p className="text-[#6B7280]">Configure invoice numbering series and formats</p>
        </div>
        <ZenButton>
          <PlusIcon className="h-4 w-4" />
          New Series
        </ZenButton>
      </div>

      {/* Current Series */}
      <div className="space-y-4">
        {series.map((item) => (
          <div key={item.id} className="bg-white border border-[#E5E7EB] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FF6A3D]/10 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-[#FF6A3D]">{item.id}</span>
                </div>
                <div>
                  <h4 className="font-medium text-[#1F2937]">{item.name}</h4>
                  <p className="text-sm text-[#6B7280]">Format: {item.format}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-[#6B7280]">Next Number</p>
                  <p className="font-medium text-[#1F2937]">{item.nextNumber}</p>
                </div>
                <ZenStatusChip status={item.status as any} size="sm" />
                <ZenButton size="sm" variant="ghost">
                  <EditIcon className="h-4 w-4" />
                </ZenButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Format Configuration */}
      <div className="bg-[#F8FAFC] p-6 rounded-lg">
        <h4 className="font-medium text-[#1F2937] mb-4">Format Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ZenInput label="Series Prefix" placeholder="A" />
          <ZenInput label="Year Format" placeholder="YYYY" />
          <ZenInput label="Number Format" placeholder="NNN (3 digits)" />
          <ZenInput label="Separator" placeholder="-" />
        </div>
        <div className="mt-4 p-3 bg-white rounded border">
          <p className="text-sm text-[#6B7280] mb-1">Preview:</p>
          <p className="font-medium text-[#1F2937]">A-2024-015</p>
        </div>
      </div>
    </div>
  );
};

const CertificatesTab: React.FC = () => {
  const certificates = [
    { 
      id: 1, 
      name: 'ZenShop Digital Certificate', 
      issuer: 'DigiCert Inc.', 
      validUntil: '2025-12-31', 
      status: 'active',
      type: 'Production'
    },
    { 
      id: 2, 
      name: 'Test Certificate', 
      issuer: 'ZenShop CA', 
      validUntil: '2024-06-30', 
      status: 'expired',
      type: 'Testing'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#1F2937]">Digital Certificates</h3>
          <p className="text-[#6B7280]">Manage certificates for digital signature and authentication</p>
        </div>
        <ZenButton>
          <PlusIcon className="h-4 w-4" />
          Add Certificate
        </ZenButton>
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white border border-[#E5E7EB] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${cert.status === 'active' ? 'bg-[#22C55E]/10' : 'bg-[#EF4444]/10'}
                `}>
                  {cert.status === 'active' ? (
                    <CheckCircleIcon className="h-5 w-5 text-[#22C55E]" />
                  ) : (
                    <AlertTriangleIcon className="h-5 w-5 text-[#EF4444]" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-[#1F2937]">{cert.name}</h4>
                  <p className="text-sm text-[#6B7280]">Issued by: {cert.issuer}</p>
                  <p className="text-sm text-[#6B7280]">Valid until: {cert.validUntil}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <ZenStatusChip status={cert.status as any} size="sm" />
                  <p className="text-xs text-[#6B7280] mt-1">{cert.type}</p>
                </div>
                <div className="flex gap-2">
                  <ZenButton size="sm" variant="ghost">
                    <DownloadIcon className="h-4 w-4" />
                  </ZenButton>
                  <ZenButton size="sm" variant="ghost">
                    <TrashIcon className="h-4 w-4" />
                  </ZenButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connection Guide */}
      <div className="bg-[#F8FAFC] p-6 rounded-lg">
        <h4 className="font-medium text-[#1F2937] mb-4">Certificate Connection Guide</h4>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-[#FF6A3D]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-[#FF6A3D]">1</span>
            </div>
            <div>
              <p className="font-medium text-[#1F2937]">Generate Certificate Request</p>
              <p className="text-sm text-[#6B7280]">Create a certificate signing request (CSR) from your system</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-[#FF6A3D]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-[#FF6A3D]">2</span>
            </div>
            <div>
              <p className="font-medium text-[#1F2937]">Submit to Certificate Authority</p>
              <p className="text-sm text-[#6B7280]">Send your CSR to a trusted certificate authority for signing</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-[#FF6A3D]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-[#FF6A3D]">3</span>
            </div>
            <div>
              <p className="font-medium text-[#1F2937]">Install Certificate</p>
              <p className="text-sm text-[#6B7280]">Upload the signed certificate to ZenShop for digital signatures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PermissionsTab: React.FC = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Editor', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Viewer', status: 'inactive' }
  ];

  const roles = [
    {
      name: 'Admin',
      permissions: ['Create invoices', 'Edit settings', 'Manage users', 'View reports', 'Digital signatures']
    },
    {
      name: 'Editor', 
      permissions: ['Create invoices', 'Edit templates', 'View reports', 'Digital signatures']
    },
    {
      name: 'Viewer',
      permissions: ['View invoices', 'View reports']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#1F2937]">User Permissions</h3>
          <p className="text-[#6B7280]">Manage user access and permissions</p>
        </div>
        <ZenButton>
          <PlusIcon className="h-4 w-4" />
          Invite User
        </ZenButton>
      </div>

      {/* Users List */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB]">
          <h4 className="font-medium text-[#1F2937]">Team Members</h4>
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {users.map((user) => (
            <div key={user.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF6A3D]/10 rounded-full flex items-center justify-center">
                  <span className="font-medium text-[#FF6A3D]">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[#1F2937]">{user.name}</p>
                  <p className="text-sm text-[#6B7280]">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ZenSelect value={user.role} className="min-w-[100px]">
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </ZenSelect>
                <ZenStatusChip status={user.status as any} size="sm" />
                <ZenButton size="sm" variant="ghost">
                  <EditIcon className="h-4 w-4" />
                </ZenButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Permissions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.name} className="bg-white border border-[#E5E7EB] rounded-lg p-4">
            <h4 className="font-medium text-[#1F2937] mb-3">{role.name}</h4>
            <div className="space-y-2">
              {role.permissions.map((permission, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-[#22C55E]" />
                  <span className="text-sm text-[#6B7280]">{permission}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};