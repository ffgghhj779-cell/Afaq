'use client';

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="mesh-bg" />

      {/* Large watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[40vw] font-black text-white/[0.015] tracking-tighter mix-blend-overlay">404</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center px-6 max-w-[600px]"
      >
        <div className="small-caps-primary mb-6 tracking-[0.5em]">404 — NOT FOUND</div>
        <h1 className="font-[family-name:var(--font-serif)] text-6xl md:text-8xl font-extralight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-6">
          الصفحة<br />غير موجودة
        </h1>
        <p className="text-[#666] text-lg font-light mb-12 leading-relaxed">
          يبدو أن هذه الصفحة ذهبت إلى أفق بعيد. دعنا نعيدك إلى الطريق الصحيح.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary inline-flex items-center gap-3">
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </Link>
          <Link href="/contact" className="btn-secondary inline-flex items-center gap-3">
            <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            تواصل معنا
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
