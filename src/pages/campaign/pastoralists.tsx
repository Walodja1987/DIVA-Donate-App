import Layout from "../../components/Layout/Layout";
import { CampaignCard } from "../../components/Section/CampaignCard";
import { AboutSection } from "../../components/Section/AboutSection";
import { DonationSection } from "../../components/Section/DonationSection";
import { LinkSection } from "../../components/Section/LinkSection";

export default function Pastoralists() {
  return (
    <main className="h-full w-full relative">
      <Layout>
        <div className="bg-[#F3FDF8]">
          <CampaignCard
              poolId={8}
              collateralTokenAddress={'0xc2132D05D31c914a87C6611C10748AEb04B58e8F'}
              divaContractAddress={'0xFf7d52432B19521276962B67FFB432eCcA609148'}
              multisig={'0x2e33876D29BAC51e1FFD128659BF9D36ba13259D'}
          />
        </div>
        <AboutSection />
        <DonationSection />
        <LinkSection />
      </Layout>
    </main>
  );
}
