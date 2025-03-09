
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 z-[-1] bg-noise opacity-[0.015]"></div>
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-radial from-albert-900/20 via-transparent to-transparent z-[-1]"></div>
      <div className="fixed -top-20 -right-20 w-96 h-96 bg-albert-500/5 blur-[100px] rounded-full z-[-1]"></div>
      <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-accent/5 blur-[100px] rounded-full z-[-1]"></div>
      
      <Navbar />
      
      <main className="pt-24 pb-20 min-h-screen">
        {children}
      </main>
      
      <footer className="bg-secondary/50 backdrop-blur-sm py-6 border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Albert. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover-text">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover-text">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover-text">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
