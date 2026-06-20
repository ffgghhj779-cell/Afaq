'use client';

import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { memo, useState, useCallback, useMemo, useEffect } from "react";
import { useLanguage } from "./language-provider";
import { BrandLockup } from "./brand-lockup";
import { LanguageSwitcher } from "./language-switcher";
import { pickTranslation } from "@/lib/i18n";
import { slideDown, mobileDrawer, mobileOverlay, mobileNavItem } from "@/lib/motion";

const navLinks = [
  { href: '/', ar: 'الرئيسية', en: 'Home', ur: 'ہوم' },
  { href: '/services', ar: 'الخدمات', en: 'Services', ur: 'خدمات' },
  { href: '/stores', ar: 'المتاجر', en: 'Stores', ur: 'اسٹورز' },
  { href: '/recruitment', ar: 'التوظيف', en: 'Careers', ur: 'ملازمتیں' },
  { href: '/contact', ar: 'تواصل معنا', en: 'Contact', ur: 'رابطہ' },
];

interface NavbarProps {
  onAIOpen?: () => void;
}

export const Navbar = memo(function Navbar({ onAIOpen }: NavbarProps) {
  const { language, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', mobileOpen);
    return () => document.body.classList.remove('menu-open');
  }, [mobileOpen]);

  const labelFor = useCallback(
    (link: (typeof navLinks)[number]) => pickTranslation(language, link.ar, link.en, link.ur),
    [language],
  );

  const drawerFromRight = language === 'ar' || language === 'ur';
  const drawerMotion = useMemo(() => mobileDrawer(drawerFromRight), [drawerFromRight]);

  return (
    <>
      <motion.nav
        className="h-[72px] flex items-center justify-between gap-3 px-4 sm:px-5 md:px-[60px] border-b border-white/5 shrink-0 bg-[#050505]/70 backdrop-blur-xl sticky top-0 z-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)]"
        {...slideDown}
      >
        <BrandLockup markSize={32} className="min-w-0 flex-1 md:flex-none" />

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="small-caps hover:text-[#165DFF] transition-colors duration-300 relative group py-2"
            >
              {labelFor(link)}
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#165DFF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center gpu-motion" />
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <LanguageSwitcher className="hidden sm:flex" />

          {/* AI Button */}
          <motion.button
            onClick={onAIOpen}
            whileTap={{ scale: 0.96 }}
            className="glass-pill gpu-motion flex items-center justify-center gap-2 group"
          >
            <Zap className="w-3.5 h-3.5 text-[#165DFF] group-hover:animate-pulse flex-shrink-0" />
            <span className="hidden sm:inline">{t('المساعدة الذكية', 'AI Assistant', 'AI معاون')}</span>
            <span className="sm:hidden">AI</span>
          </motion.button>

          {/* Mobile Hamburger */}
          <motion.button
            type="button"
            className="touch-target gpu-motion md:hidden flex items-center justify-center text-white/80 hover:text-white transition-opacity duration-200"
            onClick={toggleMobile}
            whileTap={{ scale: 0.92 }}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              {...mobileOverlay}
              className="gpu-motion fixed inset-0 bg-black/65 z-40 md:hidden"
              onClick={closeMobile}
              aria-hidden
            />

            <motion.div
              {...drawerMotion}
              className="gpu-motion fixed top-0 bottom-0 rtl:right-0 ltr:left-0 w-[min(85vw,320px)] bg-[#080808] border-white/5 z-50 md:hidden flex flex-col pt-[72px] rtl:border-l ltr:border-r"
              role="dialog"
              aria-modal="true"
              aria-label={t('القائمة', 'Navigation menu', 'نیویگیشن')}
            >
              <nav className="flex flex-col px-5 py-4 gap-0.5">
                {navLinks.map((link) => (
                  <motion.div key={link.href} {...mobileNavItem}>
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      className="touch-target flex items-center min-h-[48px] px-1 text-[#bbb] hover:text-[#165DFF] active:text-[#165DFF] transition-colors duration-150 border-b border-white/5 text-sm tracking-wide"
                    >
                      {labelFor(link)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="px-5 mt-auto pb-10 pt-6 border-t border-white/5">
                <p className="small-caps text-[#444] mb-3 px-1">{t('اللغة', 'Language', 'زبان')}</p>
                <LanguageSwitcher onSelect={closeMobile} layout="mobile" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});
