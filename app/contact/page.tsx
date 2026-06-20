'use client';

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/components/language-provider";
import { submitContact } from "@/lib/commerce-api";
import { ApiError } from "@/lib/api-client";

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

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitContact({ name, company: company || undefined, email, message, language });
      setSuccess(true);
      setName('');
      setCompany('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('فشل الإرسال', 'Failed to send', 'بھیجنے میں ناکامی'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans flex flex-col overflow-x-hidden selection:bg-[#165DFF]/30 relative">
      <div className="mesh-bg" />
      <Navbar />

      <main className="flex-1 flex flex-col relative z-10">
        <section className="py-32 px-6 lg:px-[60px] min-h-[calc(100vh-200px)] flex items-center">
          <motion.div 
            className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row gap-16"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={staggerContainer} className="flex-1">
              <motion.div variants={fadeUp} className="small-caps-primary mb-4" style={{ color: '#165DFF' }}>{t('تواصل معنا', 'CONTACT US')}</motion.div>
              <motion.h1 variants={fadeUp} className="font-[family-name:var(--font-serif)] text-5xl md:text-6xl mb-8 tracking-tighter">{t('نحن هنا لخدمتك', 'We Are Here to Serve You')}</motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-[#aaaaaa] font-light mb-12 leading-[1.6]">
                {t('تواصل مع فريق الدعم الفني أو المستشارين التقنيين للحصول على رد سريع. نضمن الرد خلال 24 ساعة كحد أقصى.', 'Contact our technical support team or tech consultants for a quick response. We guarantee a reply within 24 hours max.')}
              </motion.p>
              
              <motion.div variants={staggerContainer} className="space-y-6">
                <motion.div variants={fadeUp} className="flex items-start gap-5 group">
                  <div className="w-12 h-12 glass-panel flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-[#165DFF]" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-white mb-1 font-medium">{t('المركز الرئيسي', 'Headquarters')}</h4>
                    <p className="text-sm text-[#888]">{t('طريق الملك فهد، الرياض، المملكة العربية السعودية', 'King Fahd Road, Riyadh, Saudi Arabia')}</p>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} className="flex items-start gap-5 group">
                  <div className="w-12 h-12 glass-panel flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-[#165DFF]" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-white mb-1 font-medium">{t('البريد الإلكتروني', 'Email Address')}</h4>
                    <p className="text-sm text-[#888]" dir="ltr">support@afaq.sa</p>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} className="flex items-start gap-5 group">
                  <div className="w-12 h-12 glass-panel flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-[#165DFF]" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-white mb-1 font-medium">{t('الهاتف الموحد', 'Unified Number')}</h4>
                    <p className="text-sm text-[#888]" dir="ltr">+966 920000000</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex-[1.2]">
              <form className="stat-card glass-panel space-y-6 rtl:p-10 ltr:p-10 rtl:text-right ltr:text-left relative overflow-hidden" onSubmit={handleSubmit}>
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#165DFF] to-transparent opacity-50" />
                {success && (
                  <div className="p-3 text-sm text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20">
                    {t('تم إرسال رسالتك بنجاح. سنتواصل معك خلال 24 ساعة.', 'Message sent successfully. We\'ll respond within 24 hours.', 'پیغام کامیابی سے بھیج دیا گیا۔')}
                  </div>
                )}
                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20">{error}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 text-[#aaa]">{t('الاسم', 'Name')}</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-[#111]/50 backdrop-blur-md border border-white/10 p-4 text-white focus:outline-none focus:border-[#165DFF] transition-colors rounded-sm" placeholder={t('اسمك', 'Your Name')} />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-[#aaa]">{t('الشركة', 'Company')}</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full bg-[#111]/50 backdrop-blur-md border border-white/10 p-4 text-white focus:outline-none focus:border-[#165DFF] transition-colors rounded-sm" placeholder={t('اسم الشركة', 'Company Name')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-[#aaa]">{t('البريد الإلكتروني', 'Email')}</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#111]/50 backdrop-blur-md border border-white/10 p-4 text-white focus:outline-none focus:border-[#165DFF] transition-colors rounded-sm" placeholder="email@domain.com" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-[#aaa]">{t('الرسالة', 'Message')}</label>
                  <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required minLength={10} className="w-full bg-[#111]/50 backdrop-blur-md border border-white/10 p-4 text-white focus:outline-none focus:border-[#165DFF] transition-colors resize-none rounded-sm" placeholder={t('كيف يمكننا مساعدتك؟', 'How can we help you?')}></textarea>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-2 disabled:opacity-50">
                  {loading ? t('جاري الإرسال...', 'Sending...', 'بھیج رہا ہے...') : t('إرسال الرسالة', 'Send Message', 'پیغام بھیجیں')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
