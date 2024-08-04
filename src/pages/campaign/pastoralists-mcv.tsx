import React from 'react'
import Layout from '../../components/Layout/Layout'
import { CampaignCard } from '../../components/Section/CampaignCard'
import { AboutSectionPastoralists2 } from '../../components/Section/AboutSectionPastoralists2'
import { DonationSectionMulti } from '../../components/Section/DonationSectionMulti'
import { LinkSectionPastoralists2 } from '../../components/Section/LinkSectionPastoralists2'
import { TopDonorsTable } from '../../components/Section/TopDonorsTable'
import campaigns from '../../../config/campaigns.json'

export default function Pastoralists() {
	// Specify the campaignId from `campaign.json` file that you want to display on the page
	const campaignId = 'pastoralists_2'
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
				<AboutSectionPastoralists2 />
				<DonationSectionMulti />
				<TopDonorsTable campaign={campaign} />
				<LinkSectionPastoralists2 />
			</main>
		</Layout>
	)
}
