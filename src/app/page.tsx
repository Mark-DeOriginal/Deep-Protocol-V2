"use client";

import Link from "next/link";
import { useState } from "react";
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

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Your Gateway to
              <span className="block bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Simple Liquidity Provisioning
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              We've simplified liquidity provisioning on Solana. Submit a pool
              for review or simply provide liquidity and earn fees.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/add-pool"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-medium text-lg hover:opacity-90 transition-opacity active:scale-95"
              >
                Add Pool
              </Link>
              <Link
                href="/pools"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-medium text-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95"
              >
                Provide Liquidity
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalLiquidity.toLocaleString()}
                </div>
                <div className="text-sm md:text-xl text-gray-600 dark:text-gray-400">
                  Total Liquidity
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPools}
                </div>
                <div className="text-sm md:text-xl text-gray-600 dark:text-gray-400">
                  Active Pools
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {stats.averageDPY.toFixed(1)}%
                </div>
                <div className="text-sm md:text-xl text-gray-600 dark:text-gray-400">
                  Average DPY
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-sm md:text-xl text-gray-600 dark:text-gray-400">
                  Liquidity Providers
                </div>
              </div>
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
                High Yields
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Earn competitive DPY rates starting from 20% to 23.5% on your
                liquidity
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

      {/* Top Pools Preview */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Top Performing Pools
            </h2>
            <Link
              href="/pools"
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPools.slice(0, 3).map((pool) => (
              <div
                key={pool.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pool.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {pool.creator}
                    </p>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                    {pool.dpy}% DPY
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Liquidity
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      ${pool.totalLiquidity.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Fees
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {pool.fees}%
                    </span>
                  </div>
                </div>

                <Link
                  href={`/pools/${pool.id}`}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg text-center font-medium hover:opacity-90 transition-opacity block"
                >
                  Add Liquidity
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
