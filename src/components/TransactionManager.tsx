import React, { useState } from 'react';
import { useAlbertScore } from '@/context/AlbertScoreContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, PieChart, Calendar, DollarSign } from 'lucide-react';
import Chat from '@/components/Chat';
import { Transaction } from '@/types/finance';

const categories = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Savings',
  'Entertainment',
  'Shopping',
  'Other'
];

interface TransactionManagerProps {
  showAnalytics?: boolean;
  generatePrompt?: () => string;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({
  showAnalytics = false,
  generatePrompt
}) => {
  const { addTransaction, financialState } = useAlbertScore();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'expense' as Transaction['type'],
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) return;

    addTransaction({
      id: Date.now().toString(),
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      category: newTransaction.category,
      description: newTransaction.description,
      date: new Date(newTransaction.date)
    });

    setNewTransaction({
      amount: '',
      type: 'expense',
      category: newTransaction.category,
      description: '',
      date: new Date().toISOString().split('T')[0]
    });

    setHasAnalyzed(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tx-amount">Amount ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="tx-amount"
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tx-type">Type</Label>
            <Select
              value={newTransaction.type}
              onValueChange={(value) => setNewTransaction({...newTransaction, type: value as Transaction['type']})}
            >
              <SelectTrigger id="tx-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tx-date">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="tx-date"
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tx-category">Category</Label>
            <Select
              value={newTransaction.category}
              onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
            >
              <SelectTrigger id="tx-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tx-description">Description</Label>
          <Input
            id="tx-description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
            placeholder="What was this transaction for?"
          />
        </div>

        <Button type="submit" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </form>

      <div className="space-y-3">
        {financialState.transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet. Add some to get started!
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {[...financialState.transactions]
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50 border border-border/50">
                  <div className="flex-1">
                    <div className="font-medium">{tx.description}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {tx.date.toLocaleDateString()}
                      <span className="mx-2">•</span>
                      {tx.category}
                    </div>
                  </div>
                  <div className={`font-medium ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>

      {showAnalytics && financialState.transactions.length > 0 && !hasAnalyzed && (
        <div className="space-y-4">
          <Button 
            onClick={() => setHasAnalyzed(true)}
            className="w-full bg-albert-600 hover:bg-albert-700 text-white"
          >
            <PieChart className="mr-2 h-4 w-4" /> Analyze Spending
          </Button>
          
          {hasAnalyzed && generatePrompt && (
            <div className="mt-6">
              <Chat
                initialPrompt={generatePrompt()}
                initialSystemMessage="I'm your Financial Transactions Assistant. I can help you analyze your spending patterns and provide tips to improve your financial habits."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionManager;