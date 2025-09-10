"use client";

import { useState } from "react";
import { mockPools } from "@/data/mockPools";
import { Pool } from "@/types";
import Link from "next/link";

export default function PoolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"dpy" | "liquidity" | "name">("dpy");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["all", "defi", "nft", "gamefi", "memecoin"];

  const filteredPools = mockPools
    .filter((pool) => {
      const matchesCategory =
        selectedCategory === "all" || pool.category === selectedCategory;
      const matchesSearch =
        pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pool.creator.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dpy":
          return b.dpy - a.dpy;
        case "liquidity":
          return b.totalLiquidity - a.totalLiquidity;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Liquidity Pools
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our curated selection of high-yield liquidity pools.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4  md:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search pools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "dpy" | "liquidity" | "name")
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="dpy">Sort by DPY</option>
              <option value="liquidity">Sort by Liquidity</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Pool Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPools.map((pool) => (
            <div
              key={pool.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              {/* Pool Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {pool.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {pool.creator}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {pool.dpy}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    DPY
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    pool.category
                  )}`}
                >
                  {pool.category.toUpperCase()}
                </span>
              </div>

              {/* Pool Stats */}
              <div className="space-y-3 mb-6">
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
                    Trading Fees
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {pool.fees}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Min/Max Liquidity
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {pool.minDeposit} - {pool.maxDeposit} SOL
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href={`/pools/${pool.id}`}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg text-center font-medium hover:opacity-90 transition-opacity block"
                >
                  Add Liquidity
                </Link>
                {pool.website && (
                  <a
                    href={pool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-center text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors block"
                  >
                    Visit Website ↗
                  </a>
                )}
              </div>

              {/* Contract Address */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Contract: {pool.contractAddress.slice(0, 6)}...
                  {pool.contractAddress.slice(-6)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredPools.length === 0 && (
          <div className="text-center py-12">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.212-2.18C5.116 12.68 4.5 12.356 4.5 12c0-.356.616-.68 1.288-.82C7.5 10.184 9.66 9 12 9s4.5 1.184 6.212 2.18c.672.14 1.288.464 1.288.82 0 .356-.616.68-1.288.82A7.962 7.962 0 0112 15z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No pools found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredPools.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Available Pools
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                $
                {filteredPools
                  .reduce((sum, pool) => sum + pool.totalLiquidity, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Liquidity
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredPools.length > 0
                  ? (
                      filteredPools.reduce((sum, pool) => sum + pool.dpy, 0) /
                      filteredPools.length
                    ).toFixed(1)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average DPY
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
