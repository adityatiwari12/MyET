import { Home, Compass, Sparkles, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: any) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const { t } = useLanguage();
  const navItems = [
    { id: 'briefing', label: t('nav.briefing'), icon: Home },
    { id: 'explore', label: t('nav.explore'), icon: Compass },
    { id: 'ask', label: t('nav.ask'), icon: Sparkles },
    { id: 'profile', label: t('nav.profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 pb-safe bg-surface/80 backdrop-blur-xl z-50 border-t border-outline-variant/10">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id || (currentScreen === 'story-detail' && item.id === 'briefing');
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 transition-all duration-300 rounded-sm",
              isActive ? "text-primary bg-surface-container-low" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <Icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
            <span className="font-label text-[10px] uppercase tracking-widest">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
