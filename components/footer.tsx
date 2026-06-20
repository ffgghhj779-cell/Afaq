'use client';

import Link from "next/link";
import { useLanguage } from "./language-provider";
import { Logo } from "./logo";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="h-auto md:h-[120px] py-10 md:py-0 flex flex-col md:flex-row items-center justify-between px-6 md:px-[60px] border-t border-white/10 gap-8 md:gap-0 shrink-0">
      <div className="flex flex-col md:flex-row gap-10 md:gap-[60px] items-start w-full md:w-auto">
        <Logo height={28} className="md:hidden mb-2" />
        <div className="flex flex-col gap-1">
          <span className="small-caps">{t('المركز الرئيسي', 'Headquarters')}</span>
          <span className="text-xs text-[#666666]">{t('الرياض، المملكة العربية السعودية', 'Riyadh, Saudi Arabia')}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="small-caps">{t('موثوقية النظام', 'System Reliability')}</span>
          <span className="text-xs text-[#666666]">&lt; 400ms TTFB</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center md:items-end gap-1 w-full md:w-auto mt-4 md:mt-0">
        <div className="flex gap-[20px] mb-1">
          <Link href="#" className="small-caps text-white hover:text-[#165DFF] transition-colors">{t('الخصوصية', 'Privacy')}</Link>
          <Link href="#" className="small-caps text-white hover:text-[#165DFF] transition-colors">{t('الشروط', 'Terms')}</Link>
        </div>
        <span className="text-[10px] text-[#444444]">© 2026 AFAQ. Elite Saudi Enterprise Technology.</span>
      </div>
    </footer>
  );
}
