
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export type ChatProps = {
  initialPrompt?: string;
  initialSystemMessage?: string;
  className?: string;
}
