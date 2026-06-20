import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { createHash, randomBytes } from 'crypto';
import { env } from '../../config/env';

export interface AccessTokenPayload extends JWTPayload {
  sub: string;
  role: string;
  clientType: 'WEB' | 'MOBILE';
}

const accessSecret = new TextEncoder().encode(env.JWT_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

function parseExpiry(expiry: string): string {
  return expiry;
}

export async function signAccessToken(payload: {
  sub: string;
  role: string;
  clientType: 'WEB' | 'MOBILE';
}): Promise<string> {
  return new SignJWT({ role: payload.role, clientType: payload.clientType })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(parseExpiry(env.JWT_ACCESS_EXPIRY))
    .setIssuer('afaq-api')
    .setAudience('afaq-clients')
    .sign(accessSecret);
}

export async function signRefreshToken(userId: string, clientType: 'WEB' | 'MOBILE'): Promise<string> {
  return new SignJWT({ clientType })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(parseExpiry(env.JWT_REFRESH_EXPIRY))
    .setIssuer('afaq-api')
    .setAudience('afaq-refresh')
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, accessSecret, {
    issuer: 'afaq-api',
    audience: 'afaq-clients',
  });
  return payload as AccessTokenPayload;
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload & { sub: string; clientType: string }> {
  const { payload } = await jwtVerify(token, refreshSecret, {
    issuer: 'afaq-api',
    audience: 'afaq-refresh',
  });
  return payload as JWTPayload & { sub: string; clientType: string };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateOpaqueToken(): string {
  return randomBytes(32).toString('hex');
}

export function getRefreshExpiryDate(): Date {
  const match = env.JWT_REFRESH_EXPIRY.match(/^(\d+)([dhms])$/);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const [, amount, unit] = match;
  const ms: Record<string, number> = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
  return new Date(Date.now() + parseInt(amount!, 10) * (ms[unit!] ?? 86400000));
}
