import React from 'react'
import Layout from '../../components/Layout/Layout'
import { CampaignCard } from '../../components/Section/CampaignCard'
import { AboutSectionPastoralists4 } from '../../components/Section/AboutSectionPastoralists4'
import { DonationSection4 } from '../../components/Section/DonationSection4'
import { LinkSectionPastoralists4 } from '../../components/Section/LinkSectionPastoralists4'
import { TopDonorsTable } from '../../components/Section/TopDonorsTable'
import campaigns from '../../../config/campaigns.json'

export default function Pastoralists() {
	// Specify the campaignId from `campaign.json` file that you want to display on the page
	const campaignId = 'pastoralists_4'
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
					thankYouMessage="Thank you for providing drought insurance for pastoralists in Kenya. 🙏"
				/>
				<AboutSectionPastoralists4 />
				<DonationSection4 />
				{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
				{/* @ts-ignore: Temporarily ignore type error, fix later */}
				<TopDonorsTable campaign={campaign} />
				<LinkSectionPastoralists4 />
			</main>
		</Layout>
	)
}