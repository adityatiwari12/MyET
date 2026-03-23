import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi';

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.briefing': 'Briefing',
    'nav.explore': 'Explore',
    'nav.ask': 'Ask MyET',
    'nav.profile': 'Profile',
    'profile.title': 'Your MyET',
    'profile.subtitle': 'Curating the intelligence that drives your perspective.',
    'profile.stat.briefs': 'Daily Briefs',
    'profile.stat.insights': 'Insights Read',
    'profile.stat.rank': 'Network Rank',
    'profile.interests': 'Interests',
    'profile.selected': 'Selected',
    'profile.language': 'Intelligence Language',
    'profile.billing': 'Subscription & Billing',
    'profile.privacy': 'Privacy & AI Data Controls',
    'profile.logout': 'Terminate Session',
    'explore.following': 'Following',
    'explore.foryou': 'For You',
    'explore.refreshing': 'Refreshing Feed',
    'explore.deepdive': 'Deep Dive',
    'explore.save': 'Save',
    'explore.share': 'Share',
    'explore.ask': 'Ask MyET',
    'briefing.morning': 'Morning Briefing',
    'briefing.afternoon': 'Afternoon Briefing',
    'briefing.evening': 'Evening Briefing',
    'briefing.personalized': 'Personalized for you',
    'briefing.readtime': 'MIN READ',
    'story.insights': 'Key Insights',
    'story.matters': 'Why it matters to you',
    'story.tagline': 'Your world, today',
    'story.listen': 'Listen',
    'story.listening': 'Listening...',
    'story.tts.title': 'Convert text to speech',
    'story.tts.desc': 'Listen to a curated intelligence briefing of this story.',
    'story.tts.play': 'Listen Now',
    'story.tts.playing': 'Playing...',
    'story.summary.ai': 'AI Summary',
    'story.summary.summarizing': 'Summarizing...',
    'story.summary.deep': 'AI Deep Summary',
    'story.summary.exec': 'AI Executive Summary',
    'story.timeline.initial': 'Initial Announcement',
    'story.timeline.peak': 'Market Reaction Peak',
    'story.timeline.hearing': 'Regulatory Hearing',
    'story.mentioned': 'Mentioned',
    'story.impact.title': 'Impact on you',
    'story.impact.risk': 'Portfolio Risk',
    'story.impact.shift': 'Strategy Shift',
    'story.ask.placeholder': 'Ask MyET about this story...',
    'story.ask.button': 'ASK',
    'ask.placeholder': 'Ask anything about Indian finance...',
    'ask.suggested': 'Suggested Queries',
    'ask.analyzing': 'Analyzing markets...',
    'ask.ledger': 'Intelligence Ledger Response',
    'ask.live.active': 'Live Intelligence Session Active',
    'ask.live.connected': 'Real-time intelligence ledger connected. How can I assist you today?',
    'ask.listening': 'Listening...',
    'ask.query': 'QUERY',
  },
  hi: {
    'nav.briefing': 'ब्रीफिंग',
    'nav.explore': 'एक्सप्लोर',
    'nav.ask': 'MyET से पूछें',
    'nav.profile': 'प्रोफ़ाइल',
    'profile.title': 'आपका MyET',
    'profile.subtitle': 'उस बुद्धिमत्ता को क्यूरेट करना जो आपके दृष्टिकोण को संचालित करती है।',
    'profile.stat.briefs': 'दैनिक ब्रीफ',
    'profile.stat.insights': 'पढ़ी गई अंतर्दृष्टि',
    'profile.stat.rank': 'नेटवर्क रैंक',
    'profile.interests': 'रुचियां',
    'profile.selected': 'चयनित',
    'profile.language': 'बुद्धिमत्ता भाषा',
    'profile.billing': 'सदस्यता और बिलिंग',
    'profile.privacy': 'गोपनीयता और एआई डेटा नियंत्रण',
    'profile.logout': 'सत्र समाप्त करें',
    'explore.following': 'फॉलो कर रहे हैं',
    'explore.foryou': 'आपके लिए',
    'explore.refreshing': 'फ़ीड रिफ्रेश हो रही है',
    'explore.deepdive': 'गहराई से जानें',
    'explore.save': 'सहेजें',
    'explore.share': 'साझा करें',
    'explore.ask': 'MyET से पूछें',
    'briefing.morning': 'सुबह की ब्रीफिंग',
    'briefing.afternoon': 'दोपहर की ब्रीफिंग',
    'briefing.evening': 'शाम की ब्रीफिंग',
    'briefing.personalized': 'आपके लिए व्यक्तिगत',
    'briefing.readtime': 'मिनट की पढ़ाई',
    'story.insights': 'प्रमुख अंतर्दृष्टि',
    'story.matters': 'यह आपके लिए क्यों मायने रखता है',
    'story.tagline': 'आपकी दुनिया, आज',
    'story.listen': 'सुनें',
    'story.listening': 'सुन रहे हैं...',
    'story.tts.title': 'टेक्स्ट को स्पीच में बदलें',
    'story.tts.desc': 'इस कहानी की एक क्यूरेटेड इंटेलिजेंस ब्रीफिंग सुनें।',
    'story.tts.play': 'अभी सुनें',
    'story.tts.playing': 'चल रहा है...',
    'story.summary.ai': 'एआई सारांश',
    'story.summary.summarizing': 'संक्षिप्त कर रहे हैं...',
    'story.summary.deep': 'एआई डीप सारांश',
    'story.summary.exec': 'एआई कार्यकारी सारांश',
    'story.timeline.initial': 'प्रारंभिक घोषणा',
    'story.timeline.peak': 'बाजार प्रतिक्रिया शिखर',
    'story.timeline.hearing': 'नियामक सुनवाई',
    'story.mentioned': 'उल्लेखित',
    'story.impact.title': 'आप पर प्रभाव',
    'story.impact.risk': 'पोर्टफोलियो जोखिम',
    'story.impact.shift': 'रणनीति बदलाव',
    'story.ask.placeholder': 'इस कहानी के बारे में MyET से पूछें...',
    'story.ask.button': 'पूछें',
    'ask.placeholder': 'भारतीय वित्त के बारे में कुछ भी पूछें...',
    'ask.suggested': 'सुझाए गए प्रश्न',
    'ask.analyzing': 'बाजारों का विश्लेषण कर रहे हैं...',
    'ask.ledger': 'इंटेलिजेंस लेजर प्रतिक्रिया',
    'ask.live.active': 'लाइव इंटेलिजेंस सत्र सक्रिय',
    'ask.live.connected': 'रियल-टाइम इंटेलिजेंस लेजर कनेक्ट हो गया। मैं आज आपकी कैसे सहायता कर सकता हूँ?',
    'ask.listening': 'सुन रहे हैं...',
    'ask.query': 'पूछें',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
