'use client';

import { X } from 'lucide-react';
import { 
  formatPoolName, 
  getPoolAPR, 
  getPoolTVL, 
  getPool24hVolume,
  getPoolFeeRate,
  calculateRiskScore,
  getRiskLevel,
  calculateAPRChange,
  getVolumeEfficiency,
  type RaydiumPool 
} from '@/lib/raydiumApi';

interface PoolComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  pools: RaydiumPool[];
}

export default function PoolComparisonModal({ isOpen, onClose, pools }: PoolComparisonModalProps) {
  if (!isOpen || pools.length === 0) return null;

  const metrics = [
    { label: 'APR', key: 'apr', format: (v: number) => `${v.toFixed(2)}%`, higher: true },
    { label: 'TVL', key: 'tvl', format: (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, higher: true },
    { label: '24h Volume', key: 'volume', format: (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, higher: true },
    { label: 'Trading Fee', key: 'fee', format: (v: number) => `${v.toFixed(3)}%`, higher: false },
    { label: 'Volume/TVL', key: 'efficiency', format: (v: number) => v.toFixed(2), higher: true },
    { label: 'APR Change', key: 'aprChange', format: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`, higher: true },
    { label: 'Risk Score', key: 'risk', format: (v: number) => v.toFixed(0), higher: false },
  ];

  const getMetricValue = (pool: RaydiumPool, key: string): number => {
    switch (key) {
      case 'apr': return getPoolAPR(pool);
      case 'tvl': return getPoolTVL(pool);
      case 'volume': return getPool24hVolume(pool);
      case 'fee': return getPoolFeeRate(pool);
      case 'efficiency': return getVolumeEfficiency(pool);
      case 'aprChange': return calculateAPRChange(pool);
      case 'risk': return calculateRiskScore(pool);
      default: return 0;
    }
  };

  const getBestValue = (key: string, higher: boolean) => {
    const values = pools.map(pool => getMetricValue(pool, key));
    return higher ? Math.max(...values) : Math.min(...values);
  };

  const isBest = (pool: RaydiumPool, key: string, higher: boolean) => {
    const value = getMetricValue(pool, key);
    const best = getBestValue(key, higher);
    return Math.abs(value - best) < 0.01; // Account for floating point
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pool Comparison
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Comparing {pools.length} pool{pools.length !== 1 ? 's' : ''} side-by-side
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto max-h-[calc(90vh-100px)]">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                  Metric
                </th>
                {pools.map((pool) => (
                  <th key={pool.id} className="px-6 py-4 text-left border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        {pool.mintA.logoURI && (
                          <img 
                            src={pool.mintA.logoURI} 
                            alt={pool.mintA.symbol}
                            className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                        {pool.mintB.logoURI && (
                          <img 
                            src={pool.mintB.logoURI} 
                            alt={pool.mintB.symbol}
                            className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-base">
                        {formatPoolName(pool)}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {metrics.map((metric) => (
                <tr key={metric.key} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {metric.label}
                  </td>
                  {pools.map((pool) => {
                    const value = getMetricValue(pool, metric.key);
                    const best = isBest(pool, metric.key, metric.higher);
                    const riskLevel = metric.key === 'risk' ? getRiskLevel(value) : null;
                    
                    return (
                      <td 
                        key={pool.id} 
                        className={`px-6 py-4 text-sm ${
                          best 
                            ? 'bg-green-50 dark:bg-green-900/20 font-semibold text-green-900 dark:text-green-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{metric.format(value)}</span>
                          {best && (
                            <span className="text-green-600 dark:text-green-400 text-xs">
                              ✓ Best
                            </span>
                          )}
                          {riskLevel && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              riskLevel.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                              riskLevel.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                              'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                            }`}>
                              {riskLevel.label}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Quick Comparison Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pools.map((pool) => {
                const bestCount = metrics.filter(m => isBest(pool, m.key, m.higher)).length;
                const riskLevel = getRiskLevel(calculateRiskScore(pool));
                
                return (
                  <div key={pool.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-gray-900 dark:text-white mb-2">
                      {formatPoolName(pool)}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Best Metrics:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{bestCount}/{metrics.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Risk Level:</span>
                        <span className={`font-medium ${
                          riskLevel.color === 'green' ? 'text-green-600 dark:text-green-400' :
                          riskLevel.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {riskLevel.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Green highlighted values indicate the best metric in each category
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
