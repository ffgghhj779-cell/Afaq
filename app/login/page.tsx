'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Shield, ArrowLeft, Fingerprint, Chrome } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/components/language-provider";
import { sendOtp, verifyOtp, initiateNafath, oauthLogin } from "@/lib/auth-api";
import { ApiError } from "@/lib/api-client";
import { fadeUpFast as fadeUp, staggerContainer } from "@/lib/motion";

type AuthStep = 'method' | 'phone' | 'otp' | 'nafath' | 'nafath-pending';

export default function LoginPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>('method');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nafathId, setNafathId] = useState('');
  const [nafathRequestId, setNafathRequestId] = useState('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) return;
    setLoading(true);
    setError('');
    try {
      await sendOtp(phone);
      setStep('otp');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('فشل إرسال الرمز', 'Failed to send code', 'کوڈ بھیجنے میں ناکامی'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await sendOtp(phone);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('فشل إعادة الإرسال', 'Failed to resend', 'دوبارہ بھیجنے میں ناکامی'));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length < 6) return;
    setLoading(true);
    setError('');
    try {
      await verifyOtp(phone, otp.join(''));
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('رمز التحقق غير صحيح', 'Invalid verification code', 'غلط تصدیقی کوڈ'));
    } finally {
      setLoading(false);
    }
  };

  const handleNafath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nafathId || nafathId.length < 10) return;
    setLoading(true);
    setError('');
    try {
      const result = await initiateNafath(nafathId);
      setNafathRequestId(result.requestId);
      setStep('nafath-pending');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('فشل بدء نفاذ', 'Failed to start Nafath', 'نفاذ شروع کرنے میں ناکامی'));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setError('');
    try {
      // Production: replace with real OAuth idToken from Google/Apple SDK
      await oauthLogin(provider, `mock-${provider}-token`);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('فشل تسجيل الدخول', 'Sign-in failed', 'سائن ان ناکام'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] flex flex-col overflow-x-hidden relative">
      <div className="mesh-bg" />
      <div className="noise-overlay" />
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">

        {/* Decorative background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[30vw] font-black text-white/[0.01] font-[family-name:var(--font-serif)] tracking-tighter mix-blend-overlay">
            {t('دخول', 'LOGIN', 'لاگ ان')}
          </span>
        </div>

        <motion.div
          className="w-full max-w-[440px] relative z-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-10">
            <Logo height={40} className="justify-center mb-8" />
            <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-extralight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-3">
              {t('مرحباً بعودتك', 'Welcome Back', 'واپس خوش آمدید')}
            </h1>
            <p className="text-sm text-[#666]">
              {t('سجّل دخولك دون كلمة مرور', 'Sign in without a password', 'پاس ورڈ کے بغیر سائن ان کریں')}
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            variants={fadeUp}
            className="stat-card glass-panel relative overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#165DFF]/60 to-transparent" />

            {error && (
              <div className="mb-4 p-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">

              {/* Step: Choose Method */}
              {step === 'method' && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="small-caps text-[#555] mb-6">{t('اختر طريقة الدخول', 'CHOOSE SIGN-IN METHOD', 'سائن ان کا طریقہ منتخب کریں')}</p>

                  {/* Phone OTP */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setStep('phone')}
                    className="w-full flex items-center gap-4 bg-white/[0.03] border border-white/10 hover:border-[#165DFF]/40 hover:bg-[#165DFF]/5 transition-all duration-300 px-5 py-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#165DFF]/10 border border-[#165DFF]/20 flex items-center justify-center group-hover:bg-[#165DFF]/15 transition-colors">
                      <Phone className="w-4 h-4 text-[#165DFF]" />
                    </div>
                    <div className="flex-1 text-start rtl:text-right ltr:text-left">
                      <div className="text-sm text-white font-medium">{t('رقم الجوال + OTP', 'Phone Number + OTP', 'فون نمبر + OTP')}</div>
                      <div className="text-xs text-[#666] mt-0.5">{t('رمز تحقق لمرة واحدة', 'One-time verification code', 'ایک بار تصدیقی کوڈ')}</div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-[#444] group-hover:text-[#165DFF] rtl:rotate-0 ltr:rotate-180 transition-colors" />
                  </motion.button>

                  {/* Nafath */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setStep('nafath')}
                    className="w-full flex items-center gap-4 bg-white/[0.03] border border-white/10 hover:border-[#10B981]/40 hover:bg-[#10B981]/5 transition-all duration-300 px-5 py-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center group-hover:bg-[#10B981]/15 transition-colors">
                      <Fingerprint className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div className="flex-1 text-start rtl:text-right ltr:text-left">
                      <div className="text-sm text-white font-medium">{t('الهوية الوطنية (نفاذ)', 'Saudi National ID (Nafath)', 'قومی شناخت (نفاذ)')}</div>
                      <div className="text-xs text-[#666] mt-0.5">{t('تسجيل دخول بهويتك الوطنية', 'Sign in with your national ID', 'اپنی قومی شناخت سے سائن ان کریں')}</div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-[#444] group-hover:text-[#10B981] rtl:rotate-0 ltr:rotate-180 transition-colors" />
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-[1px] bg-white/5" />
                    <span className="text-xs text-[#444]">{t('أو', 'OR', 'یا')}</span>
                    <div className="flex-1 h-[1px] bg-white/5" />
                  </div>

                  {/* OAuth */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      disabled={loading}
                      onClick={() => handleOAuth('google')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2.5 bg-white/[0.03] border border-white/10 hover:border-white/25 hover:bg-white/[0.06] transition-all duration-300 px-4 py-3.5 text-sm text-[#ccc] disabled:opacity-50"
                    >
                      <Chrome className="w-4 h-4" />
                      Google
                    </motion.button>
                    <motion.button
                      type="button"
                      disabled={loading}
                      onClick={() => handleOAuth('apple')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2.5 bg-white/[0.03] border border-white/10 hover:border-white/25 hover:bg-white/[0.06] transition-all duration-300 px-4 py-3.5 text-sm text-[#ccc] disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2c4.411 0 8 3.589 8 8 0 3.674-2.477 6.767-5.875 7.7C13.5 19.267 13 18.73 13 18v-2c0-.667-.333-1.267-.875-1.617C14.375 14.042 16 12.167 16 10c0-2.2-1.8-4-4-4S8 7.8 8 10c0 2.167 1.625 4.042 3.875 4.383C11.333 14.733 11 15.333 11 16v2c0 .73-.5 1.267-1.125 1.7C6.477 18.767 4 15.674 4 12c0-4.411 3.589-8 8-8z" />
                      </svg>
                      Apple
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step: Phone Number */}
              {step === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setStep('method')}
                    className="flex items-center gap-2 text-xs text-[#666] hover:text-white transition-colors mb-6 group"
                  >
                    <ArrowLeft className="w-3 h-3 rtl:rotate-180 ltr:rotate-0 group-hover:-translate-x-0.5 transition-transform" />
                    {t('رجوع', 'Back', 'واپس')}
                  </button>

                  <h2 className="text-lg font-medium text-white mb-1">{t('أدخل رقم جوالك', 'Enter Your Phone Number', 'اپنا فون نمبر درج کریں')}</h2>
                  <p className="text-xs text-[#666] mb-8">{t('سنرسل لك رمز تحقق مكون من 6 أرقام', 'We\'ll send you a 6-digit verification code', 'ہم آپ کو 6 ہندسوں کا تصدیقی کوڈ بھیجیں گے')}</p>

                  <form onSubmit={handlePhoneSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs text-[#666] mb-2 tracking-widest uppercase">{t('رقم الجوال', 'Phone Number', 'فون نمبر')}</label>
                      <div className="flex items-stretch border border-white/10 focus-within:border-[#165DFF]/50 transition-colors bg-white/[0.03]">
                        <div className="flex items-center px-3 border-r border-white/10 text-sm text-[#888] bg-white/[0.02] shrink-0 gap-1.5">
                          <span>🇸🇦</span>
                          <span dir="ltr">+966</span>
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                          placeholder="5xxxxxxxx"
                          dir="ltr"
                          className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder-[#444] text-sm outline-none"
                          required
                        />
                      </div>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={loading || phone.length < 9}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="btn-primary w-full py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          {t('جاري الإرسال...', 'Sending...', 'بھیج رہا ہے...')}
                        </>
                      ) : (
                        t('إرسال رمز التحقق', 'Send Verification Code', 'تصدیقی کوڈ بھیجیں')
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* Step: OTP */}
              {step === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setStep('phone')}
                    className="flex items-center gap-2 text-xs text-[#666] hover:text-white transition-colors mb-6 group"
                  >
                    <ArrowLeft className="w-3 h-3 rtl:rotate-180 ltr:rotate-0" />
                    {t('تغيير الرقم', 'Change Number', 'نمبر تبدیل کریں')}
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#165DFF]/10 border border-[#165DFF]/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-[#165DFF]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-white">{t('أدخل رمز التحقق', 'Enter Verification Code', 'تصدیقی کوڈ درج کریں')}</h2>
                      <p className="text-xs text-[#666]" dir="ltr">+966 {phone}</p>
                    </div>
                  </div>

                  <form onSubmit={handleOtpVerify} className="space-y-6">
                    <div className="flex justify-center gap-2" dir="ltr">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className={`w-11 h-14 text-center text-xl font-light bg-white/[0.04] border transition-all duration-200 text-white outline-none ${
                            digit ? 'border-[#165DFF]/60 bg-[#165DFF]/5' : 'border-white/10 focus:border-[#165DFF]/40'
                          }`}
                        />
                      ))}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading || otp.join('').length < 6}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="btn-primary w-full py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          {t('جاري التحقق...', 'Verifying...', 'تصدیق ہو رہی ہے...')}
                        </>
                      ) : (
                        t('تأكيد الدخول', 'Confirm Sign In', 'سائن ان کی تصدیق کریں')
                      )}
                    </motion.button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleResendOtp}
                      className="w-full text-center text-xs text-[#555] hover:text-[#165DFF] transition-colors disabled:opacity-50"
                    >
                      {t('إعادة إرسال الرمز', 'Resend Code', 'کوڈ دوبارہ بھیجیں')}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step: Nafath */}
              {step === 'nafath' && (
                <motion.div
                  key="nafath"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setStep('method')}
                    className="flex items-center gap-2 text-xs text-[#666] hover:text-white transition-colors mb-6 group"
                  >
                    <ArrowLeft className="w-3 h-3 rtl:rotate-180 ltr:rotate-0" />
                    {t('رجوع', 'Back', 'واپس')}
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                      <Fingerprint className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-white">{t('تسجيل دخول بنفاذ', 'Sign In with Nafath', 'نفاذ سے سائن ان')}</h2>
                      <p className="text-xs text-[#666]">{t('الهوية الوطنية السعودية', 'Saudi National Identity', 'سعودی قومی شناخت')}</p>
                    </div>
                  </div>

                  <form onSubmit={handleNafath} className="space-y-5">
                    <div>
                      <label className="block text-xs text-[#666] mb-2 tracking-widest uppercase">{t('رقم الهوية الوطنية', 'National ID Number', 'قومی شناختی نمبر')}</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={nafathId}
                        onChange={(e) => setNafathId(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="1xxxxxxxxx"
                        dir="ltr"
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-[#10B981]/50 px-4 py-3.5 text-white placeholder-[#444] text-sm outline-none transition-colors"
                        required
                      />
                    </div>

                    <div className="bg-[#10B981]/5 border border-[#10B981]/15 p-4 text-xs text-[#10B981]/80 leading-relaxed">
                      {t(
                        'سيتم إعادة توجيهك إلى تطبيق نفاذ للمصادقة البيومترية.',
                        'You will be redirected to the Nafath app for biometric authentication.',
                        'آپ کو بایومیٹرک تصدیق کے لیے نفاذ ایپ پر ری ڈائریکٹ کیا جائے گا۔'
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading || nafathId.length < 10}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3.5 text-sm font-semibold uppercase tracking-widest bg-[#10B981] text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#0ea572] transition-colors hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          {t('جاري التحقق...', 'Verifying...', 'تصدیق ہو رہی ہے...')}
                        </>
                      ) : (
                        t('متابعة مع نفاذ', 'Continue with Nafath', 'نفاذ کے ساتھ جاری رکھیں')
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* Step: Nafath Pending */}
              {step === 'nafath-pending' && (
                <motion.div
                  key="nafath-pending"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-4"
                >
                  <div className="w-14 h-14 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
                    <Fingerprint className="w-6 h-6 text-[#10B981] animate-pulse" />
                  </div>
                  <h2 className="text-lg font-medium text-white mb-2">
                    {t('افتح تطبيق نفاذ', 'Open the Nafath App', 'نفاذ ایپ کھولیں')}
                  </h2>
                  <p className="text-xs text-[#666] mb-6 leading-relaxed">
                    {t(
                      'وافق على طلب المصادقة في تطبيق نفاذ على جوالك.',
                      'Approve the authentication request in the Nafath app on your phone.',
                      'اپنے فون پر نفاذ ایپ میں تصدیق کی درخواست منظور کریں۔'
                    )}
                  </p>
                  <p className="text-[10px] text-[#444] font-mono mb-6" dir="ltr">{nafathRequestId}</p>
                  <button
                    type="button"
                    onClick={() => setStep('method')}
                    className="text-xs text-[#666] hover:text-white transition-colors"
                  >
                    {t('رجوع', 'Back', 'واپس')}
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>

          {/* Footer note */}
          <motion.p variants={fadeUp} className="text-center text-xs text-[#444] mt-6 leading-relaxed">
            {t(
              'بالمتابعة، أنت توافق على سياسة الخصوصية وشروط الاستخدام المتوافقة مع نظام حماية البيانات الشخصية (PDPL)',
              'By continuing, you agree to our Privacy Policy and Terms of Service compliant with Saudi PDPL',
              'جاری رکھنے سے، آپ ہماری پرائیویسی پالیسی اور سعودی PDPL کے مطابق شرائط استعمال سے اتفاق کرتے ہیں'
            )}
          </motion.p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
