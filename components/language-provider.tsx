'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { isRTL, pickTranslation, readStoredLanguage, isLanguage, DEFAULT_LANGUAGE } from '@/lib/i18n';

export type Language = 'ar' | 'en' | 'ur';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (arText: string, enText: string, urText?: string) => string;
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function applyDocumentLanguage(language: Language) {
  const rtl = isRTL(language);
  document.documentElement.lang = language;
  document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  localStorage.setItem('afaq-lang', language);

  document.documentElement.classList.remove('font-ar', 'font-en', 'font-ur');
  if (language === 'en') {
    document.documentElement.classList.add('font-en');
  } else if (language === 'ur') {
    document.documentElement.classList.add('font-ar');
  } else {
    document.documentElement.classList.add('font-ar');
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    typeof window !== 'undefined' ? readStoredLanguage() : DEFAULT_LANGUAGE,
  );

  useEffect(() => {
    applyDocumentLanguage(language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    if (!isLanguage(lang)) return;
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (arText: string, enText: string, urText?: string) =>
      pickTranslation(language, arText, enText, urText),
    [language],
  );

  const rtl = isRTL(language);

  const value = useMemo(
    () => ({ language, setLanguage, t, isRTL: rtl }),
    [language, setLanguage, t, rtl],
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
