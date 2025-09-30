"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { fetchRaydiumPools, getPoolAPR, getPoolTVL } from "@/lib/raydiumApi";

export default function Home() {
  const [stats, setStats] = useState({
    totalLiquidity: 0,
    totalPools: 0,
    averageDPY: 0,
    totalUsers: 174503,
  });

  // Fetch real pool data for stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchRaydiumPools({
          poolType: 'all',
          poolSortField: 'default',
          sortType: 'desc',
          pageSize: 100,
          page: 1
        });

        if (response.success && response.data.data.length > 0) {
          // Filter out pools with APR less than 4%
          const pools = response.data.data.filter(pool => {
            const apr = getPoolAPR(pool);
            return apr >= 4;
          });
          
          const totalLiquidity = pools.reduce((sum, pool) => sum + getPoolTVL(pool), 0);
          const averageAPR = pools.reduce((sum, pool) => sum + getPoolAPR(pool), 0) / pools.length;
          
          setStats({
            totalLiquidity: Math.round(totalLiquidity),
            totalPools: pools.length,
            averageDPY: Number(averageAPR.toFixed(2)),
            totalUsers: 174503,
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  const imageRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCards, setShowCards] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [showDeepnomics, setShowDeepnomics] = useState(false);
  const deepnomicsRef = useRef<HTMLDivElement>(null);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isSectionCentered, setIsSectionCentered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const defiSectionRef = useRef<HTMLElement>(null);
  const progressAnimationRef = useRef<number>();

  // Smooth progress animation function
  const animateProgress = useCallback((targetProgress: number) => {
    if (progressAnimationRef.current) {
      cancelAnimationFrame(progressAnimationRef.current);
    }

    const startProgress = smoothProgress;
    const startTime = Date.now();
    const duration = 800; // 800ms smooth transition

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentProgress = startProgress + (targetProgress - startProgress) * easeOutCubic;
      
      setSmoothProgress(currentProgress);

      if (progress < 1) {
        progressAnimationRef.current = requestAnimationFrame(animate);
      }
    };

    progressAnimationRef.current = requestAnimationFrame(animate);
  }, [smoothProgress]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      if (!imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate distance from image center
      const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      const maxDistance = 400; // Maximum distance for effect

      // Only apply effect if mouse is within range
      if (distance < maxDistance) {
        // Calculate rotation based on mouse position relative to center
        const rotateX = (mouseY / rect.height) * -15; // Tilt up/down
        const rotateY = (mouseX / rect.width) * 15; // Tilt left/right

        // Scale effect based on distance (closer = more effect)
        const scale = 1 + 0.05 * (1 - distance / maxDistance);

        // Apply the transform
        imageRef.current.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          scale(${scale})
        `;
      } else {
        // Reset to original position when mouse is far away
        imageRef.current.style.transform = `
          perspective(1000px) 
          rotateX(0deg) 
          rotateY(0deg) 
          scale(1)
        `;
      }
    };

    // Add global mouse move listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Scroll detection for DeFi section with smooth progress and rate limiting
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let lastScrollTime = 0;
    let lastProgress = 0;
    
    const handleScroll = () => {
      if (!defiSectionRef.current) return;

      const section = defiSectionRef.current;
      const container = section.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if section is sticky (stuck at top with 5rem offset)
      const headerOffset = 80; // 5rem = 80px
      const isSticky = sectionRect.top <= headerOffset && sectionRect.bottom >= windowHeight;
      
      if (isSticky) {
        setIsSectionCentered(true);
        
        // Calculate progress based on how much of the container has scrolled past
        const containerStart = containerRect.top;
        const containerHeight = containerRect.height;
        const rawProgress = Math.max(0, Math.min(1, (-containerStart) / (containerHeight - windowHeight)));
        
        
        // Rate limiting: prevent progress from changing too quickly
        const now = Date.now();
        const timeDiff = now - lastScrollTime;
        const progressDiff = Math.abs(rawProgress - lastProgress);
        
        // If scrolling too fast, limit the progress change
        let limitedProgress = rawProgress;
        if (timeDiff < 50 && progressDiff > 0.1) { // If less than 50ms and big jump
          limitedProgress = lastProgress + (rawProgress > lastProgress ? 0.05 : -0.05);
        }
        
        setScrollProgress(limitedProgress);
        animateProgress(limitedProgress); // Use smooth animation
        
        lastScrollTime = now;
        lastProgress = limitedProgress;

        // Toggle solution when limited progress reaches thresholds
        if (limitedProgress > 0.5 && !showSolution) {
          setShowSolution(true);
        } else if (limitedProgress < 0.3 && showSolution) {
          setShowSolution(false);
        }
      } else {
        setIsSectionCentered(false);
        setScrollProgress(0);
        animateProgress(0);
        lastProgress = 0;
      }
    };

    // Throttle scroll events for better performance
    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 8); // Increased to ~120fps for smoother feel
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Initial call
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(scrollTimeout);
      if (progressAnimationRef.current) {
        cancelAnimationFrame(progressAnimationRef.current);
      }
    };
  }, [showSolution, animateProgress]);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardsRef.current) return;

      const rect = cardsRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Trigger animation when cards section is 70% visible
      if (rect.top < windowHeight * 0.7 && rect.bottom > 0) {
        setShowCards(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleDeepnomicsScroll = () => {
      if (!deepnomicsRef.current) return;

      const rect = deepnomicsRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Trigger animation when deepnomics section is 60% visible
      if (rect.top < windowHeight * 0.6 && rect.bottom > 0) {
        setShowDeepnomics(true);
      }
    };

    window.addEventListener("scroll", handleDeepnomicsScroll);
    handleDeepnomicsScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleDeepnomicsScroll);
    };
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/25 to-blue-400/25 rounded-full blur-xl animate-bounce"
            style={{ animationDuration: "6s" }}
          ></div>
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-500/22 to-blue-500/22 rounded-full blur-xl animate-bounce"
            style={{ animationDuration: "8s", animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Your Gateway to
              <span className="block bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Simple Liquidity Provisioning
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              We've simplified liquidity provisioning on Solana. Select your
              favourite Liquidity Pool and benefit from yields using our
              professional dashboard. Powered by Deep AI.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link
                href="/pools"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-medium text-lg hover:opacity-90 transition-opacity active:scale-95"
              >
                Provide Liquidity
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Deep Protocol?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built on Solana for lightning-fast transactions and minimal fees
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Execute transactions in seconds with Solana's high-performance
                blockchain
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Our Aggregator
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI-Powered aggregator makes it easy and stress-free to
                provide liquidity, track & earn yields.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Audited
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Smart contracts audited by leading security firms for maximum
                protection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Deep Protocol Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover how Deep Protocol makes liquidity provisioning simple,
              powerful, and rewarding.
            </p>
          </div>
          <div className="space-y-16">
            {/* Feature 1: Liquidity Pools */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src="/liquidity-pools.jpg"
                alt="Liquidity Pools UI"
                className="w-full md:w-1/2 rounded-2xl shadow-lg object-cover"
              />
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Unified Liquidity Pools
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  Access top Solana pools in one place. Instantly compare APYs,
                  fees, and pool stats to find the best opportunities for your
                  assets.
                </p>
                <p className="text-md text-gray-500 dark:text-gray-400">
                  No more hopping between platforms—Deep Protocol brings the
                  entire ecosystem to your fingertips.
                </p>
              </div>
            </div>
            {/* Feature 2: Add Liquidity */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <img
                src="/add-liquidity.jpg"
                alt="Add Liquidity UI"
                className="w-full md:w-1/2 rounded-2xl shadow-lg object-cover"
              />
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  One-Click Liquidity Provision
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  Provide liquidity with a single click. Our streamlined
                  interface and smart contract integration make deposits fast,
                  secure, and effortless.
                </p>
                <p className="text-md text-gray-500 dark:text-gray-400">
                  Let Deep AI handle the complexity—focus on growing your yield.
                </p>
              </div>
            </div>
            {/* Feature 3: Dashboard */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src="/dashboard.jpg"
                alt="Dashboard UI"
                className="w-full md:w-1/2 rounded-2xl shadow-lg object-cover"
              />
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Professional Dashboard & Analytics
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  Track your positions, yields, and earnings in real time. Our
                  dashboard provides actionable insights to your portfolio
                  performance.
                </p>
                <p className="text-md text-gray-500 dark:text-gray-400">
                  Stay informed and in control—Deep Protocol makes DeFi
                  management easy for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Container for DeFi Section - Desktop/Tablet only */}
      <div className="md:h-[200vh] relative">
        {/* Sticky DeFi Section - Desktop/Tablet, Regular Section on Mobile */}
        <section 
          ref={defiSectionRef}
          className="md:sticky md:top-20 md:h-screen flex items-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden py-12 md:py-0"
          style={{ minHeight: 'auto' }}
        >
        {/* Animated Background Bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/25 to-blue-400/25 rounded-full blur-xl animate-bounce"
            style={{ animationDuration: "6s" }}
          ></div>
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-500/22 to-blue-500/22 rounded-full blur-xl animate-bounce"
            style={{ animationDuration: "8s", animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* A Big DeFi Problem Solved - Header Section */}
          <div className="flex flex-col lg:flex-row items-center justify-center mb-12">
            {/* Logo on the left with global mouse tracking - positioned close to text */}
            <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-4">
              <div className="relative w-32 h-32">
                <div
                  ref={imageRef}
                  className="relative w-full h-full rounded-xl transition-all duration-300 ease-out"
                  style={{
                    transform:
                      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <img
                    src="/nobgiconlogo.png"
                    alt="Deep Protocol Logo"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Text content on the right - centered with logo */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                A Big{" "}
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  DeFi
                </span>{" "}
                Problem Solved
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
                Deep Protocol is on a mission to solve one of the biggest{" "}
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  DeFi
                </span>{" "}
                problems. And here is how.
              </p>
            </div>
          </div>

          {/* Interactive Toggle Card */}
          <div ref={cardsRef} className="max-w-4xl mx-auto">
            <div
              className={`transition-all duration-1000 ease-out ${
                showCards
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              {/* Toggle Switch - Always visible and clickable */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex flex-col sm:flex-row gap-1 sm:gap-0">
                  <button
                    onClick={() => setShowSolution(false)}
                    className={`px-4 sm:px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                      !showSolution
                        ? "bg-red-500 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Without Deep Protocol
                  </button>
                  <button
                    onClick={() => setShowSolution(true)}
                    className={`px-4 sm:px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                      showSolution
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    With Deep Protocol
                  </button>
                </div>
              </div>

              {/* Content Card */}
              <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
                {/* Problem Card */}
                {!showSolution && (
                  <div className="animate-fadeIn">
                    <div className="relative h-full">
                      {/* Gradient border effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-sm"></div>
                      <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        {/* Header with icon */}
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Without Deep Protocol
                          </h3>
                        </div>

                        <div className="space-y-4 flex-grow">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></div>
                            <p className="text-gray-700 dark:text-gray-300">
                              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                                DeFi
                              </span>{" "}
                              liquidity provisioning is powerful — but overly complex
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></div>
                            <p className="text-gray-700 dark:text-gray-300">
                              Too many pools across different protocols
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></div>
                            <p className="text-gray-700 dark:text-gray-300">
                              Hard to compare yields and risks
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></div>
                            <p className="text-gray-700 dark:text-gray-300">
                              Manual deposits, claims, and compounding
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></div>
                            <p className="text-gray-700 dark:text-gray-300">
                              High learning curve for newcomers
                            </p>
                          </div>
                        </div>
                        
                        {/* Spacer to fill remaining height */}
                        <div className="flex-grow"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Solution Card */}
                {showSolution && (
                  <div className="animate-fadeIn">
                    <div className="relative h-full">
                      {/* Gradient border effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-sm"></div>
                      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        {/* Header with icon */}
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            With Deep Protocol
                          </h3>
                        </div>

                        <div className="space-y-4 flex-grow">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                            <p className="text-gray-700 dark:text-gray-300">
                              Compare Pools Instantly: View APYs, fees, and volume
                              side by side
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                            <p className="text-gray-700 dark:text-gray-300">
                              One-Click Deposits: Provide liquidity directly without
                              switching platforms
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                            <p className="text-gray-700 dark:text-gray-300">
                              AI Optimization: Smart engine highlights the best
                              opportunities
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                            <p className="text-gray-700 dark:text-gray-300">
                              Seamless Rewards Tracking: Claim and monitor yield from
                              one interface
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                            <p className="text-gray-700 dark:text-gray-300">
                              Automated workflows and smart contract integration
                            </p>
                          </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-8 pt-6 border-t border-blue-200 dark:border-blue-700">
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Want this for your{" "}
                            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                              DeFi
                            </span>{" "}
                            strategy?
                          </p>
                          <Link
                            href="/pools"
                            className="inline-flex items-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                          >
                            START PROVIDING LIQUIDITY
                            <svg
                              className="w-4 h-4 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Scroll Progress Indicator - Desktop/Tablet only */}
              <div className="hidden md:flex justify-center mt-8">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-64 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${isSectionCentered ? scrollProgress * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* Deepnomics Section */}
      <section ref={deepnomicsRef} className="pt-12 pb-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Deepnomics
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple, transparent, and community-first tokenomics designed for long-term success.
            </p>
          </div>

          {/* Token Overview */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-3xl p-8 mb-12 border border-purple-200 dark:border-purple-800">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  $DEEP
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Token Name
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Solana
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Blockchain (SPL Token)
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  100M
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Supply
                </div>
              </div>
            </div>
          </div>


          {/* Token Distribution */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Distribution Chart */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center lg:text-left">
                Token Distribution
              </h3>
              
              {/* Development Team */}
              <div 
                className="relative cursor-pointer group"
                onMouseEnter={() => setHoveredBar("dev")}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Development Team</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">5%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out group-hover:h-5 group-hover:shadow-lg ${
                      showDeepnomics ? "animate-pulse" : ""
                    }`}
                    style={{ 
                      width: showDeepnomics ? "5%" : "0%",
                      transitionDelay: showDeepnomics ? "0.5s" : "0s"
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  Locked for continuous improvements and long-term ecosystem growth
                </p>
                
                {/* Hover Tooltip */}
                {hoveredBar === "dev" && (
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10 shadow-lg">
                    <div className="font-bold">5,000,000 $DEEP</div>
                    <div className="text-xs opacity-80">Fully locked tokens</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                  </div>
                )}
              </div>

              {/* Open Market */}
              <div 
                className="relative cursor-pointer group"
                onMouseEnter={() => setHoveredBar("market")}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Open Market</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">95%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out group-hover:h-5 group-hover:shadow-lg ${
                      showDeepnomics ? "animate-pulse" : ""
                    }`}
                    style={{ 
                      width: showDeepnomics ? "95%" : "0%",
                      transitionDelay: showDeepnomics ? "1s" : "0s"
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  Released directly to the community via Pump.Fun for fair distribution
                </p>
                
                {/* Hover Tooltip */}
                {hoveredBar === "market" && (
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10 shadow-lg">
                    <div className="font-bold">95,000,000 $DEEP</div>
                    <div className="text-xs opacity-80">Available to community</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Principles */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Principles
              </h3>
              
              <div className="space-y-6">
                {/* Principle 1 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No VC Manipulation
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      By keeping the developer share locked and pushing nearly all supply into the open market, we eliminate VC manipulation and ensure true decentralization from day one.
                    </p>
                  </div>
                </div>

                {/* Principle 2 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Community-First Distribution
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      The majority of supply is released directly to the community via Pump.Fun, guaranteeing fair and transparent distribution without insider advantages.
                    </p>
                  </div>
                </div>

                {/* Principle 3 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Aligned Incentives
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      The dev allocation is fully locked, ensuring no short-term sell pressure and aligning the team with the community's long-term success.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to be part of the future?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Join the Deep Protocol community and help shape the future of decentralized liquidity provisioning on Solana.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/pools"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Start Providing Liquidity
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Role of $DEEP Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              The Role of{" "}
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                $DEEP
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              $DEEP is the native utility token that powers the Deep Protocol ecosystem. Its design goes beyond speculation — it directly enhances user experience and provides governance rights for the community.
            </p>
          </div>

          {/* Core Utilities Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Fee Control */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Control</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Holding $DEEP reduces your platform fees. The more you hold, the bigger the discount — rewarding active participants and loyal community members.
              </p>
            </div>

            {/* Future Governance */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Future Governance</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                $DEEP holders will shape the direction of Deep Protocol. From deciding on new integrations and pool prioritization to influencing overall product strategy, governance ensures the protocol evolves with community consensus.
              </p>
            </div>
          </div>

          {/* Fee Tier System */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-3xl p-8 border border-purple-200 dark:border-purple-800">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ⚡ Fee Tier System
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                This system creates a direct link between token utility and user benefits
              </p>
            </div>

            {/* Fee Tier Table */}
            <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-500 to-blue-500">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold">$DEEP Holdings</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Platform Fee</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Discount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">0% (no $DEEP)</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">0.01 SOL per deposit/withdrawal</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">–</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">0.2–0.5% of supply</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">0.009 SOL per deposit/withdrawal</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          10%
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">0.5–1% of supply</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">0.008 SOL per deposit/withdrawal</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          20%
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">1%+ of supply</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">0.007 SOL per deposit/withdrawal</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                          30%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The more invested you are in the ecosystem, the more advantages you unlock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-20 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Roadmap
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Building the future of liquidity provisioning, one milestone at a time.
            </p>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Vertical Line - Desktop/Tablet */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-pink-500 transform -translate-x-1/2" />

            {/* Roadmap Items */}
            <div className="space-y-16">
              {/* Item 1: Mobile App - Left Side */}
              <div className="relative group">
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <div className="md:text-right mb-8 md:mb-0">
                    <div className="inline-block md:block">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                        <div className="flex md:flex-row-reverse items-start gap-4 md:text-right">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                              Mobile App & Dashboard
                            </h3>
                            <div className="space-y-2 text-left md:text-right">
                              <p className="text-gray-700 dark:text-gray-300 flex md:flex-row-reverse items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Liquidity management in your pocket</span>
                              </p>
                              <p className="text-gray-700 dark:text-gray-300 flex md:flex-row-reverse items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Deposit, withdraw, and track yields seamlessly</span>
                              </p>
                              <p className="text-gray-700 dark:text-gray-300 flex md:flex-row-reverse items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Push notifications for top-performing pools</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Center Circle */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full items-center justify-center shadow-2xl border-4 border-gray-50 dark:border-gray-900 group-hover:scale-125 transition-transform z-10">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  
                  <div className="md:col-start-2" />
                </div>
              </div>

              {/* Item 2: AI Advisory - Right Side */}
              <div className="relative group">
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <div className="md:col-start-2 mb-8 md:mb-0">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            AI Yield Advisory Dashboard
                          </h3>
                          <div className="space-y-2">
                            <p className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              <span>Personalized insights: "Deposit X SOL into Pool Y, hold Z $DEEP, expect N% yield"</span>
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              <span>Portfolio optimization suggestions powered by AI</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Center Circle */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full items-center justify-center shadow-2xl border-4 border-gray-50 dark:border-gray-900 group-hover:scale-125 transition-transform z-10">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                </div>
              </div>

              {/* Item 3: Cross-Chain - Left Side */}
              <div className="relative group">
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <div className="md:text-right mb-8 md:mb-0">
                    <div className="inline-block md:block">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                        <div className="flex md:flex-row-reverse items-start gap-4 md:text-right">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                              Cross-Chain Expansion
                            </h3>
                            <div className="space-y-2 text-left md:text-right">
                              <p className="text-gray-700 dark:text-gray-300 flex md:flex-row-reverse items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Extend Deep Protocol to support liquidity pools beyond Solana</span>
                              </p>
                              <p className="text-gray-700 dark:text-gray-300 flex md:flex-row-reverse items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Multi-chain opportunities for diversified yield strategies</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Center Circle */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full items-center justify-center shadow-2xl border-4 border-gray-50 dark:border-gray-900 group-hover:scale-125 transition-transform z-10">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  
                  <div className="md:col-start-2" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-12 shadow-2xl">
              {/* Animated glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 to-blue-400/50 blur-2xl animate-pulse" />
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Want to be part of the journey?
                </h3>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join our community and get early access to new features as we build the most advanced liquidity aggregator.
                </p>
                <Link
                  href="/signup"
                  className="inline-block bg-white text-purple-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl text-lg"
                >
                  Join the Waitlist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
