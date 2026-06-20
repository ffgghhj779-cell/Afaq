import { randomUUID } from 'crypto';
import type { Response } from 'express';
import { OtpPurpose } from '@prisma/client';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../common/middleware/error.middleware';
import {
  signAccessToken,
  signRefreshToken,
  hashToken,
  getRefreshExpiryDate,
  verifyRefreshToken,
} from '../../common/utils/jwt';
import {
  generateOtpCode,
  hashOtp,
  verifyOtp,
  getOtpExpiryDate,
  normalizeSaudiPhone,
  isValidSaudiPhone,
} from '../../common/utils/otp';
import type { SendOtpInput, VerifyOtpInput, NafathInitInput, OAuthInput } from './auth.schema';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthUser {
  id: string;
  phoneNumber: string | null;
  email: string | null;
  name: string | null;
  role: string;
  isVerified: boolean;
}

async function issueTokens(
  userId: string,
  role: string,
  clientType: 'WEB' | 'MOBILE',
  deviceInfo?: string
): Promise<AuthTokens> {
  const accessToken = await signAccessToken({ sub: userId, role, clientType });
  const refreshToken = await signRefreshToken(userId, clientType);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      clientType,
      deviceInfo,
      expiresAt: getRefreshExpiryDate(),
    },
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: env.JWT_ACCESS_EXPIRY,
  };
}

export function setWebAuthCookies(res: Response, tokens: AuthTokens): void {
  const isProd = env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'strict' : 'lax') as 'strict' | 'lax',
  };

  res.cookie('afaq_access', tokens.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
    path: '/',
  });
  res.cookie('afaq_refresh', tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearWebAuthCookies(res: Response): void {
  res.clearCookie('afaq_access', { path: '/' });
  res.clearCookie('afaq_refresh', { path: '/' });
}

async function sendSmsOtp(phone: string, code: string): Promise<void> {
  if (env.SMS_PROVIDER === 'mock') {
    console.info(`[OTP_MOCK] ${phone} → ${code} (expires in ${env.OTP_EXPIRY_MINUTES}m)`);
    return;
  }
  // TODO: Integrate Unifonic / local KSA SMS gateway
  throw new AppError(503, 'SMS provider not configured', 'SMS_UNAVAILABLE');
}

const OTP_PURPOSE_MAP: Record<string, OtpPurpose> = {
  login: OtpPurpose.LOGIN,
  register: OtpPurpose.REGISTER,
  verify_phone: OtpPurpose.VERIFY_PHONE,
};

export async function sendOtp(input: SendOtpInput): Promise<{ message: string; expiresInMinutes: number }> {
  const phone = normalizeSaudiPhone(input.phone);
  if (!isValidSaudiPhone(input.phone)) {
    throw new AppError(400, 'Invalid Saudi phone number format', 'INVALID_PHONE');
  }

  const recentCount = await prisma.otpSession.count({
    where: {
      phoneNumber: phone,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
    },
  });
  if (recentCount >= 5) {
    throw new AppError(429, 'Too many OTP requests. Try again later.', 'RATE_LIMITED');
  }

  await prisma.otpSession.updateMany({
    where: { phoneNumber: phone, verifiedAt: null },
    data: { verifiedAt: new Date() },
  });

  const code = generateOtpCode();
  const codeHash = await hashOtp(code);

  await prisma.otpSession.create({
    data: {
      phoneNumber: phone,
      codeHash,
      purpose: OTP_PURPOSE_MAP[input.purpose] ?? OtpPurpose.LOGIN,
      expiresAt: getOtpExpiryDate(),
    },
  });

  await sendSmsOtp(phone, code);

  return {
    message: 'OTP sent successfully',
    expiresInMinutes: env.OTP_EXPIRY_MINUTES,
  };
}

export async function verifyOtpAndLogin(
  input: VerifyOtpInput,
  clientType: 'WEB' | 'MOBILE',
  deviceInfo?: string
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const phone = normalizeSaudiPhone(input.phone);

  const session = await prisma.otpSession.findFirst({
    where: {
      phoneNumber: phone,
      verifiedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!session) {
    throw new AppError(400, 'OTP expired or not found. Request a new code.', 'OTP_EXPIRED');
  }

  if (session.attempts >= session.maxAttempts) {
    throw new AppError(429, 'Maximum OTP attempts exceeded', 'OTP_LOCKED');
  }

  const isValid = await verifyOtp(input.code, session.codeHash);
  if (!isValid) {
    await prisma.otpSession.update({
      where: { id: session.id },
      data: { attempts: { increment: 1 } },
    });
    throw new AppError(401, 'Invalid OTP code', 'INVALID_OTP');
  }

  await prisma.otpSession.update({
    where: { id: session.id },
    data: { verifiedAt: new Date() },
  });

  let user = await prisma.user.findUnique({ where: { phoneNumber: phone } });

  if (!user) {
    user = await prisma.user.create({
      data: { phoneNumber: phone, isVerified: true, lastLoginAt: new Date() },
    });
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, lastLoginAt: new Date() },
    });
  }

  const tokens = await issueTokens(user.id, user.role, clientType, deviceInfo);

  return {
    user: {
      id: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    },
    tokens,
  };
}

export async function initiateNafath(input: NafathInitInput): Promise<{ requestId: string; expiresAt: string }> {
  const requestId = randomUUID();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.nafathSession.create({
    data: {
      nafathId: input.nafathId,
      requestId,
      expiresAt,
    },
  });

  // TODO: Call Nafath API — POST to ELM/NIC endpoint with requestId
  console.info(`[NAFATH_MOCK] Initiated for ID ${input.nafathId.slice(0, 4)}**** — requestId: ${requestId}`);

  return { requestId, expiresAt: expiresAt.toISOString() };
}

export async function handleOAuth(
  input: OAuthInput,
  clientType: 'WEB' | 'MOBILE',
  deviceInfo?: string
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  // TODO: Verify idToken with Google/Apple JWKS
  console.info(`[OAUTH_MOCK] Provider: ${input.provider}`);

  let user = await prisma.user.findFirst({
    where: { email: `oauth-${input.provider}@placeholder.afaq.sa` },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: `oauth-${input.provider}@placeholder.afaq.sa`,
        name: `${input.provider} User`,
        isVerified: true,
        lastLoginAt: new Date(),
      },
    });
  }

  const tokens = await issueTokens(user.id, user.role, clientType, deviceInfo);

  return {
    user: {
      id: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    },
    tokens,
  };
}

export async function refreshSession(
  refreshToken: string,
  clientType: 'WEB' | 'MOBILE'
): Promise<AuthTokens> {
  let payload;
  try {
    payload = await verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, 'Refresh token invalid or expired', 'REFRESH_EXPIRED');
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(refreshToken) },
    include: { user: true },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new AppError(401, 'Refresh token revoked or expired', 'REFRESH_REVOKED');
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  return issueTokens(stored.user.id, stored.user.role, clientType);
}

export async function logout(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getMe(userId: string): Promise<AuthUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');

  return {
    id: user.id,
    phoneNumber: user.phoneNumber,
    email: user.email,
    name: user.name,
    role: user.role,
    isVerified: user.isVerified,
  };
}
