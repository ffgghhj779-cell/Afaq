'use client';

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { RefreshCw, Home } from "lucide-react";
import { fadeUpFast } from "@/lib/motion";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="mesh-bg" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[35vw] font-black text-white/[0.012] tracking-tighter mix-blend-overlay">ERR</span>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpFast}
        className="relative z-10 text-center px-6 max-w-[600px]"
      >
        <div className="small-caps mb-6 tracking-[0.5em] text-red-500/70">ERROR — SOMETHING WENT WRONG</div>
        <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl font-extralight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-6">
          حدث خطأ ما
        </h1>
        <p className="text-[#555] text-base font-light mb-12 leading-relaxed max-w-sm mx-auto">
          {error?.message || 'حدث خطأ غير متوقع. يرجى المحاولة مجدداً.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-primary inline-flex items-center gap-3">
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>
          <Link href="/" className="btn-secondary inline-flex items-center gap-3">
            <Home className="w-4 h-4" />
            الرئيسية
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
