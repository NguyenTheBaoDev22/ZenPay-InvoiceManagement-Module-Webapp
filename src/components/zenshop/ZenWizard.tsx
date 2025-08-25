import React, { useState } from 'react';
import { ZenButton } from './ZenButton';
import { ZenSelect, ZenInput, ZenTextarea } from './ZenFormInputs';
import { ZenStatusChip } from './ZenStatusChip';
import { motion } from 'motion/react';
import { 
  CheckIcon, 
  XIcon,
  FileTextIcon,
  MapPinIcon,
  LayoutTemplateIcon,
  PenToolIcon,
  CheckCircleIcon,
  UploadIcon,
  SearchIcon,
  EditIcon
} from 'lucide-react';

interface ZenWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (data: any) => void;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: WizardStep[] = [
  {
    id: 'source',
    title: 'Select Order Source',
    description: 'Choose data source for the invoice',
    icon: <FileTextIcon className="h-5 w-5" />
  },
  {
    id: 'mapping',
    title: 'Map & Verify Data',
    description: 'Review and adjust imported data',
    icon: <MapPinIcon className="h-5 w-5" />
  },
  {
    id: 'template',
    title: 'Choose Template & Series',
    description: 'Select design and numbering',
    icon: <LayoutTemplateIcon className="h-5 w-5" />
  },
  {
    id: 'sign',
    title: 'Sign & Issue',
    description: 'Digital signature and issue options',
    icon: <PenToolIcon className="h-5 w-5" />
  },
  {
    id: 'result',
    title: 'Result',
    description: 'Invoice creation summary',
    icon: <CheckCircleIcon className="h-5 w-5" />
  }
];

export const ZenWizard: React.FC<ZenWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState({
    source: '',
    orderData: null,
    template: '',
    series: '',
    issueOption: 'now'
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete?.(wizardData);
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <OrderSourceStep data={wizardData} onUpdate={setWizardData} />;
      case 1:
        return <DataMappingStep data={wizardData} onUpdate={setWizardData} />;
      case 2:
        return <TemplateSelectionStep data={wizardData} onUpdate={setWizardData} />;
      case 3:
        return <SignIssueStep data={wizardData} onUpdate={setWizardData} />;
      case 4:
        return <ResultStep data={wizardData} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#1F2937]">Issue New Invoice</h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#6B7280] hover:text-[#374151] rounded"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-[#F8FAFC]">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                  ${index <= currentStep 
                    ? 'bg-[#FF6A3D] border-[#FF6A3D] text-white' 
                    : 'bg-white border-[#E5E7EB] text-[#6B7280]'
                  }
                `}>
                  {index < currentStep ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mx-2 transition-colors
                    ${index < currentStep ? 'bg-[#FF6A3D]' : 'bg-[#E5E7EB]'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div key={step.id} className="text-center" style={{ width: '120px' }}>
                <p className={`text-xs font-medium ${index <= currentStep ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px] max-h-[calc(90vh-200px)] overflow-y-auto">
          {renderStep()}
        </div>

        {/* Footer */}
        {currentStep < steps.length - 1 && (
          <div className="border-t border-[#E5E7EB] px-6 py-4 flex justify-between">
            <ZenButton 
              variant="ghost" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </ZenButton>
            <ZenButton onClick={handleNext}>
              {currentStep === steps.length - 2 ? 'Complete' : 'Next'}
            </ZenButton>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Step Components
const OrderSourceStep: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
  const sources = [
    { id: 'manual', name: 'Manual Entry', description: 'Create invoice from scratch' },
    { id: 'csv', name: 'CSV Import', description: 'Upload customer data from CSV file' },
    { id: 'api', name: 'API Integration', description: 'Pull data from connected system' },
    { id: 'template', name: 'From Template', description: 'Use existing invoice template' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileTextIcon className="h-12 w-12 text-[#FF6A3D] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#1F2937]">Choose Your Data Source</h3>
        <p className="text-[#6B7280] mt-2">Select how you'd like to import or create invoice data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((source) => (
          <div
            key={source.id}
            onClick={() => onUpdate({ ...data, source: source.id })}
            className={`
              p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#FF6A3D]/50
              ${data.source === source.id ? 'border-[#FF6A3D] bg-[#FF6A3D]/5' : 'border-[#E5E7EB]'}
            `}
          >
            <h4 className="font-medium text-[#1F2937]">{source.name}</h4>
            <p className="text-sm text-[#6B7280] mt-1">{source.description}</p>
          </div>
        ))}
      </div>

      {data.source === 'csv' && (
        <div className="mt-6 p-4 border-2 border-dashed border-[#E5E7EB] rounded-lg text-center">
          <UploadIcon className="h-8 w-8 text-[#6B7280] mx-auto mb-2" />
          <p className="text-sm text-[#6B7280]">Drop your CSV file here or click to browse</p>
          <ZenButton variant="secondary" size="sm" className="mt-2">
            Choose File
          </ZenButton>
        </div>
      )}
    </div>
  );
};

