"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddPoolPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    poolName: "",
    contractAddress: "",
    website: "",
    creator: "",
    category: "defi" as "memecoin" | "defi" | "gamefi" | "nft",
  });
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReview = () => {
    setIsReviewing(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsReviewing(false);
      // Reset form
      setFormData({
        poolName: "",
        contractAddress: "",
        website: "",
        creator: "",
        category: "defi",
      });
      alert("Pool submitted for review! It will be added after approval.");
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign In Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to sign in to add a new pool to Deep Protocol.
            </p>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Add New Pool
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Add your liquidity pool to Deep Protocol
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          {!isReviewing ? (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="poolName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Liquidity Pool Name *
                </label>
                <input
                  type="text"
                  id="poolName"
                  name="poolName"
                  required
                  value={formData.poolName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., BONK/SOL"
                />
              </div>

              <div>
                <label
                  htmlFor="contractAddress"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Contract Address *
                </label>
                <input
                  type="text"
                  id="contractAddress"
                  name="contractAddress"
                  required
                  value={formData.contractAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder="Enter the smart contract address"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Website (Optional)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="creator"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Pool Creator *
                </label>
                <input
                  type="text"
                  id="creator"
                  name="creator"
                  required
                  value={formData.creator}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Team or individual name"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="defi">DeFi</option>
                  <option value="memecoin">Memecoin</option>
                  <option value="gamefi">GameFi</option>
                  <option value="nft">NFT</option>
                </select>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-5 h-5 text-yellow-600 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Important Notice
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                      All pools are subject to review and approval. Ensure your
                      contract address is valid and audited.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReview}
                disabled={
                  !formData.poolName ||
                  !formData.contractAddress ||
                  !formData.creator
                }
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Pool
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Review Pool Details
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Pool Name:
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formData.poolName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Contract Address:
                  </span>
                  <span className="text-gray-900 dark:text-white font-mono text-sm break-all">
                    {formData.contractAddress}
                  </span>
                </div>
                {formData.website && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Website:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formData.website}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Creator:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formData.creator}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Category:
                  </span>
                  <span className="text-gray-900 dark:text-white capitalize">
                    {formData.category}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Your pool will be reviewed by our team and added to the
                  platform within 24-48 hours if approved.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setIsReviewing(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Pool"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
