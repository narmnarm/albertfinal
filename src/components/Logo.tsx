
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-albert-400 to-albert-700 rounded-lg flex items-center justify-center`}>
          <div className={`${sizeClasses[size]} scale-[0.85] bg-background rounded-md flex items-center justify-center`}>
            <div className={`${sizeClasses[size]} scale-[0.7] bg-gradient-to-br from-albert-400 to-albert-700 rounded-md shadow-inner flex items-center justify-center text-white font-bold`}>
              A
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse-subtle" />
      </div>
      {withText && <span className={`font-semibold ${textSizeClasses[size]} tracking-tight text-white`}>Albert</span>}
    </Link>
  );
};

export default Logo;
