export const AboutSectionPastoralists5 = () => (
	<section>
		<div className="flex flex-col justify-center px-8 lg:px-0 py-6 lg:p-6 mx-auto lg:py-24 lg:flex-row lg:justify-between max-w-screen-2xl">
			<div className="border-spacing-5 flex-col justify-center sm:text-left rounded-sm lg:text-left">
				<div className="lg:col-span-7">
					<h1 className="font-semibold text-4xl sm:text-6xl md:text-6l lg:text-4xl xl:text-5xl text-[#042940] font-['lora'] mb-8">
						About the campaign
					</h1>
					<ul className="list-none font-openSans text-base font-normal mb-8">
						<li>
							{' '}							
							Pastoralist communities live a nomadic lifestyle, grazing animals on open-access 
							pastures and migrating with them in response to seasonal variations.
							Livestock and livestock products serve as their primary sources of income and food. 
							<br />
							<br />
							However, changing weather patterns induced by climate change are threatening the livelihoods of these communities
							in the eastern Horn of Africa. The region is experiencing one of the worst droughts which already resulted in the loss of over 7 million livestock 
							and put millions at risk of starvation in Ethiopia, Kenya, and Somalia. 
							<br />
							<br />
							The goal of this campaign is to assess vegetation health using the  
						{' '}
						<a
							href="https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index"
							className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
							target={'_blank'}
							rel="noreferrer">
							Normalized Difference Vegetation Index
						</a>
						{' '}
						 (NDVI) following the March-May 2025 long rains season and disburse funds to participating pastoralists if the NDVI at the end of this 
							period suggests insufficient vegetation to support livestock during the subsequent dry season.
							The target cover amount of $75 per pastoralist intends to subsidize 
							the provision of food for one livestock animal over a period of six months.
							<br />
							<br />
							DIVA Donate is a collaborative initiative between DIVA Technologies and Fortune Credit, utilizing blockchain technology to provide effective and efficient disaster relief to vulnerable communities affected by climate change. 
							This campaign represents the fifth iteration in the series dedicated to supporting Kenyan pastoralists.
							{/* <br />
							<br />
							This campaign is a joint initiative between Mercy Corps Ventures, Fortune Credit, Shamba Network, and 
							DIVA Technologies to test the use of blockchain and smart contracts to deliver anticipatory cash transfers 
							ahead of climate shocks to pastoralist communities in the Horn of Africa. */}
						</li>{' '}
					</ul>

					<h1 className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Sponsors
					</h1>
					
					<ul
						className="list-none font-openSans text-base font-normal mb-8">
						<li>
							Special thanks goes to our sponsors who seeded this campaign:
							<ul
								role="list"
								className="list-disc marker:text-[#000000] list-disc pl-10 space-y-3 mb-8 mt-4">
								<li><strong>Ripple:</strong> Supporting the campaign with $25,000 funded with their new stablecoin RLUSD</li>
								<li><strong>Mercy Corps Ventures & Arbitrum:</strong> ~$12,000 of unreleased funds rolled from previous campaigns</li>
							</ul>							{/* {' '}
							<a
								href="https://agfundernews.com/mercy-corps-ventures-pilots-the-blockchain-to-get-cash-transfers-to-communities-ahead-of-climate-shock"
								className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
								target={'_blank'}
								rel="noreferrer">
								Learn more
							</a> */}
						</li>
					</ul>
					<h1 className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Campaign goal
					</h1>
					<ul
						role="list"
						className="list-disc marker:text-[#000000] list-disc pl-10 space-y-3 text-base mb-8">
						<li>533 Pastoralists</li>
						<li>$75 target cover amount per pastoralist</li>
						<li>$40,000 total cover for the campaign</li>
					</ul>
					<div className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Beneficiaries
					</div>
					<ul
						role="list"
						className="list-disc marker:text-[#000000] list-disc pl-10 space-y-3  mb-8">
						<li>Pastoralists in Kajiado and Laikipia North (Kenyan counties)</li>
					</ul>
					<div className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Trigger metric
					</div>
					<ul className="list-disc mb-8">
						The pasture condition is assessed using an indicator called NDVI (
						<a
							href="https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index"
							className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
							target={'_blank'}
							rel="noreferrer">
							Normalized Difference Vegetation Index
						</a>
						).
						The NDVI is a widely-used metric for quantifying the health and density of vegetation using sensor data.
						It serves as a reasonable metric for assessing drought as vegetation density generally correlates with rainfall patterns.
						<br></br>
						<br></br>
						For this campaign, the NDVI as at 31 May 2025 within the eVIIRS dataset for both counties, 
						as published on the 
						{' '}
						<a
							href="https://earlywarning.usgs.gov/fews/ewx/index.html"
							className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
							target={'_blank'}
							rel="noreferrer">
							USGS FEWS NET Early Warning System website
						</a>
						, will be used. These values will be reported via the DIVA Donate Multisig on 7 June 2025, with a +1 shift applied for technical reasons.
						The chosen dataset offers a smoothed NDVI timeseries that corrects low-quality observations caused by clouds or other atmospheric contamination.
						{/* {' '}
						<a
							href="https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index"
							className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
							target={'_blank'}
							rel="noreferrer">
							Learn more
						</a> */}
					</ul>
					<div className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Donation scenarios
					</div>
					<p className="pb-4">
					The amount released to pastoralists depends on the NDVI value at the end of the campaign period. The funds will be split 50/50 between the two regions.
					Below are the scenarios for each region:
					</p>
					<p className="font-semibold mb-2">Kajiado:</p>
					<ul className="list-disc marker:text-[#000000] list-disc pl-5 space-y-3 mb-4">
						<li><span className="font-bold">100% </span> - if the NDVI is at or below 1.50</li>
						<li><span className="font-bold">50% </span> - if the NDVI is at 1.53</li>
						<li><span className="font-bold">0% </span> - if the NDVI is at or above 1.56</li>
					</ul>
					<p className="font-semibold mb-2">Laikipia:</p>
					<ul className="list-disc marker:text-[#000000] list-disc pl-5 space-y-3 mb-2">
						<li><span className="font-bold">100% </span> - if the NDVI is at or below 1.54</li>
						<li><span className="font-bold">25% </span> - if the NDVI is at 1.60</li>
						<li><span className="font-bold">0% </span> - if the NDVI is at or above 1.62</li>
					</ul>
				</div>
			</div>

			{/* <div className="flex items-center justify-center mt-8 lg:mt-0 h-full lg:w-[1440px] lg:h-[630px]">
				<Image
					className="object-contain h-full"
					width="800"
					height="800"
					src="/Images/pastoralists_4_payoff_profile_kajiado.png"
					alt="Modern building architecture"
				/>
			</div> */}
		</div>
	</section>
)
