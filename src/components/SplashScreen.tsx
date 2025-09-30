'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, TrendingUp, Shield, Zap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: (theme: 'light' | 'dark') => void;
}

const facts = [
  { icon: TrendingUp, text: "Aggregating 100+ liquidity pools on Solana", color: "text-blue-300" },
  { icon: Shield, text: "AI-powered risk analysis on every pool", color: "text-purple-300" },
  { icon: Zap, text: "Real-time APR tracking across all protocols", color: "text-green-300" },
  { icon: TrendingUp, text: "Compare pools side-by-side instantly", color: "text-orange-300" },
  { icon: Shield, text: "Only pools with 4%+ APR displayed", color: "text-pink-300" },
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | null>(null);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [progress, setProgress] = useState(0);

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
    }, 200);

    // Rotate facts every 2.5 seconds
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 2500);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 30);

    return () => {
      clearInterval(factInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleThemeSelect = (theme: 'light' | 'dark') => {
    setSelectedTheme(theme);
    
    // Store in sessionStorage so splash doesn't show again this session
    sessionStorage.setItem('hasSeenSplash', 'true');
    
    // Animate out
    setTimeout(() => {
      setIsVisible(false);
      onComplete(theme);
    }, 600);
  };

  if (!isVisible) return null;

  const CurrentFactIcon = facts[currentFactIndex].icon;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-700 ${
        selectedTheme ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%)',
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-2xl mx-auto">
        {/* Logo Container with enhanced animation */}
        <div 
          className={`mb-8 transition-all duration-1000 ${
            isAnimating 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-50 translate-y-10'
          }`}
        >
          {/* Logo with enhanced glow effect */}
          <div className="relative">
            {/* Multiple glow layers for depth */}
            <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-0 bg-purple-300/30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            
            <div className="relative bg-white/10 backdrop-blur-md rounded-full p-4 border-2 border-white/30 shadow-2xl flex items-center justify-center">
              <img
                src="/nobgiconlogo.png"
                alt="Deep Protocol"
                className="w-32 h-32 object-contain animate-spin-slow"
              />
            </div>
          </div>
        </div>

        {/* Powered by DEEP text with enhanced animation */}
        <div 
          className={`mb-8 transition-all duration-1000 delay-200 ${
            isAnimating 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-3 tracking-tight">
            <span className="animate-shimmer bg-gradient-to-r from-white from-35% via-purple-400 via-50% to-white to-65% bg-clip-text text-transparent" style={{ backgroundSize: '250% auto' }}>
              Deep Protocol
            </span>
          </h1>
          <p className="text-white/90 text-xl md:text-2xl text-center font-medium">
            Powered by <span className="font-bold bg-white/30 px-4 py-1.5 rounded-xl backdrop-blur-sm">DEEP</span>
          </p>
        </div>

        {/* Rotating Facts */}
        <div 
          className={`mb-10 transition-all duration-1000 delay-300 ${
            isAnimating 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="h-16 flex items-center justify-center">
            <div 
              key={currentFactIndex}
              className="flex items-center space-x-3 animate-fadeIn"
            >
              <CurrentFactIcon className={`w-6 h-6 ${facts[currentFactIndex].color}`} />
              <p className="text-white/80 text-lg text-center max-w-md">
                {facts[currentFactIndex].text}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-64 mx-auto">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/60 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Theme Selection with enhanced design */}
        <div 
          className={`transition-all duration-1000 delay-500 ${
            isAnimating 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-white/90 text-center mb-6 text-lg font-medium">
            Choose your experience
          </p>
          
          <div className="flex gap-6">
            {/* Light Theme Button */}
            <button
              onClick={() => handleThemeSelect('light')}
              className="group relative overflow-hidden"
            >
              <div className="relative bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/40 hover:border-white/60 rounded-2xl p-8 transition-all duration-300 hover:scale-110 hover:shadow-2xl">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-white to-yellow-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Sun className="w-10 h-10 text-yellow-600" />
                  </div>
                  <span className="text-white font-bold text-xl">Light</span>
                  <span className="text-white/60 text-sm">Clean & Bright</span>
                </div>
              </div>
              
              {/* Animated border on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/50 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </button>

            {/* Dark Theme Button */}
            <button
              onClick={() => handleThemeSelect('dark')}
              className="group relative overflow-hidden"
            >
              <div className="relative bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/40 hover:border-white/60 rounded-2xl p-8 transition-all duration-300 hover:scale-110 hover:shadow-2xl">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Moon className="w-10 h-10 text-blue-300" />
                  </div>
                  <span className="text-white font-bold text-xl">Dark</span>
                  <span className="text-white/60 text-sm">Sleek & Modern</span>
                </div>
              </div>
              
              {/* Animated border on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-400/50 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
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
          <p className="text-white/50 text-sm text-center animate-pulse">
            Select your preferred theme to continue
          </p>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(-10px) translateX(-10px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 5s linear infinite;
        }
      `}</style>
    </div>
  );
}