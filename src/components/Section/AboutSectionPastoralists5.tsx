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
							This campaign represents the <strong>5th iteration</strong> in the series dedicated to providing <strong>anticipatory cash transfers to Kenyan pastoralists </strong>
							which are disproportionately affected by climate-change-induced drought.
							<br />
							<br />
							<h1 className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Context
					</h1>
							<strong>Pastoral communities live a nomadic lifestyle</strong>, grazing animals on open-access 
							pastures and migrating with them in response to seasonal variations.
							Livestock and livestock products serve as their primary sources of income and food. 
							<br />
							<br />
							However, changing weather patterns induced by climate change are threatening the livelihoods of these communities. Over the past decade,
							Kenya has experienced severe droughts which have decimated the pastoralists&apos; livestock and put the pastoral communities at risk of starvation. 
							<br />
							<br />
								Kenya&apos;s climate naturally fluctuates between rainy and dry seasons. Rainfall during the rainy season
								stimulates vegetation growth, which provides necessary pasture for livestock in the coming dry season. 
								<strong> Consequently, sufficient vegetation and fodder at the end of the rainy season are crucial for sustaining livestock and,
								by extension, the livelihoods of pastoral communities throughout the subsequent dry season.</strong>
								<br />
								<br />
								The <strong>long rains</strong> season begins in mid-March and lasts until May/June, followed by a predominantly dry period
								until October, during which vegetation levels gradually decline. The <strong>short rains</strong> arrive in mid-October and
								continue through November and December, leading into a hot, typically rainless dry season lasting until March.
							{/* <br />
							<br />
							This campaign is a joint initiative between Mercy Corps Ventures, Fortune Credit, Shamba Network, and 
							DIVA Technologies to test the use of blockchain and smart contracts to deliver anticipatory cash transfers 
							ahead of climate shocks to pastoral communities in the Horn of Africa. */}
						</li>{' '}
					</ul>

					<h1 className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Campaign goal
					</h1>
					<ul className="list-none font-openSans text-base font-normal mb-4">
						<li>
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
							The target cover amount of <strong>$75 per pastoralist</strong> intends to subsidize 
							the provision of <strong>food for one livestock animal over a period of six months</strong>.
							<br />
							<br />
							The campaign goals are summarized below:
						</li>
					</ul>
					<ul
						role="list"
						className="list-disc marker:text-[#000000] list-disc pl-10 space-y-3 text-base mb-8">
						<li><strong>533</strong> Pastoralists</li>
						<li><strong>$75</strong> target cover amount per pastoralist</li>
						<li><strong>$40,000</strong> total cover for the campaign</li>
					</ul>

					<h1 className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Partners
					</h1>
					
					<ul className="list-none font-openSans text-base font-normal mb-8">
						<li>
							This campaign takes place in <strong>partnership with Ripple</strong> and utilizes their new stablecoin RLUSD, demonstrating its applicability in humanitarian
							aid and disaster relief. Ripple has generously contributed <strong>$25,000</strong> to support this campaign. Additionally, approximately <strong> $12,000 </strong>
							which remained unreleased in previous campaigns (funds received from Mercy Corps Ventures and Arbitrum) have been rolled into this campaign to further amplify the impact.
							{/* {' '}
							<a
								href="https://agfundernews.com/mercy-corps-ventures-pilots-the-blockchain-to-get-cash-transfers-to-communities-ahead-of-climate-shock"
								className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
								target={'_blank'}
								rel="noreferrer">
								Learn more
							</a> */}
						</li>
					</ul>
					
					<div className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Beneficiaries
					</div>
					<ul
						role="list"
						className="list-disc marker:text-[#000000] list-disc pl-10 space-y-3  mb-8">
						<li>Pastoralists in the Kenyan County of Laikipia (North)</li>
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
						For this campaign, the NDVI as at 31 May 2025 within the eVIIRS dataset, 
						as published on the 
						{' '}
						<a
							href="https://earlywarning.usgs.gov/fews/ewx/index.html"
							className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
							target={'_blank'}
							rel="noreferrer">
							USGS FEWS NET Early Warning System website
						</a>
						, will be used. These values will be reported via the DIVA Donate Multisig on 7 June 2025.
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
					Payouts to pastoralists are determined by the NDVI values measured on 31 May 2025.
					Below are the payouts in % of contributed funds based on different (shifted) NDVI scenarios:
					</p>
					<ul className="list-disc marker:text-[#000000] list-disc pl-5 space-y-3 mb-2">
						<li><span className="font-bold">100% </span> - if the NDVI is at or below 1.55</li>
						<li><span className="font-bold">67% </span> - if the NDVI is at 1.57</li>
						<li><span className="font-bold">0% </span> - if the NDVI is at or above 1.61</li>
					</ul>
					For details on the derivation of these threshold, see our
					{' '}
						<a
							href="https://divadonate.xyz/posts/diva-conditional-donations-pastoralists-5"
							className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
							target={'_blank'}
							rel="noreferrer">
							blog post
						</a>.
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
