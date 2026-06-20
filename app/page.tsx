'use client';

import Link from "next/link";
import { useState } from "react";
import { PlayCircle, ArrowLeft, ShieldCheck, Cpu, Code, Layers, Star, Plus, TrendingUp, Clock, Globe } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TrustBadges } from "@/components/trust-badges";
import { RoiCalculator } from "@/components/roi-calculator";
import { TelemetryBar } from "@/components/telemetry";
import { AIAssistant } from "@/components/ai-assistant";
import { motion } from "motion/react";
import { useLanguage } from "@/components/language-provider";

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Page() {
  const { t, language } = useLanguage();
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] flex flex-col overflow-x-hidden selection:bg-[#165DFF]/30 relative">
      <div className="mesh-bg" />
      <Navbar onAIOpen={() => setAiOpen(true)} />
      <TelemetryBar />
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />

      <main className="flex-1 flex flex-col">

        {/* ──────────────────── HERO ──────────────────── */}
        <section className="flex flex-col lg:flex-row p-6 lg:p-[80px] gap-10 lg:gap-16 min-h-[calc(100vh-80px)] relative overflow-hidden bg-grid-faint">

          {/* Watermark text */}
          <div className="absolute top-[8%] rtl:right-[-8%] ltr:left-[-8%] text-[22vw] font-black text-white/[0.015] pointer-events-none select-none tracking-tighter leading-none z-0 mix-blend-overlay">{t('أفق', 'AFAQ')}</div>

          {/* Left Column */}
          <motion.div
            className="flex-[2] flex flex-col justify-center relative z-10 rtl:lg:pl-8 ltr:lg:pr-8"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
              <div className="w-10 h-[1px] bg-gradient-to-l rtl:from-[#165DFF] ltr:to-[#165DFF] from-transparent" />
              <div className="small-caps-primary tracking-[0.4em]">{t('الجيل القادم من الذكاء الاصطناعي — للسوق السعودي', 'NEXT-GEN AI FOR THE SAUDI MARKET', 'سعودی مارکیٹ کے لیے نئی نسل کا AI')}</div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-[family-name:var(--font-serif)] text-[clamp(56px,8vw,110px)] leading-[1.05] tracking-tighter font-extralight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-600 mb-8 relative"
            >
              <span className="absolute -inset-2 opacity-15 blur-3xl block bg-[#165DFF] rounded-full z-[-1]" />
              {t('أفق نحو', 'Horizon to', 'مستقبل کی طرف')}<br />
              <span className="font-bold text-white">{t('المستقبل.', 'the future.', 'افق۔')}</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl leading-[1.9] text-[#888] max-w-[500px] mb-12 font-light rtl:border-r-[2px] rtl:border-r-[#165DFF]/25 rtl:pr-6 ltr:border-l-[2px] ltr:border-l-[#165DFF]/25 ltr:pl-6">
              {t(
                'منظومة متكاملة مصممة للارتقاء بأعمالك وتلبية متطلبات السوق السعودي بكفاءة لا مثيل لها.',
                'An integrated ecosystem designed to elevate your business and meet the unique demands of the Saudi market with unmatched efficiency.',
                'ایک مربوط نظام جو آپ کے کاروبار کو بلند کرنے اور سعودی مارکیٹ کی ضروریات کو بے مثال کارکردگی کے ساتھ پورا کرنے کے لیے ڈیزائن کیا گیا ہے۔'
              )}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-6 items-center">
              <Link href="/contact" className="btn-primary flex items-center gap-4 group">
                <span className="tracking-widest">{t('ابدأ رحلتك', 'START YOUR JOURNEY', 'اپنا سفر شروع کریں')}</span>
                <ArrowLeft className="w-4 h-4 rtl:group-hover:-translate-x-2 ltr:group-hover:translate-x-2 ltr:rotate-180 transition-transform duration-500" />
              </Link>
              <button className="flex items-center gap-3 text-sm tracking-widest uppercase text-[#aaa] hover:text-white transition-colors duration-300 group">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#165DFF]/50 transition-colors relative">
                  <div className="absolute inset-0 border border-[#165DFF]/40 rounded-full animate-ping opacity-0 group-hover:opacity-100" />
                  <PlayCircle className="w-4 h-4 text-white" />
                </div>
                {t('شاهد العرض', 'WATCH DEMO', 'ڈیمو دیکھیں')}
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column — Asymmetric Bento Grid */}
          <motion.div
            className="flex-[1.3] relative z-10 mt-8 lg:mt-0"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            {/* Bento: 2 columns × 3 rows, cells span differently */}
            <div className="grid grid-cols-2 gap-3 h-full content-center">

              {/* Cell A: Large — AI System (spans 2 cols) */}
              <motion.div
                variants={fadeUp}
                className="col-span-2 stat-card glass-panel group relative overflow-hidden rtl:translate-x-4 ltr:-translate-x-4"
              >
                <div className="absolute top-0 rtl:right-0 ltr:left-0 w-1/3 h-[1px] bg-gradient-to-r from-[#165DFF] to-transparent" />
                <div className="flex justify-between items-start mb-3">
                  <div className="small-caps tracking-widest text-[#555]">{t('النظام الأساسي', 'CORE SYSTEM', 'مرکزی نظام')}</div>
                  <div className="text-[#165DFF] text-xs font-mono opacity-60">v3.1</div>
                </div>
                <div className="text-2xl lg:text-3xl font-light mb-3 tracking-tight">9-Agent AI System</div>
                <div className="text-xs text-[#666] leading-[1.8] max-w-[90%] font-light">
                  {t('تسعة وكلاء ذكاء اصطناعي في تناغم كامل لإدارة كل جانب من جوانب أعمالك.', '9 AI agents in perfect harmony managing every aspect of your business.', '9 AI ایجنٹس آپ کے کاروبار کے ہر پہلو کو سنبھالنے میں کامل ہم آہنگی کے ساتھ۔')}
                </div>
                <div className="absolute bottom-4 rtl:left-4 ltr:right-4 flex gap-1.5">
                  {['CO', 'BU', 'VI', 'AU', 'ZA', 'SU', 'QA', 'MK', 'SE'].map((agent) => (
                    <div key={agent} className="w-6 h-6 rounded-full bg-[#165DFF]/10 border border-[#165DFF]/20 flex items-center justify-center text-[7px] font-mono text-[#165DFF]/70 group-hover:border-[#165DFF]/40 transition-colors">
                      {agent}
                    </div>
                  ))}
                </div>
                <div className="pb-8" />
              </motion.div>

              {/* Cell B: Daily Processing */}
              <motion.div
                variants={fadeUp}
                className="stat-card glass-panel group hover:-translate-y-1 transition-all duration-700 relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <TrendingUp className="w-5 h-5 text-[#10B981] opacity-70" />
                  <div className="status-dot" />
                </div>
                <div className="small-caps mb-2 text-[#555]">{t('يومياً', 'DAILY', 'روزانہ')}</div>
                <div className="flex items-baseline gap-1">
                  <div className="text-[42px] font-light tracking-tighter group-hover:text-white transition-colors duration-500">10</div>
                  <div className="text-xl text-[#10B981] font-light">M+</div>
                </div>
                <div className="text-[10px] text-[#555] mt-1 tracking-wide uppercase">{t('معالجة', 'Operations', 'آپریشنز')}</div>
              </motion.div>

              {/* Cell C: Reliability */}
              <motion.div
                variants={fadeUp}
                className="stat-card glass-panel group hover:-translate-y-1 transition-all duration-700 lg:-translate-y-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <ShieldCheck className="w-5 h-5 text-[#165DFF] opacity-70" />
                  <div className="badge-emerald text-[9px]">{t('موثوق', 'SECURE', 'محفوظ')}</div>
                </div>
                <div className="small-caps mb-2 text-[#555]">{t('الجاهزية', 'UPTIME', 'اپ ٹائم')}</div>
                <div className="flex items-baseline gap-0.5">
                  <div className="text-[42px] font-light tracking-tighter group-hover:text-white transition-colors duration-500">99</div>
                  <div className="text-xl text-[#165DFF]">.9%</div>
                </div>
                <div className="text-[10px] text-[#555] mt-1 tracking-wide uppercase">SLA</div>
              </motion.div>

              {/* Cell D: ZATCA (spans 2 cols) */}
              <motion.div
                variants={fadeUp}
                className="col-span-2 stat-card glass-dark relative overflow-hidden group rtl:translate-x-2 ltr:-translate-x-2"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#165DFF]/50 to-transparent" />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="small-caps-primary mb-2 tracking-widest">{t('الامتثال', 'COMPLIANCE', 'تعمیل')}</div>
                    <div className="text-xl font-light">ZATCA Phase 2 ✓</div>
                    <div className="text-xs text-[#666] mt-1 font-light">PDPL · NCA · TLS 1.3 · AES-256</div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-2">
                      <div className="status-dot" />
                      <span className="text-[10px] text-[#10B981] tracking-widest uppercase">{t('نشط', 'ACTIVE', 'فعال')}</span>
                    </div>
                    <Globe className="w-8 h-8 text-[#165DFF]/30 group-hover:text-[#165DFF]/60 transition-colors duration-500" />
                  </div>
                </div>
              </motion.div>

              {/* Cell E: Response Time */}
              <motion.div
                variants={fadeUp}
                className="stat-card glass-panel group hover:-translate-y-1 transition-all duration-700"
              >
                <Clock className="w-5 h-5 text-[#165DFF]/50 mb-3" />
                <div className="small-caps mb-2 text-[#555]">TTFB</div>
                <div className="flex items-baseline gap-1">
                  <div className="text-[36px] font-light tracking-tighter group-hover:text-white transition-colors duration-500">&lt;400</div>
                  <div className="text-sm text-[#555]">ms</div>
                </div>
              </motion.div>

              {/* Cell F: Passwordless */}
              <motion.div
                variants={fadeUp}
                className="stat-card glass-panel group hover:-translate-y-1 transition-all duration-700 lg:-translate-y-3"
              >
                <Code className="w-5 h-5 text-[#10B981]/50 mb-3" />
                <div className="small-caps mb-2 text-[#555]">{t('دخول', 'AUTH', 'توثیق')}</div>
                <div className="text-sm text-white font-light leading-relaxed">{t('بدون كلمة مرور', 'Passwordless', 'پاس ورڈ کے بغیر')}</div>
                <div className="text-[10px] text-[#555] mt-1">Nafath · OTP · OAuth</div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        <div className="editorial-divider" />
        <TrustBadges />
        <div className="editorial-divider opacity-50" />

        {/* ──────────────────── FEATURES ──────────────────── */}
        <section className="py-32 px-6 lg:px-[60px] relative z-10">
          <motion.div
            className="max-w-[1200px] mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="small-caps-primary mb-4 tracking-[0.4em]">{t('المميزات الأساسية', 'CORE FEATURES', 'بنیادی خصوصیات')}</motion.div>
            <motion.h2 variants={fadeUp} className="font-[family-name:var(--font-serif)] text-[clamp(40px,5vw,70px)] mb-20 tracking-tighter font-extralight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
              {t('أربع ركائز تقود منظومتك', 'Four Pillars Driving Your Ecosystem', 'آپ کے نظام کو چلانے والے چار ستون')}
            </motion.h2>

            {/* Asymmetric features bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* Large feature */}
              <motion.div variants={fadeUp} className="lg:col-span-5 stat-card glass-dark group flex flex-col justify-between min-h-[260px]">
                <div>
                  <Cpu className="w-10 h-10 text-[#165DFF] mb-6 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-2xl mb-3 font-light">{t('ذكاء اصطناعي 9-Agent', '9-Agent AI', '9-ایجنٹ AI')}</h3>
                  <p className="text-sm text-[#777] leading-[1.7] font-light">{t('تكامل 9 وكلاء ذكاء اصطناعي لإدارة المهام التلقائية والمعقدة لحظياً.', 'Integration of 9 AI agents to manage automated and complex tasks in real-time.', '9 AI ایجنٹس کا انضمام جو ریئل ٹائم میں خودکار اور پیچیدہ کاموں کو سنبھالتا ہے۔')}</p>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {['Coordinator', 'Builder', 'Vision', 'ZATCA', 'Marketing'].map((a) => (
                    <span key={a} className="text-[9px] font-mono text-[#165DFF]/60 bg-[#165DFF]/5 border border-[#165DFF]/15 px-2 py-1 tracking-wider">{a}</span>
                  ))}
                </div>
              </motion.div>

              {/* Stack of 2 smaller */}
              <motion.div variants={fadeUp} className="lg:col-span-3 flex flex-col gap-5">
                <div className="stat-card glass-panel group flex-1 flex flex-col justify-between">
                  <ShieldCheck className="w-8 h-8 text-[#10B981] mb-4 group-hover:scale-110 transition-transform duration-500" />
                  <div>
                    <h3 className="text-lg mb-2">{t('امتثال زاتكا 2', 'ZATCA Phase 2', 'ZATCA فیز 2')}</h3>
                    <p className="text-xs text-[#777] leading-[1.6]">{t('متوافق 100% مع الفوترة الإلكترونية.', '100% e-invoicing compliant.', '100% ای انوائسنگ کے مطابق۔')}</p>
                  </div>
                </div>
                <div className="stat-card glass-panel group flex-1 flex flex-col justify-between">
                  <Layers className="w-8 h-8 text-[#165DFF] mb-4 group-hover:scale-110 transition-transform duration-500" />
                  <div>
                    <h3 className="text-lg mb-2">{t('أداء فائق', 'Ultra Performance', 'بے مثال کارکردگی')}</h3>
                    <p className="text-xs text-[#777] leading-[1.6]">{t('خوادم محلية &lt;400ms TTFB.', 'Local servers, &lt;400ms TTFB.', 'مقامی سرورز، 400 ملی سیکنڈ سے کم۔')}</p>
                  </div>
                </div>
              </motion.div>

              {/* Wide feature */}
              <motion.div variants={fadeUp} className="lg:col-span-4 stat-card glass-panel group flex flex-col justify-between min-h-[260px]">
                <div>
                  <Code className="w-10 h-10 text-[#10B981] mb-6 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-2xl mb-3 font-light">{t('مصمم بلا كلمات مرور', 'Passwordless by Design', 'پاس ورڈ کے بغیر ڈیزائن')}</h3>
                  <p className="text-sm text-[#777] leading-[1.7] font-light">{t('دخول آمن عبر الهوية الوطنية (نفاذ)، OTP، وبروتوكولات OAuth 2.0.', 'Secure access via Nafath, OTP, and OAuth 2.0 protocols.', 'نفاذ، OTP، اور OAuth 2.0 پروٹوکولز کے ذریعے محفوظ رسائی۔')}</p>
                </div>
                <Link href="/login" className="inline-flex items-center gap-2 text-xs text-[#10B981] hover:text-white transition-colors mt-4 group/link">
                  {t('جرّب الآن', 'Try It Now', 'ابھی آزمائیں')}
                  <ArrowLeft className="w-3 h-3 rtl:group-hover/link:-translate-x-1 ltr:rotate-180 ltr:group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <div className="editorial-divider" />
        <RoiCalculator />
        <div className="editorial-divider" />

        {/* ──────────────────── PRICING ──────────────────── */}
        <section className="py-32 px-6 lg:px-[60px] relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[#165DFF]/[0.025] pointer-events-none" />
          <motion.div
            className="max-w-[1200px] mx-auto relative z-10"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          >
            <div className="text-center mb-24">
              <motion.div variants={fadeUp} className="small-caps-primary mb-6 mx-auto tracking-[0.4em]">{t('الاستثمار', 'INVESTMENT', 'سرمایہ کاری')}</motion.div>
              <motion.h2 variants={fadeUp} className="font-[family-name:var(--font-serif)] text-[clamp(40px,6vw,80px)] tracking-tighter font-extralight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                {t('الباقات المتاحة', 'Available Packages', 'دستیاب پیکجز')}
              </motion.h2>
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Basic */}
              <motion.div variants={fadeUp} className="stat-card glass-panel flex flex-col">
                <div className="small-caps mb-4 text-[#555]">{t('الأساسية', 'BASIC', 'بنیادی')}</div>
                <div className="text-4xl font-light mb-2 tracking-tighter">499</div>
                <div className="text-sm text-[#555] mb-8">{t('ريال / شهر', 'SAR / month', 'ریال / مہینہ')}</div>
                <ul className="space-y-3 text-sm text-[#888] mb-10 flex-1">
                  {[
                    t('3 وكلاء من أصل 9', '3 of 9 Agents', '9 میں سے 3 ایجنٹس'),
                    t('تقارير أسبوعية', 'Weekly Reports', 'ہفتہ وار رپورٹس'),
                    t('دعم فني قياسي', 'Standard Support', 'معیاری سپورٹ'),
                    t('تخزين 5GB', '5GB Storage', '5GB اسٹوریج'),
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Plus className="w-3 h-3 text-[#555] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn-secondary w-full uppercase">{t('اختيار الباقة', 'Select Plan', 'پلان منتخب کریں')}</button>
              </motion.div>

              {/* Professional — Featured */}
              <motion.div variants={fadeUp} className="stat-card glass-dark flex flex-col relative md:-translate-y-4 border-[#165DFF]/25">
                <div className="absolute -top-3 rtl:right-6 ltr:left-6">
                  <span className="badge-emerald">{t('الأكثر طلباً', 'Most Popular', 'سب سے زیادہ مقبول')}</span>
                </div>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#165DFF]/60 to-transparent" />
                <div className="small-caps-primary mb-4 tracking-widest">{t('الاحترافية', 'PROFESSIONAL', 'پروفیشنل')}</div>
                <div className="text-5xl font-light mb-2 tracking-tighter text-white">1,499</div>
                <div className="text-sm text-[#555] mb-8">{t('ريال / شهر', 'SAR / month', 'ریال / مہینہ')}</div>
                <ul className="space-y-3 text-sm text-[#999] mb-10 flex-1">
                  {[
                    t('6 وكلاء من أصل 9', '6 of 9 Agents', '9 میں سے 6 ایجنٹس'),
                    t('تكامل ZATCA المرحلة 2', 'ZATCA Phase 2 Integration', 'ZATCA فیز 2 انٹیگریشن'),
                    t('دعم أولوية 24/7', 'Priority Support 24/7', '24/7 ترجیحی سپورٹ'),
                    t('تخزين 50GB', '50GB Storage', '50GB اسٹوریج'),
                    t('تقارير يومية', 'Daily Reports', 'روزانہ رپورٹس'),
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Plus className="w-3 h-3 text-[#165DFF] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn-primary w-full uppercase shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                  {t('اختيار الباقة', 'Select Plan', 'پلان منتخب کریں')}
                </button>
              </motion.div>

              {/* Enterprise */}
              <motion.div variants={fadeUp} className="stat-card glass-panel flex flex-col">
                <div className="small-caps mb-4 text-[#555]">{t('الشركات', 'ENTERPRISE', 'انٹرپرائز')}</div>
                <div className="text-3xl font-light mb-2 tracking-tighter">{t('مخصص', 'Custom', 'کسٹم')}</div>
                <div className="text-sm text-[#555] mb-8">{t('تسعير مخصص', 'Custom pricing', 'کسٹم قیمت')}</div>
                <ul className="space-y-3 text-sm text-[#888] mb-10 flex-1">
                  {[
                    t('9 وكلاء كاملة', 'All 9 Agents', 'تمام 9 ایجنٹس'),
                    t('استضافة على خوادم خاصة', 'Private Server Hosting', 'نجی سرور ہوسٹنگ'),
                    t('مدير حساب مخصص', 'Dedicated Account Manager', 'مخصص اکاؤنٹ مینیجر'),
                    t('SLA مضمون 99.99%', 'Guaranteed 99.99% SLA', '99.99% SLA گارنٹی'),
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Plus className="w-3 h-3 text-[#10B981] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="btn-secondary w-full uppercase text-center">
                  {t('تواصل معنا', 'Contact Us', 'ہم سے رابطہ کریں')}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <div className="editorial-divider" />

        {/* ──────────────────── PORTFOLIO ──────────────────── */}
        <section className="py-32 px-6 lg:px-[60px] relative z-10">
          <motion.div
            className="max-w-[1200px] mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
              <motion.div variants={fadeUp}>
                <div className="small-caps-primary mb-4 tracking-[0.4em]">{t('نماذج أعمالنا', 'OUR PORTFOLIO', 'ہمارا پورٹ فولیو')}</div>
                <h2 className="font-[family-name:var(--font-serif)] text-[clamp(36px,5vw,72px)] tracking-tighter font-extralight text-transparent bg-clip-text bg-gradient-to-tr from-white to-gray-500">
                  {t('مشاريع تقنية نوعية', 'Premium Tech Projects', 'اعلیٰ درجے کے ٹیک پروجیکٹس')}
                </h2>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link href="/services" className="text-sm uppercase tracking-widest text-[#666] hover:text-[#165DFF] transition-colors border-b border-[#555]/30 hover:border-[#165DFF]/50 pb-1">
                  {t('عرض جميع المشاريع', 'View All Projects', 'تمام پروجیکٹس دیکھیں')}
                </Link>
              </motion.div>
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {[
                { title: t('العربية للعود الفاخرة', 'Arabian Oud Luxury', 'عریبین عود لگژری'), desc: t('تم الإطلاق في 48 ساعة، زيادة المبيعات 45% باستخدام وكيل AFAQ البصري.', 'Launched in 48h, 45% sales increase using AFAQ Vision Agent.', '48 گھنٹوں میں لانچ، AFAQ ویژن ایجنٹ کا استعمال کرتے ہوئے 45% فروخت میں اضافہ۔'), image: 'https://images.unsplash.com/photo-1595425970377-c9703c48657a?q=80&w=800&auto=format&fit=crop', id: '01', align: 'translate-y-0', tag: t('تجارة فاخرة', 'Luxury Retail', 'لگژری ریٹیل') },
                { title: t('أزياء نون للأناقة', 'Noon Fashion Elegance', 'نون فیشن'), desc: t('تكامل كامل مع زاتكا وبوابات الدفع، رفع معدل التحويل إلى 32%.', 'Full ZATCA & Payment Gateway integration, 32% conversion uplift.', 'مکمل ZATCA اور پیمنٹ گیٹ وے انٹیگریشن، 32% تبدیلی میں اضافہ۔'), image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop', id: '02', align: 'lg:translate-y-12', tag: t('أزياء', 'Fashion', 'فیشن') },
                { title: t('منصة ساكو التقنية', 'SACO Tech Platform', 'SACO ٹیک پلیٹ فارم'), desc: t('خوادم سحابية مخصصة للتحمل العالي، بزمن استجابة 200 ملي ثانية.', 'Custom high-load cloud with 200ms response time.', 'کسٹم ہائی لوڈ کلاؤڈ، 200 ملی سیکنڈ ریسپانس ٹائم۔'), image: 'https://images.unsplash.com/photo-1550009158-9ffcb5e4d284?q=80&w=800&auto=format&fit=crop', id: '03', align: 'lg:-translate-y-8', tag: t('تقنية', 'Technology', 'ٹیکنالوجی') },
                { title: t('تطبيق هوم سنتر', 'Homecentre App', 'ہوم سنٹر ایپ'), desc: t('تطبيق أداء سلس بمسار تسوق مبسط وتحليل سلوكي آني.', 'Streamlined shopping funnel with real-time behavioural analytics.', 'آسان شاپنگ فنل اور ریئل ٹائم رویے کا تجزیہ۔'), image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop', id: '04', align: 'translate-y-0', tag: t('تجزئة', 'Retail', 'ریٹیل') },
                { title: t('وكالة الرياض للسفر', 'Riyadh Travel Agency', 'ریاض ٹریول ایجنسی'), desc: t('دمج تقنيات الـ AI لتقديم اقتراحات مخصصة لرحلات العملاء.', 'AI-powered personalised travel itinerary suggestions.', 'AI سے چلنے والی ذاتی نوعیت کی سفری تجاویز۔'), image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop', id: '05', align: 'lg:translate-y-8', tag: t('سياحة', 'Travel', 'سفر') },
                { title: t('مجموعة التميمي الغذائية', 'Tamimi Food Group', 'التمیمی فوڈ گروپ'), desc: t('إدارة سلاسل الإمداد ومزامنة المخزون باستخدام الذكاء الاصطناعي.', 'AI supply chain management and real-time inventory sync.', 'AI سپلائی چین مینجمنٹ اور ریئل ٹائم انوینٹری سنک۔'), image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop', id: '06', align: 'lg:-translate-y-4', tag: t('غذاء', 'Food & Bev', 'کھانا') },
              ].map((project, i) => (
                <motion.div key={i} variants={fadeUp} className={`group cursor-pointer ${project.align} transition-transform duration-[1.5s] ease-out`}>
                  <div className="h-72 w-full glass-panel relative overflow-hidden mb-6 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-[0_20px_50px_-10px_rgba(22,93,255,0.35)]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110 opacity-50 group-hover:opacity-80 grayscale group-hover:grayscale-0"
                      style={{ backgroundImage: `url('${project.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-700" />
                    <div className="absolute top-4 rtl:right-4 ltr:left-4">
                      <span className="text-[9px] bg-[#050505]/80 border border-white/10 backdrop-blur-md px-3 py-1 text-[#888] tracking-widest uppercase">{project.tag}</span>
                    </div>
                    <div className="absolute bottom-5 rtl:right-5 rtl:left-5 ltr:left-5 ltr:right-5 flex justify-between items-end">
                      <div className="text-[#165DFF]/40 font-mono text-4xl group-hover:text-[#165DFF]/80 transition-colors duration-500 font-bold">{project.id}</div>
                      <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-[#165DFF] group-hover:border-[#165DFF] transition-all duration-500">
                        <ArrowLeft className="w-3.5 h-3.5 text-white rtl:-rotate-45 ltr:-rotate-135 rtl:group-hover:rotate-0 ltr:group-hover:rotate-180 transition-transform duration-500" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-lg font-medium mb-2 group-hover:text-[#165DFF] transition-colors duration-300">{project.title}</h4>
                  <div className="text-sm text-[#666] leading-[1.8] group-hover:text-[#999] transition-colors font-light">{project.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <div className="editorial-divider" />

        {/* ──────────────────── TESTIMONIALS + FAQ ──────────────────── */}
        <section className="relative z-10 bg-gradient-to-b from-transparent to-[#0a0a0a]">
          <div className="flex flex-col lg:flex-row">
            {/* Testimonials */}
            <motion.div
              className="py-28 px-6 lg:px-[60px] flex-1 relative"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className="small-caps-primary mb-4 tracking-[0.4em]">{t('آراء العملاء', 'TESTIMONIALS', 'کلائنٹ کی آراء')}</motion.div>
              <motion.h2 variants={fadeUp} className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl mb-14 tracking-tighter font-extralight text-transparent bg-clip-text bg-gradient-to-tr from-white to-gray-500">
                {t('ثقة نبنيها بالإنجاز', 'Trust Built on Results', 'نتائج پر بنیاد اعتماد')}
              </motion.h2>
              <motion.div variants={fadeUp} className="stat-card glass-dark relative">
                <div className="absolute top-8 rtl:left-8 ltr:right-8 text-8xl text-white/[0.03] font-[family-name:var(--font-serif)] select-none leading-none">"</div>
                <div className="flex gap-1.5 mb-6">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-[#10B981] text-[#10B981]" />)}
                </div>
                <p className="text-xl leading-[1.9] text-[#ccc] mb-10 font-light italic relative z-10">
                  {t(
                    '"انتقال سلس لمنصة تعتمد بشكل كامل على الذكاء الاصطناعي مع تقيد كامل بمتطلبات زاتكا. فريق أفق تجاوز التوقعات في الأداء والدعم."',
                    '"Smooth transition to a fully AI-driven platform with complete ZATCA compliance. The AFAQ team exceeded all expectations in performance and support."',
                    '"مکمل ZATCA تعمیل کے ساتھ مکمل AI سے چلنے والے پلیٹ فارم پر ہموار منتقلی۔ AFAQ ٹیم نے کارکردگی اور سپورٹ میں تمام توقعات سے تجاوز کیا۔"'
                  )}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#165DFF]/20 to-[#10B981]/10 border border-white/15 shadow-[0_0_20px_rgba(22,93,255,0.1)]" />
                  <div>
                    <div className="text-base font-medium">{t('عبدالله السالم', 'Abdullah Al-Salem', 'عبداللہ السالم')}</div>
                    <div className="text-xs text-[#666] mt-0.5">{t('مدير العمليات — شركة التقنية الناشئة', 'COO, Emerging Tech Co.', 'COO، ابھرتی ٹیک کمپنی')}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              className="py-28 px-6 lg:px-[60px] flex-1 bg-[#165DFF]/[0.015] relative"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className="small-caps-primary mb-4 tracking-[0.4em]">{t('الأسئلة الشائعة', 'FAQ', 'اکثر پوچھے گئے سوالات')}</motion.div>
              <motion.h2 variants={fadeUp} className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl mb-14 tracking-tighter font-extralight text-transparent bg-clip-text bg-gradient-to-tr from-white to-gray-500">
                {t('استفساراتك مجابة', 'Answers You Need', 'آپ کے جوابات')}
              </motion.h2>
              <motion.div variants={staggerContainer} className="space-y-5">
                {[
                  {
                    q: t("كيف يتم تطبيق نظام PDPL؟", "How is Saudi PDPL applied?", "سعودی PDPL کیسے لاگو ہوتا ہے؟"),
                    a: t("نعتمد خوادم محلية داخل المملكة العربية السعودية لضمان عدم نقل أي بيانات حساسة للخارج وتشفير قواعد البيانات.", "We use KSA-local servers ensuring no data leaves the Kingdom, combined with zero-knowledge-level DB encryption.", "ہم KSA مقامی سرورز استعمال کرتے ہیں جو یقینی بناتے ہیں کہ کوئی ڈیٹا بادشاہت سے باہر نہ جائے۔")
                  },
                  {
                    q: t("هل النظام مرتبط بنفاذ؟", "Is the system integrated with Nafath?", "کیا نظام نفاذ سے منسلک ہے؟"),
                    a: t("نعم، كافة بوابات الدخول للخدمات الحساسة تتطلب التحقق الثنائي والمصادقة المباشرة عبر نفاذ.", "Yes, all sensitive service portals require 2FA and direct biometric authentication via Nafath.", "ہاں، تمام حساس سروس پورٹلز کے لیے 2FA اور نفاذ کے ذریعے براہ راست بایومیٹرک تصدیق درکار ہے۔")
                  },
                  {
                    q: t("ما هي المدة الزمنية للإعداد؟", "What is the setup timeframe?", "سیٹ اپ کا وقت کیا ہے؟"),
                    a: t("يستغرق الإعداد الأساسي بين أسبوعين إلى 4 أسابيع حسب تعقيد متطلبات التكامل.", "Basic setup takes 2–4 weeks depending on integration complexity.", "بنیادی سیٹ اپ انٹیگریشن کی پیچیدگی کے لحاظ سے 2-4 ہفتے لیتا ہے۔")
                  },
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="border-b border-white/8 pb-5 rtl:hover:pr-3 ltr:hover:pl-3 transition-all duration-300 cursor-pointer group">
                    <h4 className="text-lg font-[family-name:var(--font-serif)] mb-2 text-[#ddd] group-hover:text-[#165DFF] transition-colors">{item.q}</h4>
                    <p className="text-sm text-[#666] leading-[1.8] font-light max-w-[90%]">{item.a}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="editorial-divider" />

        {/* ──────────────────── CTA ──────────────────── */}
        <section className="py-36 px-6 lg:px-[60px] text-center relative z-10 overflow-hidden bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-fixed">
          <div className="absolute inset-0 bg-[#050505]/92 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
          <motion.div
            className="relative z-10 max-w-[800px] mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="font-[family-name:var(--font-serif)] text-[clamp(50px,9vw,110px)] mb-8 tracking-tighter font-extralight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-[0_0_50px_rgba(255,255,255,0.08)]">
              {t('هل أنت جاهز؟', 'Are you ready?', 'کیا آپ تیار ہیں؟')}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#888] mb-14 font-light text-lg md:text-xl leading-[1.9]">
              {t(
                'فريق الدعم الفني والمستشارون المتخصصون مستعدون لتقديم استشارة مجانية.',
                'Our technical team and consultants are ready for a free consultation.',
                'ہماری ٹیکنیکل ٹیم اور کنسلٹنٹس مفت مشاورت کے لیے تیار ہیں۔'
              )}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary inline-flex text-lg px-12 py-5 tracking-widest">
                {t('تواصل مع المستشار', 'CONTACT A CONSULTANT', 'کنسلٹنٹ سے رابطہ کریں')}
              </Link>
              <Link href="/login" className="btn-secondary inline-flex text-lg px-12 py-5 tracking-widest">
                {t('دخول المنصة', 'SIGN IN', 'سائن ان')}
              </Link>
            </motion.div>
          </motion.div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
