interface DonationRecipient {
    name: string;
    address: `0x${string}`;
    url: string;
  }
  
export interface CampaignPool {
  poolId: `0x${string}`;
  beneficiarySide: string;
  positionToken: `0x${string}`;
}

export interface Campaign {
  campaignId: string;
  pools: CampaignPool[];
  img: string;
  path: string;
  title: string;
  desc: string;
  donationRecipients: DonationRecipient[];
  goal: string;
  raised: string;
  donated: string;
  collateralToken: `0x${string}`;
  decimals: string;
  divaContractAddress: `0x${string}`;
  chainId: string;
  expiryTimestamp: string;
}

// Tell TypeScript how to type-check the JSON files without needing explicit imports.
declare module "*.json" {
  const value: Campaign[];
  export default value;
}
  