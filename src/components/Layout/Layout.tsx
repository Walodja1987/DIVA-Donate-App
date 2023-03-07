import React, { useEffect } from 'react'
import NavBar from './Navbar'
import { FooterSection } from '../Section/FooterSection'
import Head from 'next/head'

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
	const [chainId, setChainId] = React.useState('0')
	//const handleOpen = () => {
	//    (window as any).ethereum.request({
	//        method: "wallet_switchEthereumChain",
	//        params: [{ chainId: "0x89" }],
	//    });
	//}
	useEffect(() => {
		if ((window as any)?.ethereum) {
			setChainId((window as any).ethereum.chainId)
			;(window as any).ethereum.on('chainChanged', (chainId: any) => {
				setChainId(chainId)
			})
		}
	}, [chainId])
	return (
		<>
			<Head>
				<title>DIVA Donate</title>
				<meta
					name="description"
					content="A novel donation model enabled by blockchain technology and powered by DIVA Protocol"
				/>

				{/* <!-- Facebook Meta Tags --> */}
				<meta property="og:url" content="https://www.divadonate.xyz" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="DIVA Donate" />
				<meta
					property="og:description"
					content="A novel donation model enabled by blockchain technology and powered by DIVA Protocol"
				/>
				<meta
					property="og:image"
					content="https://www.divaprotocol.io/_next/image?url=%2Fimages%2Fposts%2Fdiva_donate_header.png&w=3840&q=75"
				/>

				{/* <!-- Twitter Meta Tags --> */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="DIVA Donate" />
				<meta
					name="twitter:description"
					content="A novel donation model enabled by blockchain technology and powered by DIVA Protocol"
				/>
				<meta
					name="twitter:image"
					content="https://www.divaprotocol.io/_next/image?url=%2Fimages%2Fposts%2Fdiva_donate_header.png&w=3840&q=75"
				/>
			</Head>
			<div>
				<NavBar />
				{children}
				<FooterSection />
			</div>
		</>
	)
}

export default Layout
