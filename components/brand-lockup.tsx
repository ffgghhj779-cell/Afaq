'use client';

import Link from 'next/link';
import { memo } from 'react';
import { AfaqLogoSvg } from './afaq-logo-svg';
import { useLanguage } from './language-provider';
import { pickTranslation } from '@/lib/i18n';

interface BrandLockupProps {
  className?: string;
  /** Logo mark size in px */
  markSize?: number;
}

export const BrandLockup = memo(function BrandLockup({
  className = '',
  markSize = 32,
}: BrandLockupProps) {
  const { language } = useLanguage();

  const brandName = pickTranslation(language, 'أفق', 'Afaq', 'افق');
  const slogan = pickTranslation(
    language,
    'الجيل القادم من الذكاء الاصطناعي',
    'The Next Generation of AI',
    'اگلی نسل کی مصنوعی ذہانت',
  );

  const isLatinBrand = language === 'en';

  return (
    <Link
      href="/"
      className={`group inline-flex min-w-0 flex-shrink items-center gap-2.5 text-white sm:gap-3 ${className}`}
      aria-label="AFAQ Home"
    >
      <AfaqLogoSvg
        height={markSize}
        className="block flex-shrink-0"
      />

      <div className="flex min-w-0 flex-col justify-center gap-[3px] leading-none">
        <span
          className={
            isLatinBrand
              ? 'font-[family-name:var(--font-inter)] text-[13px] font-semibold uppercase tracking-[0.18em] sm:text-[15px]'
              : 'font-[family-name:var(--font-tajawal)] text-[15px] font-extrabold tracking-tight sm:text-base'
          }
        >
          {brandName}
        </span>
        <span className="brand-slogan hidden min-[390px]:block max-w-[120px] truncate sm:max-w-[200px] md:max-w-none">
          {slogan}
        </span>
      </div>
    </Link>
  );
});
