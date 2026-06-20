'use client';

import Image from 'next/image';
import { memo } from 'react';
import { useLanguage } from './language-provider';
import { BRAND_LOGOS } from '@/lib/assets';

export const BrandsSection = memo(function BrandsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-14 border-y border-white/5 bg-white/[0.01] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
      <div className="px-6 lg:px-[60px] mb-8 relative z-20">
        <p className="small-caps-primary tracking-[0.35em] text-center">
          {t('علامات نثق بها', 'Brands We\'ve Worked With', 'برانڈز جن کے ساتھ کام کیا')}
        </p>
      </div>
      <div className="flex w-max animate-marquee items-center gap-14 px-8 gpu-motion">
        {[...Array(2)].map((_, loop) => (
          <div key={loop} className="flex items-center gap-14">
            {BRAND_LOGOS.map((brand) => (
              <div
                key={`${loop}-${brand.alt}`}
                className="flex h-10 w-[120px] flex-shrink-0 items-center justify-center opacity-50 grayscale transition-[opacity,transform] duration-300 hover:opacity-100 hover:grayscale-0"
              >
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={120}
                  height={40}
                  className="h-8 w-auto max-w-[120px] object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
});
