import React from 'react';
import { BarChart3, LineChart, PiggyBank, CreditCard, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CreditScore from '@/components/CreditScore';
import FinanceCard from '@/components/FinanceCard';
import AlbertScoreDisplay from '@/components/AlbertScoreDisplay';
import AssetDebtManager from '@/components/AssetDebtManager';
import TransactionManager from '@/components/TransactionManager';
import GoalManager from '@/components/GoalManager';
import { useAlbertScore } from '@/context/AlbertScoreContext';

const CASH_ASSET_ID = 'cash-on-hand';

const Dashboard: React.FC = () => {
  const { financialState } = useAlbertScore();

  const cashOnHand = financialState.assets.find(a => a.id === CASH_ASSET_ID)?.value || 0;
  const otherAssets = financialState.assets
    .filter(a => a.id !== CASH_ASSET_ID)
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

  const monthlyChange = monthlyIncome - monthlySpending;

  return (
    <div className="space-y-6">
      {/* Albert Score and Credit Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AlbertScoreDisplay />
        </div>
        <div className="lg:col-span-1">
          <CreditScore />
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceCard 
          title="Cash on Hand"
          value={`$${cashOnHand.toLocaleString()}`}
          change={monthlyChange >= 0 ? +(monthlyChange / Math.max(1, cashOnHand - monthlyChange) * 100) : 
            -(monthlyChange / Math.max(1, cashOnHand + monthlyChange) * 100)}
          icon={<Wallet className="h-4 w-4" />}
        />
        <FinanceCard 
          title="Net Worth"
          value={`$${netWorth.toLocaleString()}`}
          change={monthlyChange >= 0 ? +(monthlyChange / Math.max(1, netWorth - monthlyChange) * 100) :
            -(monthlyChange / Math.max(1, netWorth + monthlyChange) * 100)}
          icon={<LineChart className="h-4 w-4" />}
        />
        <FinanceCard 
          title="Monthly Cash Flow"
          value={`$${monthlyChange.toLocaleString()}`}
          change={(monthlyChange / Math.max(1, monthlyIncome) * 100)}
          icon={<BarChart3 className="h-4 w-4" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Transactions */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
            <TransactionManager />
          </Card>

          {/* Goals */}
          <GoalManager />
        </div>

        <div className="lg:col-span-1">
          {/* Asset & Debt Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Assets & Debts</h3>
            <AssetDebtManager />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
