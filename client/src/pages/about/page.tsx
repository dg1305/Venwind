import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import HeroSection from './components/HeroSection';
import IntroductionSection from './components/IntroductionSection';
import VisionMissionSection from './components/VisionMissionSection';
import PartnershipSection from './components/PartnershipSection';

export default function AboutUs() {
  // AOS is initialized globally in main.tsx

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <IntroductionSection />
      <VisionMissionSection />
      <PartnershipSection />
      <Footer />
    </div>
  );
}
