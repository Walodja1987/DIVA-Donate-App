import { InfoCard } from '../InfoCard'
import Image from 'next/image'

export const AboutSectionPastoralists2 = () => (
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
							Pastoralists are people whose primary source of income and food is livestock and livestock products. 
							Pastoralist communities live a nomadic lifestyle which entails grazing animals on open-access 
							pastures and migrating with them in response to seasonal variations.
							<br />
							<br />
							Changing weather patterns induced by climate change are threatening the livelihoods of pastoralists communities
							in the eastern Horn of Africa. The region is experiencing one of the worst droughts which already resulted in the loss of over 7 million livestock 
							and put millions at risk of starvation in Ethiopia, Kenya, and Somalia. 
							<br />
							<br />
							The goal of this campaign is to provide financial support to enrolled pastoralists in the Kenyan counties Kajiado and Laikipia if the pasture
							conditions, as measured by remote-sensed technology, are deemed distressful. The target cover amount of $75 per pastoralist intends to subsidize 
							the provision of food for one livestock animal over a period of six months.
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
						className="list-none font-openSans text-base font-normal mb-8 ">
						<li>
						This campaign is a joint initiative between Mercy Corps Ventures, Fortune Credit, Shamba Network, and 
							DIVA Technologies to test the use of blockchain and smart contracts to deliver anticipatory cash transfers 
							ahead of climate shocks to pastoralist communities in the Horn of Africa.
							{' '}
							<a
								href="https://agfundernews.com/mercy-corps-ventures-pilots-the-blockchain-to-get-cash-transfers-to-communities-ahead-of-climate-shock"
								className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
								target={'_blank'}
								rel="noreferrer">
								Learn more
							</a>
						</li>
					</ul>
					<h1 className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Campaign goal
					</h1>
					<ul
						role="list"
						className="list-disc marker:text-[#000000] list-disc pl-5 space-y-3  mb-8">
						<li>333 Pastoralists</li>
						<li>
							$75 target cover amount per pastoralist
						</li>
						<li>$25’000 total cover for the campaign</li>
					</ul>
					<div className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Beneficiaries
					</div>
					<ul
						role="list"
						className="list-disc marker:text-[#000000] list-disc pl-5 space-y-3  mb-8">
						<li>Pastoralists in Kajiado and Laikipia (Kenyan counties)</li>
					</ul>
					<div className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Trigger metric
					</div>
					<ul className="list-disc mb-8">
						The pasture conditions are assessed using an indicator called NDVI (Normalized Difference Vegetation Index).
						The NDVI is a widely-used metric for quantifying the health and density of vegetation using sensor data.
						It serves as a reasonable metric for assessing drought as vegetation density generally correlates with rainfall patterns.
						<br></br>
						<br></br>
						For this campaign, the average NDVI observed between 1st October and
						22th December 2023 is used and reported by the Shamba oracle on 2nd
						January 2024 to ensure full data coverage of the observation period. The
						NDVI is shifted by 1 for technical reasons. The donation release profiles for each pilot location 
						were derived based on in-depth analysis of historical NDVI patterns in the respective regions.
						{' '}
						<a
							href="https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index"
							className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
							target={'_blank'}
							rel="noreferrer">
							Learn more
						</a>
					</ul>
					<div className="font-semibold text-2xl font-['lora'] text-[#042940] m-auto leading-normal mb-2">
						Donation scenarios
					</div>
					<p className="pb-4">
						The examples provided below illustrate the released donation amounts in % of the deposited funds in specific sample scenarios.
						These scenarios are based on the donation profiles for the respective pilot locations, with a 50/50 weighting.
					</p>
					<ul
						role="list"
						className="list-disc marker:text-[#000000] list-disc pl-5 space-y-3  mb-2">
						<li>
							{' '}
							<a className="font-bold" target="_blank">
								100%{' '}
							</a>
							- if the trigger metric is at or below 1.45 for Kajiado and at or below 1.54 for Laikipia
						</li>
						<li>
							<a className="font-bold" target="_blank">
								50%{' '}
							</a>{' '}
							- if the trigger metric is at or below 1.45 for Kajiado and at or above 1.64 for Laikipia
						</li>
						<li>
							<a className="font-bold" target="_blank">
								20%{' '}
							</a>{' '}
							- if the trigger metric is at 1.47 for Kajiado and 1.59 for Laikipia
						</li>
						<li>
							<a className="font-bold" target="_blank">
								0%{' '}
							</a>{' '}
							- if the trigger metric is at or above 1.51 for Kajiado and at or above 1.64 for Laikipia
						</li>
					</ul>
				</div>
			</div>

			<div className="flex items-center justify-center mt-8 lg:mt-0 h-full lg:w-[1440px] lg:h-[630px]">
				<Image
					className="object-contain h-full"
					width="800"
					height="800"
					src="/Images/CampingImage.png"
					alt="Modern building architecture"
				/>
			</div>
		</div>
	</section>
)
