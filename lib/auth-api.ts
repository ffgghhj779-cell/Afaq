import { apiFetch } from './api-client';

export interface AuthUser {
  id: string;
  phoneNumber: string | null;
  email: string | null;
  name: string | null;
  role: string;
  isVerified: boolean;
}

export async function sendOtp(phone: string): Promise<{ message: string; expiresInMinutes: number }> {
  return apiFetch('/auth/otp/send', {
    method: 'POST',
    body: { phone, purpose: 'login' },
  });
}

export async function verifyOtp(phone: string, code: string): Promise<{ user: AuthUser }> {
  return apiFetch('/auth/otp/verify', {
    method: 'POST',
    body: { phone, code },
  });
}

export async function initiateNafath(nafathId: string): Promise<{ requestId: string; expiresAt: string }> {
  return apiFetch('/auth/nafath/initiate', {
    method: 'POST',
    body: { nafathId },
  });
}

export async function oauthLogin(
  provider: 'google' | 'apple',
  idToken: string
): Promise<{ user: AuthUser }> {
  return apiFetch('/auth/oauth', {
    method: 'POST',
    body: { provider, idToken },
  });
}

export async function getMe(): Promise<{ user: AuthUser }> {
  return apiFetch('/auth/me', { method: 'GET' });
}

export async function logout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST', body: {} });
}

export async function refreshSession(): Promise<{ refreshed: boolean }> {
  return apiFetch('/auth/refresh', { method: 'POST', body: {} });
}
