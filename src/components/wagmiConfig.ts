import { http } from 'viem';
import { polygon } from 'viem/chains';

import { createConfig } from '@privy-io/wagmi';

// Ensure that the chains and transports configuration is consistent with `privyConfig.ts`.
export const wagmiConfig = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
  },
});