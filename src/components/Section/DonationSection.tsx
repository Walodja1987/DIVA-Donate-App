import Image from 'next/image'

type DonationDetail = {
	title: string
	description: string
	image: string
}

const DONATION_SPECIFICATIONS: DonationDetail[] = [
	{
		title: 'Trigger metric',
		description: '1 + Average NDVI (1 Mar - 31 May 2023)',
		image: '/Images/rain.png',
	},
	{
		title: 'Expiry',
		description: '11 June 2023, 8:00pm UTC',
		image: '/Images/Expiry.png',
	},
	{
		title: 'Reporter',
		description: 'Shamba Network',
		image: '/Images/Reporter.png',
	},
	{
		title: 'Data source',
		description: 'MODIS satellite data',
		image: '/Images/Data.png',
	},
]

const DonationItem: React.FC<DonationDetail> = ({
	title,
	description,
	image,
}) => (
	<div className="rounded-xl">
		<div className="lg:pr-[10rem] w-full overflow-visible relative mx-auto shadow-lg ring-1 ring-black/5 rounded-xl flex items-center lg:gap-6 bg-[#DEEFE7]">
			<Image
				className="absolute -left-8 w-20 md:w-24 md:h-24 rounded-full shadow-lg"
				src={image}
				width={100}
				height={100}
				alt={`Icon for ${title}`}
			/>
			<div className="flex flex-col justify-center lg:text-4xl text-left py-2 pl-16 lg:pl-24 min-h-[80px] pr-3">
				<strong className="text-[#005C53] font-semibold font-['lora']">
					{title}
				</strong>
				<span className="text-[#042940] text-xs lg:text-xl font font-['Open_Sans'] pt-2">
					{description}
				</span>
			</div>
		</div>
	</div>
)

export const DonationSection: React.FC = () => {
	return (
		<div className="flex justify-center w-full">
			<div className="mx-auto lg:mx-0 px-6 lg:px-0 lg:max-w-screen-2xl">
				<div className="py-4 text-center lg:items-center lg:justify-between">
					<h1 className="font-semibold text-4xl lg:text-6xl xl:text-6xl leading-[4.75rem] text-[#042940]">
						Donation Details
					</h1>
					<hr className="w-[15rem] h-[8px] mx-auto bg-[#9FC131] border-0 rounded-[20px] my-2" />
				</div>

				<div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between lg:px-4 py-8 gap-8 lg:gap-40 lg:py-16">
					<div className="flex flex-col gap-6 lg:gap-12 lg:w-auto pl-8">
						{DONATION_SPECIFICATIONS.map((donation) => (
							<DonationItem key={donation.title} {...donation} />
						))}
					</div>

					<div className="lg:mt-0 lg:flex w-full lg:w-[450px] mt-10">
						<Image
							className="w-full"
							width="800"
							height="800"
							src="/Images/Donationprofile.png"
							alt="Modern building architecture"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
