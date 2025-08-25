import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZenButton } from './ZenButton';
import { 
  MicIcon, 
  XIcon, 
  MessageSquareIcon,
  LightbulbIcon,
  CheckIcon,
  XCircleIcon,
  VolumeXIcon,
  Volume2Icon,
  SparklesIcon
} from 'lucide-react';

type AIState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'suggestion';
type SuggestionType = 'tax-code' | 'template' | 'customer-info' | 'validation';

interface AISuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  message: string;
  action?: string;
  data?: any;
}

interface ZenAIAssistantProps {
  isOpen?: boolean;
  onToggle?: () => void;
  suggestions?: AISuggestion[];
  onAcceptSuggestion?: (suggestion: AISuggestion) => void;
  context?: 'dashboard' | 'invoice-list' | 'invoice-wizard' | 'settings';
}

export const ZenAIAssistant: React.FC<ZenAIAssistantProps> = ({
  isOpen = false,
  onToggle,
  suggestions = [],
  onAcceptSuggestion,
  context = 'dashboard'
}) => {
  const [aiState, setAIState] = useState<AIState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [showPanel, setShowPanel] = useState(isOpen);

  // Mock conversation for demo
  const mockResponses = {
    'help': 'I can help you with invoices, templates, customer management, and more. What would you like to do?',
    'create invoice': 'I\'ll help you create a new invoice. Let me open the invoice wizard for you.',
    'find customer': 'I can search for customer information. What\'s the customer name or email?',
    'templates': 'Here are your available templates. Would you like me to show you how to create a new one?',
    'default': 'I understand you need help. Could you be more specific about what you\'d like to do?'
  };

  const handleVoiceActivation = (query: string) => {
    setTranscript(query);
    setAIState('thinking');
    
    // Simulate processing time
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let response = mockResponses.default;
      
      if (lowerQuery.includes('help')) response = mockResponses.help;
      else if (lowerQuery.includes('invoice') || lowerQuery.includes('create')) response = mockResponses['create invoice'];
      else if (lowerQuery.includes('customer') || lowerQuery.includes('find')) response = mockResponses['find customer'];
      else if (lowerQuery.includes('template')) response = mockResponses.templates;
      
      setResponse(response);
      setAIState('speaking');
      
      // Return to idle after speaking
      setTimeout(() => {
        setAIState('idle');
      }, 3000);
    }, 1500);
  };

  const handleMicClick = () => {
    if (aiState === 'listening') {
      setAIState('idle');
      setIsListening(false);
    } else {
      setAIState('listening');
      setIsListening(true);
      
      // Mock voice recognition
      setTimeout(() => {
        const mockQueries = [
          'Boo Boo ơi, help me create a new invoice',
          'Boo Booơi, show me my templates',
          'Boo Boo ơi, find customer information'
        ];
        const randomQuery = mockQueries[Math.floor(Math.random() * mockQueries.length)];
        handleVoiceActivation(randomQuery);
        setIsListening(false);
      }, 2000);
    }
  };

  const orbVariants = {
    idle: {
      scale: 1,
      boxShadow: '0 0 20px rgba(255, 106, 61, 0.3)',
      background: 'linear-gradient(135deg, #FF6A3D, #E85A2E)'
    },
    listening: {
      scale: [1, 1.1, 1],
      boxShadow: '0 0 30px rgba(255, 106, 61, 0.6)',
      background: 'linear-gradient(135deg, #FF6A3D, #E85A2E)',
      transition: {
        scale: { repeat: Infinity, duration: 1.5 },
        boxShadow: { repeat: Infinity, duration: 1.5 }
      }
    },
    thinking: {
      rotate: 360,
      boxShadow: '0 0 25px rgba(255, 106, 61, 0.4)',
      background: 'linear-gradient(135deg, #F59E0B, #FF6A3D)',
      transition: {
        rotate: { repeat: Infinity, duration: 2, ease: 'linear' }
      }
    },
    speaking: {
      scale: [1, 1.05, 1],
      boxShadow: '0 0 35px rgba(34, 197, 94, 0.5)',
      background: 'linear-gradient(135deg, #22C55E, #16A34A)',
      transition: {
        scale: { repeat: Infinity, duration: 0.8 }
      }
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          onClick={() => setShowPanel(!showPanel)}
          className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer border-0 focus:outline-none"
          variants={orbVariants}
          animate={aiState}
        >
          {/* Eyes */}
          <div className="flex gap-2">
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={aiState === 'listening' ? { scaleY: [1, 0.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={aiState === 'listening' ? { scaleY: [1, 0.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2, delay: 0.1 }}
            />
          </div>

          {/* State Indicator */}
          <div className="absolute -top-2 -right-2">
            {aiState === 'listening' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 bg-[#EF4444] rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </motion.div>
            )}
          </div>
        </motion.button>
      </motion.div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-0 right-0 w-96 h-full bg-white border-l border-[#E5E7EB] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#E5E7EB] bg-gradient-to-r from-[#FF6A3D] to-[#E85A2E] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                    animate={aiState === 'listening' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white rounded-full" />
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="font-semibold">Boo Boo</h3>
                    <p className="text-xs opacity-90">AI Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Voice Status */}
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleMicClick}
                  className={`
                    p-3 rounded-full transition-all
                    ${isListening 
                      ? 'bg-[#EF4444] text-white animate-pulse' 
                      : 'bg-[#FF6A3D] text-white hover:bg-[#E85A2E]'
                    }
                  `}
                >
                  <MicIcon className="h-5 w-5" />
                </button>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#1F2937]">
                    {aiState === 'idle' && 'Say "Boo Boo ơi..." to start'}
                    {aiState === 'listening' && 'Listening...'}
                    {aiState === 'thinking' && 'Processing...'}
                    {aiState === 'speaking' && 'Speaking...'}
                  </p>
                  {(aiState === 'listening' || aiState === 'thinking') && (
                    <button
                      onClick={() => {setAIState('idle'); setIsListening(false);}}
                      className="text-xs text-[#EF4444] hover:underline mt-1"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {transcript && (
                <div className="flex justify-end">
                  <div className="bg-[#FF6A3D]/10 text-[#1F2937] p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm">{transcript}</p>
                  </div>
                </div>
              )}
              
              {response && (
                <div className="flex justify-start">
                  <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm text-[#1F2937]">{response}</p>
                  </div>
                </div>
              )}

              {/* Contextual Suggestions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#6B7280]">Suggestions</h4>
                {getContextualSuggestions(context).map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onAccept={onAcceptSuggestion}
                  />
                ))}
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#6B7280]">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <ZenButton size="sm" variant="secondary" className="text-xs">
                    Create Invoice
                  </ZenButton>
                  <ZenButton size="sm" variant="secondary" className="text-xs">
                    Find Customer
                  </ZenButton>
                  <ZenButton size="sm" variant="secondary" className="text-xs">
                    View Reports
                  </ZenButton>
                  <ZenButton size="sm" variant="secondary" className="text-xs">
                    Settings
                  </ZenButton>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC]">
              <p className="text-xs text-[#6B7280] text-center">
                Powered by ZenShop AI • Wake word: "Boo Boo ơi..."
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contextual Suggestions Overlay */}
      <AnimatePresence>
        {suggestions.map((suggestion) => (
          <ContextualSuggestion
            key={suggestion.id}
            suggestion={suggestion}
            onAccept={onAcceptSuggestion}
            onDismiss={() => {/* Handle dismiss */}}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

// Helper function to get contextual suggestions
const getContextualSuggestions = (context: string): AISuggestion[] => {
  const suggestions: Record<string, AISuggestion[]> = {
    'dashboard': [
      {
        id: 'quota-low',
        type: 'validation',
        title: 'Quota Running Low',
        message: 'You have 15 invoices left. Consider purchasing more quota.',
        action: 'Buy Quota'
      }
    ],
    'invoice-wizard': [
      {
        id: 'tax-suggestion',
        type: 'tax-code',
        title: 'Tax Code Suggestion',
        message: 'I found a possible tax code for this customer. Use it?',
        action: 'Apply Tax Code',
        data: { taxCode: 'VAT-21', rate: 21 }
      },
      {
        id: 'template-suggestion',
        type: 'template',
        title: 'Template Recommendation',
        message: 'Based on the customer type, I recommend using the "Professional" template.',
        action: 'Use Template'
      }
    ],
    'invoice-list': [
      {
        id: 'overdue-alert',
        type: 'validation',
        title: 'Overdue Invoices',
        message: 'You have 3 overdue invoices. Should I help you send reminders?',
        action: 'Send Reminders'
      }
    ]
  };

  return suggestions[context] || [];
};

// Suggestion Card Component
interface SuggestionCardProps {
  suggestion: AISuggestion;
  onAccept?: (suggestion: AISuggestion) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onAccept }) => {
  const getIcon = () => {
    switch (suggestion.type) {
      case 'tax-code': return <SparklesIcon className="h-4 w-4 text-[#F59E0B]" />;
      case 'template': return <SparklesIcon className="h-4 w-4 text-[#0EA5E9]" />;
      case 'customer-info': return <SparklesIcon className="h-4 w-4 text-[#22C55E]" />;
      case 'validation': return <LightbulbIcon className="h-4 w-4 text-[#FF6A3D]" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#FF6A3D]/5 to-[#E85A2E]/5 border border-[#FF6A3D]/20 rounded-lg p-3"
    >
      <div className="flex items-start gap-2">
        <div className="p-1 bg-white rounded">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h5 className="text-sm font-medium text-[#1F2937]">{suggestion.title}</h5>
          <p className="text-xs text-[#6B7280] mt-1">{suggestion.message}</p>
          {suggestion.action && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onAccept?.(suggestion)}
                className="flex items-center gap-1 px-2 py-1 bg-[#FF6A3D] text-white rounded text-xs hover:bg-[#E85A2E] transition-colors"
              >
                <CheckIcon className="h-3 w-3" />
                {suggestion.action}
              </button>
              <button className="flex items-center gap-1 px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded text-xs hover:bg-[#E5E7EB] transition-colors">
                <XCircleIcon className="h-3 w-3" />
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Contextual Suggestion Overlay Component
interface ContextualSuggestionProps {
  suggestion: AISuggestion;
  onAccept?: (suggestion: AISuggestion) => void;
  onDismiss?: (suggestion: AISuggestion) => void;
}

const ContextualSuggestion: React.FC<ContextualSuggestionProps> = ({ 
  suggestion, 
  onAccept, 
  onDismiss 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-24 right-24 w-80 bg-white border border-[#E5E7EB] rounded-xl shadow-2xl z-40 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-[#FF6A3D] to-[#E85A2E] p-3">
        <div className="flex items-center gap-2 text-white">
          <SparklesIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Boo Boo Suggestion</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-medium text-[#1F2937] mb-2">{suggestion.title}</h4>
        <p className="text-sm text-[#6B7280] mb-4">{suggestion.message}</p>
        <div className="flex gap-2">
          <ZenButton size="sm" onClick={() => onAccept?.(suggestion)}>
            {suggestion.action || 'Accept'}
          </ZenButton>
          <ZenButton size="sm" variant="ghost" onClick={() => onDismiss?.(suggestion)}>
            Dismiss
          </ZenButton>
        </div>
      </div>
    </motion.div>
  );
};