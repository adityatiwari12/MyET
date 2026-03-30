import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { INTERESTS, INTERESTS_HI } from '../constants';
import { ChevronRight, ChevronLeft, Sparkles, Check, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { ApiService } from '../services/apiService';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const { language, setLanguage, t } = useLanguage();
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [investments, setInvestments] = useState<string[]>([]);
  const [risk, setRisk] = useState('');
  const [horizon, setHorizon] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [family, setFamily] = useState('');
  const [incomeRange, setIncomeRange] = useState('');
  const [financialGoal, setFinancialGoal] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentInterests = language === 'hi' ? INTERESTS_HI : INTERESTS;

  const statesAndCities = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore"],
    "Delhi": ["New Delhi"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
    "Telangana": ["Hyderabad", "Warangal"],
    "West Bengal": ["Kolkata", "Darjeeling", "Siliguri"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Agra"]
  };

  const occupations = [
    { id: 'salaried', labelEn: 'Salaried Professional', labelHi: 'वेतनभोगी पेशेवर' },
    { id: 'business', labelEn: 'Business Owner', labelHi: 'व्यवसाय के स्वामी' },
    { id: 'self_employed', labelEn: 'Self-Employed / Freelancer', labelHi: 'स्व-नियोजित / फ्रीलांसर' },
    { id: 'student', labelEn: 'Student', labelHi: 'छात्र' },
    { id: 'retired', labelEn: 'Retired', labelHi: 'सेवानिवृत्त' }
  ];

  const familyStatuses = [
    { id: 'single', labelEn: 'Single', labelHi: 'अविवाहित' },
    { id: 'married', labelEn: 'Married', labelHi: 'विवाहित' },
    { id: 'married_kids', labelEn: 'Married with Kids', labelHi: 'विवाहित (बच्चों के साथ)' },
    { id: 'other', labelEn: 'Other', labelHi: 'अन्य' }
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleInvestment = (inv: string) => {
    setInvestments(prev => 
      prev.includes(inv) 
        ? prev.filter(i => i !== inv)
        : [...prev, inv]
    );
  };

  const nextStep = () => {
    setError('');
    // Basic validation before allowing next step
    if (step === 1) {
      if (!name || !email || !password) {
        setError('Name, Email, and Password are required to create your account.');
        return;
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };
  
  const prevStep = () => {
    setError('');
    setStep(s => Math.max(s - 1, 0));
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const payload = {
        email,
        password,
        name,
        state,
        city,
        occupation,
        familyStatus: family,
        language,
        financialGoal,
        investments,
        riskTolerance: risk,
        investmentHorizon: horizon,
        incomeRange,
        interests: selectedInterests
      };

      const response = await ApiService.register(payload);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        onComplete();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const investmentOptions = [
    { id: 'realestate', label: t('onboarding.realestate') },
    { id: 'stocks', label: t('onboarding.stocks') },
    { id: 'crypto', label: t('onboarding.crypto') },
    { id: 'fd', label: t('onboarding.fd') },
  ];

  const goalOptions = [
    { id: 'wealth', label: t('onboarding.goal.wealth') },
    { id: 'retirement', label: t('onboarding.goal.retirement') },
    { id: 'house', label: t('onboarding.goal.house') },
    { id: 'education', label: t('onboarding.goal.education') },
  ];

  const riskOptions = [
    { id: 'low', label: t('onboarding.risk.low') },
    { id: 'medium', label: t('onboarding.risk.medium') },
    { id: 'high', label: t('onboarding.risk.high') },
  ];

  const horizonOptions = [
    { id: 'short', label: t('onboarding.horizon.short') },
    { id: 'medium', label: t('onboarding.horizon.medium') },
    { id: 'long', label: t('onboarding.horizon.long') },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-tertiary/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-xl z-10">
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant/20 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">{t('onboarding.welcome')}</h1>
          <p className="font-body text-on-surface-variant text-lg">{t('onboarding.subtitle')}</p>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/20 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-surface-container-highest">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${((step + 1) / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm border border-error/20">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-headline text-2xl font-medium mb-6">Language Preference</h2>
                <div className="grid grid-cols-1 gap-4">
                  <label className="flex items-center justify-between p-4 bg-surface-container cursor-pointer group hover:bg-surface-container-high transition-colors rounded-lg" onClick={() => setLanguage('en')}>
                    <div className="flex flex-col">
                      <span className="font-body font-semibold">English (Global)</span>
                      <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-tight">Primary Business Intel</span>
                    </div>
                    <div className={cn(
                      "w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors",
                      language === 'en' ? "border-primary bg-primary" : "border-outline-variant group-hover:border-on-surface-variant"
                    )}>
                      {language === 'en' && <Check className="w-3 h-3 text-on-primary" />}
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-4 bg-surface-container cursor-pointer group hover:bg-surface-container-high transition-colors rounded-lg" onClick={() => setLanguage('hi')}>
                    <div className="flex flex-col">
                      <span className="font-body font-semibold">Hindi (हिन्दी)</span>
                      <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-tight">Regional Insights</span>
                    </div>
                    <div className={cn(
                      "w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors",
                      language === 'hi' ? "border-primary bg-primary" : "border-outline-variant group-hover:border-on-surface-variant"
                    )}>
                      {language === 'hi' && <Check className="w-3 h-3 text-on-primary" />}
                    </div>
                  </label>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-headline text-2xl font-medium mb-6">{t('onboarding.step1.title')}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">Name *</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-surface-container p-4 rounded-lg border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">Email *</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-surface-container p-4 rounded-lg border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface" 
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">Password *</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-container p-4 rounded-lg border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface" 
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">{t('onboarding.state')}</label>
                      <select 
                        value={state}
                        onChange={e => { setState(e.target.value); setCity(''); }}
                        className="w-full bg-surface-container p-4 rounded-lg border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface"
                      >
                        <option value="">{t('onboarding.select_state')}</option>
                        {Object.keys(statesAndCities).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">{t('onboarding.city')}</label>
                      <select 
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        disabled={!state}
                        className="w-full bg-surface-container p-4 rounded-lg border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">{t('onboarding.select_city')}</option>
                        {state && statesAndCities[state as keyof typeof statesAndCities].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">{t('onboarding.occupation')}</label>
                    <select 
                      value={occupation}
                      onChange={e => setOccupation(e.target.value)}
                      className="w-full bg-surface-container p-4 rounded-lg border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface"
                    >
                      <option value="">{t('onboarding.select_occupation')}</option>
                      {occupations.map(o => (
                        <option key={o.id} value={o.id}>
                          {language === 'hi' ? o.labelHi : o.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">{t('onboarding.family')}</label>
                    <select 
                      value={family}
                      onChange={e => setFamily(e.target.value)}
                      className="w-full bg-surface-container p-4 rounded-lg border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface"
                    >
                      <option value="">{t('onboarding.select_family')}</option>
                      {familyStatuses.map(f => (
                        <option key={f.id} value={f.id}>
                          {language === 'hi' ? f.labelHi : f.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="font-headline text-2xl font-medium mb-6">{t('onboarding.step2.title')}</h2>
                
                <div className="space-y-4">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">{t('onboarding.goal')}</label>
                  <select className="w-full bg-surface-container p-4 rounded-lg border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface appearance-none">
                    <option value="">Select a goal...</option>
                    {goalOptions.map(g => (
                      <option key={g.id} value={g.id}>{g.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">{t('onboarding.investments')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {investmentOptions.map(inv => {
                      const isSelected = investments.includes(inv.id);
                      return (
                        <button
                          key={inv.id}
                          onClick={() => toggleInvestment(inv.id)}
                          className={cn(
                            "p-4 rounded-lg border text-left transition-all flex items-center justify-between",
                            isSelected 
                              ? "bg-primary-container border-primary/30 text-on-primary-container" 
                              : "bg-surface-container border-outline-variant/20 text-on-surface hover:border-outline-variant"
                          )}
                        >
                          <span className="font-body text-sm font-medium">{inv.label}</span>
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-headline text-2xl font-medium mb-6">{t('onboarding.step3.title')}</h2>
                
                <div className="space-y-4">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">{t('onboarding.income')}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ₹10L - ₹15L" 
                    value={incomeRange}
                    onChange={e => setIncomeRange(e.target.value)}
                    className="w-full bg-surface-container p-4 rounded-lg border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface" 
                  />
                </div>

                <div className="space-y-4">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">{t('onboarding.risk')}</label>
                  <div className="grid grid-cols-1 gap-3">
                    {riskOptions.map(r => {
                      const isSelected = risk === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => setRisk(r.id)}
                          className={cn(
                            "p-4 rounded-lg border text-left transition-all flex items-center justify-between",
                            isSelected 
                              ? "bg-primary-container border-primary/30 text-on-primary-container" 
                              : "bg-surface-container border-outline-variant/20 text-on-surface hover:border-outline-variant"
                          )}
                        >
                          <span className="font-body text-sm font-medium">{r.label}</span>
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">{t('onboarding.horizon')}</label>
                  <select 
                    value={horizon}
                    onChange={(e) => setHorizon(e.target.value)}
                    className="w-full bg-surface-container p-4 rounded-lg border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-on-surface appearance-none"
                  >
                    <option value="">Select horizon...</option>
                    {horizonOptions.map(h => (
                      <option key={h.id} value={h.id}>{h.label}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-headline text-2xl font-medium mb-6">{t('onboarding.step4.title')}</h2>
                <div className="flex flex-wrap gap-2">
                  {currentInterests.map((interest, idx) => {
                    const englishInterest = INTERESTS[idx];
                    const isSelected = selectedInterests.includes(englishInterest);
                    return (
                      <button 
                        key={interest}
                        onClick={() => toggleInterest(englishInterest)}
                        className={cn(
                          "px-4 py-2 text-sm font-medium border rounded-full transition-all",
                          isSelected 
                            ? "bg-primary text-on-primary border-primary" 
                            : "bg-surface-container text-on-surface border-outline-variant/20 hover:border-outline-variant"
                        )}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between pt-6 border-t border-outline-variant/10">
            <button 
              onClick={prevStep}
              disabled={isSubmitting}
              className={cn(
                "flex items-center gap-2 px-4 py-2 font-label text-xs uppercase tracking-widest transition-colors",
                step === 0 ? "opacity-0 pointer-events-none" : "text-on-surface-variant hover:text-on-surface",
                isSubmitting && "opacity-50 pointer-events-none"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              {t('onboarding.back')}
            </button>
            
            {step < 4 ? (
              <button 
                onClick={nextStep}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label text-xs uppercase tracking-widest hover:bg-primary-dim transition-all active:scale-95 disabled:opacity-50"
              >
                {t('onboarding.next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label text-xs uppercase tracking-widest hover:bg-primary-dim transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    Creating Account...
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    {t('onboarding.complete')}
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
