'use client';

import Link from 'next/link';
import { memo } from 'react';
import { AfaqLogoSvg } from './afaq-logo-svg';

export type LogoVariant = 'dark' | 'color';
export type LogoLayout = 'compact' | 'mark';

interface LogoProps {
  className?: string;
  height?: number;
  /** dark = all-white on transparent (default). color = original PNG lockup */
  variant?: LogoVariant;
  /** compact = symbol + wordmark, mark = symbol only (navbar) */
  layout?: LogoLayout;
}

export const Logo = memo(function Logo({
  className = '',
  height = 32,
  variant = 'dark',
  layout = 'mark',
}: LogoProps) {
  const showWordmark = layout === 'compact';

  return (
    <Link
      href="/"
      className={`inline-flex items-center flex-shrink-0 text-white ${className}`}
      aria-label="AFAQ Home"
    >
      {variant === 'dark' ? (
        <AfaqLogoSvg
          height={height}
          showWordmark={showWordmark}
          className="block"
        />
      ) : (
        // Fallback colored lockup for light surfaces only
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="AFAQ"
          height={height}
          className="h-auto w-auto object-contain"
          style={{ height, maxHeight: height }}
        />
      )}
    </Link>
  );
});
