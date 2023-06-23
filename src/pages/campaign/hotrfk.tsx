import Layout from "../../components/Layout/Layout";
import { CampaingCard } from "../../components/Section/CampaingCard";
import { AboutSection } from "../../components/Section/AboutSection";
import { DonationSection } from "../../components/Section/DonationSection";
import { HRLinkSection } from "../../components/Section/HRLinkSection";

export default function Pastoralists() {
    return (
        <main className="h-full w-full relative">
            <Layout>
                <div className="bg-[#F3FDF8]">
                    <CampaingCard
                        poolId={'0xf9ea1671ddca4aaad1df33257cd2040c656064c9bb628102dd3c68431d1baaaf'}
                        collateralTokenAddress={'0xc2132d05d31c914a87c6611c10748aeb04b58e8f'}
                        divaContractAddress={'0x2C9c47E7d254e493f02acfB410864b9a86c28e1D'}
                        multisig={'0x2e33876D29BAC51e1FFD128659BF9D36ba13259D'}
                    />
                </div>
                <HRLinkSection />
            </Layout>
        </main>
    );
}
