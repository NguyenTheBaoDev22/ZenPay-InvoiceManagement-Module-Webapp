import React, { useState, useEffect } from 'react';
import { ZenButton } from '../zenshop/ZenButton';
import { DownloadIcon, FileTextIcon, AlertCircleIcon, RefreshCwIcon } from 'lucide-react';

interface PDFPreviewProps {
  invoiceId: string;
  taxCode: string;
  className?: string;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ 
  invoiceId, 
  taxCode, 
  className = '' 
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7242/api';

  const loadPDF = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const previewUrl = `${API_BASE_URL}/zen-invoice/preview-pdf/${invoiceId}?taxCode=${taxCode}`;
      
      // Test if PDF is accessible
      const response = await fetch(previewUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to load PDF: ${response.status} ${response.statusText}`);
      }

      // Create blob URL for PDF preview
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to load PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const downloadUrl = `${API_BASE_URL}/zen-invoice/download-pdf/${invoiceId}?taxCode=${taxCode}`;
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `invoice_${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF');
    }
  };

  useEffect(() => {
    if (invoiceId && taxCode) {
      loadPDF();
    }

    // Cleanup blob URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [invoiceId, taxCode]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg flex items-center justify-center">
          <div className="text-center">
            <RefreshCwIcon className="h-16 w-16 text-[#6B7280] mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-[#1F2937] mb-2">Loading PDF...</h3>
            <p className="text-[#6B7280]">Please wait while we load the invoice PDF</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg flex items-center justify-center">
          <div className="text-center">
            <AlertCircleIcon className="h-16 w-16 text-[#EF4444] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#1F2937] mb-2">Failed to Load PDF</h3>
            <p className="text-[#6B7280] mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <ZenButton variant="secondary" onClick={loadPDF}>
                <RefreshCwIcon className="h-4 w-4" />
                Retry
              </ZenButton>
              <ZenButton variant="secondary" onClick={downloadPDF}>
                <DownloadIcon className="h-4 w-4" />
                Download PDF
              </ZenButton>
            </div>
          </div>
        </div>
      );
    }

    if (pdfUrl) {
      return (
        <div className="h-full flex flex-col bg-white">
          {/* Header with title and download button */}
          <div className="flex justify-between items-center p-4 border-b border-[#E5E7EB]">
            <h3 className="text-lg font-medium text-[#1F2937]">PDF Preview</h3>
            <ZenButton variant="secondary" onClick={downloadPDF}>
              <DownloadIcon className="h-4 w-4" />
              Download PDF
            </ZenButton>
          </div>

          {/* PDF Viewer - Full width and height */}
          <div className="flex-1 relative">
            <iframe
              src={pdfUrl}
              className="absolute inset-0 w-full h-full border-0"
              title="Invoice PDF Preview"
              style={{ minHeight: '600px' }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="h-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg flex items-center justify-center">
        <div className="text-center">
          <FileTextIcon className="h-16 w-16 text-[#6B7280] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#1F2937] mb-2">PDF Preview</h3>
          <p className="text-[#6B7280] mb-4">Click to load the invoice PDF</p>
          <div className="flex gap-2 justify-center">
            <ZenButton variant="secondary" onClick={loadPDF}>
              <FileTextIcon className="h-4 w-4" />
              Load PDF
            </ZenButton>
            <ZenButton variant="secondary" onClick={downloadPDF}>
              <DownloadIcon className="h-4 w-4" />
              Download PDF
            </ZenButton>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {renderContent()}
    </div>
  );
};
