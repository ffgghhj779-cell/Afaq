'use client';

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Briefcase } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/components/language-provider";
import { submitRecruitment } from "@/lib/commerce-api";
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

export default function RecruitmentPage() {
  const { t } = useLanguage();
  const [applicantName, setApplicantName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitRecruitment({
        applicantName,
        contactPhone,
        contactEmail: contactEmail || undefined,
        portfolioUrl: portfolioUrl || undefined,
        coverLetter: coverLetter || undefined,
      });
      setSuccess(true);
      setApplicantName('');
      setContactPhone('');
      setContactEmail('');
      setPortfolioUrl('');
      setCoverLetter('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('فشل الإرسال', 'Failed to submit', 'جمع کرانے میں ناکامی'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans flex flex-col overflow-x-hidden selection:bg-[#165DFF]/30 relative">
      <div className="mesh-bg" />
      <Navbar />

      <main className="flex-1 flex flex-col relative z-10">
        <section className="py-32 px-6 lg:px-[60px]">
          <motion.div 
            className="max-w-[800px] mx-auto text-center"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="mx-auto w-20 h-20 rounded-full glass-dark flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20" />
              <Briefcase className="w-10 h-10 text-[#165DFF]" />
            </motion.div>
            <motion.div variants={fadeUp} className="small-caps-primary mb-4" style={{ color: '#165DFF' }}>{t('التوظيف', 'CAREERS')}</motion.div>
            <motion.h1 variants={fadeUp} className="font-[family-name:var(--font-serif)] text-5xl md:text-6xl mb-8 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">{t('انضم إلى فريق النخبة', 'Join the Elite Team')}</motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-[#aaaaaa] font-light mb-16 leading-[1.6]">
              {t('نحن نبحث باستمرار عن أصحاب العقول الملهمة والمبتكرين في مجالات الذكاء الاصطناعي وهندسة البرمجيات.', 'We are constantly searching for inspired minds and innovators in artificial intelligence and software engineering.')}
            </motion.p>

            <motion.form variants={fadeUp} className="stat-card glass-panel rtl:text-right ltr:text-left space-y-6 max-w-[600px] mx-auto p-10 relative overflow-hidden" onSubmit={handleSubmit}>
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#165DFF] to-transparent opacity-50" />
              {success && (
                <div className="p-3 text-sm text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20">
                  {t('تم إرسال طلبك بنجاح. سنتواصل معك قريباً.', 'Application submitted successfully. We\'ll be in touch soon.', 'درخواست کامیابی سے جمع ہو گئی۔')}
                </div>
              )}
              {error && (
                <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20">{error}</div>
              )}
              <div>
                <label className="block text-sm mb-2 text-[#aaa]">{t('الاسم الكامل', 'Full Name')}</label>
                <input type="text" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} className="w-full bg-[#111]/50 backdrop-blur-md border border-white/10 p-4 text-white focus:outline-none focus:border-[#165DFF] transition-colors rounded-sm" placeholder={t('الاسم', 'Name')} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-[#aaa]">{t('رقم الجوال', 'Phone Number')}</label>
                  <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full bg-[#111]/50 backdrop-blur-md border border-white/10 p-4 text-white focus:outline-none focus:border-[#165DFF] transition-colors rounded-sm" placeholder="05xxxxxxxx" required dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-[#aaa]">{t('البريد الإلكتروني', 'Email Address')}</label>
                  <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full bg-[#111]/50 backdrop-blur-md border border-white/10 p-4 text-white focus:outline-none focus:border-[#165DFF] transition-colors rounded-sm" placeholder="email@domain.com" dir="ltr" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#aaa]">{t('رابط الأعمال / Portfolio URL', 'Portfolio URL')}</label>
                <input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="w-full bg-[#111]/50 backdrop-blur-md border border-white/10 p-4 text-white focus:outline-none focus:border-[#165DFF] transition-colors rounded-sm" placeholder="https://..." dir="ltr" />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#aaa]">{t('رسالة تعريفية', 'Cover Letter')}</label>
                <textarea rows={4} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="w-full bg-[#111]/50 backdrop-blur-md border border-white/10 p-4 text-white focus:outline-none focus:border-[#165DFF] transition-colors rounded-sm resize-none" placeholder={t('حدثنا عن خبرتك...', 'Tell us about your experience...')}></textarea>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-6 py-4 text-base disabled:opacity-50">
                {loading ? t('جاري الإرسال...', 'Submitting...', 'جمع ہو رہا ہے...') : t('إرسال الطلب', 'Submit Application', 'درخواست جمع کریں')}
              </button>
            </motion.form>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
