import { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getCMSData, normalizeImageUrl } from '../../../utils/cms';

interface AdvantageItem {
  title: string;
  content: string;
}

interface TechnicalAdvantagesContent {
  title?: string;
  imageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  items?: AdvantageItem[];
}

const defaultAdvantages: AdvantageItem[] = [
  { title: 'Variable-Speed Variable-Pitch Control', content: 'Adaptable to random changes in wind, optimizing power output.' },
  { title: 'Permanent Magnet, Medium Speed Drive-Train Technology', content: 'Higher wind energy utilization, minimal energy loss and less maintenance (low speed). Optimized technology giving advantages of both permanent magnet generator and low-speed drive train. Active air-cooling system for generator and drive-train ensures high performance and reliability.' },
  { title: 'Adaptive Active Yaw System', content: 'Automatically corrects wind vane orientation for improved wind alignment accuracy.' },
  { title: 'Full-Power Converter', content: 'Outstanding fault ride through capability and grid friendliness (AC-DC-AC conversion). Full power converter is cooled by active liquid cooling system, effectively improving the cooling efficiency.' },
  { title: 'Comprehensive Load and Strength Calculation', content: 'Redundancy design for high reliability.' },
  { title: 'Capacitance Detection Technology', content: 'Regularly detects ultra capacitors of the pitch system, reducing risk to the wind turbine.' },
  { title: 'Modular Structural Design', content: 'Enables flexible installation and construction.' },
  { title: 'Quality Control and Factory Inspection System', content: 'Facilitates easy commissioning and stable operation.' },
  { title: 'Monitoring Systems', content: 'Central, remote, and online monitoring systems for efficient operation and maintenance.' },
];

export default function TechnicalAdvantagesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [content, setContent] = useState<TechnicalAdvantagesContent>({
    title: 'Technical Advantages',
    items: defaultAdvantages,
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
        const result = await getCMSData('technology', 'technical-advantages', {
          defaultValue: { title: 'Technical Advantages', items: defaultAdvantages },
        });
        const imageUrl = result.data.imageUrl && result.data.imageUrl.trim() ? result.data.imageUrl.trim() : undefined;
        const imageUrl2 = result.data.imageUrl2 && result.data.imageUrl2.trim() ? result.data.imageUrl2.trim() : undefined;
        const imageUrl3 = result.data.imageUrl3 && result.data.imageUrl3.trim() ? result.data.imageUrl3.trim() : undefined;
        
        console.log('Technical Advantages - Loaded CMS data:', {
          imageUrl,
          imageUrl2,
          imageUrl3,
          rawData: result.data
        });
        
        setContent({
          title: result.data.title || 'Technical Advantages',
          imageUrl,
          imageUrl2,
          imageUrl3,
          items: (result.data.items && result.data.items.length > 0) ? result.data.items : defaultAdvantages,
        });
      } catch (error) {
        console.error('Error loading technical advantages content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    const handleCmsUpdate = (e: CustomEvent) => {
      if (e.detail.page === 'technology' && e.detail.section === 'technical-advantages') {
        fetchContent();
      }
    };
    window.addEventListener('cmsUpdate', handleCmsUpdate as EventListener);

    return () => {
      window.removeEventListener('cmsUpdate', handleCmsUpdate as EventListener);
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };



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

  const advantages = content.items || defaultAdvantages;

  return (
    <section className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center py-28">
      {/* Image Left */}
      {content.imageUrl && (
        <div ref={imageContainerRef} className="col-span-12 lg:col-span-6 hidden lg:block p-0" data-aos="fade-right">
          <div className="w-full overflow-hidden">
            <img 
              src={normalizeImageUrl(content.imageUrl)}
              alt="Wind turbine technical advantages"
              className="w-full h-auto object-contain max-h-[680px]"
            />
          </div>
        </div>
      )}
      
      {/* Content Right */}
      <div ref={contentRef} className={`${content.imageUrl ? 'col-span-12 lg:col-span-6' : 'col-span-12'} pt-20`}>
        <div className="mb-6" data-aos="fade-left">
          <h2 className="text-gray-900 text-3xl font-semibold mb-6">
            {content.title || 'Technical Advantages'}
          </h2>
        </div>
        <ul className="space-y-2">
          {advantages.map((advantage, index) => (
            <li key={index} className="bg-white overflow-hidden" data-aos="fade-left" data-aos-delay={index * 50}>
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#8DC63F]/10 transition-colors cursor-pointer group border-b border-gray-200"
              >
                <h3 
                  className="text-gray-900 text-lg font-semibold text-left transition-colors group-hover:text-[#8DC63F]"
                  style={{ color: openIndex === index ? '#8DC63F' : undefined }}
                >
                  {advantage.title}
                </h3>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 ml-4">
                  <i className={`ri-${openIndex === index ? 'subtract' : 'add'}-line text-2xl transition-transform duration-300`} style={{ color: '#8DC63F' }}></i>
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-[500px]' : 'max-h-0'
                }`}
              >
                <div className="px-4 pb-3">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {advantage.content}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
