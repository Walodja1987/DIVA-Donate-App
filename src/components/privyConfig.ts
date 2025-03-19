import type { PrivyClientConfig } from '@privy-io/react-auth';
import { polygon, arbitrum, mainnet } from 'viem/chains';

// privy configuration used in PrivyProvider
export const privyConfig: PrivyClientConfig = {
	embeddedWallets: {
	  createOnLogin: 'users-without-wallets',
	  requireUserPasswordOnCreate: true,
	  noPromptOnSignature: false,
	},
	loginMethods: ['wallet'], // ['email', 'wallet', 'google', 'apple', 'farcaster']
	appearance: {
	  showWalletLoginFirst: true,
	},
	defaultChain: mainnet, // Users will be prompted to switch to this network if they are connected to a different chain
	// @todo switch defaultChain to Arbitrum when going live with the new campaign
	supportedChains: [polygon, arbitrum, mainnet],
	// externalWallets: {
	// 	metamask: {
	// 	  enabled: true,
	// 	},
	// 	walletConnect: {
	// 	  enabled: true,
	// 	},
	// 	coinbase: {
	// 		enabled: false,
	// 	}
	// },
};
