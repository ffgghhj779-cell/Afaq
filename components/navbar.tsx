'use client';

import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { memo, useState, useCallback, useMemo } from "react";
import { useLanguage } from "./language-provider";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { pickTranslation } from "@/lib/i18n";
import { slideDown } from "@/lib/motion";

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

  const labelFor = useCallback(
    (link: (typeof navLinks)[number]) => pickTranslation(language, link.ar, link.en, link.ur),
    [language],
  );

  const drawerFromRight = language === 'ar' || language === 'ur';
  const drawerMotion = useMemo(
    () => ({
      initial: { opacity: 0, x: drawerFromRight ? 320 : -320 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: drawerFromRight ? 320 : -320 },
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
    }),
    [drawerFromRight],
  );

  return (
    <>
      <motion.nav
        className="h-[72px] flex items-center justify-between px-5 md:px-[60px] border-b border-white/5 shrink-0 bg-[#050505]/70 backdrop-blur-xl sticky top-0 z-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)]"
        {...slideDown}
      >
        <Logo priority />

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="small-caps hover:text-[#165DFF] transition-colors duration-300 relative group"
            >
              {labelFor(link)}
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#165DFF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher className="hidden sm:flex" />

          {/* AI Button */}
          <motion.button
            onClick={onAIOpen}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="glass-pill flex items-center gap-2 group transition-transform duration-300"
          >
            <Zap className="w-3 h-3 text-[#165DFF] group-hover:animate-pulse flex-shrink-0" />
            <span className="hidden sm:inline">{t('المساعدة الذكية', 'AI Assistant', 'AI معاون')}</span>
            <span className="sm:hidden">AI</span>
          </motion.button>

          {/* Mobile Hamburger */}
          <motion.button
            className="md:hidden w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            onClick={toggleMobile}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobile}
            />

            {/* Drawer Panel */}
            <motion.div
              {...drawerMotion}
              className="fixed top-0 bottom-0 rtl:right-0 ltr:left-0 w-[75vw] max-w-[320px] bg-[#080808] border-l border-r border-white/5 z-50 md:hidden flex flex-col pt-[72px] will-change-transform"
            >
              <nav className="flex flex-col p-8 gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      className="flex items-center py-4 text-[#aaa] hover:text-[#165DFF] transition-colors duration-200 border-b border-white/5 text-sm tracking-widest uppercase"
                    >
                      {labelFor(link)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="px-8 mt-auto pb-12">
                <p className="small-caps text-[#444] mb-4">{t('اللغة', 'Language', 'زبان')}</p>
                <LanguageSwitcher onSelect={closeMobile} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});
