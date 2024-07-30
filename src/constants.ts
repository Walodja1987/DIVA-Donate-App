import campaigns from '../config/campaigns.json'


// Pre-audit contract version used for the very first campaign (poolId = 8)
export const divaContractAddressOld = '0xFf7d52432B19521276962B67FFB432eCcA609148'

// Post-audit contract version used for subsequent campaigns
export const divaContractAddress = '0x2C9c47E7d254e493f02acfB410864b9a86c28e1D'

export const IMAGE_PATH = "/Images/posts/";
export const HOME = "https://www.divadonate.xyz";

export const chainConfig = {
      name: 'Polygon',
      chainId: 137,
}

// export const chainConfig = {
//     name: 'Mumbai',
//     chainId: 80001,
// }

export type NavItemType = {
    to: string;
    name: string;
    isDropdown?: boolean;
    dropdownItems?: any[];
    target?: string;
    rel?: string;
};


export const links: NavItemType[] = [
    {
        to: "/",
        name: "Home",
    },
    {
        to: "/campaign",
        name: "Campaigns",
        isDropdown: true,
        dropdownItems: campaigns,
    },
    {
        to: "/donations",
        name: "My Donations",
    },
    {
        to: "https://docs.divadonate.xyz/",
        name: "Docs",
        target: "_blank",
        rel: "noopener noreferrer",
    },
    {
        to: "/posts",
        name: "Blog",
    },
];