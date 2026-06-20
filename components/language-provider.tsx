'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en' | 'ur';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (arText: string, enText: string, urText?: string) => string;
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('afaq-lang') as Language;
    if (storedLang && ['ar', 'en', 'ur'].includes(storedLang)) {
      setLanguageState(storedLang);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isRTL = language === 'ar' || language === 'ur';
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem('afaq-lang', language);

    document.documentElement.classList.remove('font-ar', 'font-en', 'font-ur');
    if (language === 'en') {
      document.documentElement.classList.add('font-en');
    } else {
      document.documentElement.classList.add('font-ar'); // Tajawal covers Arabic & Urdu
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (arText: string, enText: string, urText?: string): string => {
    if (language === 'ar') return arText;
    if (language === 'ur') return urText ?? arText;
    return enText;
  };

  const isRTL = language === 'ar' || language === 'ur';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.15s' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
