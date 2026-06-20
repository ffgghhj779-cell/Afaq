import { Router } from 'express';
import { optionalAuth, requireAuth } from '../../common/middleware/auth.middleware';
import * as aiController from './ai.controller';

const router = Router();

/** POST /api/v1/ai/chat — Send message to 9-node AI orchestrator */
router.post('/chat', optionalAuth, aiController.chat);

/** GET /api/v1/ai/sessions/:sessionId — Retrieve chat history */
router.get('/sessions/:sessionId', requireAuth, aiController.getHistory);

export default router;
