
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Sample data for the graph
const monthlyData = [
  { name: 'Jan', balance: 12400, spending: 3200 },
  { name: 'Feb', balance: 14100, spending: 2800 },
  { name: 'Mar', balance: 15300, spending: 3100 },
  { name: 'Apr', balance: 17200, spending: 2500 },
  { name: 'May', balance: 19500, spending: 2700 },
  { name: 'Jun', balance: 21700, spending: 2900 },
  { name: 'Jul', balance: 23800, spending: 3400 },
  { name: 'Aug', balance: 24156, spending: 3100 },
];

const weeklyData = [
  { name: 'Mon', balance: 23600, spending: 450 },
  { name: 'Tue', balance: 23750, spending: 320 },
  { name: 'Wed', balance: 23850, spending: 180 },
  { name: 'Thu', balance: 23950, spending: 290 },
  { name: 'Fri', balance: 24050, spending: 210 },
  { name: 'Sat', balance: 24100, spending: 380 },
  { name: 'Sun', balance: 24156, spending: 140 },
];

const SpendingGraph: React.FC = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
  
  const data = period === 'monthly' ? monthlyData : weeklyData;
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-albert-400">
            Balance: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-accent">
            Spending: ${payload[1].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="p-6 bg-card/50 border-border/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Balance & Spending</h3>
          <Tabs defaultValue="monthly" value={period} onValueChange={(value) => setPeriod(value as 'weekly' | 'monthly')}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#14b8a6" 
                strokeWidth={3}
                dot={{ r: 4, fill: "#14b8a6", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#14b8a6", stroke: "rgba(20,184,166,0.4)", strokeWidth: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="spending" 
                stroke="#a78bfa" 
                strokeWidth={3}
                dot={{ r: 4, fill: "#a78bfa", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#a78bfa", stroke: "rgba(167,139,250,0.4)", strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 flex gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-albert-500 mr-2"></div>
            <span className="text-sm text-muted-foreground">Balance</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
            <span className="text-sm text-muted-foreground">Spending</span>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card/50 border-border/30">
          <h3 className="text-sm text-muted-foreground mb-2">Current Balance</h3>
          <div className="text-2xl font-medium">$24,156.20</div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-albert-400">↑ 5.4%</span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </Card>
        
        <Card className="p-6 bg-card/50 border-border/30">
          <h3 className="text-sm text-muted-foreground mb-2">Monthly Spending</h3>
          <div className="text-2xl font-medium">$3,100.45</div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-destructive">↑ 2.1%</span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </Card>
        
        <Card className="p-6 bg-card/50 border-border/30">
          <h3 className="text-sm text-muted-foreground mb-2">Savings Rate</h3>
          <div className="text-2xl font-medium">18.2%</div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-albert-400">↑ 1.5%</span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SpendingGraph;
