import React from 'react'
import NavBar from './Navbar'
import { FooterSection } from '../Section/FooterSection'
import CookieBanner from '../CookieBanner';
import Head from 'next/head'

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
	return (
		<>
			<Head>
				<title>DIVA Donate</title>
				<meta
					name="description"
					content="DIVA Donate is a parametric conditional donation platform that leverages decentralized finance and remote sensed data to deliver effective, efficient disaster relief, empowering vulnerable populations worldwide to rebuild their lives and thrive. Powered by DIVA Protocol."
				/>

				{/* <!-- Facebook Meta Tags --> */}
				<meta property="og:url" content="https://www.divadonate.xyz" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="DIVA Donate" />
				<meta
					property="og:description"
					content="DIVA Donate is a parametric conditional donation platform that leverages decentralized finance and remote sensed data to deliver effective, efficient disaster relief, empowering vulnerable populations worldwide to rebuild their lives and thrive. Powered by DIVA Protocol."
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
					content="DIVA Donate is a parametric conditional donation platform that leverages decentralized finance and remote sensed data to deliver effective, efficient disaster relief, empowering vulnerable populations worldwide to rebuild their lives and thrive. Powered by DIVA Protocol."
				/>
				<meta
					name="twitter:image"
					content="https://www.divaprotocol.io/_next/image?url=%2Fimages%2Fposts%2Fdiva_donate_header.png&w=3840&q=75"
				/>
			</Head>
			<NavBar />
			<CookieBanner />
			{children}
			<FooterSection />
		</>
	)
}

export default Layout
