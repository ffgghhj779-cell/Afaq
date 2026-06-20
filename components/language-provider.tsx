'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

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

  useEffect(() => {
    const storedLang = localStorage.getItem('afaq-lang') as Language;
    if (storedLang && ['ar', 'en', 'ur'].includes(storedLang)) {
      setLanguageState(storedLang);
    }
  }, []);

  useEffect(() => {
    const isRTL = language === 'ar' || language === 'ur';
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem('afaq-lang', language);

    document.documentElement.classList.remove('font-ar', 'font-en', 'font-ur');
    if (language === 'en') {
      document.documentElement.classList.add('font-en');
    } else {
      document.documentElement.classList.add('font-ar');
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (arText: string, enText: string, urText?: string): string => {
      if (language === 'ar') return arText;
      if (language === 'ur') return urText ?? arText;
      return enText;
    },
    [language],
  );

  const isRTL = language === 'ar' || language === 'ur';

  const value = useMemo(
    () => ({ language, setLanguage, t, isRTL }),
    [language, setLanguage, t, isRTL],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
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
