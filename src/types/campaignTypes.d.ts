interface DonationRecipient {
    name: string;
    address: `0x${string}`;
    url: string;
  }
  
export interface CampaignPool {
  poolId: `0x${string}`  | string; // Extend the type to include string to handle the first campaign that was released on a pre-final version with poolId = 8;
  beneficiarySide: string;
  beneficiaryToken: `0x${string}`;
  donorToken: `0x${string}`;
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
  chainName: string;
  expiryTimestamp: string;
}

export type CampaignStatus = 'Completed' | 'Expired' | 'Ongoing';

// Tell TypeScript how to type-check the JSON files without needing explicit imports.
declare module "*.json" {
  const value: Campaign[];
  export default value;
}
  