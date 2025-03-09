import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAlbertScore } from '@/context/AlbertScoreContext';
import { Message } from '@/types/chat';

export function useChat(initialSystemMessage: string, initialPrompt?: string) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: initialSystemMessage,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { financialState, score: albertScore } = useAlbertScore();

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, []);

  // Get user's financial data as context
  const getFinancialContext = () => {
    const cashOnHand = financialState.assets.find(a => a.id === 'cash-on-hand')?.value || 0;
    const otherAssets = financialState.assets
      .filter(a => a.id !== 'cash-on-hand')
      .reduce((sum, a) => sum + a.value, 0);
    const totalDebts = financialState.debts.reduce((sum, d) => sum + d.amount, 0);
    const netWorth = cashOnHand + otherAssets - totalDebts;

    const monthlyTransactions = financialState.transactions
      .filter(t => t.date >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const monthlySpending = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const savedCreditScore = localStorage.getItem('user-credit-score');
    const creditScore = savedCreditScore ? parseInt(savedCreditScore) : 650;

    return `
FINANCIAL SNAPSHOT:
- Albert Score: ${albertScore}/100
- Credit Score: ${creditScore}
- Net Worth: $${netWorth.toLocaleString()}
- Cash on Hand: $${cashOnHand.toLocaleString()}
- Other Assets: $${otherAssets.toLocaleString()}
- Total Debts: $${totalDebts.toLocaleString()}
- Monthly Income: $${monthlyIncome.toLocaleString()}
- Monthly Spending: $${monthlySpending.toLocaleString()}

RECENT TRANSACTIONS:
${monthlyTransactions.slice(0, 5).map(t => 
  `- ${t.type === 'income' ? 'Received' : 'Spent'} $${t.amount.toLocaleString()} on ${t.category} (${t.description})`
).join('\n')}

FINANCIAL GOALS:
${financialState.goals.map(g => 
  `- ${g.name}: $${g.currentAmount.toLocaleString()}/$${g.targetAmount.toLocaleString()} (${Math.round((g.currentAmount/g.targetAmount)*100)}% complete)`
).join('\n')}

ASSETS:
${financialState.assets.map(a => 
  `- ${a.name}: $${a.value.toLocaleString()} (${a.type})`
).join('\n')}

DEBTS:
${financialState.debts.map(d => 
  `- ${d.name}: $${d.amount.toLocaleString()} at ${d.interestRate}% APR`
).join('\n')}`;
  };

  // Get context based on current page
  const getContextPrompt = () => {
    const path = location.pathname;
    let roleContext = "You are Albert's friendly AI assistant for a personal finance management platform. ";
    
    if (path === '/dashboard') {
      roleContext += "You are currently assisting with their financial dashboard overview. Focus on providing insights about their overall financial health, spending patterns, and suggestions for improvement.";
    } else if (path === '/credit-analysis') {
      roleContext += "You are currently on their credit analysis page. Focus on credit score improvement strategies and maintaining good credit health.";
    } else if (path === '/transactions') {
      roleContext += "You are analyzing their transaction history. Focus on spending patterns, budget optimization, and saving opportunities.";
    } else if (path === '/goals') {
      roleContext += "You are reviewing their financial goals. Focus on strategies to achieve these goals and suggest relevant milestones.";
    } else {
      roleContext += "Provide comprehensive assistance about personal finance management.";
    }

    return roleContext;
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
  
    try {
      const contextPrompt = getContextPrompt();
      const financialContext = getFinancialContext();
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
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
                { text: `${contextPrompt}\n\nCURRENT FINANCIAL DATA:\n${financialContext}\n\nUser question: ${messageText}\n\nPlease provide a brief response. Enclose important text with triple asterisks (***bold***) for emphasis.` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400,
          }
        }),
      });
  
      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
        let aiContent = data.candidates[0].content.parts[0].text || "I'm sorry, I couldn't process that request.";
        aiContent = aiContent.replace(/\*\*\*(.*?)\*\*\*/g, '<b>$1</b>'); // Convert ***text*** to <b>text</b>
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiContent,
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

  return {
    messages,
    isLoading,
    sendMessage: handleSendMessage
  };
}
