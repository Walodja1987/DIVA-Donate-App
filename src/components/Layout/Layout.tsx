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
