import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import HeroSection from './components/HeroSection';
import ApplicationSection from './components/ApplicationSection';

export default function CareersPage() {
  // AOS is initialized globally in main.tsx

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ApplicationSection />
      <Footer />
    </div>
  );
}
