import React from 'react'
import Layout from '../../components/Layout/Layout'
import { CampaignCard } from '../../components/Section/CampaignCard'
import { AboutSectionPastoralists6 } from '../../components/Section/AboutSectionPastoralists6'
import { DonationSection6 } from '../../components/Section/DonationSection6'
import { LinkSectionPastoralists6 } from '../../components/Section/LinkSectionPastoralists6'
import { TopDonorsTable } from '../../components/Section/TopDonorsTable'
import campaigns from '../../../config/campaigns.json'

export default function Pastoralists() {
	// Specify the campaignId from `campaign.json` file that you want to display on the page
	const campaignId = 'pastoralists_6'
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
					thankYouMessage="Thank you for providing parametric drought protection for pastoralists in Kenya 🙏"
				/>
				<AboutSectionPastoralists6 />
				<DonationSection6 />
				{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
				{/* @ts-ignore: Temporarily ignore type error, fix later */}
				{/* <TopDonorsTable campaign={campaign} /> */}
				<LinkSectionPastoralists6 />
			</main>
		</Layout>
	)
}
