import React from 'react';
import { LayoutTemplateIcon, ChevronDownIcon } from 'lucide-react';
import { useInvoiceWizard } from '../../../hooks/useInvoiceWizard';

export const TemplateSelectionStep: React.FC = () => {
  const { template, series, setTemplate, setSeries } = useInvoiceWizard();

  const templates = [
    { 
      id: 'classic' as const, 
      name: 'Classic', 
      preview: 'Traditional business format',
      enabled: true,
      isDefault: true
    },
    { 
      id: 'modern' as const, 
      name: 'Modern', 
      preview: 'Clean, minimal design',
      enabled: false
    },
    { 
      id: 'creative' as const, 
      name: 'Creative', 
      preview: 'Colorful, branded design',
      enabled: false
    }
  ];

  const seriesOptions = [
    { value: '1C25TYZ', label: '1C25TYZ' }
  ];

  // Auto-select classic template on mount using modern useEffect pattern
  React.useEffect(() => {
    if (template !== 'classic') {
      setTemplate('classic');
    }
    if (series !== '1C25TYZ') {
      setSeries('1C25TYZ');
    }
  }, []); // Empty dependency array since we only want this to run once

  return (
    <div className="space-y-6">
      <div className="text-center">
        <LayoutTemplateIcon className="h-12 w-12 text-[#FF6A3D] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#1F2937]">Choose Template & Series</h3>
        <p className="text-[#6B7280] mt-2">Select the design template and numbering series for your invoice</p>
      </div>

      {/* Invoice Template */}
      <div>
        <h4 className="font-medium text-[#1F2937] mb-4">Invoice Template</h4>
        <div className="grid grid-cols-3 gap-4">
          {templates.map((templateOption) => (
            <div
              key={templateOption.id}
              onClick={() => templateOption.enabled && setTemplate(templateOption.id)}
              className={`
                p-4 border-2 rounded-lg transition-all relative
                ${templateOption.enabled 
                  ? 'cursor-pointer hover:border-[#FF6A3D]/50' 
                  : 'cursor-not-allowed opacity-50'
                }
                ${template === templateOption.id && templateOption.enabled
                  ? 'border-[#FF6A3D] bg-[#FF6A3D]/5' 
                  : 'border-[#E5E7EB]'
                }
              `}
            >
              {!templateOption.enabled && (
                <div className="absolute inset-0 bg-gray-100/50 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </div>
              )}
              
              {templateOption.isDefault && templateOption.enabled && (
                <div className="absolute -top-2 -right-2 bg-[#FF6A3D] text-white text-xs px-2 py-1 rounded-full">
                  Default
                </div>
              )}
              
              {/* Template Preview */}
              <div className="h-24 bg-[#F8FAFC] rounded mb-2 flex items-center justify-center">
                {templateOption.id === 'classic' && (
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded flex flex-col p-2">
                    <div className="h-2 bg-gray-300 rounded mb-1"></div>
                    <div className="h-1 bg-gray-200 rounded mb-2"></div>
                    <div className="flex-1 border border-gray-200 rounded p-1">
                      <div className="h-1 bg-gray-200 rounded mb-1"></div>
                      <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                )}
                {templateOption.id === 'modern' && (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded opacity-50"></div>
                )}
                {templateOption.id === 'creative' && (
                  <div className="w-full h-full bg-gradient-to-br from-purple-50 to-purple-100 rounded opacity-50"></div>
                )}
              </div>
              
              <h5 className={`font-medium ${templateOption.enabled ? 'text-[#1F2937]' : 'text-[#9CA3AF]'}`}>
                {templateOption.name}
              </h5>
              <p className={`text-xs ${templateOption.enabled ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                {templateOption.preview}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Numbering Series */}
      <div>
        <h4 className="font-medium text-[#1F2937] mb-4">Numbering Series</h4>
        <div className="relative">
          <select
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            className="w-full px-3 py-2 text-base bg-white border border-[#E5E7EB] rounded-lg transition-all duration-150 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-[#FF6A3D] focus:ring-[#FF6A3D]/20 hover:border-[#D1D5DB]"
          >
            {seriesOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
        </div>
        <p className="text-sm text-[#6B7280] mt-2">
          Series format: {series}-YYYY-XXX (e.g., {series}-2025-001)
        </p>
      </div>

      {/* Selection Summary */}
      <div className="bg-[#F0F9FF] border border-[#0EA5E9]/20 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-[#0EA5E9] rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h4 className="font-medium text-[#1F2937] mb-1">Selection Summary</h4>
            <div className="text-sm text-[#6B7280] space-y-1">
              <p><span className="font-medium">Template:</span> {templates.find(t => t.id === template)?.name}</p>
              <p><span className="font-medium">Series:</span> {series}</p>
              <p><span className="font-medium">Next Invoice Number:</span> {series}-2025-001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
