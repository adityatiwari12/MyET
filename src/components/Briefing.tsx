import { Bell, Volume2, Sparkles, RefreshCw, ThumbsUp, ThumbsDown, ExternalLink, Info } from 'lucide-react';
import { Story } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { ApiService } from '../services/apiService';

interface BriefingProps {
  onStoryClick: (story: Story) => void;
}

interface Narrative {
  id: string;
  title: string;
  narrative: string;
  insights: string[];
  insightsHi?: string[];
  mattersToYou: string;
  mattersToYouHi?: string;
  watchNext: string;
  category: string;
  sentiment: string;
  sources: { title: string; url: string; source: string }[];
  articleIds: number[];
  generatedAt: string;
}

/** Map a Narrative from the RAG feed into the Story shape the rest of the app understands */
function narrativeToStory(n: Narrative, idx: number): Story {
  return {
    id: n.articleIds?.[0] || idx,
    title: n.title,
    category: n.category,
    categoryHi: n.category,
    insights: n.insights || [],
    insightsHi: n.insightsHi || n.insights || [],
    mattersToYou: n.mattersToYou || '',
    mattersToYouHi: n.mattersToYouHi || n.mattersToYou || '',
    readTime: '3 MIN READ',
    readTimeHi: '3 मिनट',
    updateInfo: n.sentiment === 'positive' ? 'Positive Outlook' : n.sentiment === 'negative' ? 'Market Alert' : 'Intelligence Update',
    tags: [n.category, ...(n.sources || []).slice(0, 2).map(s => s.source)].filter(Boolean),
    imageUrl: '',
    content: n.narrative,
    isBreaking: false,
  };
}

