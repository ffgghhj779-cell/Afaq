import type { Metadata } from 'next';
import { Inter, Tajawal, Playfair_Display } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/components/language-provider';
import { TopographicLines } from '@/components/topographic-lines';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AFAQ - Elite Saudi AI Intelligence',
  description: 'Elite Saudi AI Intelligence - The next generation of artificial intelligence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${tajawal.variable} ${playfair.variable} font-ar`}>
      <body className="bg-[#050505] text-white antialiased overflow-x-hidden selection:bg-[#165DFF]/30 selection:text-white" suppressHydrationWarning>
        <div className="noise-overlay" />
        <TopographicLines />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
