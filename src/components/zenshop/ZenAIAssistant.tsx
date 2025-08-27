import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  FileText,
  Calculator,
  AlertTriangle,
  TrendingUp,
  Zap,
  MessageCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ZenAIAssistantProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const ZenAIAssistant: React.FC<ZenAIAssistantProps> = ({
  isOpen = false,
  onToggle
}) => {
  const [showPanel, setShowPanel] = useState(isOpen);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Xin chào! Tôi là Boo Boo, trợ lý AI của bạn. Tôi có thể giúp bạn tạo hóa đơn, kiểm tra VAT, phát hiện bất thường và nhiều việc khác. Bạn cần hỗ trợ gì?',
      timestamp: new Date(),
      suggestions: ['Tạo hóa đơn mới', 'Kiểm tra VAT', 'Xem báo cáo']
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickActions = [
    {
      id: 'new-invoice',
      label: 'Tạo hóa đơn',
      icon: FileText,
      description: 'Tạo hóa đơn từ chat'
    },
    {
      id: 'check-vat',
      label: 'Kiểm tra VAT',
      icon: Calculator,
      description: 'Kiểm tra thuế VAT'
    },
    {
      id: 'anomaly-check',
      label: 'Phát hiện bất thường',
      icon: AlertTriangle,
      description: 'Rà soát dữ liệu'
    },
    {
      id: 'insights',
      label: 'Thống kê',
      icon: TrendingUp,
      description: 'Xem insight kinh doanh'
    }
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Tôi đã hiểu yêu cầu của bạn. Để hỗ trợ tốt nhất, bạn có thể cung cấp thêm chi tiết không?',
        timestamp: new Date(),
        suggestions: ['Có', 'Không, tiếp tục', 'Thay đổi yêu cầu']
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  if (!showPanel) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          onClick={() => setShowPanel(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6A3D] to-[#E85A2E] flex items-center justify-center cursor-pointer border-0 focus:outline-none shadow-lg"
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/50"
        onClick={() => setShowPanel(false)}
      />

      {/* Drawer */}
      <div className="w-96 bg-background border-l border-border flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-bold">AI</span>
            </div>
            <div>
              <h2 className="font-medium">Trợ lý AI Boo Boo</h2>
              <p className="text-sm text-muted-foreground">Sẵn sàng hỗ trợ bạn</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPanel(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className="h-auto p-3 flex flex-col items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-xs font-bold">AI</span>
                  </div>
                )}

                <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {message.suggestions && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Zap className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              AI được bảo mật và không lưu trữ PII
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

