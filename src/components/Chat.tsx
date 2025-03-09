import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatInput from './chat/ChatInput';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import { useChat } from '@/hooks/useChat';

interface ChatProps {
  initialSystemMessage?: string;
  initialPrompt?: string;
  className?: string;
}

const Chat: React.FC<ChatProps> = ({
  initialSystemMessage = "I am Albert, your financial advisor. How can I help you today?",
  initialPrompt,
  className = ''
}) => {
  const { messages, isLoading, sendMessage } = useChat(initialSystemMessage, initialPrompt);

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <ChatHeader title="Albert" subtitle="Your Personal Financial Advisor" />
      
      <ScrollArea className="flex-1 p-4">
        <ChatMessages 
          messages={messages.filter(m => m.role !== 'system')} 
          isLoading={isLoading} 
        />
      </ScrollArea>

      <div className="p-4 border-t">
        <ChatInput 
          onSend={sendMessage}
          isLoading={isLoading}
          placeholder="Ask Albert about your finances..."
        />
      </div>
    </Card>
  );
};

export default Chat;
