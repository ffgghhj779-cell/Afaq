'use client';

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowLeft, Layers, ShieldCheck, Cpu } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/components/language-provider";

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function ServicesPage() {
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
            <motion.div variants={fadeUp} className="small-caps-primary mb-4" style={{ color: '#165DFF' }}>{t('الخدمات', 'SERVICES')}</motion.div>
            <motion.h1 variants={fadeUp} className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl mb-12 tracking-tighter">{t('حلول تقنية متكاملة', 'Integrated Tech Solutions')}</motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-[#aaaaaa] max-w-2xl font-light mb-20 leading-[1.6]">
              {t('نقدم مجموعة من الخدمات المصممة خصيصاً للارتقاء بأعمالك وتلبية جميع المتطلبات التنظيمية والتقنية الحديثة.', 'We offer a range of services specifically designed to elevate your business and meet all modern organizational and technical requirements.')}
            </motion.p>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: t('الوكلاء الأذكياء (Agents)', 'Smart Agents'), icon: Cpu, desc: t('تكامل مع منظومة الذكاء الاصطناعي الأوتوماتيكي لتقليل المهام الروتينية.', 'Integration with the automated AI ecosystem to reduce routine tasks.') },
                { title: t('الامتثال التلقائي', 'Automated Compliance'), icon: ShieldCheck, desc: t('توافق كامل مع Phase 2 للفوترة الإلكترونية وتطبيق معايير PDPL.', 'Full compatibility with e-invoicing Phase 2 and implementation of PDPL standards.') },
                { title: t('بنية تحتية سحابية', 'Cloud Infrastructure'), icon: Layers, desc: t('استضافة سحابية محلية داخل السعودية بنسبة جاهزية 99.9%.', 'Local cloud hosting within Saudi Arabia with 99.9% uptime.') },
                { title: t('الدعم الفني والعمليات', 'Technical Support & Ops'), icon: Cpu, desc: t('دعم تقني متواصل وإدارة سلسة للعمليات لضمان أداء مستقر.', 'Continuous technical support and seamless operations management to ensure stable performance.') },
                { title: t('التسويق المدعوم بالذكاء', 'AI-Powered Marketing'), icon: Layers, desc: t('تحليل البيانات وإطلاق حملات موجهة بشكل دقيق.', 'Data analysis and the launch of highly targeted campaigns.') },
                { title: t('الأمن السيبراني', 'Cybersecurity'), icon: ShieldCheck, desc: t('حماية متقدمة استباقية ضد التهديدات وحفاظ على سرية البيانات.', 'Advanced proactive protection against threats and maintaining data confidentiality.') }
              ].map((service, idx) => (
                <motion.div key={idx} variants={fadeUp} className="stat-card glass-panel group cursor-pointer hover:bg-white/5 transition-all duration-500">
                  <service.icon className="w-8 h-8 text-[#165DFF] mb-6 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-xl mb-3 group-hover:text-[#165DFF] transition-colors">{service.title}</h3>
                  <p className="text-sm text-[#888888] leading-[1.6] mb-8">{service.desc}</p>
                  <button className="flex items-center gap-2 text-sm text-[#f0f0f0] group-hover:text-[#165DFF] font-medium transition-colors">
                    {t('اكتشف المزيد', 'Discover More')} <ArrowLeft className="w-3 h-3 transition-transform rtl:group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
