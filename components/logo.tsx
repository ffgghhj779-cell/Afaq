'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface LogoProps {
  className?: string;
  height?: number;
  priority?: boolean;
}

export const Logo = memo(function Logo({
  className = '',
  height = 36,
  priority = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center flex-shrink-0 ${className}`}
      aria-label="AFAQ Home"
    >
      <Image
        src="/logo.png"
        alt="AFAQ"
        width={Math.round(height * 2.8)}
        height={height}
        priority={priority}
        className="h-auto w-auto max-h-[36px] md:max-h-[40px] object-contain"
        style={{ height, width: 'auto' }}
      />
    </Link>
  );
});
