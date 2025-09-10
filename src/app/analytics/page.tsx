"use client";

import { useState } from "react";
import { mockPools } from "@/data/mockPools";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  // Calculate analytics data
  const totalLiquidity = mockPools.reduce(
    (sum, pool) => sum + pool.totalLiquidity,
    0
  );
  const averageDPY =
    mockPools.reduce((sum, pool) => sum + pool.dpy, 0) / mockPools.length;
  const totalPools = mockPools.length;
  const totalUsers = 174503;
  const totalVolume = 45678912;
  const totalFees = 32341567;

  // Mock data for charts
  const liquidityData = [
    { period: "7 days ago", value: totalLiquidity - 500000 },
    { period: "6 days ago", value: totalLiquidity - 400000 },
    { period: "5 days ago", value: totalLiquidity - 300000 },
    { period: "4 days ago", value: totalLiquidity - 200000 },
    { period: "3 days ago", value: totalLiquidity - 100000 },
    { period: "2 days ago", value: totalLiquidity - 50000 },
    { period: "1 day ago", value: totalLiquidity - 10000 },
    { period: "Today", value: totalLiquidity },
  ];

  const topPerformingPools = [...mockPools]
    .sort((a, b) => b.dpy - a.dpy)
    .slice(0, 5);

  const categoryDistribution = mockPools.reduce((acc, pool) => {
    acc[pool.category] = (acc[pool.category] || 0) + pool.totalLiquidity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real-time insights into Deep Protocol's performance.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? "bg-purple-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Liquidity
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalLiquidity.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +12.5% from last week
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Volume
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalVolume.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +8.2% from last week
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Pools
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalPools}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  +2 this week
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +15.7% from last week
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <svg
                  className="w-6 h-6 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Liquidity Growth Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Liquidity Growth
            </h3>
            <div className="space-y-3">
              {liquidityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.period}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(item.value / totalLiquidity) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Liquidity by Category
            </h3>
            <div className="space-y-4">
              {Object.entries(categoryDistribution).map(([category, value]) => {
                const percentage = (value / totalLiquidity) * 100;
                const colors = {
                  defi: "bg-blue-500",
                  memecoin: "bg-orange-500",
                  gamefi: "bg-purple-500",
                  nft: "bg-pink-500",
                };
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {category}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          colors[category as keyof typeof colors]
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Performing Pools */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Top Performing Pools
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Pool
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    DPY
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Liquidity
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    24h Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {topPerformingPools.map((pool, index) => (
                  <tr
                    key={pool.id}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {pool.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          by {pool.creator}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {pool.dpy}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      ${pool.totalLiquidity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium capitalize">
                        {pool.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 dark:text-green-400">
                        +{(Math.random() * 5 + 1).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Platform Health
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Average DPY
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {averageDPY.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Fees Collected
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  ${totalFees.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Active Liquidity Providers
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {Math.floor(totalUsers).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Average Pool Size
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  ${Math.floor(totalLiquidity / totalPools).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    New pool added: ORCA/SOL
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Platform milestone: {mockPools.length} pools live
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Large deposit: 500 SOL to JUP/SOL
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    4 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    DPY increased for BONK/SOL pool
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2 days ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
