import React from 'react'
import Layout from '../../components/Layout/Layout'
import { CampaignCard } from '../../components/Section/CampaignCard'
import { AboutSectionPastoralists5 } from '../../components/Section/AboutSectionPastoralists5'
import { DonationSectionMulti5 } from '../../components/Section/DonationSectionMulti5'
import { LinkSectionPastoralists5 } from '../../components/Section/LinkSectionPastoralists5'
import { TopDonorsTable } from '../../components/Section/TopDonorsTable'
import campaigns from '../../../config/campaigns.json'

export default function Pastoralists() {
	// Specify the campaignId from `campaign.json` file that you want to display on the page
	const campaignId = 'pastoralists_5'
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
					thankYouMessage="Thank you for providing parametric drought insurance for pastoralists in Kenya 🙏"
				/>
				<AboutSectionPastoralists5 />
				<DonationSectionMulti5 />
				{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
				{/* @ts-ignore: Temporarily ignore type error, fix later */}
				<TopDonorsTable campaign={campaign} />
				<LinkSectionPastoralists5 />
			</main>
		</Layout>
	)
}
