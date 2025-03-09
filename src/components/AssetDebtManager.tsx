import React, { useState } from 'react';
import { useAlbertScore } from '@/context/AlbertScoreContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Asset, Debt } from '@/types/finance';

const AssetDebtManager: React.FC = () => {
  const { addAsset, addDebt, financialState } = useAlbertScore();
  const [activeTab, setActiveTab] = useState('assets');

  // Asset form state
  const [newAsset, setNewAsset] = useState({
    name: '',
    value: '',
    type: 'cash' as Asset['type']
  });

  // Debt form state
  const [newDebt, setNewDebt] = useState({
    name: '',
    amount: '',
    interestRate: '',
    minimumPayment: '',
    type: 'credit' as Debt['type']
  });

  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.value) return;

    addAsset({
      id: Date.now().toString(),
      name: newAsset.name,
      value: parseFloat(newAsset.value),
      type: newAsset.type,
      lastUpdated: new Date()
    });

    setNewAsset({ name: '', value: '', type: 'cash' });
  };

  const handleDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebt.name || !newDebt.amount) return;

    addDebt({
      id: Date.now().toString(),
      name: newDebt.name,
      amount: parseFloat(newDebt.amount),
      interestRate: parseFloat(newDebt.interestRate || '0'),
      minimumPayment: parseFloat(newDebt.minimumPayment || '0'),
      type: newDebt.type,
      lastUpdated: new Date()
    });

    setNewDebt({
      name: '',
      amount: '',
      interestRate: '',
      minimumPayment: '',
      type: 'credit'
    });
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="assets" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="debts">Debts</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-6">
          <form onSubmit={handleAssetSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Asset Name"
                value={newAsset.name}
                onChange={e => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Value"
                value={newAsset.value}
                onChange={e => setNewAsset(prev => ({ ...prev, value: e.target.value }))}
              />
              <Select
                value={newAsset.type}
                onValueChange={value => setNewAsset(prev => ({ ...prev, type: value as Asset['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </form>

          <div className="space-y-2">
            {financialState.assets.map(asset => (
              <div key={asset.id} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                <div>
                  <h4 className="font-medium">{asset.name}</h4>
                  <p className="text-sm text-muted-foreground">{asset.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${asset.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Updated: {asset.lastUpdated.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="debts" className="space-y-6">
          <form onSubmit={handleDebtSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Debt Name"
                value={newDebt.name}
                onChange={e => setNewDebt(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newDebt.amount}
                onChange={e => setNewDebt(prev => ({ ...prev, amount: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Interest Rate (%)"
                value={newDebt.interestRate}
                onChange={e => setNewDebt(prev => ({ ...prev, interestRate: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Minimum Payment"
                value={newDebt.minimumPayment}
                onChange={e => setNewDebt(prev => ({ ...prev, minimumPayment: e.target.value }))}
              />
              <Select
                value={newDebt.type}
                onValueChange={value => setNewDebt(prev => ({ ...prev, type: value as Debt['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Debt Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="student">Student Loan</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Debt
            </Button>
          </form>

          <div className="space-y-2">
            {financialState.debts.map(debt => (
              <div key={debt.id} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                <div>
                  <h4 className="font-medium">{debt.name}</h4>
                  <p className="text-sm text-muted-foreground">{debt.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-500">${debt.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {debt.interestRate}% APR
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AssetDebtManager;