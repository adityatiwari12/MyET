import { Bell, Search, ArrowUp, Volume2, Sparkles } from 'lucide-react';
import { MOCK_STORIES, Story } from '../constants';
import { motion } from 'motion/react';
import { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface BriefingProps {
  onStoryClick: (story: Story) => void;
}

export function Briefing({ onStoryClick }: BriefingProps) {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const handleListen = async (e: React.MouseEvent, story: Story) => {
    e.stopPropagation();
    if (speakingId === story.id) return;
    setSpeakingId(story.id);
    try {
      const title = language === 'hi' ? (story.titleHi || story.title) : story.title;
      const insights = language === 'hi' ? (story.insightsHi || story.insights) : story.insights;
      const mattersToYou = language === 'hi' ? (story.mattersToYouHi || story.mattersToYou) : story.mattersToYou;
      
      const textToRead = `${title}. ${insights.join('. ')}. ${mattersToYou}`;
      const audioUrl = await geminiService.textToSpeech(textToRead);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.onended = () => setSpeakingId(null);
        audio.play();
      } else {
        setSpeakingId(null);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setSpeakingId(null);
    }
  };

  return (
    <div className="pb-32">
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 h-16 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/20">
              <img 
                alt="User profile" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8wKjcVCIrVmeADhrLXObmnfyWgsFgMuSUyhEDCMvWsqu-NoD8Y8mHyDv7jiMeM1C-8shfk4AZXojluH_HSkKDFZMiOp-Kfe48ZQ3xTzrneDEifZI8_3JYtkrop5053KgBSYDlmkOKvG3x6uTvgLGjWyqQuuZ1Xb7QtQEOjIE8MYXHaHukFifNIjjLrWMoe_dNGVeRSLOhR9IziECDR0If38YbxdKCUs2ulwY6nuvihVt84PTV9tx0jiT21KD5pTggbRuU7d7vVA" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-headline italic text-2xl tracking-tight text-primary">MyET</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant -mt-1">
                {t('story.tagline')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-on-surface p-2 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-4xl mx-auto space-y-12">
        {MOCK_STORIES.map((story, idx) => {
          const title = language === 'hi' ? (story.titleHi || story.title) : story.title;
          const category = language === 'hi' ? (story.categoryHi || story.category) : story.category;
          const updateInfo = language === 'hi' ? (story.updateInfoHi || story.updateInfo) : story.updateInfo;
          const readTime = language === 'hi' ? (story.readTimeHi || story.readTime) : story.readTime;
          const insights = language === 'hi' ? (story.insightsHi || story.insights) : story.insights;
          const mattersToYou = language === 'hi' ? (story.mattersToYouHi || story.mattersToYou) : story.mattersToYou;

          return (
            <motion.article 
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onStoryClick(story)}
              className="bg-surface-container-low p-8 border-l-2 border-primary/20 cursor-pointer group hover:border-primary/40 transition-all"
            >
              <header className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label text-xs text-primary uppercase tracking-[0.2em]">
                    {updateInfo || category}
                  </span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => handleListen(e, story)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-label uppercase tracking-widest transition-all ${
                        speakingId === story.id 
                          ? 'bg-primary text-on-primary animate-pulse' 
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary'
                      }`}
                    >
                      <div className="relative">
                        <Volume2 className="w-3 h-3" />
                        <Sparkles className="w-1.5 h-1.5 absolute -top-1 -right-1 text-primary-dim" />
                      </div>
                      {speakingId === story.id ? t('story.listening') : t('story.listen')}
                    </button>
                    <span className="font-label text-xs text-on-surface-variant">{readTime}</span>
                  </div>
                </div>
                <h2 className="font-headline text-3xl md:text-4xl text-on-surface leading-tight group-hover:text-primary transition-colors">
                  {title}
                </h2>
              </header>

              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3 space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 pb-1">{t('story.insights')}</h3>
                    <ul className="space-y-4">
                      {insights.map((insight, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="text-primary mt-1 text-xs font-label">0{i + 1}</span>
                          <p className="text-on-surface leading-relaxed text-sm">{insight}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-surface-container-high/50 rounded-sm">
                    <h4 className="font-label text-[10px] uppercase tracking-widest text-primary mb-3">{t('story.matters')}</h4>
                    <p className="text-on-surface-variant text-sm italic">{mattersToYou}</p>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <div className="aspect-video bg-surface-container-highest overflow-hidden rounded-sm">
                    <img 
                      alt={title} 
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500" 
                      src={story.imageUrl} 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {story.tags.map(tag => (
                      <span key={tag} className="bg-surface-container-highest px-3 py-1 text-[10px] font-label text-on-surface-variant tracking-wider uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </main>

      <div className="fixed bottom-24 left-0 w-full px-6 z-40 flex justify-center pointer-events-none">
        <div className="w-full max-w-2xl glass-panel rounded-full px-6 h-14 flex items-center border border-primary/20 pointer-events-auto shadow-2xl">
          <Sparkles className="w-5 h-5 text-primary mr-4" />
          <input 
            className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-on-surface-variant/50 font-body text-sm" 
            placeholder={t('ask.placeholder')} 
            type="text"
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden md:block bg-surface-container p-1 rounded-sm text-[10px] font-label text-on-surface-variant">CMD + K</kbd>
            <button className="bg-primary hover:bg-primary-dim text-on-primary w-8 h-8 rounded-full flex items-center justify-center transition-colors">
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
