import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import TransactionManager from '@/components/TransactionManager';
import { useAlbertScore } from '@/context/AlbertScoreContext';

const TransactionsPage: React.FC = () => {
  const { financialState } = useAlbertScore();
  
  const calculateTotal = () => {
    return financialState.transactions
      .reduce((sum, tx) => sum + (tx.type === 'income' ? tx.amount : -tx.amount), 0);
  };

  const getCategoryTotal = (category: string) => {
    return financialState.transactions
      .filter(tx => tx.category === category)
      .reduce((sum, tx) => sum + (tx.type === 'income' ? tx.amount : -tx.amount), 0);
  };

  const getCategories = () => {
    return Array.from(new Set(financialState.transactions.map(tx => tx.category)));
  };

  const generatePrompt = () => {
    if (financialState.transactions.length === 0) return '';
    
    const categoryBreakdown = getCategories()
      .map(cat => `${cat}: $${Math.abs(getCategoryTotal(cat)).toFixed(2)}`)
      .join(', ');
    
    return `I've recorded transactions with a net balance of $${calculateTotal().toFixed(2)}. 
Category breakdown: ${categoryBreakdown}.

Can you analyze my spending patterns and suggest any areas where I could save money or improve my financial habits?`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Transaction Analysis</h1>
            <p className="text-muted-foreground">
              Track your spending and get personalized insights to optimize your budget.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Net Balance</div>
            <div className={`text-2xl font-bold ${calculateTotal() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${calculateTotal().toFixed(2)}
            </div>
          </div>
        </div>

        <Card className="p-6">
          <TransactionManager 
            showAnalytics={true}
            generatePrompt={generatePrompt}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default TransactionsPage;
