import React from 'react'
import Layout from '../components/Layout/Layout'
import { CampaignCard } from '../components/Section/CampaignCard'
import { AboutSectionPastoralists3 } from '../components/Section/AboutSectionPastoralists3'
import { DonationSection3 } from '../components/Section/DonationSection3'
import { LinkSectionPastoralists3 } from '../components/Section/LinkSectionPastoralists3'
import { TopDonorsTable } from '../components/Section/TopDonorsTable'
import campaigns from '../../config/campaigns.json'

export default function Pastoralists() {
	// Specify the campaignId from `campaign.json` file that you want to display on the page
	const campaignId = 'test_settled_dUSD_arbitrum'
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
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore: Temporarily ignore type error, fix later
					campaign={campaign}
					thankYouMessage="Thank you for providing livestock insurance to pastoralists in Kenya."
				/>
				<AboutSectionPastoralists3 />
				<DonationSection3 />
				{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
				{/* @ts-ignore: Temporarily ignore type error, fix later */}
				<TopDonorsTable campaign={campaign} />
				<LinkSectionPastoralists3 />
			</main>
		</Layout>
	)
}
