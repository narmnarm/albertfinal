
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoDemo: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Albert in Action</h1>
          <p className="text-muted-foreground mb-6">
            See how Albert can transform your financial management experience.
          </p>
          
          <div className="aspect-video bg-black/30 rounded-lg overflow-hidden border border-border">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Albert Demo Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          
          <div className="mt-10 space-y-6">
            <h2 className="text-2xl font-semibold">Key Features Demonstrated</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-xl font-medium mb-2">AI-Powered Financial Analysis</h3>
                <p className="text-muted-foreground">
                  See how our AI provides personalized insights about your financial situation and recommends actionable steps.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-xl font-medium mb-2">Alternative Credit Scoring</h3>
                <p className="text-muted-foreground">
                  Watch how Albert analyzes alternative data sources to give you a more comprehensive credit profile.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-xl font-medium mb-2">Smart Transaction Categorization</h3>
                <p className="text-muted-foreground">
                  See how the platform automatically categorizes your spending and identifies patterns to help you save.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-xl font-medium mb-2">Interactive Financial Education</h3>
                <p className="text-muted-foreground">
                  Learn how our AI assistant helps you understand complex financial concepts through simple, conversational explanations.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <Button className="bg-albert-600 hover:bg-albert-700 text-white" asChild>
                <Link to="/chat">Try Albert Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoDemo;
