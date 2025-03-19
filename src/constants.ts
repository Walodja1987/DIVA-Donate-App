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
      graphUrl: 'https://api.studio.thegraph.com/query/73880/diva-protocol-v1-polygon/version/latest', // replace "latest" with version number if you want to use a specific version of the subgraph
      blockExplorer: 'https://polygonscan.com/'
}

type ChainConfig = {
    name: string;
    graphUrl: string;
    blockExplorer: string;
    divaContractAddress: string;
}

export const chainConfigs: { [chainId: number]: ChainConfig } = {
    137: {
        name: 'Polygon',
        graphUrl: 'https://api.studio.thegraph.com/query/73880/diva-protocol-v1-polygon/version/latest',
        blockExplorer: 'https://polygonscan.com/',
        divaContractAddress: '0x2C9c47E7d254e493f02acfB410864b9a86c28e1D'
    },
    42161: {
        name: 'Arbitrum One',
        graphUrl: 'https://api.studio.thegraph.com/query/73880/diva-protocol-v1-arbitrum-one/version/latest',
        blockExplorer: 'https://arbiscan.io/',
        divaContractAddress: '0x2C9c47E7d254e493f02acfB410864b9a86c28e1D'
    },
    1: {
        name: 'Ethereum',
        graphUrl: 'https://api.studio.thegraph.com/query/73880/diva-protocol-v1-ethereum/version/latest',
        blockExplorer: 'https://etherscan.io/',
        divaContractAddress: '0x2C9c47E7d254e493f02acfB410864b9a86c28e1D'
    },
    // Add more chains as needed
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

export const ADMIN_ADDRESS = "0xd288B4A23ECc79Eb4bb4661147f3AB3294919F54".toLowerCase();

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

// Create a separate admin link that we'll add conditionally
export const adminLink: NavItemType = {
    to: "/admin",
    name: "Admin",
};