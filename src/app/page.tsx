"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { mockPools } from "@/data/mockPools";

export default function Home() {
  const [stats] = useState({
    totalLiquidity: mockPools.reduce(
      (sum, pool) => sum + pool.totalLiquidity,
      0
    ),
    totalPools: mockPools.length,
    averageDPY:
      mockPools.reduce((sum, pool) => sum + pool.dpy, 0) / mockPools.length,
    totalUsers: 174503,
  });

  const imageRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCards, setShowCards] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      {/* Combined DeFi Problem & Solution Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        {/* Subtle background animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-500/8 to-purple-500/8 rounded-full blur-2xl animate-bounce"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* A Big DeFi Problem Solved - Header Section */}
          <div className="flex flex-col lg:flex-row items-center justify-center mb-20">
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

          {/* Problem & Solution Cards - Fixed alignment and reduced width */}
          <div ref={cardsRef} className="space-y-12 max-w-3xl mx-auto">
            {/* Problem Card - Slides in from left */}
            <div
              className={`transition-all duration-1000 ease-out ${
                showCards
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0"
              }`}
            >
              <div className="relative">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-sm"></div>
                <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

                  <div className="space-y-4">
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
                </div>
              </div>
            </div>

            {/* Solution Card - Slides in from right */}
            <div
              className={`transition-all duration-1000 ease-out delay-300 ${
                showCards
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            >
              <div className="relative">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-sm"></div>
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

                  <div className="space-y-4">
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
    </div>
  );
}
