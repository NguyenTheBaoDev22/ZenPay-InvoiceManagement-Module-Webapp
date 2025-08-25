import React, { useState } from 'react';
import { ZenNavigation } from './components/zenshop/ZenNavigation';
import { ZenWizard } from './components/zenshop/ZenWizard';
import { ZenAIAssistant } from './components/zenshop/ZenAIAssistant';
import { InvoiceDashboard } from './components/screens/InvoiceDashboard';
import { InvoiceList } from './components/screens/InvoiceList';
import { InvoiceDetail } from './components/screens/InvoiceDetail';
import { BuyQuota } from './components/screens/BuyQuota';
import { Settings } from './components/screens/Settings';
import { Logs } from './components/screens/Logs';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [showInvoiceWizard, setShowInvoiceWizard] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handleNavigate = (viewId: string) => {
    setCurrentView(viewId);
    setShowInvoiceDetail(false);
  };

  const handleShowInvoiceDetail = () => {
    setShowInvoiceDetail(true);
  };

  const handleBackFromDetail = () => {
    setShowInvoiceDetail(false);
  };

  const handleOpenInvoiceWizard = () => {
    setShowInvoiceWizard(true);
  };

  const handleCloseInvoiceWizard = () => {
    setShowInvoiceWizard(false);
  };

  const handleWizardComplete = (data: any) => {
    console.log('Invoice wizard completed with data:', data);
    // Handle the completed invoice data
  };

  const handleAISuggestion = (suggestion: any) => {
    console.log('AI suggestion accepted:', suggestion);
    
    // Handle different suggestion types
    switch (suggestion.type) {
      case 'tax-code':
        // Apply tax code logic
        break;
      case 'template':
        // Apply template logic
        break;
      case 'validation':
        if (suggestion.id === 'quota-low') {
          setCurrentView('quota');
        }
        break;
    }
  };

  // Get contextual suggestions based on current view
  const getContextualSuggestions = () => {
    const suggestions: any[] = [];
    
    if (currentView === 'dashboard') {
      suggestions.push({
        id: 'quota-low',
        type: 'validation',
        title: 'Quota Running Low',
        message: 'You have 15 invoices left. Consider purchasing more quota.',
        action: 'Buy Quota'
      });
    }
    
    return suggestions;
  };

  const renderCurrentView = () => {
    if (showInvoiceDetail) {
      return <InvoiceDetail onBack={handleBackFromDetail} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <InvoiceDashboard onCreateInvoice={handleOpenInvoiceWizard} />;
      case 'invoices':
        return (
          <InvoiceList 
            onViewInvoice={handleShowInvoiceDetail}
            onCreateInvoice={handleOpenInvoiceWizard}
          />
        );
      case 'quota':
        return <BuyQuota />;
      case 'settings':
        return <Settings />;
      case 'logs':
        return <Logs />;
      case 'help':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-[#1F2937]">Help & Support</h1>
            <p className="text-[#6B7280] mt-2">Documentation and support resources will be available here.</p>
          </div>
        );
      default:
        return <InvoiceDashboard onCreateInvoice={handleOpenInvoiceWizard} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {!showInvoiceDetail && (
        <ZenNavigation 
          currentView={currentView} 
          onNavigate={handleNavigate} 
        />
      )}
      
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Invoice Wizard Modal */}
      <ZenWizard
        isOpen={showInvoiceWizard}
        onClose={handleCloseInvoiceWizard}
        onComplete={handleWizardComplete}
      />

      {/* AI Assistant */}
      <ZenAIAssistant
        context={currentView as any}
        suggestions={getContextualSuggestions()}
        onAcceptSuggestion={handleAISuggestion}
      />
    </div>
  );
}