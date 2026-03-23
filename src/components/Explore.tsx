import { Search, Bell, Bookmark, Share2, Compass, Sparkles, RefreshCw } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function Explore() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const { language, t } = useLanguage();
  
  const slides = [
    {
      id: 1,
      title: "The UPI Revolution: Global Expansion",
      titleHi: "UPI क्रांति: वैश्विक विस्तार",
      dek: "India's UPI is now live in 7 countries, reshaping cross-border remittances.",
      dekHi: "भारत का UPI अब 7 देशों में लाइव है, जो सीमा पार प्रेषण को नया आकार दे रहा है।",
      interest: "Indian Fintech",
      interestHi: "भारतीय फिनटेक",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-world-map-with-connections-914-large.mp4",
      image: "https://images.unsplash.com/photo-1556742049-02e49f9d2a10?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 2,
      title: "Nifty IT: The Recovery Path",
      titleHi: "निफ्टी आईटी: रिकवरी की राह",
      dek: "Why analysts believe Indian IT stocks are ripe for a 20% rally in 2024.",
      dekHi: "विश्लेषकों का मानना है कि भारतीय आईटी शेयर 2024 में 20% की रैली के लिए तैयार हैं।",
      interest: "Nifty IT",
      interestHi: "निफ्टी आईटी",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-data-processing-in-a-server-room-4114-large.mp4",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 3,
      title: "Real Estate Boom in Tier 2 Cities",
      titleHi: "टियर 2 शहरों में रियल एस्टेट बूम",
      dek: "Lucknow and Indore see a 30% surge in luxury housing demand.",
      dekHi: "लखनऊ और इंदौर में लक्जरी आवास की मांग में 30% की वृद्धि देखी गई है।",
      interest: "Real Estate India",
      interestHi: "रियल एस्टेट इंडिया",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-city-at-night-11-large.mp4",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 4,
      title: "The Rise of Retail Investors",
      titleHi: "रिटेल निवेशकों का उदय",
      dek: "Demat accounts in India cross the 150 million mark, a new milestone.",
      dekHi: "भारत में डीमैट खातों ने 150 मिलियन का आंकड़ा पार किया, एक नया मील का पत्थर।",
      interest: "NSE/BSE",
      interestHi: "एनएसई/बीएसई",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-4107-large.mp4",
      image: "https://images.unsplash.com/photo-1611974717484-7da00ff12991?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 5,
      title: "Green Hydrogen: India's New Bet",
      titleHi: "ग्रीन हाइड्रोजन: भारत का नया दांव",
      dek: "Reliance and Adani lead the charge in India's $20B green energy push.",
      dekHi: "रिलायंस और अडानी भारत के $20B ग्रीन एनर्जी पुश का नेतृत्व कर रहे हैं।",
      interest: "Sustainable Energy",
      interestHi: "सतत ऊर्जा",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-wind-turbines-in-a-field-at-sunset-15-large.mp4",
      image: "https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 6,
      title: "Banking Sector: NPA Crisis Over?",
      titleHi: "बैंकिंग क्षेत्र: एनपीए संकट खत्म?",
      dek: "Indian banks report the lowest gross NPA levels in a decade at 3.2%.",
      dekHi: "भारतीय बैंकों ने एक दशक में 3.2% पर सबसे कम सकल एनपीए स्तर दर्ज किया।",
      interest: "Banking Sector",
      interestHi: "बैंकिंग क्षेत्र",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-counting-money-in-a-bank-4112-large.mp4",
      image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 7,
      title: "The EV Race in India",
      titleHi: "भारत में ईवी रेस",
      dek: "Tata Motors dominates, but Mahindra and Ola Electric are catching up fast.",
      dekHi: "टाटा मोटर्स का दबदबा है, लेकिन महिंद्रा और ओला इलेक्ट्रिक तेजी से पकड़ बना रहे हैं।",
      interest: "Indian Startups",
      interestHi: "भारतीय स्टार्टअप",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-electric-car-charging-at-a-station-4116-large.mp4",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 8,
      title: "Digital Rupee: The Future of Cash",
      titleHi: "डिजिटल रुपया: नकद का भविष्य",
      dek: "RBI's CBDC pilot expands to 15 more cities with 5 million users.",
      dekHi: "RBI का CBDC पायलट 5 मिलियन उपयोगकर्ताओं के साथ 15 और शहरों में विस्तारित हुआ।",
      interest: "Digital Rupee",
      interestHi: "डिजिटल रुपया",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-particles-forming-a-sphere-916-large.mp4",
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 9,
      title: "IPO Market: A Busy 2024 Ahead",
      titleHi: "आईपीओ बाजार: आगे एक व्यस्त 2024",
      dek: "Over 50 companies line up to raise ₹70,000 crore from the markets.",
      dekHi: "50 से अधिक कंपनियां बाजारों से ₹70,000 करोड़ जुटाने के लिए कतार में हैं।",
      interest: "IPO Market",
      interestHi: "आईपीओ बाजार",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-business-people-shaking-hands-in-an-office-4110-large.mp4",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 10,
      title: "Wealth Management for Millennials",
      titleHi: "मिलेनियल्स के लिए वेल्थ मैनेजमेंट",
      dek: "Personalized AI advisors are replacing traditional wealth managers.",
      dekHi: "व्यक्तिगत एआई सलाहकार पारंपरिक वेल्थ मैनेजरों की जगह ले रहे हैं।",
      interest: "Wealth Management",
      interestHi: "वेल्थ मैनेजमेंट",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-using-a-smartphone-in-a-cafe-4108-large.mp4",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  // Simple pull detection logic
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].pageY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      const currentY = e.touches[0].pageY;
      const diff = currentY - startY.current;
      if (diff > 0) {
        setPullDistance(Math.min(diff / 2, 80));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      handleRefresh();
    }
    setPullDistance(0);
  };

  return (
    <div 
      className="h-screen overflow-hidden bg-black relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      <motion.div 
        style={{ y: pullDistance - 40 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center"
      >
        <div className={`p-2 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 transition-transform ${isRefreshing ? 'animate-spin' : ''}`}>
          <RefreshCw className="w-5 h-5 text-primary" />
        </div>
      </motion.div>

      <header className="fixed top-0 left-0 w-full z-50 px-6 h-20 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-4">
          <h1 className="font-headline italic text-2xl tracking-tight text-primary">MyET</h1>
        </div>
        <div className="flex gap-6 items-center">
          <button className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors">
            {t('explore.following')}
          </button>
          <div className="flex flex-col items-center">
            <button className="font-label text-xs uppercase tracking-widest text-white font-bold">
              {t('explore.foryou')}
            </button>
            <div className="h-0.5 w-4 bg-primary mt-1"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-white" />
          <Bell className="w-5 h-5 text-white" />
        </div>
      </header>

      <main 
        ref={containerRef}
        className="h-full snap-y snap-mandatory overflow-y-scroll no-scrollbar"
      >
        {slides.map((slide) => {
          const title = language === 'hi' ? (slide.titleHi || slide.title) : slide.title;
          const dek = language === 'hi' ? (slide.dekHi || slide.dek) : slide.dek;
          const interest = language === 'hi' ? (slide.interestHi || slide.interest) : slide.interest;

          return (
            <section key={slide.id} className="h-screen w-full snap-start relative overflow-hidden bg-black">
              {slide.videoUrl ? (
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  poster={slide.image}
                >
                  <source src={slide.videoUrl} type="video/mp4" />
                </video>
              ) : (
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  alt={title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60" 
                  src={slide.image} 
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end px-6 pb-28">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="max-w-[80%]"
                >
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary bg-black/40 backdrop-blur-md px-2 py-1 mb-3 inline-block">
                    {language === 'hi' ? `${interest} में आपकी रुचि के आधार पर` : `Based on your interest in ${interest}`}
                  </span>
                  <h2 className="font-headline text-3xl font-bold text-white mb-2 leading-tight">{title}</h2>
                  <p className="font-body text-on-surface-variant text-sm italic mb-4">{dek}</p>
                </motion.div>
              </div>

              <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center">
                <ActionButton icon={Compass} label={t('explore.deepdive')} active />
                <ActionButton icon={Bookmark} label={t('explore.save')} />
                <ActionButton icon={Share2} label={t('explore.share')} />
                <ActionButton icon={Sparkles} label={t('explore.ask')} active />
              </div>
            </section>
          );
        })}
      </main>

      <AnimatePresence>
        {isRefreshing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[70] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <span className="font-label text-xs uppercase tracking-widest text-primary">{t('explore.refreshing')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 group">
      <button className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-all active:scale-95 ${active ? 'bg-white/10 text-primary border border-primary/30' : 'bg-white/10 text-white'}`}>
        <Icon className="w-6 h-6" style={active ? { fill: 'currentColor' } : {}} />
      </button>
      <span className="font-label text-[9px] uppercase tracking-tighter text-on-surface-variant">{label}</span>
    </div>
  );
}
