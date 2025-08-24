Here's a step-by-step guide for your junior engineer:

# Task: Improve Campaign Statistics Loading and Wallet Connection UX

## Part 1: Switch to Subgraph for Campaign Statistics

1. First, examine how data is fetched in `TopDonorsTable.tsx`. Note the pattern:
```typescript
const { data, isLoading, isError } = useQuery({
    queryKey: ['liquidity', poolIds],
    queryFn: async () => {
      const response = await request(
        chainConfigs[Number(campaign.chainId)].graphUrl,
        queryDIVALiquidity(poolIds)
      );
      return response.liquidities || [];
    }
});
```

2. Create a new GraphQL query for campaign statistics. Add it to your queries folder (e.g., `src/queries/divaSubgraph.ts`):
```typescript
export const queryCampaignStats = (poolIds: string[]) => `
  query {
    pools(where: { id_in: ${JSON.stringify(poolIds)} }) {
      id
      capacity
      collateralBalance
      longToken
      shortToken
    }
  }
`
```

3. In `CampaignCard.tsx`, replace the existing smart contract calls with the subgraph query:
   - Remove the existing `useEffect` that fetches campaign stats
   - Add the new query using `react-query`
   - Update the state based on the query results

```typescript:src/components/Section/CampaignCard.tsx
import { useQuery } from '@tanstack/react-query'
import request from 'graphql-request'
import { queryCampaignStats } from '@/queries/divaSubgraph'

// Inside component:
const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['campaignStats', campaign.pools.map(pool => pool.poolId)],
    queryFn: async () => {
      const response = await request(
        chainConfigs[Number(campaign.chainId)].graphUrl,
        queryCampaignStats(campaign.pools.map(pool => pool.poolId))
      );
      return response.pools;
    }
});

// Add effect to update states when data changes
useEffect(() => {
    if (statsData) {
      let sumCapacityPools: number | 'Unlimited' = 0;
      let sumRaisedPools: number = 0;

      statsData.forEach((pool: any) => {
        // Calculate totals
        if (isUnlimited(pool.capacity)) {
          sumCapacityPools = 'Unlimited';
        } else if (sumCapacityPools !== 'Unlimited') {
          sumCapacityPools += Number(formatUnits(pool.capacity, decimals));
        }
        sumRaisedPools += Number(formatUnits(pool.collateralBalance, decimals));
      });

      // Apply overrides from campaign data
      if (campaign.goal !== '') {
        sumCapacityPools = Number(campaign.goal);
      }
      if (campaign.raised !== '') {
        sumRaisedPools = Number(campaign.raised);
      }

      // Update states
      setGoal(sumCapacityPools);
      setRaised(sumRaisedPools);
      setToGo(sumCapacityPools === 'Unlimited' ? 'Unlimited' : sumCapacityPools - sumRaisedPools);
      setPercentage(sumCapacityPools === 'Unlimited' ? 0 : (sumRaisedPools / sumCapacityPools) * 100);
    }
}, [statsData, campaign]);
```

4. Test thoroughly to ensure statistics are loading correctly without wallet connection

## Part 2: Integrate Wallet Connection into Button

1. Remove the `ConnectWalletModal` component from `DonationCard.tsx`

2. Modify the `CustomButton` component to handle different states:
```typescript:src/components/Section/DonationCard.tsx
const CustomButton: React.FC<{
  isLoading: boolean;
  onClick: () => void;
  isEnabled: boolean;
  label: string;
  isConnected: boolean;
  openConnectModal?: () => void;
}> = ({
  isLoading,
  onClick,
  isEnabled,
  label,
  isConnected,
  openConnectModal
}) => {
  if (!isConnected && openConnectModal) {
    return (
      <button
        onClick={openConnectModal}
        className="w-full flex justify-center items-center mt-10 py-3 text-lg text-white bg-[#042940] rounded-[10px] hover:bg-[#042940]"
        type="button"
      >
        Connect Wallet to Donate
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full disabled:opacity-25 flex justify-center items-center mt-10 py-3 text-lg text-white bg-[#042940] rounded-[10px] hover:bg-[#042940] focus:outline-none focus:ring-2 focus:ring-[#005C53] focus:ring-opacity-50 ${
        isLoading ? 'relative' : ''
      }`}
      type="button"
      disabled={!isEnabled || isLoading}
    >
      {isLoading ? <Spinner /> : label}
    </button>
  );
};
```

3. Update the button rendering in `DonationCard.tsx`:
```typescript:src/components/Section/DonationCard.tsx
<CustomButton
  isLoading={approveLoading || donateLoading}
  onClick={approveEnabled ? handleApprove : handleDonation}
  isEnabled={!insufficientFunds && (approveEnabled || donateEnabled)}
  label={
    insufficientFunds 
    ? 'Insufficient Funds' 
    : (approveEnabled ? 'Approve' : (donateEnabled ? 'Deposit' : 'Enter amount'))
  }
  isConnected={isConnected}
  openConnectModal={openConnectModal}
/>
```

4. Test the new flow:
   - Campaign statistics should load immediately
   - "Connect Wallet to Donate" button should be shown when not connected
   - After connecting, the button should show appropriate state (Enter amount/Approve/Deposit)
   - Chain switching should still work as before

## Notes:
- Keep all existing chain-switching functionality
- Maintain all existing error handling
- Ensure loading states are properly handled
- Test on different networks and with different campaign states

Let me know if you need any clarification or run into issues!
