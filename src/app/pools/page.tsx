"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle,
  Flame,
  ChevronDown,
  X
} from "lucide-react";
import { 
  fetchRaydiumPools, 
  formatPoolName, 
  getPoolAPR, 
  getPoolTVL, 
  getPool24hVolume,
  getPoolFeeRate,
  getPoolCategory,
  calculateRiskScore,
  getRiskLevel,
  calculateAPRChange,
  getVolumeEfficiency,
  type RaydiumPool,
  type PoolSortField,
  type SortType 
} from "@/lib/raydiumApi";
import PoolComparisonModal from "@/components/PoolComparisonModal";

export default function PoolsPage() {
  const [pools, setPools] = useState<RaydiumPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<PoolSortField>("liquidity");
  const [sortType, setSortType] = useState<SortType>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // Client-side pagination
  const POOLS_PER_PAGE = 50;
  const [displayPage, setDisplayPage] = useState(1);
  
  // Advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minTVL, setMinTVL] = useState(0);
  const [maxTVL, setMaxTVL] = useState(100000000);
  const [minAPR, setMinAPR] = useState(0);
  const [maxAPR, setMaxAPR] = useState(1000);
  const [riskFilter, setRiskFilter] = useState<string>("all");
  
  // Pool comparison
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const categories = ["all", "defi", "memecoin", "stable", "gamefi"];

  // Fetch pools from Raydium API
  useEffect(() => {
    const loadPools = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchRaydiumPools({
          poolType: 'all',
          poolSortField: sortBy,
          sortType: sortType,
          pageSize: 200, // Fetch more to have enough after filtering
          page: currentPage
        });

        if (response.success) {
          // Filter out pools with APR less than 4%
          const filteredPools = response.data.data.filter(pool => {
            const apr = getPoolAPR(pool);
            return apr >= 4;
          });
          
          setPools(filteredPools);
          setHasNextPage(response.data.hasNextPage);
          setTotalCount(filteredPools.length);
        } else {
          setError('Failed to fetch pools');
        }
      } catch (err) {
        setError('Error loading pools. Please try again later.');
        console.error('Error fetching pools:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPools();
  }, [sortBy, sortType, currentPage]);

  // Filter pools based on all criteria
  const filteredPools = pools.filter((pool) => {
    const poolCategory = getPoolCategory(pool);
    const matchesCategory = selectedCategory === "all" || poolCategory === selectedCategory;
    
    const poolName = formatPoolName(pool);
    const matchesSearch = poolName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Advanced filters
    const tvl = getPoolTVL(pool);
    const apr = getPoolAPR(pool);
    const riskScore = calculateRiskScore(pool);
    const riskLevel = getRiskLevel(riskScore);
    
    const matchesTVL = tvl >= minTVL && tvl <= maxTVL;
    const matchesAPR = apr >= minAPR && apr <= maxAPR;
    const matchesRisk = riskFilter === "all" || riskLevel.label.toLowerCase() === riskFilter;
    
    return matchesCategory && matchesSearch && matchesTVL && matchesAPR && matchesRisk;
  });

  // Paginate filtered pools (client-side)
  const totalPages = Math.ceil(filteredPools.length / POOLS_PER_PAGE);
  const startIndex = (displayPage - 1) * POOLS_PER_PAGE;
  const endIndex = startIndex + POOLS_PER_PAGE;
  const paginatedPools = filteredPools.slice(startIndex, endIndex);

  // Calculate aggregated stats
  const stats = {
    totalPools: filteredPools.length,
    totalTVL: filteredPools.reduce((sum, pool) => sum + getPoolTVL(pool), 0),
    totalVolume24h: filteredPools.reduce((sum, pool) => sum + getPool24hVolume(pool), 0),
    avgAPR: filteredPools.length > 0 
      ? filteredPools.reduce((sum, pool) => sum + getPoolAPR(pool), 0) / filteredPools.length 
      : 0,
    highestAPR: filteredPools.length > 0
      ? Math.max(...filteredPools.map(pool => getPoolAPR(pool)))
      : 0,
    highestAPRPool: filteredPools.length > 0
      ? filteredPools.reduce((max, pool) => getPoolAPR(pool) > getPoolAPR(max) ? pool : max, filteredPools[0])
      : null
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "defi":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
      case "memecoin":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400";
      case "stable":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "gamefi":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400";
      case "nft":
        return "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400";
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as PoolSortField);
    setCurrentPage(1);
  };

  const togglePoolSelection = (poolId: string) => {
    if (selectedPools.includes(poolId)) {
      setSelectedPools(selectedPools.filter(id => id !== poolId));
    } else if (selectedPools.length < 3) {
      setSelectedPools([...selectedPools, poolId]);
    }
  };

  const resetFilters = () => {
    setMinTVL(0);
    setMaxTVL(100000000);
    setMinAPR(0);
    setMaxAPR(1000);
    setRiskFilter("all");
    setSelectedCategory("all");
    setSearchTerm("");
    setDisplayPage(1); // Reset to first page
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setDisplayPage(1);
  }, [selectedCategory, searchTerm, minTVL, minAPR, riskFilter]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Raydium Liquidity Pools
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-time data from Raydium's liquidity pools on Solana.
          </p>
        </div>

        {/* Advanced Metrics Dashboard */}
        {!loading && !error && (
          <div className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              LIVE MARKET OVERVIEW
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPools}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active Pools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  ${(stats.totalTVL / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total TVL</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                  ${(stats.totalVolume24h / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">24h Volume</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.avgAPR.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Avg APR</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400 flex items-center justify-center space-x-1">
                  <span>{stats.highestAPRPool ? formatPoolName(stats.highestAPRPool) : 'N/A'}</span>
                  {stats.highestAPRPool && <Flame className="w-4 h-4" />}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Top APR: {stats.highestAPR.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Bar */}
        {comparisonMode && selectedPools.length > 0 && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Selected {selectedPools.length} pool{selectedPools.length !== 1 ? 's' : ''}:
                </span>
                {selectedPools.map(poolId => {
                  const pool = pools.find(p => p.id === poolId);
                  return pool ? (
                    <span key={poolId} className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs font-medium text-blue-900 dark:text-blue-200 flex items-center space-x-1">
                      <span>{formatPoolName(pool)}</span>
                      <button
                        onClick={() => togglePoolSelection(poolId)}
                        className="hover:text-red-600 dark:hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowComparisonModal(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  View Comparison
                </button>
                <button
                  onClick={() => {
                    setSelectedPools([]);
                    setComparisonMode(false);
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 px-3 py-2"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            {/* Main Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
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
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="liquidity">Sort by Liquidity</option>
                <option value="volume24h">Sort by 24h Volume</option>
                <option value="apr24h">Sort by APR</option>
                <option value="fee24h">Sort by 24h Fees</option>
                <option value="default">Default</option>
              </select>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                <span>Advanced Filters</span>
              </button>
              <button
                onClick={() => setComparisonMode(!comparisonMode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  comparisonMode
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {comparisonMode ? '✓ Comparison Mode' : 'Compare Pools'}
              </button>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* TVL Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Min TVL: ${minTVL.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={minTVL}
                      onChange={(e) => setMinTVL(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* APR Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Min APR: {minAPR}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="5"
                      value={minAPR}
                      onChange={(e) => setMinAPR(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Risk Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Risk Level
                    </label>
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Risk Levels</option>
                      <option value="low">Low Risk Only</option>
                      <option value="medium">Medium Risk Only</option>
                      <option value="high">High Risk Only</option>
                    </select>
                  </div>

                  {/* Max APR */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max APR: {maxAPR === 1000 ? 'No limit' : `${maxAPR}%`}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={maxAPR}
                      onChange={(e) => setMaxAPR(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                </div>

                {/* Reset Filters */}
                <div className="flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading pools...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md mx-auto">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">
                Error Loading Pools
              </h3>
              <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Pool Grid */}
        {!loading && !error && (
          <>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedPools.map((pool) => {
                const poolName = formatPoolName(pool);
                const apr = getPoolAPR(pool);
                const tvl = getPoolTVL(pool);
                const volume24h = getPool24hVolume(pool);
                const feeRate = getPoolFeeRate(pool);
                const category = getPoolCategory(pool);
                const riskScore = calculateRiskScore(pool);
                const riskLevel = getRiskLevel(riskScore);
                const aprChange = calculateAPRChange(pool);
                const isSelected = selectedPools.includes(pool.id);

                return (
                  <div
                    key={pool.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-6 border ${
                      isSelected 
                        ? 'border-blue-500 ring-2 ring-blue-500' 
                        : 'border-gray-200 dark:border-gray-700'
                    } hover:shadow-lg transition-all relative`}
                  >
                    {/* Comparison Checkbox */}
                    {comparisonMode && (
                      <div className="absolute top-4 right-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePoolSelection(pool.id)}
                          disabled={!isSelected && selectedPools.length >= 3}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Pool Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        {/* Token Icons */}
                        <div className="flex -space-x-2">
                          {pool.mintA.logoURI && (
                            <img 
                              src={pool.mintA.logoURI} 
                              alt={pool.mintA.symbol}
                              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                          {pool.mintB.logoURI && (
                            <img 
                              src={pool.mintB.logoURI} 
                              alt={pool.mintB.symbol}
                              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {poolName}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {pool.pooltype.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-end">
                          <span>{apr.toFixed(2)}%</span>
                          {aprChange !== 0 && (
                            <span className={`ml-1 flex items-center text-xs ${aprChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {aprChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              <span className="ml-0.5">{Math.abs(aprChange).toFixed(1)}%</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          APR
                        </div>
                      </div>
                    </div>

                    {/* Badges Row */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                        {category.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                        riskLevel.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                        riskLevel.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      }`}>
                        {riskLevel.color === 'green' ? <CheckCircle className="w-3 h-3" /> : 
                         riskLevel.color === 'yellow' ? <AlertCircle className="w-3 h-3" /> : 
                         <AlertTriangle className="w-3 h-3" />}
                        <span>{riskLevel.label} Risk</span>
                      </span>
                    </div>

                    {/* Pool Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total Liquidity (TVL)
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          ${tvl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          24h Volume
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          ${volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Trading Fee
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {feeRate.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Volume/TVL Ratio
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {getVolumeEfficiency(pool).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link
                        href={`/pools/${pool.id}`}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg text-center font-medium hover:opacity-90 transition-opacity block"
                      >
                        View Details & Get Early Access
                      </Link>
                      <a
                        href="https://raydium.io/liquidity-pools/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-center text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors block"
                      >
                        View on Raydium ↗
                      </a>
                    </div>

                    {/* Pool ID */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Pool ID: {pool.id.slice(0, 6)}...{pool.id.slice(-6)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Results */}
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
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 underline"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredPools.length > POOLS_PER_PAGE && (
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  {/* Pagination Info */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1} - {Math.min(endIndex, filteredPools.length)} of {filteredPools.length} pools
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setDisplayPage(1)}
                      disabled={displayPage === 1}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      First
                    </button>
                    <button
                      onClick={() => setDisplayPage(prev => Math.max(1, prev - 1))}
                      disabled={displayPage === 1}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (displayPage <= 3) {
                          pageNum = i + 1;
                        } else if (displayPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = displayPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setDisplayPage(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              displayPage === pageNum
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setDisplayPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={displayPage === totalPages}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => setDisplayPage(totalPages)}
                      disabled={displayPage === totalPages}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      Last
                    </button>
                  </div>

                  {/* Jump to Page */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Go to:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={displayPage}
                      onChange={(e) => {
                        const page = Number(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          setDisplayPage(page);
                        }
                      }}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">of {totalPages}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Filtered Results Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredPools.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Displayed Pools
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${filteredPools
                      .reduce((sum, pool) => sum + getPoolTVL(pool), 0)
                      .toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Liquidity
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredPools.length > 0
                      ? (filteredPools.reduce((sum, pool) => sum + getPoolAPR(pool), 0) / filteredPools.length).toFixed(2)
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Average APR
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pool Comparison Modal */}
      <PoolComparisonModal 
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        pools={pools.filter(p => selectedPools.includes(p.id))}
      />
    </div>
  );
}