import HeroSection from './components/HeroSection';
import CommitmentSection from './components/CommitmentSection';
import FutureGoalsSection from './components/FutureGoalsSection';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';

export default function SustainabilityPage() {
  // AOS is initialized globally in main.tsx

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CommitmentSection />
      <FutureGoalsSection />
      <Footer />
    </div>
  );
}
