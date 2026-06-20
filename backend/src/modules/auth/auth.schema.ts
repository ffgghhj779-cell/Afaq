import { z } from 'zod';

export const sendOtpSchema = z.object({
  phone: z.string().min(9).max(15),
  purpose: z.enum(['login', 'register', 'verify_phone']).default('login'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().min(9).max(15),
  code: z.string().length(6).regex(/^\d{6}$/),
});

export const nafathInitSchema = z.object({
  nafathId: z.string().length(10).regex(/^[12]\d{9}$/),
});

export const nafathCallbackSchema = z.object({
  requestId: z.string().uuid(),
  status: z.enum(['approved', 'rejected', 'expired']),
});

export const oauthSchema = z.object({
  provider: z.enum(['google', 'apple']),
  idToken: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type NafathInitInput = z.infer<typeof nafathInitSchema>;
export type OAuthInput = z.infer<typeof oauthSchema>;
