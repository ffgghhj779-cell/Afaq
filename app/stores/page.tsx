'use client';

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/components/language-provider";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function StoresPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans flex flex-col overflow-x-hidden selection:bg-[#165DFF]/30 relative">
      <div className="mesh-bg" />
      <Navbar />

      <main className="flex-1 flex flex-col relative z-10">
        <section className="py-32 px-6 lg:px-[60px]">
          <motion.div 
            className="max-w-[1200px] mx-auto"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="small-caps-primary mb-4" style={{ color: '#165DFF' }}>{t('المتاجر الإلكترونية', 'E-COMMERCE')}</motion.div>
            <motion.h1 variants={fadeUp} className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl mb-12 tracking-tighter">{t('أنشئ متجرك بثقة', 'Build Your Store with Confidence')}</motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-[#aaaaaa] max-w-2xl font-light mb-16 leading-[1.6]">
              {t('حلول تجارة إلكترونية متكاملة للمؤسسات السعودية، متطابقة مع كافة قوانين ونظم الدفع والتجارة الداخلية.', 'Integrated e-commerce solutions for Saudi enterprises, compliant with all local laws, payment, and internal trade systems.')}
            </motion.p>

            <motion.div variants={fadeUp} className="stat-card glass-dark flex flex-col md:flex-row items-center justify-between gap-8 p-12 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#165DFF]/5 pointer-events-none" />
              <div className="relative z-10">
                <ShoppingBag className="w-12 h-12 text-[#165DFF] mb-6" />
                <h3 className="text-4xl mb-4 font-light tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{t('إدارة متكاملة لمتجرك', 'Integrated Store Management')}</h3>
                <p className="text-lg text-[#aaaaaa] leading-[1.8] max-w-lg font-light">
                  {t('من إدارة المخزون وحتى التحصيل الضريبي وتوليد الفواتير بشكل يتوافق مباشرة مع هيئة الزكاة والضريبة والجمارك (فاتورة).', 'From inventory management to tax collection and invoice generation, directly complying with ZATCA (Fatoora).')}
                </p>
              </div>
              <div className="relative z-10">
                <button className="btn-primary whitespace-nowrap flex items-center gap-3 group text-lg px-8 py-4">
                  {t('تأسيس متجر', 'Establish a Store')} <ArrowLeft className="w-5 h-5 rtl:group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
