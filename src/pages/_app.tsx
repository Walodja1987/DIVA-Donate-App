import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Providers from '@/components/providers'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Providers>
			<Component {...pageProps} />
		</Providers>
	)
}

// @todo check what happens if a user connects to an unsupported chain within Metamask manually. The privy docs say:
// For external wallets (e.g. MetaMask), users may switch their wallet's network manually, independent of both Privy and your application. There is no way to prevent this behavior; Privy will not throw an error, and you can only re-prompt the user to switch to a different network.
// https://docs.privy.io/guide/react/configuration/networks#overview
