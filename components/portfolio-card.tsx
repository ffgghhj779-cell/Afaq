'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import { motion } from 'motion/react';
import { fadeUp } from '@/lib/motion';

interface PortfolioCardProps {
  title: string;
  desc: string;
  image: string;
  id: string;
  align: string;
  tag: string;
  priority?: boolean;
}

export const PortfolioCard = memo(function PortfolioCard({
  title,
  desc,
  image,
  id,
  align,
  tag,
  priority = false,
}: PortfolioCardProps) {
  return (
    <motion.div variants={fadeUp} className={`group cursor-pointer ${align}`}>
      <div className="h-72 w-full glass-panel relative overflow-hidden mb-6 transition-transform duration-500 will-change-transform group-hover:scale-[1.02]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover opacity-50 grayscale transition-[opacity,transform] duration-500 will-change-transform group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-500" />
        <div className="absolute top-4 rtl:right-4 ltr:left-4">
          <span className="text-[9px] bg-[#050505]/80 border border-white/10 px-3 py-1 text-[#888] tracking-widest uppercase">
            {tag}
          </span>
        </div>
        <div className="absolute bottom-5 rtl:right-5 rtl:left-5 ltr:left-5 ltr:right-5 flex justify-between items-end">
          <div className="text-[#165DFF]/40 font-mono text-4xl group-hover:text-[#165DFF]/80 transition-opacity duration-300 font-bold">
            {id}
          </div>
          <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#165DFF] group-hover:border-[#165DFF] transition-[transform,opacity] duration-300">
            <ArrowLeft className="w-3.5 h-3.5 text-white rtl:-rotate-45 ltr:-rotate-135 rtl:group-hover:rotate-0 ltr:group-hover:rotate-180 transition-transform duration-300" />
          </div>
        </div>
      </div>
      <h4 className="text-lg font-medium mb-2 group-hover:text-[#165DFF] transition-colors duration-200">
        {title}
      </h4>
      <div className="text-sm text-[#666] leading-[1.8] group-hover:text-[#999] transition-colors duration-200 font-light">
        {desc}
      </div>
    </motion.div>
  );
});
