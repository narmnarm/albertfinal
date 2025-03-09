import React from 'react';
import { Message } from '@/types/chat';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isAI = message.role === 'assistant';

  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isAI ? "flex-row" : "flex-row-reverse"
    )}>
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage 
          src={isAI ? "/images/middle.png" : undefined} 
          alt={isAI ? "Albert" : "You"}
        />
      </Avatar>
      <div className={cn(
        "rounded-lg px-4 py-2 max-w-[80%]",
        isAI ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
      )}>
        <div className="text-sm font-medium mb-1">
          {isAI ? 'Albert' : 'You'}
        </div>
        <div
          className="text-sm whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
        <div className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
