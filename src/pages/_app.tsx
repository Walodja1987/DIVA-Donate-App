import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { ChakraProvider } from '@chakra-ui/react'
import CustomAvatar from '../components/CustomAvatar'

const { chains, provider } = configureChains(
	[polygon],
	[alchemyProvider({ apiKey: 'p3-IGmZPQrd-ri5AGlGm4cVm8k1uhCXx' })]
)

const { connectors } = getDefaultWallets({
	appName: 'Diva Donate',
	chains,
})
const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
})

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider>
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider chains={chains} avatar={CustomAvatar}>
					<Component {...pageProps} />
				</RainbowKitProvider>
			</WagmiConfig>
		</ChakraProvider>
	)
}
