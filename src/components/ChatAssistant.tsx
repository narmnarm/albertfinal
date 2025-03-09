
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Loader2, Bot, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: "Hello! I'm Albert's AI assistant. How can I help you with your financial journey today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { toast } = useToast();

  // Get context based on current page
  const getContextPrompt = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') {
      return "The user is viewing their financial dashboard with spending breakdowns, net worth, and investment performance. Provide insights specific to their financial overview.";
    } else if (path === '/credit-analysis') {
      return "The user is viewing their credit analysis page which shows their credit score, factors affecting it, and improvement recommendations. Provide insights related to credit health.";
    } else if (path === '/transactions') {
      return "The user is viewing their transactions history with categorized spending and savings patterns. Help them understand their spending habits.";
    } else {
      return "The user is on the Albert financial management platform's homepage. Provide general assistance about personal finance management.";
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const contextPrompt = getContextPrompt();
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyDdP1lp5mtes6xJtUe0EDSrTGiG0sxzzsw',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `You are Albert's friendly AI assistant for a personal finance management platform. ${contextPrompt}\n\nUser question: ${input}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.candidates[0].content.parts[0].text || "I'm sorry, I couldn't process that request.",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      toast({
        title: "AI Assistant Error",
        description: "There was a problem connecting to the AI service. Please try again.",
        variant: "destructive",
      });
      
      setMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-40 bottom-6 right-6 p-4 rounded-full transition-all duration-300 shadow-lg hover-scale ${
          isOpen 
            ? 'bg-accent text-white rotate-90' 
            : 'bg-albert-600 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      <div className={`fixed z-30 bottom-6 right-6 w-full max-w-md bg-background rounded-lg border border-border shadow-xl transition-all duration-300 transform ${
        isOpen 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-albert-700 flex items-center justify-center">
              <Bot size={16} className="text-albert-300" />
            </div>
            <div>
              <h3 className="font-medium">Albert Assistant</h3>
              <p className="text-xs text-muted-foreground">Powered by Gemini AI</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </Button>
        </div>

        <div className="h-[350px] overflow-y-auto p-4 space-y-4 scrollbar-none">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-albert-700 flex-shrink-0 flex items-center justify-center">
                  <Bot size={16} className="text-albert-300" />
                </div>
              )}
              
              <div className={`max-w-[75%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-accent/20 text-white ml-auto'
                  : message.role === 'system'
                  ? 'bg-secondary/80 text-foreground'
                  : 'bg-secondary text-foreground'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-albert-700 flex items-center justify-center">
                <Bot size={16} className="text-albert-300" />
              </div>
              <div className="max-w-[75%] p-3 rounded-lg bg-secondary text-foreground">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <p className="text-sm">Albert is thinking...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-border flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="bg-albert-600 text-white hover:bg-albert-700"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </>
  );
};

export default ChatAssistant;
