"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchSolPriceUSD } from "@/lib/utils";
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
  type RaydiumPool 
} from "@/lib/raydiumApi";
import Link from "next/link";
import { 
  ArrowLeft, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Activity,
  Percent,
  BarChart3,
  Clock,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  Shield
} from "lucide-react";
import ComingSoonModal from "@/components/ComingSoonModal";

export default function PoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pool, setPool] = useState<RaydiumPool | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("1.5");
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'tokens'>('overview');

  useEffect(() => {
    fetchSolPriceUSD().then(setSolPrice);
  }, []);

  useEffect(() => {
    const loadPool = async () => {
      setLoading(true);
      try {
        const response = await fetchRaydiumPools({
          poolType: 'all',
          poolSortField: 'default',
          sortType: 'desc',
          pageSize: 1000,
          page: 1
        });

        if (response.success) {
          const foundPool = response.data.data.find((p) => p.id === params.id);
          if (foundPool) {
            const apr = getPoolAPR(foundPool);
            if (apr >= 4) {
              setPool(foundPool);
            } else {
              router.push("/pools");
            }
          } else {
            router.push("/pools");
          }
        } else {
          router.push("/pools");
        }
      } catch (error) {
        console.error('Error loading pool:', error);
        router.push("/pools");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadPool();
    }
  }, [params.id, router]);

  if (loading) {
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

  if (!pool) {
    return null;
  }

  const poolName = formatPoolName(pool);
  const apr = getPoolAPR(pool);
  const tvl = getPoolTVL(pool);
  const volume24h = getPool24hVolume(pool);
  const volume7d = pool.week.volume || 0;
  const volume30d = pool.month.volume || 0;
  const feeRate = getPoolFeeRate(pool);
  const category = getPoolCategory(pool);
  const riskScore = calculateRiskScore(pool);
  const riskLevel = getRiskLevel(riskScore);
  const aprChange = calculateAPRChange(pool);
  const volumeEfficiency = getVolumeEfficiency(pool);
  
  // Additional metrics
  const fee24h = pool.day.volumeFee || 0;
  const fee7d = pool.week.volumeFee || 0;
  const fee30d = pool.month.volumeFee || 0;
  const apr7d = pool.week.apr || 0;
  const apr30d = pool.month.apr || 0;
  const feeApr = pool.day.feeApr || 0;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
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

  const getRiskIcon = () => {
    switch (riskLevel.color) {
      case 'green':
        return <CheckCircle className="w-5 h-5" />;
      case 'yellow':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/pools"
          className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Pools</span>
        </Link>

        {/* Pool Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Pool Info */}
            <div className="flex items-start space-x-4">
              {/* Token Icons */}
              <div className="flex -space-x-3">
                {pool.mintA.logoURI && (
                  <img 
                    src={pool.mintA.logoURI} 
                    alt={pool.mintA.symbol}
                    className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                {pool.mintB.logoURI && (
                  <img 
                    src={pool.mintB.logoURI} 
                    alt={pool.mintB.symbol}
                    className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
              </div>
              
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {poolName}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                    {category.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${
                    riskLevel.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    riskLevel.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                  }`}>
                    {getRiskIcon()}
                    <span>{riskLevel.label} Risk</span>
                  </span>
                  {pool.pooltype.map((type, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2">
              <a
                href="https://raydium.io/liquidity-pools/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span>View on Raydium</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setShowComingSoonModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Get Early Access
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* APR */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">APR</span>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {apr.toFixed(2)}%
            </div>
            {aprChange !== 0 && (
              <div className={`flex items-center space-x-1 text-sm ${aprChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {aprChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{aprChange > 0 ? '+' : ''}{aprChange.toFixed(1)}% 7d</span>
              </div>
            )}
          </div>

          {/* TVL */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">TVL</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ${(tvl / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Total Liquidity
            </div>
          </div>

          {/* 24h Volume */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">24h Volume</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              ${(volume24h / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Volume/TVL: {volumeEfficiency.toFixed(2)}
            </div>
          </div>

          {/* Fee APR */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2 mb-2">
              <Percent className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Fee APR</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {feeApr.toFixed(2)}%
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Trading Fee: {feeRate.toFixed(3)}%
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1 p-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'analytics'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('tokens')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'tokens'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Tokens
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Performance Metrics */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-purple-500" />
                        <span>Performance Metrics</span>
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">24h APR</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{apr.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">7d APR</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{apr7d.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">30d APR</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{apr30d.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Fee APR</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{feeApr.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Analysis */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-purple-500" />
                        <span>Risk Analysis</span>
                      </h3>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Overall Risk Score</span>
                          <span className={`text-2xl font-bold ${
                            riskLevel.color === 'green' ? 'text-green-600 dark:text-green-400' :
                            riskLevel.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {riskScore}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-4">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              riskLevel.color === 'green' ? 'bg-green-500' :
                              riskLevel.color === 'yellow' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${riskScore}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400 block mb-1">Liquidity</span>
                            <span className={`font-semibold ${tvl > 1000000 ? 'text-green-600' : 'text-yellow-600'}`}>
                              {tvl > 10000000 ? 'Excellent' : tvl > 1000000 ? 'Good' : 'Fair'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400 block mb-1">Volatility</span>
                            <span className={`font-semibold ${category === 'stable' ? 'text-green-600' : category === 'defi' ? 'text-yellow-600' : 'text-red-600'}`}>
                              {category === 'stable' ? 'Low' : category === 'defi' ? 'Medium' : 'High'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400 block mb-1">Token Type</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {pool.pooltype[0] || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pool Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Target className="w-5 h-5 text-purple-500" />
                        <span>Pool Details</span>
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Current Price</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">{pool.price.toFixed(6)}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Volume Efficiency</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">{volumeEfficiency.toFixed(2)}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Opened</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {new Date(pool.openTime).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Pool ID</span>
                          <code className="text-xs text-gray-900 dark:text-white font-mono">
                            {pool.id.slice(0, 8)}...{pool.id.slice(-8)}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    {/* Volume Breakdown */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Volume Analysis</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">24h Volume</span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            ${volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">7d Volume</span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            ${volume7d.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">30d Volume</span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            ${volume30d.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fee Analysis */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fee Revenue</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">24h Fees</span>
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">
                            ${fee24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">7d Fees</span>
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">
                            ${fee7d.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">30d Fees</span>
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">
                            ${fee30d.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Range (24h)</h3>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 block">Low</span>
                            <span className="text-xl font-bold text-red-600 dark:text-red-400">
                              {pool.day.priceMin.toFixed(6)}
                            </span>
                          </div>
                          <div className="text-center flex-1 mx-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400 block">Current</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                              {pool.price.toFixed(6)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-600 dark:text-gray-400 block">High</span>
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                              {pool.day.priceMax.toFixed(6)}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 via-gray-500 to-green-500 h-full rounded-full"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    {/* Time Period Comparison */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Comparison</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left py-3 text-gray-600 dark:text-gray-400 font-medium">Period</th>
                              <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-medium">APR</th>
                              <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-medium">Volume</th>
                              <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-medium">Fees</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                              <td className="py-3 font-medium text-gray-900 dark:text-white">24 Hours</td>
                              <td className="py-3 text-right text-green-600 dark:text-green-400 font-semibold">{apr.toFixed(2)}%</td>
                              <td className="py-3 text-right text-gray-900 dark:text-white">${(volume24h / 1000).toFixed(0)}K</td>
                              <td className="py-3 text-right text-gray-900 dark:text-white">${(fee24h / 1000).toFixed(0)}K</td>
                            </tr>
                            <tr>
                              <td className="py-3 font-medium text-gray-900 dark:text-white">7 Days</td>
                              <td className="py-3 text-right text-green-600 dark:text-green-400 font-semibold">{apr7d.toFixed(2)}%</td>
                              <td className="py-3 text-right text-gray-900 dark:text-white">${(volume7d / 1000).toFixed(0)}K</td>
                              <td className="py-3 text-right text-gray-900 dark:text-white">${(fee7d / 1000).toFixed(0)}K</td>
                            </tr>
                            <tr>
                              <td className="py-3 font-medium text-gray-900 dark:text-white">30 Days</td>
                              <td className="py-3 text-right text-green-600 dark:text-green-400 font-semibold">{apr30d.toFixed(2)}%</td>
                              <td className="py-3 text-right text-gray-900 dark:text-white">${(volume30d / 1000).toFixed(0)}K</td>
                              <td className="py-3 text-right text-gray-900 dark:text-white">${(fee30d / 1000).toFixed(0)}K</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Key Insights */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Insights</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                              Volume Efficiency: {volumeEfficiency.toFixed(2)}
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                              {volumeEfficiency > 2 ? 'Excellent liquidity turnover' : volumeEfficiency > 0.5 ? 'Good trading activity' : 'Lower trading activity'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-purple-900 dark:text-purple-300">
                              Opened: {new Date(pool.openTime).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                              Pool creation date from Raydium
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tokens Tab */}
                {activeTab === 'tokens' && (
                  <div className="space-y-6">
                    {/* Token A */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        {pool.mintA.logoURI && (
                          <img 
                            src={pool.mintA.logoURI} 
                            alt={pool.mintA.symbol}
                            className="w-12 h-12 rounded-full"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{pool.mintA.symbol}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Token A</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Amount in Pool</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {pool.mintAmountA.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Decimals</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">{pool.mintA.decimals}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Contract Address</span>
                          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded font-mono block text-gray-900 dark:text-white break-all">
                            {pool.mintA.address}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Token B */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        {pool.mintB.logoURI && (
                          <img 
                            src={pool.mintB.logoURI} 
                            alt={pool.mintB.symbol}
                            className="w-12 h-12 rounded-full"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{pool.mintB.symbol}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Token B</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Amount in Pool</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {pool.mintAmountB.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Decimals</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">{pool.mintB.decimals}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Contract Address</span>
                          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded font-mono block text-gray-900 dark:text-white break-all">
                            {pool.mintB.address}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Earnings Calculator */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-purple-500" />
                <span>Earnings Calculator</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Investment Amount (SOL)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold"
                    placeholder="Enter amount"
                  />
                </div>

                {/* Earnings Breakdown */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-5 border border-purple-200 dark:border-purple-800">
                  <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-4">
                    Potential Earnings
                  </h4>
                  
                  <div className="space-y-3">
                    {/* Daily */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Daily</span>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {((apr * Number(amount)) / 100 / 365).toFixed(4)} SOL
                        </div>
                        {solPrice && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            ${((apr * Number(amount)) / 100 / 365 * solPrice).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Weekly */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Weekly</span>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {((apr * Number(amount)) / 100 / 52).toFixed(4)} SOL
                        </div>
                        {solPrice && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            ${((apr * Number(amount)) / 100 / 52 * solPrice).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Monthly */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Monthly</span>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {((apr * Number(amount)) / 100 / 12).toFixed(4)} SOL
                        </div>
                        {solPrice && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            ${((apr * Number(amount)) / 100 / 12 * solPrice).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Yearly */}
                    <div className="flex justify-between items-center pt-3 border-t border-purple-200 dark:border-purple-700">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Yearly</span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {((apr * Number(amount)) / 100).toFixed(4)} SOL
                        </div>
                        {solPrice && (
                          <div className="text-xs text-purple-600 dark:text-purple-400">
                            ${((apr * Number(amount)) / 100 * solPrice).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {solPrice && (
                    <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700 text-xs text-gray-600 dark:text-gray-400">
                      1 SOL = ${solPrice.toFixed(2)} USD
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowComingSoonModal(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
                >
                  Get Early Access
                </button>
                
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Deposits coming soon. Join the waitlist!
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pool Type</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{pool.pooltype[0]}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trading Fee</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{feeRate.toFixed(3)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Farms</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {pool.farmOngoingCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        poolName={poolName}
      />
    </div>
  );
}