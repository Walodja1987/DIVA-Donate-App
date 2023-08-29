import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
	return (
		<section className="relative justify-center bg-[#F3FDF8] pt-10 md:pt-0">
			<div className="container mx-auto md:gap-[7rem] flex flex-col md:flex-row justify-center sm:pt-[8rem] md:pt-[8rem] px-4 md:px-0">
				<div className="flex flex-col justify-center rounded-sm lg:text-left ">
					<h1 className="text-[40px] md:text-[80px] font-semibold text-[#042940] font-lora">
						Event-Driven
						<br /> Conditional
						<br /> Donations
					</h1>
					<div className="mt-6 font-openSans text-[15px] md:text-[20px] font-semibold text-[#005C53] ">
						A novel donation model enabled by blockchain technology
						<br />
						<p className="font-openSans text-[15px] md:text-[20px] font-light text-[#042940]">
							Powered by DIVA Protocol
						</p>
					</div>

					<div className="flex flex-col mt-6 space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
						<button
							onClick={() => {
								window.scrollBy(0, 2750)
							}}
							className="font-openSans rounded-lg bg-[#042940] justify-center text-white font-bold py-4 px-10 inline-flex items-center">
							<Image
								className="mr-3"
								width="24"
								height="24"
								src="/Images/donate-light-icon.svg"
								alt="donate-light-icon"
							/>
							<span className="font-openSans">Donate</span>
						</button>
						<Link href="/faq">
							<button className="inline-block font-openSans rounded-lg px-10 py-4 text-base font-semibold text-[#042940] ring-1 ring-[#042940] w-full ">
								Learn More
							</button>
						</Link>
					</div>
				</div>
				<div className="z-5 mt-[1rem] -mb-[5rem]  md:block flex justify-center">
					<div className="w-[300px] h-[300px] md:w-[800px] md:h-[800px]">
						<Image
							className="object-contain"
							width="800"
							height="800"
							src="/Images/landing-illustration.png"
							alt="Modern building architecture"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
