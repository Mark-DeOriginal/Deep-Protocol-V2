'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface SplashScreenProps {
  onComplete: (theme: 'light' | 'dark') => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    // Check if user has already seen splash screen in this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    // Start logo animation after a brief delay
    setTimeout(() => {
      setIsAnimating(true);
    }, 300);
  }, []);

  const handleThemeSelect = (theme: 'light' | 'dark') => {
    setSelectedTheme(theme);
    
    // Store in sessionStorage so splash doesn't show again this session
    sessionStorage.setItem('hasSeenSplash', 'true');
    
    // Animate out
    setTimeout(() => {
      setIsVisible(false);
      onComplete(theme);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        selectedTheme ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%)',
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Container */}
        <div 
          className={`mb-12 transition-all duration-1000 ${
            isAnimating 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-75 translate-y-10'
          }`}
        >
          {/* Logo with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-3xl blur-2xl animate-pulse" />
            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <img
                src="/nobgiconlogo.png"
                alt="Deep Protocol"
                className="w-32 h-32 object-contain animate-float"
              />
            </div>
          </div>
        </div>

        {/* Powered by DEEP text */}
        <div 
          className={`mb-16 transition-all duration-1000 delay-300 ${
            isAnimating 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Deep Protocol
          </h1>
          <p className="text-white/80 text-lg md:text-xl text-center font-medium">
            Powered by <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">DEEP</span>
          </p>
        </div>

        {/* Theme Selection */}
        <div 
          className={`transition-all duration-1000 delay-500 ${
            isAnimating 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-white/90 text-center mb-6 text-lg">
            Choose your theme to continue
          </p>
          
          <div className="flex gap-4">
            {/* Light Theme Button */}
            <button
              onClick={() => handleThemeSelect('light')}
              className="group relative bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sun className="w-8 h-8 text-purple-600" />
                </div>
                <span className="text-white font-semibold text-lg">Light</span>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-2xl transition-all duration-300" />
            </button>

            {/* Dark Theme Button */}
            <button
              onClick={() => handleThemeSelect('dark')}
              className="group relative bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Moon className="w-8 h-8 text-blue-400" />
                </div>
                <span className="text-white font-semibold text-lg">Dark</span>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-2xl transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Hint text */}
        <div 
          className={`mt-8 transition-all duration-1000 delay-700 ${
            isAnimating 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
        >
          <p className="text-white/60 text-sm text-center">
            Click to enter Deep Protocol
          </p>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
