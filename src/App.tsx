import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './infrastructure/api/queryClient';
import { ZenNavigation } from './components/zenshop/ZenNavigation';
import { InvoiceWizard } from './presentation/components/invoice-wizard/InvoiceWizard';
import { ZenAIAssistant } from './components/zenshop/ZenAIAssistant';
import { InvoiceDashboard } from './components/screens/InvoiceDashboard';
import { InvoiceList } from './components/screens/InvoiceList';
import { InvoiceDetail } from './components/screens/InvoiceDetail';
import { ResourceCenterPage } from './components/screens/ResourceCenterPage';
import { Settings } from './components/screens/Settings';
import { Logs } from './components/screens/Logs';
import { Login } from './components/screens/Login';
import { Quotas } from './components/screens/Quotas';
import { InvoiceListItem } from './core/entities/Invoice';
import { useRequireAuth } from './presentation/hooks/useAuth';

export default function App() {
  const { isAuthenticated, shouldShowLogin } = useRequireAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceListItem | null>(null);
  const [showInvoiceWizard, setShowInvoiceWizard] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handleLoginSuccess = () => {
    // After successful login, user will see the main app
    console.log('Login successful, redirecting to dashboard');
  };

  const handleNavigate = (viewId: string) => {
    setCurrentView(viewId);
    setShowInvoiceDetail(false);
  };

  // ✅ Listen for navigation events from CheckoutModal
  useEffect(() => {
    const handleNavigateToQuotas = () => {
      console.log('🎯 Navigating to quotas page after successful payment');
      setCurrentView('quotas');
      setShowInvoiceDetail(false);
    };

    window.addEventListener('navigate-to-quotas', handleNavigateToQuotas);

    return () => {
      window.removeEventListener('navigate-to-quotas', handleNavigateToQuotas);
    };
  }, []);

  const handleShowInvoiceDetail = (invoice: InvoiceListItem) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetail(true);
  };

  const handleBackFromDetail = () => {
    setShowInvoiceDetail(false);
    setSelectedInvoice(null);
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
    if (showInvoiceDetail && selectedInvoice) {
      return <InvoiceDetail invoice={selectedInvoice} onBack={handleBackFromDetail} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <InvoiceDashboard onCreateInvoice={handleOpenInvoiceWizard} onNavigate={handleNavigate} />;
      case 'invoices':
        return (
          <InvoiceList 
            onViewInvoice={handleShowInvoiceDetail}
            onCreateInvoice={handleOpenInvoiceWizard}
          />
        );
      case 'quota':
        return <ResourceCenterPage onNavigate={handleNavigate} />;
      case 'quotas':
        return <Quotas />;
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

  // Show login screen if not authenticated
  if (shouldShowLogin) {
    return (
      <QueryClientProvider client={queryClient}>
        <Login onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
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
        <InvoiceWizard
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
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}