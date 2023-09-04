import { InfoCard } from '../InfoCard'
import Image from 'next/image'

export const FeatureSection = () => (
	<section className="pt-[5rem] px-4">
		<div className="mx-auto max-w-7xl sm:px-6 text-center lg:items-center lg:justify-between">
			<h1 className="font-lora font-semibold text-4xl lg:text-[60px] lg:leading-[76.8px] text-[#042940]">
				Why Smart Contracts?
			</h1>
			<p className="font-semibold font-openSans text-[15px] md:text-[20px] mt-6 text-[#005C53] ">
				Increasing efficiency and transparency
			</p>
			<hr className="w-[15rem] md:w-[25rem] h-[8px] mx-auto bg-[#9FC131] border-0 rounded-[20px] mt-6" />
		</div>
		<div className="container mt-10 flex flex-col lg:flex-row-reverse justify-center md:justify-around mx-auto md:p-6">
			<div className="h-[358px] lg:w-[520px] md:h-[560px] flex justify-center w-full">
				<Image
					className=" lg:ml-10 object-contain"
					width="520"
					height="560"
					src="/Images/SmartContractsimg.png"
					alt="Conditional Donation"
				/>
			</div>

			<div className="w-full pt-8 md:p-[2rem] pb-[2rem] grid gap-4 lg:gap-[24px] grid-rows-3">
				<InfoCard
					cardPadding="p-4 md:p-6"
					cardWidth="w-auto md:w-full"
					cardRadius="20px"
					title="Transparent"
					paragraph="Donation flows are transparent and auditable on the blockchain"
					paragraphColor="text-[#042940]"
					titleSize="text-[23px] md:text-[46px]"
					paragraphSize="text-sm md:text-base"
					titleColor="text-[#042940]"
					cardColor="bg-[#DEEFE7]"
				/>

				<InfoCard
					cardPadding="p-4 md:p-6"
					cardWidth="w-auto md:w-full"
					cardRadius="20px"
					title="Trustless"
					paragraph="Funds are held in a programmatic escrow eliminating the risk of misuse"
					paragraphColor="text-[#042940]"
					titleSize="text-[23px] md:text-[46px]"
					paragraphSize="text-sm md:text-base"
					titleColor="text-[#042940]"
					cardColor="bg-[#DEEFE7]"
				/>

				<InfoCard
					cardPadding="p-4 md:p-6"
					cardWidth="w-auto md:w-full"
					cardRadius="20px"
					title="Cost-efficient"
					paragraph="Programmatically enforced rules remove the need for manual processes"
					paragraphColor="text-[#042940]"
					titleSize="text-[23px] md:text-[46px]"
					paragraphSize="text-sm md:text-base"
					titleColor="text-[#042940]"
					cardColor="bg-[#DEEFE7]"
				/>
			</div>
		</div>
	</section>
)
