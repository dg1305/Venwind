import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getCMSData, normalizeImageUrl } from '../../../utils/cms';

interface AdvantageItem {
  title: string;
  content: string | React.ReactNode;
}

interface AdvantagesContent {
  title?: string;
  imageUrl?: string;
  items?: AdvantageItem[];
}

const defaultAdvantages: AdvantageItem[] = [
  { title: 'Higher Wind Energy Utilization', content: 'Permanent magnet medium speed technology' },
  { title: 'Larger Rotor Diameter and Higher Hub Heights in its Class', content: 'Captures more wind energy, higher tip speed ratio' },
  { title: 'Flexible Modular Design', content: 'Supports enhancement to higher capacity and higher rotor diameter' },
  { title: 'Supports application scenarios such as energy storage and distributed wind power', content: 'Designed to operate at higher capacities (4.8MW and above)' },
  { title: 'Grid Connection', content: (
    <ul className="list-disc pl-5 space-y-2">
      <li>Operates at a constant power factor, independent of grid voltage</li>
      <li>No need for external grid excitation</li>
    </ul>
  ) },
  { title: 'Low cut-in wind speed', content: 'Cut-in wind speed 2.5m/s' },
];

export default function AdvantagesSection() {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [content, setContent] = useState<AdvantagesContent>({
    title: 'Advantages over Competitors',
    items: defaultAdvantages,
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
        const result = await getCMSData('technology', 'advantages', {
          defaultValue: { title: 'Advantages over Competitors', items: defaultAdvantages },
        });
        setContent({
          title: result.data.title || 'Advantages over Competitors',
          imageUrl: result.data.imageUrl && result.data.imageUrl.trim() ? result.data.imageUrl : undefined,
          items: (result.data.items && result.data.items.length > 0) ? result.data.items : defaultAdvantages,
        });
      } catch (error) {
        console.error('Error loading advantages content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    const handleCmsUpdate = (e: CustomEvent) => {
      if (e.detail.page === 'technology' && e.detail.section === 'advantages') {
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  const advantages = content.items || defaultAdvantages;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-start">
          <div data-aos="fade-right" className="pr-8">
            <h2 className="text-gray-900 text-4xl lg:text-5xl font-bold mb-8">
              {content.title || 'Advantages over Competitors'}
            </h2>
            
            <div className="space-y-4">
              {advantages.map((advantage, index) => (
                <div key={index} className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                    className="w-full flex items-center justify-between py-4 text-left transition-colors cursor-pointer"
                    style={{ color: openIndex === index ? '#8DC63F' : '#111827' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#8DC63F'}
                    onMouseLeave={(e) => e.currentTarget.style.color = openIndex === index ? '#8DC63F' : '#111827'}
                  >
                    <span className="text-lg font-semibold pr-4">
                      {advantage.title}
                    </span>
                    <i className={`${openIndex === index ? 'ri-subtract-line' : 'ri-add-line'} text-2xl text-gray-600 flex-shrink-0`}></i>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
                    }`}
                  >
                    <div className="text-gray-700 text-base leading-relaxed">
                      {typeof advantage.content === 'string' ? advantage.content : advantage.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {content.imageUrl && (
            <div data-aos="fade-left" className="hidden lg:block pl-0">
              <div className="relative w-full rounded-r-lg rounded-l-none overflow-hidden">
                <img
                  src={normalizeImageUrl(content.imageUrl)}
                  alt="Wind Turbine Advantages"
                  className="w-full object-cover rounded-r-lg rounded-l-none"
                  style={{ maxHeight: '600px', height: 'auto' }}
                />
                <div className="absolute inset-0 bg-black/40 rounded-r-lg rounded-l-none"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
