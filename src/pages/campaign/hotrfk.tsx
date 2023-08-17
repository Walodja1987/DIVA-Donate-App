import Layout from "../../components/Layout/Layout";
import { CampaignCard } from "../../components/Section/CampaignCard";
import { AboutSection } from "../../components/Section/AboutSection";
import { DonationSection } from "../../components/Section/DonationSection";
import { HRLinkSection } from "../../components/Section/HRLinkSection";
import campaigns from '../../../config/campaigns.json'


export default function Pastoralists() {
    // Specify the campaignId from `campaign.json` file that you want to display on the page
    const campaignId = "pastoralists_2"
    const campaign = campaigns.find(c => c.campaignId === campaignId);

    // If campaign is undefined, return null to avoid rendering the component
    if (!campaign) {
        return null;
    }
    
    // @todo 
    // - Consider adding another prop for Thank you message at the top of the donation widget
    return (
        <main className="h-full w-full relative">
            <Layout>
                <div className="bg-[#F3FDF8]">
                    <CampaignCard
                        campaign={campaign}
                        thankYouMessage="Thank you for providing livestock insurance to pastoralists in Kenya."
                    />
                </div>
                <HRLinkSection />
            </Layout>
        </main>
    );
}
