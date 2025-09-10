export interface Pool {
  id: string;
  name: string;
  contractAddress: string;
  website?: string;
  creator: string;
  dpy: number;
  totalLiquidity: number;
  minDeposit: number;
  maxDeposit: number;
  fees: number;
  category: 'memecoin' | 'defi' | 'gamefi' | 'nft';
}

export interface LiquidityPosition {
  poolId: string;
  amount: number;
  timestamp: number;
  walletAddress: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'claim';
  poolId: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}
