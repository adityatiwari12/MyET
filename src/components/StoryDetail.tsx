import { ArrowLeft, Bell, Bookmark, Share2, Expand, ChevronDown, Volume2, FileText, Sparkles, AudioLines } from 'lucide-react';
import { Story } from '../constants';
import { motion } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../contexts/LanguageContext';

interface StoryDetailProps {
  story: Story;
  onBack: () => void;
}

export function StoryDetail({ story, onBack }: StoryDetailProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { language, t } = useLanguage();

  const title = language === 'hi' ? (story.titleHi || story.title) : story.title;
  const category = language === 'hi' ? (story.categoryHi || story.category) : story.category;
  const readTime = language === 'hi' ? (story.readTimeHi || story.readTime) : story.readTime;
  const content = language === 'hi' ? (story.contentHi || story.content) : story.content;

  const handleReadAloud = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const textToRead = `${title}. ${content}`;
      const audioUrl = await geminiService.textToSpeech(textToRead);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const handleSummarize = async () => {
    if (summary || isSummarizing) return;
    setIsSummarizing(true);
    try {
      const prompt = language === 'hi' 
        ? `कृपया इस लेख का हिंदी में संक्षिप्त विवरण दें: ${content}`
        : content || title;
      const result = await geminiService.analyzeComplex(prompt);
      setSummary(result);
    } catch (error) {
      console.error('Summarization error:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="pb-32">
      <header className="bg-surface/90 backdrop-blur-md fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-headline italic text-2xl tracking-tight text-primary">MyET</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleReadAloud}
            className={`p-2 rounded-full transition-colors ${isSpeaking ? 'text-primary animate-pulse' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <Bell className="w-6 h-6 text-on-surface-variant" />
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXjJWC_5MowYu8JLlrMvpK45po26o8-e9UAJBZNgLfUHzj_d5TuPIK678IsicK8RKlnxRqiCBlybn9DC-o2U41zQFYnKPd4OCbDpI1aZI-wrao-aDyETQHu3EerN-dZIKX8gWZCtIEmqvt-Lwmc3eXKsKoq3A9J14nDp6eayMeE6-GZnlfV-tKS2oZiEF6V6vajgYM0aYNy2tZIcBTNvIkdgt3rxHGb8xpOncd7QuuwaHqNIgeJ20rUHFJmzaqsdwurUxEU4saOA" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <main className="pt-24 max-w-4xl mx-auto px-6 space-y-12">
        <article className="space-y-6">
          <div className="space-y-2">
            <span className="font-label text-primary text-[10px] uppercase tracking-[0.2em]">
              {category} • {readTime}
            </span>
            <h1 className="font-headline text-5xl md:text-6xl text-on-surface font-semibold leading-tight tracking-tight">
              {title}
            </h1>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-6 rounded-sm flex items-center justify-between group hover:bg-primary/10 transition-all cursor-pointer" onClick={handleReadAloud}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform relative">
                <AudioLines className="w-6 h-6" />
                <Sparkles className="w-3 h-3 absolute top-2 right-2 text-primary-dim animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-label text-xs uppercase tracking-widest font-bold text-primary">
                  {t('story.tts.title')}
                </h3>
                <p className="text-sm text-on-surface-variant">
                  {t('story.tts.desc')}
                </p>
              </div>
            </div>
            <button 
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-label uppercase tracking-widest transition-all ${
                isSpeaking 
                  ? 'bg-primary text-on-primary animate-pulse' 
                  : 'bg-primary text-on-primary hover:bg-primary-dim'
              }`}
            >
              {isSpeaking ? t('story.tts.playing') : t('story.tts.play')}
            </button>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleSummarize}
              className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-sm text-xs font-label uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-all"
            >
              <FileText className="w-4 h-4" />
              {isSummarizing ? t('story.summary.summarizing') : t('story.summary.ai')}
            </button>
            <button 
              onClick={handleReadAloud}
              disabled={isSpeaking}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-label uppercase tracking-widest transition-all ${
                isSpeaking 
                  ? 'bg-primary text-on-primary animate-pulse' 
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary'
              }`}
            >
              <div className="relative">
                <Volume2 className="w-4 h-4" />
                <Sparkles className="w-2 h-2 absolute -top-1 -right-1 text-primary-dim" />
              </div>
              {isSpeaking ? t('story.listening') : t('story.listen')}
            </button>
          </div>

          {summary && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-primary/5 p-8 border-l-4 border-primary rounded-sm prose prose-invert max-w-none"
            >
              <h2 className="font-label text-[10px] text-primary uppercase tracking-widest mb-4">
                {t('story.summary.deep')}
              </h2>
              <ReactMarkdown>{summary}</ReactMarkdown>
            </motion.section>
          )}

          <div className="relative py-4 group">
            <div className="flex overflow-x-auto gap-8 no-scrollbar scroll-smooth pb-4">
              <div className="flex-none w-48 border-l-2 border-primary/20 pl-4 space-y-1">
                <p className="font-label text-[10px] text-on-surface-variant">OCT 12, 09:00</p>
                <p className="text-sm font-medium">{t('story.timeline.initial')}</p>
              </div>
              <div className="flex-none w-48 border-l-2 border-primary pl-4 space-y-1">
                <p className="font-label text-[10px] text-primary">OCT 14, 14:30</p>
                <p className="text-sm font-medium">{t('story.timeline.peak')}</p>
              </div>
              <div className="flex-none w-48 border-l-2 border-primary/20 pl-4 space-y-1 opacity-50">
                <p className="font-label text-[10px] text-on-surface-variant">OCT 18, 11:00</p>
                <p className="text-sm font-medium">{t('story.timeline.hearing')}</p>
              </div>
            </div>
          </div>

          <section className="bg-surface-container-low p-8 border-l-4 border-primary/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-16 h-16 text-primary" />
            </div>
            <h2 className="font-label text-[10px] text-primary uppercase tracking-widest mb-4">
              {t('story.summary.exec')}
            </h2>
            <p className="text-xl font-headline italic leading-relaxed text-on-surface-variant">
              {language === 'hi' 
                ? '"क्रॉस-बॉर्डर सेटलमेंट में स्वायत्त एजेंटिक वर्कफ़्लो के एकीकरण ने पारंपरिक केंद्रों से एल्गोरिथम गलियारों में तरलता में 14% बदलाव किया है। हम वास्तविक समय में ऋण की कीमत में एक संरचनात्मक बदलाव देख रहे हैं।"'
                : '"The integration of autonomous agentic workflows into cross-border settlements has triggered a 14% shift in liquidity from traditional hubs to algorithmic corridors. We are seeing a structural break in how debt is priced in real-time."'}
            </p>
          </section>

          <section className="flex flex-wrap gap-2 items-center">
            <span className="font-label text-[10px] text-on-surface-variant uppercase mr-2">
              {t('story.mentioned')}
            </span>
            {['JPM +1.2%', 'Gary Gensler', 'NVIDIA +0.4%', 'Ethereum Foundation'].map(item => (
              <div key={item} className="bg-surface-container-highest px-3 py-1 flex items-center gap-2 group cursor-pointer hover:bg-surface-bright transition-colors">
                <span className="font-label text-xs">{item.split(' ')[0]}</span>
                {item.includes('+') && <span className="text-[10px] text-primary">{item.split(' ')[1]}</span>}
              </div>
            ))}
          </section>

          <div className="space-y-8 text-on-surface/90 leading-7 text-lg max-w-2xl">
            {content?.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <div className="group cursor-pointer py-6 border-y border-outline-variant/20 hover:bg-surface-container-low px-4 -mx-4 transition-all">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <AnalyticsIcon className="w-6 h-6 text-primary" />
                  <span className="font-medium">
                    {language === 'hi' ? 'गहराई से जानें: एल्गोरिथम कॉरिडोर तंत्र' : 'Deep Dive: The Algorithmic Corridor Mechanism'}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </div>
            </div>
          </div>
        </article>

        <section className="space-y-6">
          <h3 className="font-headline text-3xl font-medium">{t('story.impact.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container p-6 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Wallet className="w-5 h-5" />
                <h4 className="font-label text-xs uppercase tracking-widest font-bold">
                  {t('story.impact.risk')}
                </h4>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                {language === 'hi' 
                  ? 'टी-बिल्स के संपर्क में अस्थिरता बढ़ सकती है क्योंकि एआई-संचालित ट्रेडिंग प्लेटफॉर्म स्वचालित रेपो बाजारों की ओर मुड़ते हैं।'
                  : 'Exposure to T-Bills may see increased volatility as AI-driven trading platforms pivot to automated repo markets.'}
              </p>
            </div>
            <div className="bg-surface-container p-6 space-y-4">
              <div className="flex items-center gap-3 text-tertiary-dim">
                <Shield className="w-5 h-5" />
                <h4 className="font-label text-xs uppercase tracking-widest font-bold">
                  {t('story.impact.shift')}
                </h4>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                {language === 'hi' 
                  ? 'Q4 के लिए अनुमानित तीव्र वेग बदलावों के खिलाफ बचाव के लिए मुद्रास्फीति-संरक्षित संपत्तियों में नकद भंडार का 4% स्थानांतरित करने पर विचार करें।'
                  : 'Consider shifting 4% of cash reserves to inflation-protected assets to hedge against the rapid velocity shifts predicted for Q4.'}
              </p>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-50">
        <div className="glass-panel border border-primary/20 rounded-full flex items-center p-2 shadow-2xl">
          <div className="flex-1 flex items-center px-4 gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant" 
              placeholder={t('story.ask.placeholder')} 
              type="text"
            />
          </div>
          <button className="bg-primary text-on-primary h-10 px-6 rounded-full font-label text-xs font-bold hover:bg-primary-dim transition-all active:scale-95">
            {t('story.ask.button')}
          </button>
        </div>
      </div>
    </div>
  );
}

function AnalyticsIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  );
}

function Wallet(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
  );
}

function Shield(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><circle cx="12" cy="11" r="3"/><path d="M7 18a5.2 5.2 0 0 1 10 0"/></svg>
  );
}
