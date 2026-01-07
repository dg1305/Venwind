import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getCMSData } from '../../../utils/cms';

interface HeroContent {
  title?: string;
  bgImageUrl?: string;
}

export default function HeroSection() {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'Products',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });

    const fetchContent = async () => {
      try {
        const result = await getCMSData('products', 'hero', {
          defaultValue: { title: 'Products' },
        });
        setHeroContent(result.data);
      } catch (error) {
        console.error('Error loading hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    const handleCmsUpdate = (e: CustomEvent) => {
      if (e.detail.page === 'products' && e.detail.section === 'hero') {
        fetchContent();
      }
    };
    window.addEventListener('cmsUpdate', handleCmsUpdate as EventListener);

    return () => {
      window.removeEventListener('cmsUpdate', handleCmsUpdate as EventListener);
    };
  }, []);

  if (loading) {
    return (
      <section className="relative h-[350px] w-full overflow-hidden bg-cover bg-center flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section 
        className="relative h-[350px] w-full overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: heroContent.bgImageUrl 
            ? `url(${heroContent.bgImageUrl})` 
            : 'url(https://readdy.ai/api/search-image?query=Modern%20wind%20turbines%20farm%20against%20clear%20blue%20sky%2C%20renewable%20energy%20infrastructure%2C%20clean%20technology%2C%20sustainable%20power%20generation%2C%20white%20wind%20turbines%20with%20three%20blades%20rotating%2C%20green%20energy%20landscape%2C%20environmental%20conservation%2C%20industrial%20wind%20power%20installation%2C%20bright%20daylight%20scene%20with%20minimal%20clouds&width=1920&height=500&seq=products-hero-bg&orientation=landscape)',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-6xl font-bold">{heroContent.title || 'Products'}</h1>
        </div>
      </section>
  );
}
