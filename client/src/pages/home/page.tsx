import Header from './components/Header';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import DifferentiatorsSection from './components/DifferentiatorsSection';
import Footer from './components/Footer';

export default function HomePage() {
  // AOS is initialized globally in main.tsx

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <StatsSection />
      <DifferentiatorsSection />
      <Footer />
    </div>
  );
}
