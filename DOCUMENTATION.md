# Introduction

The DIVA Donate app offers a platform for hosting conditional donation campaigns, powered by DIVA Protocol.

# Stack
* **JavaScript Library:** React
* **Framework:** Next.js
* **Styling:** Tailwind CSS
* **Wallet connect:** RainbowKit/Wagmi

To the extent possible, this app should minimize reliance on indexers such as The Graph, ensuring the app remains self-reliant.

## Campaign data

To create a new campaigns, you'll need to manually configure settings within the `campaign.json` file. Use existing entries as reference when populating the corresponding fields for the new campaign.

If any modifications to the file structure are required, make sure to mirror them in the `types/campaignTypes.d.ts` file and the corresponding sections of the codebase.

### Multiple pools

A campaign can link multiple pools. A few important notes when linking multiple pools to a campaign:
- All linked pools should either have unlimited capacities or limited capacities. Mixing the two types will break the app's functionality.
- The donation amount will be split between among the linked pools based on their assigned capacities. For example, if pool A is assigned USDT 15'000 as capacity and pool B USDT 30'000, then a USDT 300 donation will be split USDT 100 into pool A and USDT 200 into pool B.
- The raised and donated amounts can be hard-coded in `campaigns.json` on **campaign level**. This is to remove the reliance on indexer's like The Graph.
- All pools linked to a campaign must share the same expiry time and utilize the same collateral token.
- Manual provision of the `decimals` value for the collateral token is required to minimize the need for frequent RPC calls.

### Overwrites

The `raised` and `donated` fields can be set to overwrite the values obtained from DIVA Protocol's `getPoolParameters` function as this function returns net values only. The hard-coded values apply on **campaign level**, representing an aggregate value across all linked pools . This is to remove the reliance on indexer's like The Graph.

The overwrite is entered in decimal format. Example: `"donated": "5374"`. If it's empty `""`, then the value will be pulled from DIVA Protocol via `getPoolParameters`.