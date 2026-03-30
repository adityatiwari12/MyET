import { Bell, Wallet, Lock, LogOut, ChevronRight, Check } from 'lucide-react';
import { INTERESTS, INTERESTS_HI } from '../constants';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ApiService } from '../services/apiService';

interface ProfileProps {
  onLogout?: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
  const { language, setLanguage, t } = useLanguage();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [stats, setStats] = useState({ totalRead: 0, interactions: 0 });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [meData, statsData] = await Promise.all([
          ApiService.getMe(),
          ApiService.getStats()
        ]);
        if (meData.user) {
          setUser(meData.user);
          if (meData.user.preferences?.interests) {
            setSelectedInterests(meData.user.preferences.interests);
          } else {
             // Fallback default
             setSelectedInterests(["NSE/BSE", "Indian Fintech", "RBI Policy"]);
          }
        }
        if (statsData.stats) {
          setStats({
            totalRead: statsData.stats.read || 0,
            interactions: (statsData.stats.likes || 0) + (statsData.stats.shares || 0) + (statsData.stats.saves || 0)
          });
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
      }
    };
    loadProfileData();
  }, []);

  const toggleInterest = async (interest: string) => {
    const newInterests = selectedInterests.includes(interest) 
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
      
    // Optimistic UI update
    setSelectedInterests(newInterests);
    
    // Sync with backend
    try {
      await ApiService.updateProfile({ preferences: { interests: newInterests } });
    } catch (err) {
      console.error("Failed to update preferences:", err);
      // Revert if failed (simplistic approach)
    }
  };

  const currentInterests = language === 'hi' ? INTERESTS_HI : INTERESTS;

  return (
    <div className="pb-32">
      <header className="bg-surface text-primary flex justify-between items-center px-6 h-16 w-full fixed top-0 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20">
            {user ? (
               <div className="w-full h-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm uppercase">
                 {user.name ? user.name.charAt(0) : user.email.charAt(0)}
               </div>
            ) : (
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7Dy1ZOoG3qrGYaWceTkSldxv0x6ibiWt4DvI3CFL_F1lULhSBoXx1ZOXUtftSJloX6-AdPKEPC097pOB24EK_G93py1LFs8tF1KMZZYRD-GgDHwft9kGSYO9n0folte6YCT6eClFCMqi7ZarN8kCttvsLiyd2jiRC-OaPo3ZyrivXjEFYlGNdp2fW5vpif2Vy0m2Xc86vl21B2o6hDKImrwNRvUZKzxLOcXXGA_OVyurHtplylCp5eQoeWXRAlyPGh8V9BxWnng" 
                referrerPolicy="no-referrer"
                alt="Profile avatar"
              />
            )}
          </div>
          <span className="font-headline italic text-2xl tracking-tight text-primary">MyET</span>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-on-surface-variant" />
        </div>
      </header>

      <main className="max-w-screen-md mx-auto px-6 pt-24 space-y-12">
        <section className="space-y-2">
          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface">
            {user ? `Hi, ${user.name || user.email.split('@')[0]}` : t('profile.title')}
          </h1>
          <p className="font-body text-on-surface-variant max-w-prose text-lg">{t('profile.subtitle')}</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-1">
          <StatCard label={t('profile.stat.briefs')} value={stats.totalRead.toString()} />
          <StatCard label={t('profile.stat.insights')} value={stats.interactions.toString()} />
          <StatCard label={t('profile.stat.rank')} value="Top 5%" />
        </section>

        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-outline-variant/10 pb-2">
            <h2 className="font-label text-xs uppercase tracking-widest text-primary">{t('profile.interests')}</h2>
            <span className="font-label text-[10px] text-on-surface-variant">{selectedInterests.length} {t('profile.selected')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentInterests.map((interest, idx) => {
              const englishInterest = INTERESTS[idx];
              const isSelected = selectedInterests.includes(englishInterest);
              return (
                <button 
                  key={interest}
                  onClick={() => toggleInterest(englishInterest)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium border transition-all",
                    isSelected 
                      ? "bg-primary-container text-on-primary-container border-primary/20" 
                      : "bg-surface-container-highest text-on-surface border-transparent hover:border-outline-variant"
                  )}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-outline-variant/10 pb-2">
            <h2 className="font-label text-xs uppercase tracking-widest text-primary">{t('profile.language')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LanguageCard 
              label="English (Global)" 
              sub="Primary Business Intel" 
              active={language === 'en'} 
              onClick={() => setLanguage('en')}
            />
            <LanguageCard 
              label="Hindi (हिन्दी)" 
              sub="Regional Insights" 
              active={language === 'hi'} 
              onClick={() => setLanguage('hi')}
            />
          </div>
        </section>

        <section className="space-y-4 pt-4">
          <SettingsLink icon={Wallet} label={t('profile.billing')} />
          <SettingsLink icon={Lock} label={t('profile.privacy')} />
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high transition-all text-left"
          >
            <div className="flex items-center gap-4 text-error">
              <LogOut className="w-5 h-5" />
              <span className="font-body">{t('profile.logout')}</span>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-surface-container-low p-6 space-y-1">
      <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</span>
      <p className="font-headline text-3xl font-medium">{value}</p>
    </div>
  );
}

function LanguageCard({ label, sub, active, onClick }: { label: string, sub: string, active?: boolean, onClick: () => void }) {
  return (
    <label className="flex items-center justify-between p-4 bg-surface-container-low cursor-pointer group hover:bg-surface-container-high transition-colors" onClick={onClick}>
      <div className="flex flex-col">
        <span className="font-body font-semibold">{label}</span>
        <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-tight">{sub}</span>
      </div>
      <div className={cn(
        "w-5 h-5 border-2 flex items-center justify-center",
        active ? "border-primary bg-primary" : "border-outline-variant group-hover:border-on-surface-variant"
      )}>
        {active && <Check className="w-4 h-4 text-on-primary" />}
      </div>
    </label>
  );
}

function SettingsLink({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high transition-all text-left">
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-on-surface-variant" />
        <span className="font-body">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-on-surface-variant" />
    </button>
  );
}
