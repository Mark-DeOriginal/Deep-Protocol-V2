# Raydium API Integration

## Overview
Successfully integrated real-time data from Raydium's API v3 to replace mock pool data throughout the Deep Protocol V2 application.

## Changes Made

### 1. New API Service (`src/lib/raydiumApi.ts`)
Created a comprehensive Raydium API integration service with:

- **API Endpoint**: `https://api-v3.raydium.io/pools/info/list`
- **Type Definitions**: Full TypeScript types for Raydium pool data
- **Core Functions**:
  - `fetchRaydiumPools()` - Fetch pools with filtering and sorting
  - `formatPoolName()` - Format pool names (e.g., "SOL/USDC")
  - `getPoolAPR()` - Extract APR from pool data
  - `getPoolTVL()` - Get Total Value Locked
  - `getPool24hVolume()` - Get 24h trading volume
  - `getPoolFeeRate()` - Get pool fee rate
  - `getPoolCategory()` - Auto-categorize pools (DeFi, Memecoin, Stable, GameFi)

### 2. Updated Pools Page (`src/app/pools/page.tsx`)
Transformed the pools page to use real Raydium data:

- **Real-time Data**: Fetches live pool data from Raydium API
- **Dynamic Filtering**: Category-based filtering (All, DeFi, Memecoin, Stable, GameFi)
- **Advanced Sorting**: Sort by Liquidity, Volume, APR, Fees
- **Pagination**: Support for browsing through large pool datasets
- **Loading States**: Proper loading and error handling
- **Token Icons**: Displays actual token logos from pool data
- **Live Stats**: Shows real TVL, 24h Volume, APR, and Fee rates

### 3. Updated Pool Detail Page (`src/app/pools/[id]/page.tsx`)
Enhanced individual pool pages with real data:

- **Real Pool Data**: Fetches specific pool information
- **Token Information**: Displays both tokens with addresses and amounts
- **Live Statistics**: Real APR, TVL, 24h Volume, and Fee rates
- **Earnings Calculator**: Calculate potential earnings based on actual APR
- **Token Logos**: Shows official token icons
- **External Links**: Direct links to Raydium for adding liquidity

### 4. Updated Homepage (`src/app/page.tsx`)
Enhanced homepage statistics with real data:

- **Live TVL**: Shows total liquidity across all Raydium pools
- **Pool Count**: Displays actual number of active pools
- **Average APR**: Calculates average APR from real pools
- **Auto-refresh**: Stats update with real-time data

## API Parameters

The Raydium API accepts the following query parameters:

| Parameter | Type | Required | Options |
|-----------|------|----------|---------|
| `poolType` | string | Yes | `all`, `concentrated`, `standard`, `allFarm`, `concentratedFarm`, `standardFarm` |
| `poolSortField` | string | Yes | `default`, `liquidity`, `volume24h`, `fee24h`, `apr24h`, `volume7d`, `fee7d`, `apr7d`, `volume30d`, `fee30d`, `apr30d` |
| `sortType` | string | Yes | `desc`, `asc` |
| `pageSize` | number | Yes | Max 1000 |
| `page` | number | Yes | Page index (starts at 1) |

## Pool Categories

Pools are automatically categorized based on token symbols:

- **Memecoin**: BONK, WIF, SAMO, COPE, POPCAT, MYRO, WEN
- **Stablecoin**: USDC, USDT, DAI, USD
- **GameFi**: GMT, STEPN, ATLAS, POLIS, AURORY
- **DeFi**: Everything else (default)

## Data Displayed

### Pool Card Information
- Pool name (e.g., "SOL/USDC")
- Token logos
- APR (Annual Percentage Rate)
- TVL (Total Value Locked)
- 24h Trading Volume
- Trading Fee Rate
- Current Price
- Pool Type (concentrated, standard, etc.)
- Category Badge

### Pool Detail Information
- Token pair details
- Token contract addresses
- Token amounts in pool
- Current price
- 24h Volume
- APR
- TVL
- Fee rate
- Earnings calculator

## Features

### ✅ Implemented
- Real-time pool data fetching
- Category-based filtering
- Advanced sorting options
- Pagination support
- Loading states
- Error handling
- Token logo display
- Live statistics
- Search functionality
- Responsive design

### 🔄 Auto-categorization
Pools are automatically categorized to maintain the Deep Protocol UX while using real Raydium data.

### 💾 Caching
API responses are cached for 60 seconds using Next.js's `revalidate` option for better performance.

## Testing

To test the integration:

1. **Pools Page**: Visit http://localhost:3000/pools
   - Verify pools load with real data
   - Test category filters (All, DeFi, Memecoin, Stable, GameFi)
   - Test sorting options
   - Test search functionality
   - Try pagination

2. **Pool Detail**: Click on any pool
   - Verify pool details load
   - Check token information
   - Test earnings calculator
   - Verify "View on Raydium" link

3. **Homepage**: Visit http://localhost:3000
   - Check that stats show real numbers
   - Verify Total Liquidity updates
   - Verify Pool Count is accurate

## API Response Structure

```typescript
interface RaydiumApiResponse {
  id: string;
  success: boolean;
  data: {
    count: number;
    data: RaydiumPool[];
    hasNextPage: boolean;
  };
}
```

## Error Handling

- API failures show user-friendly error messages
- Retry functionality on errors
- Graceful fallbacks for missing data
- Console logging for debugging

## Performance Optimizations

1. **Caching**: 60-second revalidation on API calls
2. **Pagination**: Load 100 pools at a time
3. **Client-side filtering**: Fast category and search filtering
4. **Image error handling**: Gracefully hide broken token logos

## Next Steps (Optional Enhancements)

- [ ] Add pool favorites/bookmarking
- [ ] Add historical APR charts
- [ ] Add price charts
- [ ] Add liquidity position tracking
- [ ] Add notifications for APR changes
- [ ] Add advanced filters (min TVL, min APR, etc.)
- [ ] Add pool comparison feature

## Documentation

- Raydium API: https://api-v3.raydium.io
- API endpoint used: `GET /pools/info/list`

## Notes

- Mock pool data (`src/data/mockPools.ts`) is no longer used in the pools pages
- All pool data is now fetched from Raydium's real-time API
- The application maintains its original design while showing real data
- Token logos are fetched from pool metadata when available
