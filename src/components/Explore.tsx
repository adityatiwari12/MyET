import { Search, Bell, Bookmark, Share2, Compass, Sparkles, RefreshCw, Heart } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ApiService } from '../services/apiService';
import { Story } from '../constants';

export function Explore() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  
  // Interaction tracking state
  const [interactions, setInteractions] = useState<Record<number, { liked: boolean, shared: boolean, saved: boolean, timeSpent: number }>>({});
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [feed, setFeed] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Fetch initial personalized feed
  const loadMoreVideos = useCallback(async (isRefresh = false) => {
    if ((loadingRef.current || !hasMore) && !isRefresh) return;
    
    loadingRef.current = true;
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      // Try RAG feed first, fall back to trending articles
      let slides: Story[] = [];
      try {
        const data = await ApiService.getFeed();
        if (data.narratives && data.narratives.length > 0) {
          slides = data.narratives.map((n: any, i: number) => ({
            id: n.articleIds?.[0] || i,
            title: n.title || 'Financial Update',
            titleHi: n.title,
            category: n.category || 'markets',
            categoryHi: n.category || 'markets',
            insights: n.insights || [],
            insightsHi: n.insightsHi || n.insights || [],
            mattersToYou: n.mattersToYou || '',
            mattersToYouHi: n.mattersToYouHi || n.mattersToYou || '',
            tags: [n.category].filter(Boolean),
            imageUrl: (n.sources?.[0]?.imageUrl) || `https://picsum.photos/seed/${n.articleIds?.[0] || i}/800/600`,
            readTime: '3 MIN READ',
            dek: n.narrative?.slice(0, 120) || n.mattersToYou || '',
            isBreaking: n.sentiment === 'negative',
          }));
        }
      } catch {/* ignore, try trending */}

      // Fallback to trending articles if RAG feed empty
      if (slides.length === 0) {
        const trending = await ApiService.getTrending();
        slides = (trending.articles || []).map((a: any) => ({
          id: a.id,
          title: a.title || 'Financial Update',
          titleHi: a.title,
          category: a.category || 'markets',
          categoryHi: a.category || 'markets',
          insights: a.insights || [],
          insightsHi: a.insights || [],
          mattersToYou: a.summary || '',
          mattersToYouHi: a.summary || '',
          tags: (a.impactTags || []).slice(0, 3),
          imageUrl: a.imageUrl || `https://picsum.photos/seed/${a.id}/800/600`,
          readTime: a.readTime || '3 MIN READ',
          dek: a.summary?.slice(0, 120) || '',
          isBreaking: false,
        }));
      }

      if (slides.length > 0) {
        if (isRefresh) {
          setFeed(slides);
          setPage(2);
          if (!activeVideoId) setActiveVideoId(slides[0].id as number);
        } else {
          setFeed(prev => {
            const existingIds = new Set(prev.map(s => s.id));
            return [...prev, ...slides.filter(s => !existingIds.has(s.id))];
          });
          setPage(p => p + 1);
        }
        setHasMore(slides.length >= 3);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setIsLoadingMore(false);
      setIsRefreshing(false);
      loadingRef.current = false;
    }
  }, [page, hasMore, activeVideoId]);

  // Initial load
  useEffect(() => {
    if (feed.length === 0) {
      loadMoreVideos();
    }
  }, [loadMoreVideos, feed.length]);

  // Load existing interactions to pre-fill active states
  useEffect(() => {
    const loadInteractions = async () => {
      try {
        const data = await ApiService.getUserInteractions();
        if (data.interactions) {
          const initialInteractions: Record<number, any> = {};
          data.interactions.forEach((int: any) => {
            if (!initialInteractions[int.storyId]) {
              initialInteractions[int.storyId] = { liked: false, shared: false, saved: false, timeSpent: 0 };
            }
            if (int.type === 'like') initialInteractions[int.storyId].liked = true;
            if (int.type === 'save') initialInteractions[int.storyId].saved = true;
            if (int.type === 'share') initialInteractions[int.storyId].shared = true;
          });
          setInteractions(initialInteractions);
        }
      } catch (err) {
        console.error("Error loading interactions:", err);
      }
    };
    loadInteractions();
  }, []);

  // Track time spent on active video and push to backend periodically maybe?
  // For now, tracking locally for UI
  useEffect(() => {
    if (!activeVideoId) return;
    
    const timer = setInterval(() => {
      setInteractions(prev => ({
        ...prev,
        [activeVideoId]: {
          ...(prev[activeVideoId] || { liked: false, shared: false, saved: false, timeSpent: 0 }),
          timeSpent: (prev[activeVideoId]?.timeSpent || 0) + 1
        }
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeVideoId]);

  // Intersection Observer to detect active video
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-id'));
            if (id) setActiveVideoId(id);
          }
        });
      },
      { threshold: 0.6 }
    );

    const elements = document.querySelectorAll('.video-slide');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [feed]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMoreVideos();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [isLoadingMore, loadMoreVideos]);

  const handleInteraction = async (id: number, type: 'liked' | 'shared' | 'saved') => {
    const apiTypeObj: Record<string, string> = {
      'liked': 'like',
      'saved': 'save',
      'shared': 'share'
    };
    
    // Optimistic UI update
    setInteractions(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { liked: false, shared: false, saved: false, timeSpent: 0 }),
        [type]: !prev[id]?.[type]
      }
    }));

    try {
      await ApiService.toggleInteraction(id, apiTypeObj[type]);
    } catch (err) {
      console.error(`Failed to toggle ${type} on story ${id}`, err);
    }
  };

  const handleRefresh = () => {
    // Scroll to top
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Fetch fresh personalized feed from page 1
    loadMoreVideos(true);
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
        {feed.map((slide) => {
          const title = language === 'hi' ? (slide.titleHi || slide.title) : slide.title;
          const dek = language === 'hi' ? (slide.dekHi || slide.dek) : slide.dek;
          
          // Explore previously used "interest", our schema uses "category"
          const interest = language === 'hi' ? (slide.categoryHi || slide.category) : slide.category;
          const interaction = interactions[Number(slide.id)] || { liked: false, shared: false, saved: false, timeSpent: 0 };

          // Default videoUrl if not present in schema to keep UI structure
          const videoUrl = (slide as any).videoUrl;

          return (
            <section key={slide.id} data-id={slide.id} className="video-slide h-screen w-full snap-start relative overflow-hidden bg-black">
              {videoUrl ? (
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  poster={slide.imageUrl}
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              ) : (
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  alt={title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60" 
                  src={slide.imageUrl} 
                  referrerPolicy="no-referrer"
                />
              )}
              {!slide.imageUrl && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-surface-container-high to-black" />
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
                <ActionButton 
                  icon={Heart} 
                  label={t('explore.like')} 
                  active={interaction.liked} 
                  onClick={() => handleInteraction(Number(slide.id), 'liked')} 
                />
                <ActionButton 
                  icon={Bookmark} 
                  label={t('explore.save')} 
                  active={interaction.saved}
                  onClick={() => handleInteraction(Number(slide.id), 'saved')}
                />
                <ActionButton 
                  icon={Share2} 
                  label={t('explore.share')} 
                  active={interaction.shared}
                  onClick={() => handleInteraction(Number(slide.id), 'shared')}
                />
                <ActionButton icon={Compass} label={t('explore.deepdive')} />
              </div>
            </section>
          );
        })}
        
        {/* Infinite Scroll Sentinel */}
        <div ref={observerTarget} className="h-20 w-full snap-start bg-black flex items-center justify-center">
          {isLoadingMore && (
            <div className="flex items-center gap-3 text-primary">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="font-label text-xs uppercase tracking-widest">{t('explore.refreshing')}</span>
            </div>
          )}
        </div>
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

function ActionButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1 group">
      <button 
        onClick={onClick}
        className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-all active:scale-95 ${active ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-white/10 text-white'}`}
      >
        <Icon className="w-6 h-6" style={active ? { fill: 'currentColor' } : {}} />
      </button>
      <span className="font-label text-[9px] uppercase tracking-tighter text-on-surface-variant">{label}</span>
    </div>
  );
}
