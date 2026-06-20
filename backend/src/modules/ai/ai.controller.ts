import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import { chatSchema } from './ai.schema';
import * as aiService from './ai.service';

export async function chat(req: AuthenticatedRequest, res: Response) {
  const input = chatSchema.parse(req.body);
  const result = await aiService.processChat(input, req.user?.id);

  res.status(200).json({
    success: true,
    data: {
      sessionId: result.sessionId,
      response: result.response,
      node: result.node,
    },
    meta: { ttfb_ms: result.ttfbMs },
  });
}

export async function getHistory(req: AuthenticatedRequest, res: Response) {
  const sessionId = String(req.params.sessionId);
  const session = await aiService.getSessionHistory(sessionId, req.user?.id);

  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found', code: 'SESSION_NOT_FOUND' });
  }

  res.status(200).json({ success: true, data: { session } });
}
