
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { ArrowRight, CreditCard, Info, ShieldCheck, AlertTriangle } from 'lucide-react';
import Chat from '@/components/Chat';

const CreditAnalysisPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [creditScore, setCreditScore] = useState(650);
  const [income, setIncome] = useState('60000');
  const [debt, setDebt] = useState('15000');
  const [utilization, setUtilization] = useState(30);
  const [history, setHistory] = useState(5);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };
  
  const getCreditScoreColor = () => {
    if (creditScore >= 750) return "bg-green-500";
    if (creditScore >= 670) return "bg-blue-500";
    if (creditScore >= 580) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getCreditScoreLabel = () => {
    if (creditScore >= 750) return "Excellent";
    if (creditScore >= 670) return "Good";
    if (creditScore >= 580) return "Fair";
    return "Poor";
  };
  
  const debtToIncomeRatio = parseFloat(debt) / parseFloat(income) * 100;
  
  const initialPrompt = formSubmitted 
    ? `Based on my credit profile: ${creditScore} credit score, $${income} annual income, $${debt} total debt, ${utilization}% credit utilization, and ${history} years of credit history, what specific steps can I take to improve my credit score and financial health?`
    : '';

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Credit Analysis</h1>
        <p className="text-muted-foreground mb-8">
          Get insights into your credit health and personalized recommendations to improve your score.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {!formSubmitted ? (
            <Card className="p-6 bg-card border border-border">
              <h2 className="text-xl font-semibold mb-4">Enter Your Credit Information</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="credit-score">Credit Score (Estimated)</Label>
                    <div className="mt-1">
                      <Slider 
                        id="credit-score"
                        value={[creditScore]} 
                        onValueChange={(value) => setCreditScore(value[0])} 
                        min={300} 
                        max={850} 
                        step={1}
                        className="py-4"
                      />
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-red-500">Poor (300)</span>
                        <span className="text-amber-500">Fair</span>
                        <span className="text-blue-500">Good</span>
                        <span className="text-green-500">Excellent (850)</span>
                      </div>
                      <div className="text-center mt-1 font-medium text-lg">
                        {creditScore}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="annual-income">Annual Income ($)</Label>
                      <Input 
                        id="annual-income"
                        type="number" 
                        value={income} 
                        onChange={(e) => setIncome(e.target.value)}
                        className="mt-1" 
                        placeholder="Annual Income" 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="total-debt">Total Debt ($)</Label>
                      <Input 
                        id="total-debt"
                        type="number" 
                        value={debt} 
                        onChange={(e) => setDebt(e.target.value)}
                        className="mt-1" 
                        placeholder="Total Debt" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="credit-utilization">
                      Credit Utilization ({utilization}%)
                    </Label>
                    <Slider 
                      id="credit-utilization"
                      value={[utilization]} 
                      onValueChange={(value) => setUtilization(value[0])} 
                      min={0} 
                      max={100} 
                      step={1}
                      className="py-4"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="credit-history">
                      Years of Credit History ({history})
                    </Label>
                    <Slider 
                      id="credit-history"
                      value={[history]} 
                      onValueChange={(value) => setHistory(value[0])} 
                      min={0} 
                      max={30} 
                      step={1}
                      className="py-4"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-albert-600 hover:bg-albert-700 text-white">
                  Analyze My Credit <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="p-6 bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Credit Profile</h2>
                  <Button variant="outline" size="sm" onClick={() => setFormSubmitted(false)}>
                    Edit Profile
                  </Button>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Credit Score</span>
                    <span className="text-sm font-medium">{getCreditScoreLabel()}</span>
                  </div>
                  <div className="relative h-8 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full ${getCreditScoreColor()} transition-all duration-500`}
                      style={{ width: `${(creditScore - 300) / 5.5}%` }}
                    >
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-sm font-medium">
                      {creditScore}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Annual Income</span>
                      <span className="text-sm font-medium">${parseInt(income).toLocaleString()}</span>
                    </div>
                    <Progress value={Math.min(parseInt(income) / 200000 * 100, 100)} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Total Debt</span>
                      <span className="text-sm font-medium">${parseInt(debt).toLocaleString()}</span>
                    </div>
                    <Progress value={Math.min(parseInt(debt) / 100000 * 100, 100)} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Debt to Income Ratio</span>
                      <span className="text-sm font-medium">{debtToIncomeRatio.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.min(debtToIncomeRatio * 2, 100)} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Credit Utilization</span>
                      <span className="text-sm font-medium">{utilization}%</span>
                    </div>
                    <Progress value={utilization} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Credit Age</span>
                      <span className="text-sm font-medium">{history} years</span>
                    </div>
                    <Progress value={Math.min(history / 30 * 100, 100)} className="h-2" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-card border border-border">
                <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    {creditScore >= 670 ? (
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium">Credit Score</h3>
                      <p className="text-sm text-muted-foreground">
                        {creditScore >= 750 
                          ? "Excellent! You're in the top tier, which gives you access to the best rates and terms."
                          : creditScore >= 670
                          ? "Good. You have a solid score that qualifies you for most financial products."
                          : creditScore >= 580
                          ? "Fair. You may face higher interest rates and more limited options."
                          : "Poor. You might have difficulty qualifying for new credit."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    {utilization <= 30 ? (
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium">Credit Utilization</h3>
                      <p className="text-sm text-muted-foreground">
                        {utilization <= 10
                          ? "Excellent utilization rate below 10%. This positively impacts your score."
                          : utilization <= 30
                          ? "Good utilization rate below 30%. This is generally recommended."
                          : "High utilization rate. Lenders may see this as a risk factor."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    {debtToIncomeRatio <= 36 ? (
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium">Debt to Income Ratio</h3>
                      <p className="text-sm text-muted-foreground">
                        {debtToIncomeRatio <= 20
                          ? "Excellent DTI ratio. You're managing your debt well relative to your income."
                          : debtToIncomeRatio <= 36
                          ? "Good DTI ratio. This is within the range lenders typically prefer."
                          : "High DTI ratio. This may limit your borrowing options and increase rates."}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          <div className="h-[800px] lg:h-auto">
            <Chat 
              initialPrompt={initialPrompt}
              initialSystemMessage="I'm your Credit Analysis Assistant. I can help you understand your credit profile and suggest ways to improve your financial health."
              className="h-full"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreditAnalysisPage;
