import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().uuid().optional(),
  locale: z.enum(['ar-SA', 'en-GB', 'ur-PK']).default('ar-SA'),
});

export type ChatInput = z.infer<typeof chatSchema>;

export type AgentNode =
  | 'COORDINATOR'
  | 'BUILDER'
  | 'VISION'
  | 'AUTOMATION'
  | 'ZATCA'
  | 'SUPPORT'
  | 'QUALITY'
  | 'MARKETING'
  | 'SECURITY';
