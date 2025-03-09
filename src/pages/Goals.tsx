import React from 'react';
import Layout from '@/components/Layout';
import GoalManager from '@/components/GoalManager';
import { Card } from '@/components/ui/card';
import { useAlbertScore } from '@/context/AlbertScoreContext';
import { Target, TrendingUp, Award } from 'lucide-react';

const GoalsPage: React.FC = () => {
  const { financialState } = useAlbertScore();

  const calculateTotalProgress = () => {
    if (financialState.goals.length === 0) return 0;
    return financialState.goals.reduce((sum, goal) => 
      sum + (goal.currentAmount / goal.targetAmount), 0) / financialState.goals.length * 100;
  };

  const totalTargetAmount = financialState.goals.reduce((sum, goal) => 
    sum + goal.targetAmount, 0);
  
  const totalCurrentAmount = financialState.goals.reduce((sum, goal) => 
    sum + goal.currentAmount, 0);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Financial Goals</h1>
            <p className="text-muted-foreground">
              Set and track your financial goals to improve your Albert Score.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Overall Progress</div>
            <div className="text-2xl font-bold text-albert-500">
              {calculateTotalProgress().toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-albert-400" />
              <h3 className="font-medium">Total Goals</h3>
            </div>
            <div className="text-2xl font-bold">
              {financialState.goals.length}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-albert-400" />
              <h3 className="font-medium">Total Target</h3>
            </div>
            <div className="text-2xl font-bold">
              ${totalTargetAmount.toLocaleString()}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-5 w-5 text-albert-400" />
              <h3 className="font-medium">Current Progress</h3>
            </div>
            <div className="text-2xl font-bold">
              ${totalCurrentAmount.toLocaleString()}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Goals Manager */}
          <GoalManager />

          {/* Goal Insights */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Goal Insights</h3>
            <div className="space-y-4">
              {financialState.goals.map(goal => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const remainingAmount = goal.targetAmount - goal.currentAmount;
                return (
                  <div key={goal.id} className="p-4 rounded-lg bg-secondary/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{goal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {goal.type === 'savings' ? 'Savings Goal' : 'Debt Payoff'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          ${remainingAmount.toLocaleString()} remaining
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {progress.toFixed(1)}% complete
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-albert-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {goal.deadline && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Target date: {goal.deadline.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default GoalsPage;