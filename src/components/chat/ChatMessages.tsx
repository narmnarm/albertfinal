import React from 'react';
import { Message } from '@/types/chat';
import MessageItem from './MessageItem';
import { Loader2 } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-secondary rounded-lg px-4 py-2 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Albert is thinking...</span>
          </div>
        </div>
      )}

      {messages.length === 0 && !isLoading && (
        <div className="text-center text-muted-foreground py-8">
          <p>Welcome! How can I help you with your finances today?</p>
          <p className="text-sm mt-2">
            Try asking about your spending habits, financial goals, or investment advice.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
