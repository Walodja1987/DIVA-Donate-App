import Navbar from '../components/Layout/Navbar'
import { FooterSection } from '../components/Section/FooterSection'
import FAQContent from '../components/Section/FAQContent'
import Layout from '../components/Layout/Layout'

export default function Faq() {
	return (
		<main className="relative">
			<Layout>
				<div className="justify-center px-4  lg:yx-auto  pt-16 md:pt-[10rem] pb-[21rem] bg-[#F3FDF8]">
					<FAQContent />
				</div>
			</Layout>
		</main>
	)
}
