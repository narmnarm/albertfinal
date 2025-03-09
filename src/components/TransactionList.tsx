
import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Search, Coffee, ShoppingCart, Home, Film, Utensils, Bus, CreditCard, Compass } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample transaction data
const transactions = [
  {
    id: 't1',
    type: 'expense',
    amount: 43.65,
    merchant: 'Starbucks',
    category: 'Food & Drink',
    date: '2023-10-12',
    icon: Coffee,
    color: 'bg-chart-yellow/20 text-chart-yellow'
  },
  {
    id: 't2',
    type: 'expense',
    amount: 128.45,
    merchant: 'Amazon',
    category: 'Shopping',
    date: '2023-10-11',
    icon: ShoppingCart,
    color: 'bg-chart-blue/20 text-chart-blue'
  },
  {
    id: 't3',
    type: 'income',
    amount: 2463.12,
    merchant: 'Acme Corp',
    category: 'Salary',
    date: '2023-10-10',
    icon: CreditCard,
    color: 'bg-chart-green/20 text-chart-green'
  },
  {
    id: 't4',
    type: 'expense',
    amount: 1200.00,
    merchant: 'Apartment 4B',
    category: 'Housing',
    date: '2023-10-05',
    icon: Home,
    color: 'bg-chart-purple/20 text-chart-purple'
  },
  {
    id: 't5',
    type: 'expense',
    amount: 32.50,
    merchant: 'AMC Theaters',
    category: 'Entertainment',
    date: '2023-10-03',
    icon: Film,
    color: 'bg-chart-pink/20 text-chart-pink'
  },
  {
    id: 't6',
    type: 'expense',
    amount: 28.75,
    merchant: 'Chipotle',
    category: 'Food & Drink',
    date: '2023-10-02',
    icon: Utensils,
    color: 'bg-chart-yellow/20 text-chart-yellow'
  },
  {
    id: 't7',
    type: 'expense',
    amount: 12.50,
    merchant: 'Public Transit',
    category: 'Transportation',
    date: '2023-10-01',
    icon: Bus,
    color: 'bg-chart-blue/20 text-chart-blue'
  },
  {
    id: 't8',
    type: 'expense',
    amount: 145.32,
    merchant: 'Travel Booking',
    category: 'Travel',
    date: '2023-09-28',
    icon: Compass,
    color: 'bg-chart-green/20 text-chart-green'
  },
];

const TransactionList: React.FC = () => {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/30">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <h3 className="text-lg font-medium">Recent Transactions</h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9 bg-background/50 w-full sm:w-[200px]"
              />
            </div>
            <Button variant="outline" size="sm">Filter</Button>
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="divide-y divide-border">
          {transactions.map((transaction) => {
            const Icon = transaction.icon;
            const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
            
            return (
              <div 
                key={transaction.id} 
                className="p-4 hover:bg-secondary/40 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${transaction.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{transaction.merchant}</p>
                        <p className="text-xs text-muted-foreground">{transaction.category}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-sm font-medium flex items-center ${
                          transaction.type === 'income' ? 'text-green-400' : ''
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowDownLeft className="h-3 w-3 mr-1 text-green-400" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 mr-1 text-foreground" />
                          )}
                          ${transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">{formattedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-border bg-secondary/30 text-center">
        <Button variant="link" size="sm" className="text-xs text-muted-foreground hover:text-albert-400">
          View All Transactions
        </Button>
      </div>
    </div>
  );
};

export default TransactionList;
