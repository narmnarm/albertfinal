
import React from 'react';
import { ArrowRight, LineChart, Shield, PieChart, CreditCard, Sparkles, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureSection: React.FC = () => {
  const features = [
    {
      title: 'Smart Financial Analysis',
      description: 'Get a complete view of your finances with AI-powered insights and recommendations.',
      icon: <LineChart className="h-5 w-5 text-albert-400" />,
    },
    {
      title: 'Alternative Credit Scoring',
      description: 'Our unique approach uses alternative data to build a more complete picture of your creditworthiness.',
      icon: <CreditCard className="h-5 w-5 text-albert-400" />,
    },
    {
      title: 'Personalized Financial Advice',
      description: 'Receive custom recommendations tailored to your financial goals and habits.',
      icon: <Sparkles className="h-5 w-5 text-albert-400" />,
    },
    {
      title: 'Spending Patterns Analysis',
      description: 'Visualize your spending habits and identify areas for improvement and savings.',
      icon: <PieChart className="h-5 w-5 text-albert-400" />,
    },
    {
      title: 'Net Worth Tracking',
      description: 'Track your assets and liabilities in one place for a complete financial picture.',
      icon: <BarChart3 className="h-5 w-5 text-albert-400" />,
    },
    {
      title: 'Bank-Level Security',
      description: 'Your financial data is protected with enterprise-grade encryption and security protocols.',
      icon: <Shield className="h-5 w-5 text-albert-400" />,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Albert Works for You</h2>
          <p className="text-muted-foreground">
            Our platform analyzes your financial data to provide personalized insights and help you make smarter financial decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card/80 backdrop-blur-sm hover-scale hover-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-albert-500/10 p-2 rounded-lg">{feature.icon}</div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <a href="#" className="text-sm text-albert-500 hover:text-albert-400 flex items-center">
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
