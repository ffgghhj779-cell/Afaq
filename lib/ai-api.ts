import { apiFetch } from './api-client';
import type { Language } from '@/components/language-provider';

const LOCALE_MAP: Record<Language, 'ar-SA' | 'en-GB' | 'ur-PK'> = {
  ar: 'ar-SA',
  en: 'en-GB',
  ur: 'ur-PK',
};

export interface ChatResponse {
  sessionId: string;
  response: string;
  node: string;
}

export async function sendChatMessage(
  message: string,
  language: Language,
  sessionId?: string
): Promise<ChatResponse & { ttfbMs?: number }> {
  const locale = LOCALE_MAP[language];

  const data = await apiFetch<ChatResponse>('/ai/chat', {
    method: 'POST',
    body: { message, sessionId, locale },
  });

  return data;
}

export { LOCALE_MAP };
