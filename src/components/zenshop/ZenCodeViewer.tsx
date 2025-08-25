import React from 'react';
import { cn } from '../ui/utils';
import { CopyIcon, CheckIcon } from 'lucide-react';

interface ZenCodeViewerProps {
  code: string;
  language?: 'json' | 'xml' | 'javascript' | 'html';
  title?: string;
  className?: string;
  showCopyButton?: boolean;
}

export const ZenCodeViewer: React.FC<ZenCodeViewerProps> = ({
  code,
  language = 'json',
  title,
  className,
  showCopyButton = true,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const formatCode = (code: string, language: string) => {
    if (language === 'json') {
      try {
        return JSON.stringify(JSON.parse(code), null, 2);
      } catch {
        return code;
      }
    }
    return code;
  };

  const formattedCode = formatCode(code, language);

  return (
    <div className={cn('bg-white border border-[#E5E7EB] rounded-lg overflow-hidden', className)}>
      {(title || showCopyButton) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          {title && (
            <h3 className="text-sm font-medium text-[#1F2937]">{title}</h3>
          )}
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1 text-sm text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6] rounded-md transition-colors"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 text-[#22C55E]" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}
      <div className="p-4 overflow-auto max-h-96">
        <pre className="text-sm text-[#1F2937] font-mono leading-relaxed whitespace-pre-wrap">
          <code className={cn('language-' + language)}>
            {formattedCode}
          </code>
        </pre>
      </div>
    </div>
  );
};