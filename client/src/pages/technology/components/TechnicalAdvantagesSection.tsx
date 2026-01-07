import { useState, useEffect } from 'react';
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
  items?: AdvantageItem[];
}

const defaultAdvantages: AdvantageItem[] = [
  { title: 'Variable-Speed Variable-Pitch Control', content: 'Adaptable to random changes in wind, optimizing power output' },
  { title: 'Permanent Magnet, Medium Speed Drive-Train Technology', content: 'Higher wind energy utilization, minimal energy loss and less maintenance (low speed). Optimized technology giving advantages of both permanent magnet generator and low-speed drive train. Active air-cooling system for generator and drive-train ensures high performance and reliability.' },
  { title: 'Adaptive Active Yaw System', content: 'Automatically corrects wind vane orientation for improved wind alignment accuracy' },
  { title: 'Full-Power Converter', content: 'Outstanding fault ride through capability and grid friendliness (AC-DC-AC conversion). Full power converter is cooled by active liquid cooling system, effectively improving the cooling efficiency.' },
  { title: 'Comprehensive Load and Strength Calculation', content: 'Redundancy design for high reliability' },
  { title: 'Capacitance Detection Technology', content: 'Regularly detects ultra capacitors of the pitch system, reducing risk to the wind turbine' },
  { title: 'Modular Structural Design', content: 'Enables flexible installation and construction' },
  { title: 'Quality Control and Factory Inspection System', content: 'Facilitates easy commissioning and stable operation' },
  { title: 'Monitoring Systems', content: 'Central, remote, and online monitoring systems for efficient operation and maintenance' },
];

export default function TechnicalAdvantagesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [content, setContent] = useState<TechnicalAdvantagesContent>({
    title: 'Technical Advantages',
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
        const result = await getCMSData('technology', 'technical-advantages', {
          defaultValue: { title: 'Technical Advantages', items: defaultAdvantages },
        });
        const imageUrl = result.data.imageUrl && result.data.imageUrl.trim() ? result.data.imageUrl.trim() : undefined;
        
        setContent({
          title: result.data.title || 'Technical Advantages',
          imageUrl,
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
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Left */}
          {content.imageUrl && (
            <div className="hidden lg:block" data-aos="fade-right">
              <div className="w-full overflow-hidden">
                <img 
                  src={normalizeImageUrl(content.imageUrl)}
                  alt="Wind turbine technical advantages"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          )}
          
          {/* Content Right */}
          <div className={content.imageUrl ? '' : 'lg:col-span-2'}>
            <div className="mb-6" data-aos="fade-left">
              <h2 className="text-gray-900 text-3xl font-semibold mb-6">
                {content.title || 'Technical Advantages'}
              </h2>
            </div>
            
            <div className="elementor-accordion bordered" style={{ borderTop: '1px solid #D4DFF2C7' }}>
              {advantages.map((advantage, index) => (
                <div key={index} className="elementor-accordion-item border-b border-gray-200" data-aos="fade-left" data-aos-delay={index * 50}>
                  <div
                    onClick={() => toggleAccordion(index)}
                    className="elementor-tab-title w-full flex items-center text-left py-4 hover:bg-[#8DC63F]/10 transition-colors cursor-pointer group"
                    role="button"
                    aria-expanded={openIndex === index}
                    tabIndex={0}
                  >
                    <span className="elementor-accordion-icon elementor-accordion-icon-left flex items-center justify-center flex-shrink-0 mr-4" aria-hidden="true">
                      <span className={openIndex === index ? 'elementor-accordion-icon-opened' : 'elementor-accordion-icon-closed'}>
                        {openIndex === index ? (
                          <i className="ri-subtract-line text-xl text-[#8DC63F]"></i>
                        ) : (
                          <i className="ri-add-line text-xl text-[#8DC63F]"></i>
                        )}
                      </span>
                    </span>
                    <span 
                      className="elementor-accordion-title text-gray-900 text-lg font-semibold flex-1 transition-colors group-hover:text-[#8DC63F] cursor-pointer"
                      style={{ color: openIndex === index ? '#8DC63F' : undefined }}
                    >
                      {advantage.title}
                    </span>
                  </div>
                  
                  <div 
                    className={`elementor-tab-content elementor-clearfix overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-[500px] pb-4' : 'max-h-0'
                    }`}
                    role="region"
                  >
                    <div className="pl-10 pr-0">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {advantage.content}
                      </p>
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

