import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { env } from '../../config/env';

export function generateOtpCode(): string {
  const min = Math.pow(10, env.OTP_LENGTH - 1);
  const max = Math.pow(10, env.OTP_LENGTH) - 1;
  return randomInt(min, max + 1).toString();
}

export async function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function verifyOtp(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

export function getOtpExpiryDate(): Date {
  return new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);
}

/** Normalize Saudi phone numbers to +966XXXXXXXXX format */
export function normalizeSaudiPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('966')) return `+${digits}`;
  if (digits.startsWith('0')) return `+966${digits.slice(1)}`;
  if (digits.length === 9) return `+966${digits}`;
  return `+${digits}`;
}

export function isValidSaudiPhone(phone: string): boolean {
  const normalized = normalizeSaudiPhone(phone);
  return /^\+966[5][0-9]{8}$/.test(normalized);
}
