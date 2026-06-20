import type { Language } from '@/components/language-provider';

export const LANGUAGES: Language[] = ['ar', 'en', 'ur'];

export const LANGUAGE_LABELS: Record<Language, string> = {
  ar: 'AR',
  en: 'EN',
  ur: 'UR',
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  ar: 'العربية',
  en: 'English',
  ur: 'اردو',
};

/** BCP-47 locale codes used by the API layer */
export const LOCALE_CODES: Record<Language, string> = {
  ar: 'ar-SA',
  en: 'en-GB',
  ur: 'ur-PK',
};

export function isRTL(language: Language): boolean {
  return language === 'ar' || language === 'ur';
}

export function isLanguage(value: string): value is Language {
  return value === 'ar' || value === 'en' || value === 'ur';
}

export function pickTranslation(
  language: Language,
  ar: string,
  en: string,
  ur?: string,
): string {
  if (language === 'ar') return ar;
  if (language === 'ur') return ur ?? ar;
  return en;
}

export function readStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'ar';
  const stored = localStorage.getItem('afaq-lang');
  return stored && isLanguage(stored) ? stored : 'ar';
}
