
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { Menu, X, ChevronDown, LineChart, CreditCard, PieChart, User, Settings, MessageSquare } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LineChart className="h-4 w-4" /> },
    { name: 'Credit Analysis', path: '/credit-analysis', icon: <CreditCard className="h-4 w-4" /> },
    { name: 'Transactions', path: '/transactions', icon: <PieChart className="h-4 w-4" /> },
    { name: 'AI Chat', path: '/chat', icon: <MessageSquare className="h-4 w-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition-all ${
                  isActive(link.path) 
                    ? 'bg-albert-500/10 text-albert-400' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="default" className="bg-albert-600 hover:bg-albert-700 text-white" asChild>
              <Link to="/chat">Get Started</Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 py-3 animate-fade-in-up bg-secondary/50 backdrop-blur-md rounded-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md flex items-center gap-2 ${
                    isActive(link.path)
                      ? 'bg-albert-500/20 text-albert-400'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex justify-center">
                <Button className="w-full bg-albert-600 hover:bg-albert-700 text-white" asChild>
                  <Link to="/chat">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
