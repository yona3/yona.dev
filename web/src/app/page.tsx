import { PortfolioList } from "@/features/portfolio";
import { getAllWorks } from "@/features/portfolio/services/PortfolioService";
import { ProfileSection } from "@/features/profile";
import { ProfileHero } from "@/features/profile/components/ProfileHero";
import { getProfileData } from "@/features/profile/services/ProfileService";
import { Layout } from "@/shared/components/Layout";

const HomePage = () => {
  const profileData = getProfileData();
  const works = getAllWorks();

  return (
    <Layout>
      <div>
        <ProfileHero />
        <ProfileSection profileData={profileData} />
        <PortfolioList works={works} />
      </div>
    </Layout>
  );
};

export default HomePage;
