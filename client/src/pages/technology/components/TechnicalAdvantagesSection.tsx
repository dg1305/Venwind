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
  { title: 'Variable-Speed Variable-Pitch Control', content: 'Advanced control system that optimizes turbine performance by adjusting both rotor speed and blade pitch angle in real-time, maximizing energy capture across varying wind conditions while reducing mechanical stress and extending component lifetime.' },
  { title: 'Permanent Magnet, Medium Speed Drive-Train Technology', content: 'Innovative drivetrain combining a medium-speed gearbox with a permanent magnet generator, eliminating the need for external excitation, reducing losses, and improving overall system efficiency while minimizing maintenance requirements.' },
  { title: 'Adaptive Active Yaw System', content: 'Intelligent yaw control system that continuously adjusts the nacelle orientation to optimize wind capture and reduce loads, using advanced algorithms and real-time wind data to maximize energy production and minimize wear on components.' },
  { title: 'Full-Power Converter', content: 'State-of-the-art power electronics that convert 100% of generated power, providing superior grid support capabilities, excellent power quality, and enabling advanced grid services such as voltage and frequency regulation.' },
  { title: 'Comprehensive Load and Strength Calculation', content: 'Rigorous engineering analysis using advanced simulation tools to ensure structural integrity and optimal performance under all operating conditions, including extreme weather events and grid disturbances.' },
  { title: 'Capacitance Detection Technology:', content: 'Advanced monitoring system that detects and prevents potential electrical issues before they occur, enhancing safety and reliability while reducing unplanned downtime and maintenance costs.' },
  { title: 'Modular Structural Design', content: 'Flexible architecture that allows for easy upgrades, modifications, and maintenance, reducing installation time and costs while enabling future technology integration and capacity enhancements.' },
  { title: 'Quality Control and Factory Inspection System', content: 'Comprehensive quality assurance program with rigorous testing and inspection protocols at every stage of manufacturing, ensuring the highest standards of reliability and performance for every turbine.' },
  { title: 'Monitoring Systems', content: 'Advanced SCADA and condition monitoring systems that provide real-time performance data, predictive maintenance alerts, and comprehensive analytics to optimize operations and maximize uptime across the entire wind farm.' },
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

  useEffect(() => {
    const matchHeight = () => {
      if (contentRef.current && imageContainerRef.current) {
        const contentHeight = contentRef.current.offsetHeight;
        const imageImg = imageContainerRef.current.querySelector('img');
        if (imageImg) {
          imageContainerRef.current.style.height = `${contentHeight}px`;
          imageImg.style.height = `${contentHeight}px`;
        }
      }
    };

    // Match height initially and after content changes
    matchHeight();
    
    // Also match height when accordion opens/closes
    const timer = setTimeout(matchHeight, 100);
    
    return () => clearTimeout(timer);
  }, [openIndex, content, loading]);

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
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-0 items-start">
          {content.imageUrl && (
            <div ref={imageContainerRef} className="hidden lg:block pr-0" data-aos="fade-right">
              <img 
                src={normalizeImageUrl(content.imageUrl)}
                alt="Wind turbine technical advantages"
                className="w-full object-cover rounded-l-lg rounded-r-none"
                style={{ objectPosition: 'top' }}
              />
            </div>
          )}
          
          <div ref={contentRef} className="pl-8">
            <div className="mb-8" data-aos="fade-up">
              <h2 className="text-gray-900 text-4xl lg:text-5xl font-bold">
                {content.title ? (
                  content.title.split(' ').map((word, index, arr) => (
                    <span key={index}>
                      {word}
                      {index < arr.length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <>
                    Technical<br />Advantages
                  </>
                )}
              </h2>
            </div>
            <div className="space-y-4">
            {advantages.map((advantage, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <h3 className="text-gray-900 text-xl font-bold text-left whitespace-nowrap">{advantage.title}</h3>
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 ml-4">
                    <i className={`ri-${openIndex === index ? 'subtract' : 'add'}-line text-2xl transition-transform duration-300`} style={{ color: '#8DC63F' }}></i>
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-8 pb-6">
                    <p className="text-gray-700 text-base leading-relaxed">
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
