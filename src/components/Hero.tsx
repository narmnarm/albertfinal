
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Shield, BarChart3, LineChart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="py-12 md:py-24 container mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm backdrop-blur-sm bg-background/30">
            <span className="flex h-2 w-2 rounded-full bg-albert-400 mr-2"></span>
            <span className="text-xs">Simplify your financial journey</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-gradient">Smarter finance</span> starts with Albert.
          </h1>
          
          <p className="text-lg text-muted-foreground">
            A single platform that analyzes, optimizes, and grows your financial health using advanced AI and alternative data metrics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button className="bg-albert-600 hover:bg-albert-700 text-white h-12 px-6 rounded-lg" asChild>
              <Link to="/chat">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="h-12 px-6 rounded-lg" asChild>
              <Link to="/demo">
                View Demo
              </Link>
            </Button>
          </div>
          
          <div className="pt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-albert-400" />
              <span className="text-sm">Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-albert-400" />
              <span className="text-sm">Advanced analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-albert-400" />
              <span className="text-sm">Personalized insights</span>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px]">
          <div className="absolute inset-0 bg-gradient-radial from-albert-500/20 via-transparent to-transparent opacity-70 z-0 rounded-full blur-[60px]"></div>
          
          {/* Dashboard Preview */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-10 overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] bg-[#121218]">
            <div className="h-10 w-full bg-[#1a1a1f] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
              </div>
              <div className="text-xs bg-[#2a2a30] rounded-full px-3 py-0.5 text-white/60 ml-3">
                Albert Financial Dashboard
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60">Total Balance</p>
                  <p className="text-xl font-bold">$24,156.20</p>
                </div>
                <div className="flex items-center gap-1 bg-albert-500/20 text-albert-400 rounded-full px-2 py-0.5 text-xs">
                  <Sparkles className="h-3 w-3" />
                  <span>+15.3%</span>
                </div>
              </div>
              
              <div className="bg-[#1a1a1f] rounded-lg p-3 mb-3">
                <div className="h-[120px] w-full bg-gradient-to-b from-albert-500/10 to-transparent rounded-md overflow-hidden relative">
                  <svg viewBox="0 0 300 100" className="w-full h-full">
                    <path 
                      d="M0,50 C60,30 150,80 300,30" 
                      fill="none" 
                      stroke="#14b8a6" 
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1a1a1f] rounded-lg p-3">
                  <p className="text-xs text-white/60">Credit Score</p>
                  <p className="text-lg font-bold">742</p>
                  <div className="h-1.5 w-full bg-[#2a2a30] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-albert-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="bg-[#1a1a1f] rounded-lg p-3">
                  <p className="text-xs text-white/60">Investments</p>
                  <p className="text-lg font-bold">$8,245.50</p>
                  <div className="h-1.5 w-full bg-[#2a2a30] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-[15%] right-[5%] w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-[20%] left-[10%] w-20 h-20 bg-albert-600/20 rounded-full blur-xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
