"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockPools } from "@/data/mockPools";
import { fetchSolPriceUSD } from "@/lib/utils";
import { Pool } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function PoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [pool, setPool] = useState<Pool | null>(null);
  const [amount, setAmount] = useState("1.5");
  const [isDepositing, setIsDepositing] = useState(false);
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [depositWallet] = useState(
    "3ivAZjdWhiW51kGXJX1kVosekryEayiv25kksFevUruk"
  );
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [solPrice, setSolPrice] = useState<number | null>(null);

  useEffect(() => {
    fetchSolPriceUSD().then(setSolPrice);
  }, []);

  useEffect(() => {
    const foundPool = mockPools.find((p) => p.id === params.id);
    if (foundPool) {
      setPool(foundPool);
    } else {
      router.push("/pools");
    }
  }, [params.id, router]);

  const handleDeposit = async () => {
    if (!isAuthenticated) {
      router.push("/signup");
      return;
    }

    const depositAmount = parseFloat(amount);
    if (depositAmount < pool!.minDeposit || depositAmount > pool!.maxDeposit) {
      alert(
        `Deposit amount must be between ${pool!.minDeposit} and ${
          pool!.maxDeposit
        } SOL`
      );
      return;
    }

    setIsDepositing(true);
    setShowWalletAddress(true);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositWallet);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 1200);
  };

  // const confirmDeposit = () => {
  //   // Simulate deposit confirmation
  //   setTimeout(() => {
  //     setIsDepositing(false);
  //     setShowWalletAddress(false);
  //     setAmount('');
  //     alert(`Successfully deposited ${amount} SOL to ${pool?.name} pool!`);
  //   }, 2000);
  // };

  if (!pool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading pool details...
          </p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "defi":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
      case "memecoin":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400";
      case "gamefi":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400";
      case "nft":
        return "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/pools"
          className="inline-flex items-center text-purple-500 hover:text-purple-600 mb-6"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Pools
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pool Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {pool.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Created by {pool.creator}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                    pool.category
                  )}`}
                >
                  {pool.category.toUpperCase()}
                </span>
              </div>

              {pool.website && (
                <a
                  href={pool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-500 hover:text-purple-600 text-sm"
                >
                  Visit Website
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>

            {/* Deposit Panel (moved here for mobile order) */}
            <div className="order-1 lg:order-none lg:hidden">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Add Liquidity
                </h2>
                {/* ...existing deposit panel content... */}
                {!showWalletAddress ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Amount (SOL)
                      </label>
                      <input
                        type="number"
                        min={pool.minDeposit}
                        max={pool.maxDeposit}
                        step="0.1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={`${pool.minDeposit} - ${pool.maxDeposit}`}
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Min: {pool.minDeposit} SOL, Max: {pool.maxDeposit} SOL
                      </p>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                        Fee Earnings Calculator
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        With {pool.dpy}% DPY, a {amount || 0} SOL liquidity
                        would earn approximately{" "}
                        <strong>
                          {((pool.dpy * Number(amount)) / 100).toFixed(2)} SOL
                          {solPrice && amount && !isNaN(Number(amount)) && (
                            <>
                              {" "}
                              ($
                              {Number(
                                ((pool.dpy * Number(amount)) / 100) * solPrice
                              ).toFixed(2)}
                              )
                            </>
                          )}
                        </strong>{" "}
                        in fees daily.
                        <br />
                        <br />
                        Remember, earnings may vary based on current SOL price.
                        {solPrice && amount && !isNaN(Number(amount)) && (
                          <span className="block text-blue-600 dark:text-blue-300 mt-1">
                            1 SOL = ${solPrice} USD
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={handleDeposit}
                      disabled={
                        !amount ||
                        parseFloat(amount) < pool.minDeposit ||
                        parseFloat(amount) > pool.maxDeposit
                      }
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAuthenticated ? "Add Liquidity" : "Sign In"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Send {amount} SOL to:
                      </h3>
                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <code className="text-sm font-mono break-all text-gray-900 dark:text-white">
                          {depositWallet}
                        </code>
                        <button
                          onClick={handleCopyAddress}
                          className="block mx-auto mt-2 text-purple-500 hover:text-purple-600 text-sm"
                        >
                          {copiedWallet ? "Copied..." : "Copy Address"}
                        </button>
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <strong>Important:</strong>
                        <br />
                        Only send SOL to this address. Transaction will be
                        confirmed in a few seconds.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowWalletAddress(false)}
                        className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        // onClick={confirmDeposit}
                        disabled={isDepositing}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {isDepositing ? "Confirming..." : "I Sent SOL"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pool Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 order-2 lg:order-none">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Pool Statistics
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                    {pool.dpy}%
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Daily Percentage Yield
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ${pool.totalLiquidity.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Total Liquidity
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {pool.fees}%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Trading Fees
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {pool.minDeposit}-{pool.maxDeposit}
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">
                    SOL Range
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 order-3 lg:order-none">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contract Information
              </h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Contract Address:
                  </span>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                      {pool.contractAddress.slice(0, 8)}...
                      {pool.contractAddress.slice(-8)}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pool.contractAddress);
                        setCopiedContract(true);
                        setTimeout(() => setCopiedContract(false), 1200);
                      }}
                      className="p-1 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Copy Contract Address"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      {copiedContract && (
                        <span className="ml-1 text-gray-600 dark:text-gray-400">
                          Copied...
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deposit Panel Sidebar for large screens only */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Add Liquidity
              </h2>
              {/* ...existing deposit panel content... */}
              {!showWalletAddress ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount (SOL)
                    </label>
                    <input
                      type="number"
                      min={pool.minDeposit}
                      max={pool.maxDeposit}
                      step="0.1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={`${pool.minDeposit} - ${pool.maxDeposit}`}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Min: {pool.minDeposit} SOL, Max: {pool.maxDeposit} SOL
                    </p>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                      Fee Earnings Calculator
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      With {pool.dpy}% DPY, a {amount || 0} SOL liquidity would
                      earn approximately{" "}
                      <strong>
                        {((pool.dpy * Number(amount)) / 100).toFixed(2)} SOL
                        {solPrice && amount && !isNaN(Number(amount)) && (
                          <>
                            {" "}
                            ($
                            {Number(
                              ((pool.dpy * Number(amount)) / 100) * solPrice
                            ).toFixed(2)}
                            )
                          </>
                        )}
                      </strong>{" "}
                      in fees daily.
                      <br />
                      <br />
                      Remember, earnings may vary based on current SOL price.
                      {solPrice && amount && !isNaN(Number(amount)) && (
                        <span className="block text-blue-600 dark:text-blue-300 mt-1">
                          1 SOL = ${solPrice} USD
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={handleDeposit}
                    disabled={
                      !amount ||
                      parseFloat(amount) < pool.minDeposit ||
                      parseFloat(amount) > pool.maxDeposit
                    }
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAuthenticated ? "Add Liquidity" : "Sign In"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Send {amount} SOL to:
                    </h3>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <code className="text-sm font-mono break-all text-gray-900 dark:text-white">
                        {depositWallet}
                      </code>
                      <button
                        onClick={handleCopyAddress}
                        className="block mx-auto mt-2 text-purple-500 hover:text-purple-600 text-sm"
                      >
                        {copiedWallet ? "Copied..." : "Copy Address"}
                      </button>
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <strong>Important:</strong>
                      <br />
                      Only send SOL to this address. Transaction will be
                      confirmed in a few seconds.
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowWalletAddress(false)}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      // onClick={confirmDeposit}
                      disabled={isDepositing}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {isDepositing ? "Confirming..." : "I Sent SOL"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
