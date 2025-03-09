import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

export interface FinanceCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const FinanceCard: React.FC<FinanceCardProps> = ({ title, value, change, icon }) => {
  return (
    <Card className="p-6 bg-card/50 border-border/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-semibold">{value}</div>
        <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
    </Card>
  );
};

export default FinanceCard;
