import { apiFetch } from './api-client';
import type { Language } from '@/components/language-provider';
import { LOCALE_MAP } from './ai-api';

export async function submitContact(data: {
  name: string;
  company?: string;
  email: string;
  message: string;
  language: Language;
}): Promise<{ id: string; message: string }> {
  return apiFetch('/commerce/contact', {
    method: 'POST',
    body: {
      name: data.name,
      company: data.company,
      email: data.email,
      message: data.message,
      locale: LOCALE_MAP[data.language],
    },
  });
}

export async function submitRecruitment(data: {
  applicantName: string;
  contactPhone: string;
  contactEmail?: string;
  portfolioUrl?: string;
  coverLetter?: string;
}): Promise<{ id: string; message: string }> {
  return apiFetch('/commerce/recruitment', {
    method: 'POST',
    body: data,
  });
}
