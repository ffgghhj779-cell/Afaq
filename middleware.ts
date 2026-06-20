import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['ar-SA', 'en-GB', 'ur-PK'];
const defaultLocale = 'ar-SA';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  try {
    return match(languages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  // --- 1. I18N ROUTING ---
  const { pathname } = request.nextUrl;
  
  // Exclude API routes and static files from locale redirect
  const isApiRoute = pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.');
  if (!isApiRoute) {
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
      const locale = getLocale(request);
      request.headers.set('x-locale', locale);
    }
  }

  // --- 2. SECURITY HEADERS (PDPL & ZATCA Compliant) ---
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    }
  });

  // Enforce HSTS for TLS 1.3 compliance expectation
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  // Protect against Clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Data Privacy (PDPL) & ZATCA Data Location Expectation headers
  // Explicitly tagging KSA origin expectation
  response.headers.set('X-Data-Residency', 'KSA');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
  ],
};
