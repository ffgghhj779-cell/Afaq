'use client';

import { memo, useCallback } from 'react';
import { useLanguage, type Language } from './language-provider';
import { LANGUAGES, LANGUAGE_LABELS } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  onSelect?: () => void;
}

export const LanguageSwitcher = memo(function LanguageSwitcher({
  className = '',
  onSelect,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const select = useCallback(
    (lang: Language) => {
      if (lang !== language) {
        setLanguage(lang);
      }
      onSelect?.();
    },
    [language, setLanguage, onSelect],
  );

  return (
    <div className={`flex items-center gap-1 ${className}`} role="group" aria-label="Language">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => select(lang)}
          aria-pressed={language === lang}
          aria-label={LANGUAGE_LABELS[lang]}
          className={`min-w-[2.25rem] px-2 py-1 text-[10px] tracking-widest uppercase transition-colors duration-200 border ${
            language === lang
              ? 'border-[#165DFF] text-[#165DFF] bg-[#165DFF]/10'
              : 'border-white/10 text-[#666] hover:border-white/30 hover:text-white'
          }`}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
});
