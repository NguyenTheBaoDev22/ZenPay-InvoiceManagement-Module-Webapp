import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckIcon, 
  XIcon,
  FileTextIcon,
  MapPinIcon,
  LayoutTemplateIcon,
  PenToolIcon,
  CheckCircleIcon
} from 'lucide-react';
import { ZenButton } from '../../../components/zenshop/ZenButton';
import { OrderSourceStep } from './steps/OrderSourceStep';
import { DataMappingStep } from './steps/DataMappingStep';
import { TemplateSelectionStep } from './steps/TemplateSelectionStep';
import { SignIssueStep } from './steps/SignIssueStep';
import { ResultStep } from './steps/ResultStep';

interface InvoiceWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
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

export const InvoiceWizard: React.FC<InvoiceWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = React.useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handlePrevious = React.useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleStepComplete = React.useCallback(() => {
    if (currentStep === steps.length - 1) {
      // Last step completed
      onComplete?.();
      onClose();
      setCurrentStep(0); // Reset for next time
    } else {
      handleNext();
    }
  }, [currentStep, onComplete, onClose, handleNext]);

  // Reset step when wizard closes
  React.useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const renderStep = React.useMemo(() => {
    switch (currentStep) {
      case 0:
        return <OrderSourceStep />;
      case 1:
        return <DataMappingStep />;
      case 2:
        return <TemplateSelectionStep />;
      case 3:
        return <SignIssueStep onComplete={handleStepComplete} />;
      case 4:
        return <ResultStep onComplete={handleStepComplete} />;
      default:
        return null;
    }
  }, [currentStep, handleStepComplete]);

  // Early return after all hooks have been called
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-[#E5E7EB] px-6 py-4">
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
        <div className="flex-shrink-0 px-6 py-4 bg-[#F8FAFC]">
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
        <div className="flex-1 overflow-y-auto p-6">
          {renderStep}
        </div>

        {/* Footer */}
        {currentStep < steps.length - 2 && (
          <div className="flex-shrink-0 border-t border-[#E5E7EB] px-6 py-4 flex justify-between">
            <ZenButton 
              variant="ghost" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </ZenButton>
            <ZenButton onClick={handleNext}>
              {currentStep === steps.length - 3 ? 'Continue to Sign & Issue' : 'Next'}
            </ZenButton>
          </div>
        )}
      </motion.div>
    </div>
  );
};
