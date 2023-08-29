import Layout from '../components/Layout/Layout'
import HeroSection from '../components/Section/HeroSection'
import { InfoSection } from '../components/Section/InfoSection'
import { FeatureSection } from '../components/Section/FeatureSection'
import { CampaignSection } from '../components/Section/CampaignSection'
import { WorkSection } from '../components/Section/WorkSection'

// @todo Add FooterSection?
export default function Home() {
	return (
		<main className="h-full w-full">
			<div className="sm:block sm:visible">
				<Layout>
					<div className="w-full overflow-x-hidden pt-20 lg:pt-0">
						<HeroSection />
						<InfoSection />
						<FeatureSection />
						<CampaignSection />
						<WorkSection />
					</div>
				</Layout>
			</div>
			{/* <div className="pt-[20rem] sm:invisible sm:hidden">
              <InfoCard
                  cardPadding="p-4 md:p-8"
                  cardWidth="w-auto md:w-full text-center"
                  cardRadius="20px"
                  title="Mobile is currently not supported. Please check on a desktop computer."
                  paragraph=""
                  paragraphColor="text-[#042940]"
                  titleSize="text-[23px] md:text-[46px]"
                  paragraphSize="text-sm md:text-base"
                  titleColor="text-[#042940]"
                  cardColor="bg-[#DEEFE7]"
              />
          </div> */}
		</main>
	)
}
