import React from 'react';
import Layout from '@/components/Layout';
import Chat from '@/components/Chat';
import { useAlbertScore } from '@/context/AlbertScoreContext';

const ChatPage: React.FC = () => {
  const { score } = useAlbertScore();

  const getAlbertImage = () => {
    if (score >= 80) return "/images/best.png";
    if (score >= 40) return "/images/middle.png";
    return "/images/worst.png";
  };

  const getAlbertMood = () => {
    if (score >= 80) return "happy";
    if (score >= 40) return "alright";
    return "sad";
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Chat with Albert</h1>
            <p className="text-muted-foreground">
              Your personal AI financial advisor, ready to help with any questions.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">Albert Score: {score}</p>
            <p className="text-muted-foreground">Albert is {getAlbertMood()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Chat Interface */}
          <div className="bg-card rounded-lg shadow-lg h-[700px] lg:sticky lg:top-8">
            <Chat
              initialSystemMessage="I am Albert, your dedicated AI financial advisor. I'm here to help you manage your finances, make better financial decisions, and achieve your goals."
            />
          </div>

          {/* Albert Image and Info */}
          <div className="hidden lg:block relative">
            <div className="sticky top-8 space-y-6">
              <div className="relative">
                <img
                  src={getAlbertImage()}
                  alt="Albert, your AI financial advisor"
                  className="w-full max-w-lg mx-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
              
              <div className="text-center max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-3">Meet Albert</h2>
                <p className="text-muted-foreground mb-4">
                  Powered by advanced AI, I analyze your financial data to provide personalized advice and insights.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-albert-500">24/7</div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-albert-500">Real-time</div>
                    <div className="text-sm text-muted-foreground">Analysis</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-albert-500">Smart</div>
                    <div className="text-sm text-muted-foreground">Insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
