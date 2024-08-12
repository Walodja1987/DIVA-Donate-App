import type { PrivyClientConfig } from '@privy-io/react-auth';
import { polygon } from 'viem/chains';

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
	defaultChain: polygon, // Users will be prompted to switch to this network if they are connected to a different chain
	supportedChains: [polygon],
};
