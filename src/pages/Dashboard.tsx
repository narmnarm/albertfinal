import React from 'react';
import Layout from '@/components/Layout';
import DashboardComponent from '@/components/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Track your financial health and improve your Albert Score through smart financial management.
          </p>
        </div>
        
        <DashboardComponent />
      </div>
    </Layout>
  );
};

export default DashboardPage;
