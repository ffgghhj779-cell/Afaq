import { Router } from 'express';
import { requireAuth } from '../../common/middleware/auth.middleware';
import * as commerceController from './commerce.controller';

const router = Router();

// ─── Public (read-only) ──────────────────────────────────────────────────────
router.get('/plans', commerceController.getPlans);
router.get('/services', commerceController.getServices);
router.get('/portfolio', commerceController.getPortfolio);
router.post('/contact', commerceController.submitContact);
router.post('/recruitment', commerceController.submitRecruitment);

// ─── Authenticated ─────────────────────────────────────────────────────────
router.get('/stores', requireAuth, commerceController.getStores);
router.post('/stores', requireAuth, commerceController.createStore);
router.get('/subscriptions/me', requireAuth, commerceController.getSubscription);
router.post('/subscriptions', requireAuth, commerceController.subscribe);

export default router;
