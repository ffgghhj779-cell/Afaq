'use client';

import { motion } from "motion/react";
import { Shield, Lock, FileCheck, CheckCircle } from "lucide-react";
import { useLanguage } from "./language-provider";

export function TrustBadges() {
  const { t } = useLanguage();

  return (
    <section className="py-12 border-y border-white/5 bg-[#165DFF]/[0.02] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
      <div className="flex w-max animate-marquee items-center gap-16 px-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-16 items-center">
            <div className="flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Shield className="w-6 h-6 text-[#165DFF]" />
              <span className="font-[family-name:var(--font-serif)] text-lg tracking-widest uppercase">{t('اعتماد الأمن السيبراني (NCA)', 'NCA Compliant')}</span>
            </div>
            <div className="flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <FileCheck className="w-6 h-6 text-[#165DFF]" />
              <span className="font-sans font-light text-lg tracking-widest uppercase">{t('زاتكا المرحلة الثانية', 'ZATCA Phase 2')}</span>
            </div>
            <div className="flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Lock className="w-6 h-6 text-[#165DFF]" />
              <span className="font-sans font-light text-lg tracking-widest uppercase">{t('متوافق مع PDPL', 'PDPL Certified')}</span>
            </div>
            <div className="flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <CheckCircle className="w-6 h-6 text-[#165DFF]" />
              <span className="font-[family-name:var(--font-serif)] text-lg tracking-wider uppercase">{t('آيزو 27001', 'ISO 27001')}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
