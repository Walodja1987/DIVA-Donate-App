'use client';

// Inspired by privy's wagmi demo: https://github.com/privy-io/wagmi-demo/blob/main/components/providers.tsx
// See the privy guide to integrate wagmi: https://docs.privy.io/guide/react/wallets/usage/wagmi

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Wagmi uses TanStack Query under the hood to power its data fetching and caching of wallet and blockchain data.

import { http } from 'viem';
import { polygon } from 'viem/chains';

import type { PrivyClientConfig } from '@privy-io/react-auth';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider, createConfig } from '@privy-io/wagmi';

import { ChakraProvider } from '@chakra-ui/react'

// import { QueryClient, QueryClientProvider } from 'react-query' // @todo Update TopDonors component where useQuery is used

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
  },
});

// privy configuration used in PrivyProvider
const privyConfig: PrivyClientConfig = {
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

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <ChakraProvider>
        <PrivyProvider
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
        config={privyConfig}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
                    {children}
                </WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    </ChakraProvider>
  );
}