const DataMappingStep: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
  const mockData = {
    customer: 'Acme Corporation',
    email: 'accounting@acme.com',
    items: [
      { description: 'Web Development Services', quantity: 1, price: 2500 },
      { description: 'Domain Registration', quantity: 1, price: 15 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <MapPinIcon className="h-12 w-12 text-[#FF6A3D] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#1F2937]">Review & Map Data</h3>
        <p className="text-[#6B7280] mt-2">Verify the imported data and make any necessary adjustments</p>
      </div>

      <div className="bg-[#F8FAFC] p-4 rounded-lg">
        <h4 className="font-medium text-[#1F2937] mb-4">Customer Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ZenInput label="Customer Name" value={mockData.customer} />
          <ZenInput label="Email Address" value={mockData.email} />
        </div>
      </div>

      <div className="bg-[#F8FAFC] p-4 rounded-lg">
        <h4 className="font-medium text-[#1F2937] mb-4">Line Items</h4>
        <div className="space-y-3">
          {mockData.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg">
              <div className="flex-1">
                <ZenInput value={item.description} />
              </div>
              <div className="w-20">
                <ZenInput value={item.quantity.toString()} />
              </div>
              <div className="w-24">
                <ZenInput value={`$${item.price}`} />
              </div>
              <button className="p-2 text-[#6B7280] hover:text-[#EF4444]">
                <EditIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TemplateSelectionStep: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
  const templates = [
    { id: 'modern', name: 'Modern', preview: 'Clean, minimal design' },
    { id: 'classic', name: 'Classic', preview: 'Traditional business format' },
    { id: 'creative', name: 'Creative', preview: 'Colorful, branded design' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <LayoutTemplateIcon className="h-12 w-12 text-[#FF6A3D] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#1F2937]">Choose Template & Series</h3>
        <p className="text-[#6B7280] mt-2">Select the design template and numbering series for your invoice</p>
      </div>

      <div>
        <h4 className="font-medium text-[#1F2937] mb-4">Invoice Template</h4>
        <div className="grid grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onUpdate({ ...data, template: template.id })}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#FF6A3D]/50
                ${data.template === template.id ? 'border-[#FF6A3D] bg-[#FF6A3D]/5' : 'border-[#E5E7EB]'}
              `}
            >
              <div className="h-24 bg-[#F8FAFC] rounded mb-2"></div>
              <h5 className="font-medium text-[#1F2937]">{template.name}</h5>
              <p className="text-xs text-[#6B7280]">{template.preview}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-[#1F2937] mb-4">Numbering Series</h4>
        <ZenSelect 
          value={data.series} 
          onChange={(e) => onUpdate({ ...data, series: e.target.value })}
        >
          <option value="">Select Series</option>
          <option value="A">Series A (A-2024-001)</option>
          <option value="B">Series B (B-2024-001)</option>
          <option value="C">Series C (C-2024-001)</option>
        </ZenSelect>
      </div>
    </div>
  );
};

const SignIssueStep: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <PenToolIcon className="h-12 w-12 text-[#FF6A3D] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#1F2937]">Sign & Issue Invoice</h3>
        <p className="text-[#6B7280] mt-2">Apply digital signature and choose issuing options</p>
      </div>

      <div className="bg-[#F8FAFC] p-4 rounded-lg">
        <h4 className="font-medium text-[#1F2937] mb-4">Digital Signature</h4>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
          <CheckCircleIcon className="h-5 w-5 text-[#22C55E]" />
          <div>
            <p className="font-medium text-[#1F2937]">Certificate Connected</p>
            <p className="text-sm text-[#6B7280]">ZenShop Digital Certificate (Valid until 2025-12-31)</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-[#1F2937] mb-4">Issue Options</h4>
        <div className="space-y-3">
          <div
            onClick={() => onUpdate({ ...data, issueOption: 'now' })}
            className={`
              p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#FF6A3D]/50
              ${data.issueOption === 'now' ? 'border-[#FF6A3D] bg-[#FF6A3D]/5' : 'border-[#E5E7EB]'}
            `}
          >
            <h5 className="font-medium text-[#1F2937]">Issue Now</h5>
            <p className="text-sm text-[#6B7280]">Send invoice immediately to customer</p>
          </div>
          <div
            onClick={() => onUpdate({ ...data, issueOption: 'queue' })}
            className={`
              p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#FF6A3D]/50
              ${data.issueOption === 'queue' ? 'border-[#FF6A3D] bg-[#FF6A3D]/5' : 'border-[#E5E7EB]'}
            `}
          >
            <h5 className="font-medium text-[#1F2937]">Add to Queue</h5>
            <p className="text-sm text-[#6B7280]">Save as draft for manual review and sending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultStep: React.FC<{ data: any; onComplete: () => void }> = ({ data, onComplete }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="h-8 w-8 text-[#22C55E]" />
        </div>
        <h3 className="text-lg font-semibold text-[#1F2937]">Invoice Created Successfully!</h3>
        <p className="text-[#6B7280] mt-2">Your invoice has been processed and is ready</p>
      </div>

      <div className="bg-[#F8FAFC] p-6 rounded-lg">
        <div className="text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Invoice Number:</span>
            <span className="font-medium text-[#1F2937]">INV-2024-007</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Status:</span>
            <ZenStatusChip status={data.issueOption === 'now' ? 'sent' : 'draft'} size="sm" />
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Amount:</span>
            <span className="font-medium text-[#1F2937]">$2,515.00</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <ZenButton variant="secondary">
          View Invoice
        </ZenButton>
        <ZenButton onClick={onComplete}>
          Create Another
        </ZenButton>
      </div>
    </div>
  );
};