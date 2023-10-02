import React from 'react'
import Layout from '../../components/Layout/Layout'
import { CampaignCard } from '../../components/Section/CampaignCard'
import { AboutSection } from '../../components/Section/AboutSection'
import { DonationSection } from '../../components/Section/DonationSection'
import { LinkSection } from '../../components/Section/LinkSection'
import campaigns from '../../../config/campaigns.json'

export default function Pastoralists() {
	const campaignId = 'pastoralists_1'
	const campaign = campaigns.find((c) => c.campaignId === campaignId)

	// If campaign is undefined, return null to avoid rendering the component
	if (!campaign) {
		return null
	}

	// @todo
	// - Consider adding another prop for Thank you message at the top of the donation widget
	return (
		<Layout>
			<main className="relative overflow-x-hidden">
				<CampaignCard
					campaign={campaign}
					thankYouMessage="Thank you for providing livestock insurance to pastoralists in Kenya."
				/>
				<AboutSection />
				<DonationSection />
				<LinkSection />
			</main>
		</Layout>
	)
}
