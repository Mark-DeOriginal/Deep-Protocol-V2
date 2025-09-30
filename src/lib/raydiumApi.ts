// Raydium API Integration
// API Documentation: https://api-v3.raydium.io

const RAYDIUM_API_BASE = 'https://api-v3.raydium.io';

export type PoolType = 'all' | 'concentrated' | 'standard' | 'allFarm' | 'concentratedFarm' | 'standardFarm';
export type PoolSortField = 'default' | 'liquidity' | 'volume24h' | 'fee24h' | 'apr24h' | 'volume7d' | 'fee7d' | 'apr7d' | 'volume30d' | 'fee30d' | 'apr30d';
export type SortType = 'desc' | 'asc';

export interface RaydiumPoolParams {
  poolType?: PoolType;
  poolSortField?: PoolSortField;
  sortType?: SortType;
  pageSize?: number;
  page?: number;
}

export interface RaydiumPool {
  id: string;
  mintA: {
    address: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
  };
  mintB: {
    address: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
  };
  price: number;
  mintAmountA: number;
  mintAmountB: number;
  feeRate: number;
  openTime: string | number; // Can be ISO string or Unix timestamp
  tvl: number;
  day: {
    volume: number;
    volumeQuote: number;
    volumeFee: number;
    apr: number;
    feeApr: number;
    priceMin: number;
    priceMax: number;
  };
  week: {
    volume: number;
    volumeQuote: number;
    volumeFee: number;
    apr: number;
    feeApr: number;
    priceMin: number;
    priceMax: number;
  };
  month: {
    volume: number;
    volumeQuote: number;
    volumeFee: number;
    apr: number;
    feeApr: number;
    priceMin: number;
    priceMax: number;
  };
  pooltype: string[];
  rewardDefaultInfos: unknown[];
  farmUpcomingCount: number;
  farmOngoingCount: number;
  farmFinishedCount: number;
}

export interface RaydiumApiResponse {
  id: string;
  success: boolean;
  data: {
    count: number;
    data: RaydiumPool[];
    hasNextPage: boolean;
  };
}

/**
 * Fetch pool list from Raydium API
 */
export async function fetchRaydiumPools(params: RaydiumPoolParams = {}): Promise<RaydiumApiResponse> {
  const {
    poolType = 'all',
    poolSortField = 'default',
    sortType = 'desc',
    pageSize = 100,
    page = 1
  } = params;

  const queryParams = new URLSearchParams({
    poolType,
    poolSortField,
    sortType,
    pageSize: pageSize.toString(),
    page: page.toString()
  });

  const url = `${RAYDIUM_API_BASE}/pools/info/list?${queryParams}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Enable caching for better performance
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Raydium API error: ${response.status} ${response.statusText}`);
    }

    const data: RaydiumApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Raydium pools:', error);
    throw error;
  }
}

/**
 * Format pool name from mint symbols
 */
export function formatPoolName(pool: RaydiumPool): string {
  return `${pool.mintA.symbol}/${pool.mintB.symbol}`;
}

/**
 * Calculate APR as percentage
 */
export function getPoolAPR(pool: RaydiumPool): number {
  return pool.day.apr || 0;
}

/**
 * Get TVL (Total Value Locked) formatted
 */
export function getPoolTVL(pool: RaydiumPool): number {
  return pool.tvl || 0;
}

/**
 * Get 24h volume
 */
export function getPool24hVolume(pool: RaydiumPool): number {
  return pool.day.volume || 0;
}

/**
 * Get fee rate as percentage
 */
export function getPoolFeeRate(pool: RaydiumPool): number {
  return (pool.feeRate || 0) * 100;
}

/**
 * Determine pool category based on token symbols
 */
export function getPoolCategory(pool: RaydiumPool): 'defi' | 'memecoin' | 'gamefi' | 'nft' | 'stable' {
  const symbol = `${pool.mintA.symbol}/${pool.mintB.symbol}`.toLowerCase();
  
  // Memecoin patterns
  const memecoins = ['bonk', 'wif', 'samo', 'cope', 'popcat', 'myro', 'wen'];
  if (memecoins.some(coin => symbol.includes(coin))) {
    return 'memecoin';
  }
  
  // Stablecoin patterns
  const stables = ['usdc', 'usdt', 'dai', 'usd'];
  if (stables.some(stable => symbol.includes(stable))) {
    return 'stable';
  }
  
  // GameFi patterns
  const gamefi = ['gmt', 'stepn', 'atlas', 'polis', 'aurory'];
  if (gamefi.some(game => symbol.includes(game))) {
    return 'gamefi';
  }
  
  // Default to DeFi
  return 'defi';
}

/**
 * Calculate risk score for a pool (0-100, lower is less risky)
 */
export function calculateRiskScore(pool: RaydiumPool): number {
  let riskScore = 0;
  
  // 1. TVL Score (40 points) - Higher TVL = Lower Risk
  const tvl = getPoolTVL(pool);
  if (tvl < 10000) riskScore += 40;
  else if (tvl < 100000) riskScore += 30;
  else if (tvl < 1000000) riskScore += 20;
  else if (tvl < 10000000) riskScore += 10;
  else riskScore += 0;
  
  // 2. Volume/TVL Ratio Score (30 points) - Higher ratio = Higher risk (low liquidity depth)
  const volume24h = getPool24hVolume(pool);
  const volumeToTVLRatio = tvl > 0 ? volume24h / tvl : 0;
  if (volumeToTVLRatio > 10) riskScore += 30; // Very high turnover
  else if (volumeToTVLRatio > 5) riskScore += 20;
  else if (volumeToTVLRatio > 2) riskScore += 10;
  else if (volumeToTVLRatio > 0.5) riskScore += 5;
  else riskScore += 0;
  
  // 3. Token Pair Type Score (30 points)
  const category = getPoolCategory(pool);
  if (category === 'memecoin') riskScore += 30;
  else if (category === 'gamefi') riskScore += 20;
  else if (category === 'nft') riskScore += 25;
  else if (category === 'stable') riskScore += 0;
  else riskScore += 10; // defi
  
  return Math.min(100, Math.max(0, riskScore));
}

/**
 * Get risk level label and color
 */
export function getRiskLevel(riskScore: number): {
  label: 'Low' | 'Medium' | 'High';
  color: string;
} {
  if (riskScore < 30) {
    return { label: 'Low', color: 'green' };
  } else if (riskScore < 60) {
    return { label: 'Medium', color: 'yellow' };
  } else {
    return { label: 'High', color: 'red' };
  }
}

/**
 * Calculate APR change (comparing day vs week APR as proxy)
 */
export function calculateAPRChange(pool: RaydiumPool): number {
  const dayAPR = pool.day.apr || 0;
  const weekAPR = pool.week.apr || 0;
  
  if (weekAPR === 0) return 0;
  
  // Calculate percentage change
  const change = ((dayAPR - weekAPR) / weekAPR) * 100;
  return Number(change.toFixed(2));
}

/**
 * Calculate volume efficiency (volume per dollar of TVL)
 */
export function getVolumeEfficiency(pool: RaydiumPool): number {
  const tvl = getPoolTVL(pool);
  const volume = getPool24hVolume(pool);
  return tvl > 0 ? volume / tvl : 0;
}
