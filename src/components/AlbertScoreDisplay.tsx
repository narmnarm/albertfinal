import React from 'react';
import { useAlbertScore } from '@/context/AlbertScoreContext';
import { Card } from '@/components/ui/card';
import { Medal, TrendingUp, TrendingDown, DollarSign, Percent, CreditCard, Calendar, Wallet, Target } from 'lucide-react';

const AlbertScoreDisplay: React.FC = () => {
  const { score, financialState } = useAlbertScore();

  // Get color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Calculate total assets and debts
  const totalAssets = financialState.assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalDebts = financialState.debts.reduce((sum, debt) => sum + debt.amount, 0);
  const netWorth = totalAssets - totalDebts;

  // Calculate monthly income and expenses
  const now = new Date();
  const monthAgo = new Date();
  monthAgo.setMonth(now.getMonth() - 1);
  
  const monthlyIncome = financialState.transactions
    .filter(t => t.type === 'income' && t.date >= monthAgo)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = financialState.transactions
    .filter(t => t.type === 'expense' && t.date >= monthAgo)
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate savings rate
  const savingsRate = monthlyIncome > 0 ?
    Math.max(0, (monthlyIncome - monthlyExpenses) / monthlyIncome) : 0;

  // Calculate average interest rate
  const totalDebtAmount = financialState.debts.reduce((sum, d) => sum + d.amount, 0);
  const weightedInterestRate = totalDebtAmount > 0 ?
    financialState.debts.reduce((sum, d) => sum + (d.amount * d.interestRate), 0) / totalDebtAmount : 0;
  
  // Calculate discretionary spending ratio
  const discretionaryCategories = [
    'Dining', 'Entertainment', 'Shopping', 'Travel',
    'Subscription', 'Hobby', 'Luxury'
  ];
  
  const discretionarySpending = financialState.transactions
    .filter(t =>
      t.type === 'expense' &&
      discretionaryCategories.includes(t.category) &&
      t.date >= monthAgo
    )
    .reduce((sum, t) => sum + t.amount, 0);
  
  const discretionaryRatio = monthlyExpenses > 0 ?
    discretionarySpending / monthlyExpenses : 0;

  return (
    <Card className="p-8 bg-card/50 border-border/30">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-6">
          <Medal className="h-8 w-8 text-albert-400" />
          <h2 className="text-2xl font-bold">Albert Score</h2>
        </div>

        <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
          {score}
        </div>

        <p className="text-muted-foreground mb-8">
          Your Comprehensive Financial Health Score
        </p>

        <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Assets</p>
            <p className="text-2xl font-semibold text-green-500">
              ${totalAssets.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Debts</p>
            <p className="text-2xl font-semibold text-red-500">
              ${totalDebts.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          {netWorth >= 0 ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
          <span className={netWorth >= 0 ? 'text-green-500' : 'text-red-500'}>
            Net Worth: ${Math.abs(netWorth).toLocaleString()}
          </span>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 w-full">
          <h3 className="text-lg font-medium mb-4">Score Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 bg-card rounded-lg border border-border/50">
              <div className="flex justify-center mb-2">
                <Wallet className="h-5 w-5 text-albert-400" />
              </div>
              <div className="text-muted-foreground font-medium">Debt-to-Asset Ratio</div>
              <div className={totalAssets > totalDebts ? 'text-green-500' : 'text-yellow-500'}>
                {totalDebts > 0 ?
                  ((totalAssets / totalDebts) * 100).toFixed(0) + '%' :
                  '∞'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalAssets > totalDebts * 2 ? 'Excellent' :
                  totalAssets > totalDebts ? 'Good' : 'Needs improvement'}
              </div>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border/50">
              <div className="flex justify-center mb-2">
                <Percent className="h-5 w-5 text-albert-400" />
              </div>
              <div className="text-muted-foreground font-medium">Interest Burden</div>
              <div className={weightedInterestRate < 10 ? 'text-green-500' :
                weightedInterestRate < 15 ? 'text-yellow-500' : 'text-red-500'}>
                {weightedInterestRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {weightedInterestRate < 5 ? 'Low rate' :
                  weightedInterestRate < 10 ? 'Moderate rate' : 'High rate'}
              </div>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border/50">
              <div className="flex justify-center mb-2">
                <DollarSign className="h-5 w-5 text-albert-400" />
              </div>
              <div className="text-muted-foreground font-medium">Savings Rate</div>
              <div className={savingsRate > 0.2 ? 'text-green-500' :
                savingsRate > 0.1 ? 'text-yellow-500' : 'text-red-500'}>
                {(savingsRate * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {savingsRate > 0.2 ? 'Strong savings' :
                  savingsRate > 0.1 ? 'Moderate savings' : 'Low savings'}
              </div>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border/50">
              <div className="flex justify-center mb-2">
                <CreditCard className="h-5 w-5 text-albert-400" />
              </div>
              <div className="text-muted-foreground font-medium">Discretionary Spending</div>
              <div className={discretionaryRatio < 0.3 ? 'text-green-500' :
                discretionaryRatio < 0.5 ? 'text-yellow-500' : 'text-red-500'}>
                {(discretionaryRatio * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {discretionaryRatio < 0.3 ? 'Well managed' :
                  discretionaryRatio < 0.5 ? 'Moderate' : 'High'}
              </div>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border/50">
              <div className="flex justify-center mb-2">
                <Target className="h-5 w-5 text-albert-400" />
              </div>
              <div className="text-muted-foreground font-medium">Goal Progress</div>
              <div className="text-albert-400">
                {financialState.goals.length > 0
                  ? ((financialState.goals.reduce((sum, goal) =>
                      sum + (goal.currentAmount / goal.targetAmount), 0) /
                      financialState.goals.length) * 100).toFixed(0)
                  : 0}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {financialState.goals.length} financial goals
              </div>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border/50">
              <div className="flex justify-center mb-2">
                <Calendar className="h-5 w-5 text-albert-400" />
              </div>
              <div className="text-muted-foreground font-medium">Emergency Fund</div>
              <div className={monthlyExpenses > 0 &&
                (financialState.assets.find(a => a.id === 'cash-on-hand')?.value || 0) / monthlyExpenses >= 3 ?
                'text-green-500' : 'text-yellow-500'}>
                {monthlyExpenses > 0 ?
                  ((financialState.assets.find(a => a.id === 'cash-on-hand')?.value || 0) / monthlyExpenses).toFixed(1) :
                  '0'} months
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {monthlyExpenses > 0 &&
                (financialState.assets.find(a => a.id === 'cash-on-hand')?.value || 0) / monthlyExpenses >= 6 ?
                'Excellent' :
                (financialState.assets.find(a => a.id === 'cash-on-hand')?.value || 0) / monthlyExpenses >= 3 ?
                'Good' : 'Needs improvement'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AlbertScoreDisplay;