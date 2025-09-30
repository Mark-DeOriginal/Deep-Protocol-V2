"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Wallet, Mail, User, Gift, CheckCircle, Rocket, TrendingUp, Sparkles } from "lucide-react";

// Phantom wallet detection
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString: () => string };
    };
  }
}

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth();
  const router = useRouter();
  const [signupMethod, setSignupMethod] = useState<'wallet' | 'manual' | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    walletAddress: "",
    referralCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    walletAddress?: string;
  }>({});
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Check if Phantom is installed
    if (typeof window !== "undefined") {
      setHasPhantom(window.solana?.isPhantom || false);
      
      // Autofill referral code from localStorage if present
      const storedRef = localStorage.getItem("deep-protocol-ref");
      if (storedRef) {
        setFormData((prev) => ({ ...prev, referralCode: storedRef }));
      }
    }
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateWalletAddress = (address: string) => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  };

  const handlePhantomConnect = async () => {
    if (!window.solana?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      const response = await window.solana.connect();
      const walletAddress = response.publicKey.toString();
      
      setFormData(prev => ({
        ...prev,
        walletAddress: walletAddress
      }));
      
      setSignupMethod('wallet');
      setIsConnecting(false);
    } catch (err) {
      console.error('Error connecting to Phantom:', err);
      setIsConnecting(false);
      alert('Failed to connect to Phantom wallet. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; walletAddress?: string } = {};
    
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!validateWalletAddress(formData.walletAddress)) {
      newErrors.walletAddress = "Please enter a valid Solana wallet address.";
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      signup(formData);
      setIsSubmitting(false);
      router.push("/pools");
    }, 1000);
  };

  // Method selection screen
  if (!signupMethod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50 dark:border-gray-700">
                <img src="/nobgiconlogo.png" alt="Deep Protocol" className="w-16 h-16 object-contain" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Join Deep Protocol
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get early access to the most advanced liquidity aggregator on Solana
            </p>
          </div>

          {/* Signup Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Phantom Wallet Option */}
            <button
              onClick={handlePhantomConnect}
              disabled={isConnecting}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {hasPhantom ? 'Connect Phantom' : 'Get Phantom'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {hasPhantom 
                      ? 'Quick signup with your Phantom wallet' 
                      : 'Install Phantom to get started'}
                  </p>
                </div>
                {!hasPhantom && (
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    Opens Phantom.app
                  </span>
                )}
                {isConnecting && (
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              
              {/* Recommended Badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Recommended</span>
                </span>
              </div>
            </button>

            {/* Manual Form Option */}
            <button
              onClick={() => setSignupMethod('manual')}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Email Signup
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Sign up with email and wallet address
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Benefits */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Why Sign Up?
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Early access to deposits
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track your positions
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Exclusive rewards & airdrops
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Wallet signup flow
  if (signupMethod === 'wallet' && formData.walletAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-md mx-auto w-full">
          <button
            onClick={() => {
              setSignupMethod(null);
              setFormData(prev => ({ ...prev, walletAddress: "" }));
            }}
            className="mb-6 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back</span>
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Just a few more details to get started
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            {/* Wallet Connected */}
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-900 dark:text-green-300">
                  Wallet Connected
                </span>
              </div>
              <code className="text-xs text-green-700 dark:text-green-400 break-all">
                {formData.walletAddress}
              </code>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.email
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Gift className="w-4 h-4 inline mr-2" />
                  Referral Code (optional)
                </label>
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white uppercase"
                  placeholder="Enter referral code"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.fullName || !formData.email}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Complete Signup"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Manual signup form
  if (signupMethod === 'manual') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-md mx-auto w-full">
          <button
            onClick={() => setSignupMethod(null)}
            className="mb-6 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back</span>
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign up for early access to Deep Protocol
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.email
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Wallet className="w-4 h-4 inline mr-2" />
                  Solana Wallet Address
                </label>
                <input
                  type="text"
                  name="walletAddress"
                  required
                  value={formData.walletAddress}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm ${
                    errors.walletAddress
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Your Solana wallet address"
                />
                {errors.walletAddress && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.walletAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Gift className="w-4 h-4 inline mr-2" />
                  Referral Code (optional)
                </label>
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white uppercase"
                  placeholder="Optional referral code"
                />
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.fullName ||
                  !formData.email ||
                  !formData.walletAddress
                }
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
}