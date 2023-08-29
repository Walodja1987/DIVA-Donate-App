import Image from 'next/image'
import { InfoCard } from '../InfoCard'

export const InfoSection = () => (
	<section className="pt-[9rem] px-4">
		<div className="mx-auto max-w-7xl   sm:px-6 text-center lg:items-center lg:justify-between">
			<h1 className="font-lora font-semibold text-[30px] md:text-[60px] md:leading-[76.8px] text-[#042940]">
				Why Conditional Donations?
			</h1>
			<p className="font-semibold font-openSans text-[15px] md:text-[20px] mt-6 text-[#005C53] ">
				Increasing effectiveness
			</p>
			<hr className="w-[15rem] md:w-[25rem] h-[8px] mx-auto bg-[#9FC131] border-0 rounded-[20px] mt-6" />
		</div>

		<div className="container mt-10 flex flex-col lg:flex-row justify-center md:justify-around mx-auto md:p-6">
			<div className="h-[260px] md:w-[520px] md:h-[560px] flex justify-center w-full">
				<Image
					className="object-contain"
					width="520"
					height="560"
					src="/Images/ConditionalDonationimg.png"
					alt="Conditional Donation"
				/>
			</div>

			<div className="w-full pt-8 md:p-[2rem] pb-[2rem] grid gap-4 md:gap-2 lg:gap-[24px] grid-rows-3">
				<InfoCard
					cardPadding="p-4 md:p-6"
					cardWidth="w-auto md:w-full"
					cardRadius="20px"
					title="Targeted"
					paragraph="Donations are released when beneficiaries are in actual need"
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
					title="Parametric"
					paragraph="The underlying event is measurable and its verification is detached from any potential external bias"
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
					title="Pro-active"
					paragraph="Reduces delays in fund release as available resources have been deposited in advance"
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