export function Briefing({ onStoryClick }: BriefingProps) {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const { language, t } = useLanguage();

  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const warmupTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadFeed = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await ApiService.getFeed();

      if (data.isWarmingUp || !data.narratives || data.narratives.length === 0) {
        setIsWarmingUp(true);
        setNarratives([]);

        // Poll every 30s when warming up
        if (!warmupTimerRef.current) {
          warmupTimerRef.current = setInterval(async () => {
            try {
              const retry = await ApiService.getFeed();
              if (retry.narratives && retry.narratives.length > 0) {
                setNarratives(retry.narratives);
                setIsWarmingUp(false);
                if (warmupTimerRef.current) clearInterval(warmupTimerRef.current);
                warmupTimerRef.current = null;
              }
            } catch {}
          }, 30000);
        }
      } else {
        setNarratives(data.narratives);
        setIsWarmingUp(false);
        if (warmupTimerRef.current) { clearInterval(warmupTimerRef.current); warmupTimerRef.current = null; }
      }
    } catch (err: any) {
      console.error('Feed load error:', err);
      setErrorMsg('Could not load your feed. Retrying...');
      setTimeout(() => loadFeed(), 5000); // Auto-retry
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
    return () => { if (warmupTimerRef.current) clearInterval(warmupTimerRef.current); };
  }, [loadFeed]);

  const handleListen = async (e: React.MouseEvent, narrative: Narrative) => {
    e.stopPropagation();
    if (speakingId === narrative.id) {
      geminiService.stopSpeech();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(narrative.id);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    
    try {
      const insights = language === 'hi' ? (narrative.insightsHi || narrative.insights) : narrative.insights;
      const matters = language === 'hi' ? (narrative.mattersToYouHi || narrative.mattersToYou) : narrative.mattersToYou;
      const textToRead = `${narrative.title}. ${insights.slice(0, 3).join('. ')}. ${matters}`;
      const audioUrl = await geminiService.textToSpeech(textToRead, language);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.onended = () => setSpeakingId(null);
        audio.onerror = () => setSpeakingId(null);
        audio.play();
      } else {
        // Web Speech played it directly — just clear speaking state after delay
        setTimeout(() => setSpeakingId(null), textToRead.length * 50);
      }
    } catch (err) {
      console.error('TTS error:', err);
      setSpeakingId(null);
    }
  };

  const handleFeedback = async (e: React.MouseEvent, narrativeId: string, articleId: number, type: 'up' | 'down') => {
    e.stopPropagation();
    setFeedback(prev => {
      const isSame = prev[narrativeId] === type;
      const next = { ...prev };
      if (isSame) delete next[narrativeId];
      else next[narrativeId] = type;
      return next;
    });
    ApiService.trackBehavior(type === 'up' ? 'like' : 'skip', articleId).catch(() => {});
  };

  const sentimentColor = (s: string) =>
    s === 'positive' ? 'text-emerald-400' : s === 'negative' ? 'text-red-400' : 'text-amber-400';
  const sentimentDot = (s: string) =>
    s === 'positive' ? 'bg-emerald-400' : s === 'negative' ? 'bg-red-400' : 'bg-amber-400';

  return (
    <div className="pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 h-16 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-headline italic text-2xl tracking-tight text-primary">MyET</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant -mt-1">
                {t('story.tagline')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadFeed(true)}
              disabled={isRefreshing}
              className="p-2 rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
              title="Refresh feed"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            </button>
            <button className="text-on-surface-variant hover:text-on-surface p-2 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-4xl mx-auto space-y-10">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Generating your intelligence feed...</p>
          </div>
        )}

        {/* Warming up state */}
        {!isLoading && isWarmingUp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center space-y-4"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <h3 className="font-headline text-xl text-on-surface">Warming Up Your Intelligence Engine</h3>
            <p className="text-on-surface-variant text-sm max-w-sm mx-auto">
              MyET is fetching and analyzing live Indian financial news for you. This takes ~2 minutes on first load.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-primary font-label uppercase tracking-widest">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Checking every 30 seconds...</span>
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {!isLoading && errorMsg && (
          <div className="py-12 text-center text-on-surface-variant text-sm">
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Narrative Cards */}
        <AnimatePresence>
          {narratives.map((narrative, idx) => {
            const title = narrative.title;
            const insights = language === 'hi' ? (narrative.insightsHi || narrative.insights) : narrative.insights;
            const matters = language === 'hi' ? (narrative.mattersToYouHi || narrative.mattersToYou) : narrative.mattersToYou;
            const storyForClick = narrativeToStory(narrative, idx);

            return (
              <motion.article
                key={narrative.id || idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => onStoryClick(storyForClick)}
                className="bg-surface-container-low p-8 border-l-2 border-primary/20 cursor-pointer group hover:border-primary/60 transition-all"
              >
                <header className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${sentimentDot(narrative.sentiment)}`} />
                      <span className="font-label text-xs text-primary uppercase tracking-[0.2em]">
                        {narrative.category}
                      </span>
                      <span className={`font-label text-[10px] ${sentimentColor(narrative.sentiment)}`}>
                        {narrative.sentiment}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleListen(e, narrative)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-label uppercase tracking-widest transition-all ${
                          speakingId === narrative.id
                            ? 'bg-primary text-on-primary animate-pulse'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary'
                        }`}
                      >
                        <Volume2 className="w-3 h-3" />
                        {speakingId === narrative.id ? 'Stop' : t('story.listen')}
                      </button>
                    </div>
                  </div>
                  <h2 className="font-headline text-2xl md:text-3xl text-on-surface leading-tight group-hover:text-primary transition-colors">
                    {title}
                  </h2>
                </header>

                <div className="space-y-6">
                  {/* Key Insights */}
                  <div className="space-y-3">
                    <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 pb-1">
                      {t('story.insights')}
                    </h3>
                    <ul className="space-y-3">
                      {(insights || []).slice(0, 4).map((insight, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="text-primary mt-0.5 text-xs font-label shrink-0">0{i + 1}</span>
                          <p className="text-on-surface leading-relaxed text-sm">{insight}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Why This Matters */}
                  {matters && (
                    <div className="p-5 bg-primary/5 border border-primary/10 rounded-sm">
                      <h4 className="font-label text-[10px] uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        {t('story.matters')}
                      </h4>
                      <p className="text-on-surface-variant text-sm italic leading-relaxed">{matters}</p>
                    </div>
                  )}

                  {/* Watch Next */}
                  {narrative.watchNext && (
                    <div className="flex items-start gap-2 text-xs text-on-surface-variant">
                      <Info className="w-3 h-3 shrink-0 mt-0.5 text-amber-400" />
                      <span className="italic">{narrative.watchNext}</span>
                    </div>
                  )}

                  {/* Sources */}
                  {narrative.sources && narrative.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {narrative.sources.slice(0, 3).map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full text-[10px] font-label text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          {src.source}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Feedback */}
                  <div className="flex items-center gap-4 pt-1 border-t border-outline-variant/10">
                    <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                      {t('briefing.feedback.question')}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleFeedback(e, narrative.id, narrative.articleIds?.[0], 'up')}
                        className={`p-2 rounded-full transition-colors ${feedback[narrative.id] === 'up' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleFeedback(e, narrative.id, narrative.articleIds?.[0], 'down')}
                        className={`p-2 rounded-full transition-colors ${feedback[narrative.id] === 'down' ? 'bg-red-500/20 text-red-400' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </main>
    </div>
  );
}
