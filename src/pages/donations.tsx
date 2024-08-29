import Donations from '@/components/Section/Donations'
import Layout from '@/components/Layout/Layout'

export default function DonationsPage() {
	return (
		<main className="h-full w-full relative">
			<Layout>
				<div className="justify-center yx-auto pt-[5rem] pb-[15rem] bg-[#F3FDF8]">
					<Donations />
				</div>
			</Layout>
		</main>
	)
}
