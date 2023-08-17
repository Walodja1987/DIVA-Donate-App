interface DonationRecipient {
    name: string;
    address: string;
    url: string;
  }
  
  interface Pool {
    poolId: string;
    beneficiarySide: string;
    positionToken: string;
  }
  
  export interface Campaign {
    campaignId: string;
    pools: Pool[];
    img: string;
    path: string;
    title: string;
    desc: string;
    donationRecipients: DonationRecipient[];
    raised: string;
    donated: string;
    collateralToken: string;
    decimals: string;
    divaContractAddress: string;
    chainId: string;
  }
  
  // Tell TypeScript how to type-check the JSON files without needing explicit imports.
  declare module "*.json" {
    const value: Campaign[];
    export default value;
  }
  