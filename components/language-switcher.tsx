'use client';

import { memo, useCallback } from 'react';
import { useLanguage, type Language } from './language-provider';
import { LANGUAGES, LANGUAGE_LABELS } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  onSelect?: () => void;
  layout?: 'inline' | 'mobile';
}

export const LanguageSwitcher = memo(function LanguageSwitcher({
  className = '',
  onSelect,
  layout = 'inline',
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

  const isMobile = layout === 'mobile';

  return (
    <div
      className={`flex items-center gap-1.5 ${isMobile ? 'w-full' : ''} ${className}`}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => select(lang)}
          aria-pressed={language === lang}
          aria-label={LANGUAGE_LABELS[lang]}
          className={`touch-target gpu-motion flex flex-1 items-center justify-center text-[11px] tracking-widest uppercase transition-colors duration-150 border ${
            isMobile ? 'min-h-[48px] px-4 py-3' : 'min-h-[44px] min-w-[2.75rem] px-3 py-2'
          } ${
            language === lang
              ? 'border-[#165DFF] text-[#165DFF] bg-[#165DFF]/10'
              : 'border-white/10 text-[#666] hover:border-white/30 hover:text-white active:border-[#165DFF]/50 active:text-white'
          }`}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
});
