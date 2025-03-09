import React, { useState } from 'react';
import { useAlbertScore } from '@/context/AlbertScoreContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Target } from 'lucide-react';
import { FinancialGoal } from '@/types/finance';

const GoalManager: React.FC = () => {
  const { updateGoal, financialState } = useAlbertScore();
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    type: 'savings' as FinancialGoal['type'],
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount) return;

    updateGoal({
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount || '0'),
      type: newGoal.type,
      deadline: newGoal.deadline ? new Date(newGoal.deadline) : undefined
    });

    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      type: 'savings',
      deadline: ''
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Financial Goals</h3>
        <Target className="h-5 w-5 text-muted-foreground" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input
              id="goal-name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
              placeholder="e.g., Emergency Fund"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-type">Goal Type</Label>
            <Select
              value={newGoal.type}
              onValueChange={(value) => setNewGoal({...newGoal, type: value as FinancialGoal['type']})}
            >
              <SelectTrigger id="goal-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="debt">Debt Payoff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target-amount">Target Amount ($)</Label>
            <Input
              id="target-amount"
              type="number"
              min="0"
              step="0.01"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current-amount">Current Progress ($)</Label>
            <Input
              id="current-amount"
              type="number"
              min="0"
              step="0.01"
              value={newGoal.currentAmount}
              onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Target Date (Optional)</Label>
          <Input
            id="deadline"
            type="date"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
          />
        </div>

        <Button type="submit" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Current Goals</h4>
        {financialState.goals.map(goal => (
          <div 
            key={goal.id} 
            className="p-4 rounded-lg bg-secondary/30 border border-border/30"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{goal.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {goal.type === 'savings' ? 'Savings Goal' : 'Debt Payoff'}
                </p>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                </div>
                {goal.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Due by {goal.deadline.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-albert-500 rounded-full transition-all"
                style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GoalManager;