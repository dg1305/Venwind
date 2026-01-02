import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getCMSData, normalizeImageUrl } from '../../../utils/cms';

interface BenefitItem {
  title: string;
  content: string | React.ReactNode;
}

interface BenefitsContent {
  title?: string;
  imageUrl?: string;
  items?: BenefitItem[];
}

const defaultBenefits: BenefitItem[] = [
  { title: 'Improved Power Generation', content: (
    <ul className="list-disc pl-5 space-y-2">
      <li>Higher wind energy utilization and adaptability</li>
      <li>Large rotor diameter and higher hub height for its class</li>
      <li>Lesser BOP and O&M costs due to larger size resulting in improved LCOE</li>
    </ul>
  ) },
  { title: 'Technology optimization', content: 'Optimized design strategy to get advantage of permanent magnet generator at medium speed' },
  { title: 'Lesser maintenance', content: 'Medium speed Gearbox (MSPM) design ensures minimum maintenance and high reliability' },
  { title: 'Reliability', content: 'German technology with more than 2GW installations of the 5.3MW WTG platform worldwide by Vensys technology partners' },
];

export default function BenefitsSection() {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [content, setContent] = useState<BenefitsContent>({
    title: 'Other Benefits',
    items: defaultBenefits,
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
        const result = await getCMSData('technology', 'benefits', {
          defaultValue: { title: 'Other Benefits', items: defaultBenefits },
        });
        setContent({
          title: result.data.title || 'Other Benefits',
          imageUrl: result.data.imageUrl && result.data.imageUrl.trim() ? result.data.imageUrl : undefined,
          items: (result.data.items && result.data.items.length > 0) ? result.data.items : defaultBenefits,
        });
      } catch (error) {
        console.error('Error loading benefits content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    const handleCmsUpdate = (e: CustomEvent) => {
      if (e.detail.page === 'technology' && e.detail.section === 'benefits') {
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  const benefits = content.items || defaultBenefits;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
          {content.imageUrl && (
            <div data-aos="fade-right" className="hidden lg:block h-full">
              <div className="h-full flex items-center">
                <img
                  src={normalizeImageUrl(content.imageUrl)}
                  alt="Wind Turbine Benefits"
                  className="w-full h-full max-h-[600px] object-cover rounded-lg"
                />
              </div>
            </div>
          )}

          <div data-aos="fade-left" className="flex flex-col justify-center">
            <h2 className="text-gray-900 text-4xl lg:text-5xl font-bold mb-8">
              {content.title || 'Other Benefits'}
            </h2>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                    className="w-full flex items-center justify-between py-4 text-left transition-colors cursor-pointer"
                    style={{ color: openIndex === index ? '#8DC63F' : '#111827' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#8DC63F'}
                    onMouseLeave={(e) => e.currentTarget.style.color = openIndex === index ? '#8DC63F' : '#111827'}
                  >
                    <span className="text-lg font-semibold pr-4">
                      {benefit.title}
                    </span>
                    <i className={`${openIndex === index ? 'ri-subtract-line' : 'ri-add-line'} text-2xl text-gray-600 flex-shrink-0`}></i>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
                    }`}
                  >
                    <div className="text-gray-700 text-base leading-relaxed">
                      {typeof benefit.content === 'string' ? benefit.content : benefit.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
