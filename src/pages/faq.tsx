import Navbar from '../components/Layout/Navbar'
import { FooterSection } from '../components/Section/FooterSection'
import FAQContent from '../components/Section/FAQContent'
import Layout from '../components/Layout/Layout'

export default function Faq() {
	return (
		<main className="relative">
			<Layout>
				<div className="justify-center px-4  lg:yx-auto  pt-16 md:pt-[10rem] pb-[21rem] bg-[#F3FDF8]">
				<div className="pb-10 flex flex-col items-center justify-center">
					<h1 className="font-lora text-4xl md:text-[60px] text-center lg:text-left">
						FAQ
					</h1>
					<hr className="w-48 h-[8px] mx-auto bg-[#9FC131] border-0 rounded-[20px] mt-5" />
				</div>
					<FAQContent />
				</div>
			</Layout>
		</main>
	)
}
