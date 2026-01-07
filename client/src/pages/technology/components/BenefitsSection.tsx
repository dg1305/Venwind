import { useState, useEffect, useRef } from 'react';
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
  const contentRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

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
    <section className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center py-28">
      {/* Image Left */}
      {content.imageUrl && (
        <div ref={imageContainerRef} className="col-span-12 lg:col-span-6 hidden lg:block p-0" data-aos="fade-right">
          <div className="w-full overflow-hidden">
            <img
              src={normalizeImageUrl(content.imageUrl)}
              alt="Wind Turbine Benefits"
              className="w-full h-auto object-contain max-h-[680px]"
            />
          </div>
        </div>
      )}

      {/* Content Right */}
      <div ref={contentRef} className={`${content.imageUrl ? 'col-span-12 lg:col-span-6' : 'col-span-12'} pt-20`} data-aos="fade-left">
        <h2 className="text-gray-900 text-3xl font-semibold mb-6">
          {content.title || 'Other Benefits'}
        </h2>
        
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="border-b border-gray-200">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full flex items-center justify-between py-3 text-left transition-colors cursor-pointer"
                style={{ color: openIndex === index ? '#8DC63F' : '#111827' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#8DC63F'}
                onMouseLeave={(e) => e.currentTarget.style.color = openIndex === index ? '#8DC63F' : '#111827'}
              >
                <span className="text-base font-semibold pr-4">
                  {benefit.title}
                </span>
                <i className={`${openIndex === index ? 'ri-subtract-line' : 'ri-add-line'} text-2xl text-gray-600 flex-shrink-0`}></i>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-3' : 'max-h-0'
                }`}
              >
                <div className="text-gray-700 text-sm leading-relaxed">
                  {typeof benefit.content === 'string' ? benefit.content : benefit.content}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}