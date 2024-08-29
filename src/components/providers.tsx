'use client';

// Inspired by privy's wagmi demo: https://github.com/privy-io/wagmi-demo/blob/main/components/providers.tsx
// See the privy guide to integrate wagmi: https://docs.privy.io/guide/react/wallets/usage/wagmi

import { ChakraProvider } from '@chakra-ui/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Wagmi uses TanStack Query under the hood to power its data fetching and caching of wallet and blockchain data.

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';

import { wagmiConfig } from './wagmiConfig';
import { privyConfig } from './privyConfig';

const queryClient = new QueryClient();

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
