"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    walletAddress: "",
    referralCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    walletAddress?: string;
  }>({});

  // Autofill referral code from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRef = localStorage.getItem("deep-protocol-ref");
      if (storedRef) {
        setFormData((prev) => ({ ...prev, referralCode: storedRef }));
      }
    }
  }, []);

  const validateEmail = (email: string) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateWalletAddress = (address: string) => {
    // Solana addresses are usually 32-44 base58 chars, no 0/O/I/l
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error for the field on change
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
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);
    // Simulate API call delay
    setTimeout(() => {
      signup(formData);
      setIsSubmitting(false);
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign In to Deep Protocol
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to add a pool or provide liquidity.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.email
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="walletAddress"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Wallet Address
              </label>
              <input
                type="text"
                id="walletAddress"
                name="walletAddress"
                required
                value={formData.walletAddress}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm ${
                  errors.walletAddress
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter Solana wallet address"
              />
              {errors.walletAddress && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.walletAddress}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="referralCode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Referral Code (optional)
              </label>
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter referral code (if any)"
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
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
