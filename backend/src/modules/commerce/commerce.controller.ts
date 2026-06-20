import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import {
  createStoreSchema,
  contactSchema,
  recruitmentSchema,
} from './commerce.service';
import * as commerceService from './commerce.service';

function getLocale(req: AuthenticatedRequest): string {
  return (req.headers['accept-language'] as string)?.split(',')[0] ?? 'ar-SA';
}

export async function getPlans(req: AuthenticatedRequest, res: Response) {
  const plans = await commerceService.getPlans(getLocale(req));
  res.status(200).json({ success: true, data: { plans } });
}

export async function getServices(req: AuthenticatedRequest, res: Response) {
  const services = await commerceService.getServices(getLocale(req));
  res.status(200).json({ success: true, data: { services } });
}

export async function getPortfolio(req: AuthenticatedRequest, res: Response) {
  const portfolio = await commerceService.getPortfolio(getLocale(req));
  res.status(200).json({ success: true, data: { portfolio } });
}

export async function createStore(req: AuthenticatedRequest, res: Response) {
  const input = createStoreSchema.parse(req.body);
  const store = await commerceService.createStore(req.user!.id, input);
  res.status(201).json({ success: true, data: { store } });
}

export async function getStores(req: AuthenticatedRequest, res: Response) {
  const stores = await commerceService.getUserStores(req.user!.id);
  res.status(200).json({ success: true, data: { stores } });
}

export async function submitContact(req: AuthenticatedRequest, res: Response) {
  const input = contactSchema.parse(req.body);
  const inquiry = await commerceService.submitContact(input);
  res.status(201).json({ success: true, data: { id: inquiry.id, message: 'Inquiry submitted' } });
}

export async function submitRecruitment(req: AuthenticatedRequest, res: Response) {
  const input = recruitmentSchema.parse(req.body);
  const application = await commerceService.submitRecruitment(input);
  res.status(201).json({ success: true, data: { id: application.id, message: 'Application submitted' } });
}

export async function getSubscription(req: AuthenticatedRequest, res: Response) {
  const subscription = await commerceService.getUserSubscription(req.user!.id);
  res.status(200).json({ success: true, data: { subscription } });
}

export async function subscribe(req: AuthenticatedRequest, res: Response) {
  const { planId } = req.body as { planId: string };
  if (!planId) {
    return res.status(400).json({ success: false, error: 'planId required', code: 'PLAN_ID_REQUIRED' });
  }
  const subscription = await commerceService.subscribeToPlan(req.user!.id, planId);
  res.status(201).json({ success: true, data: { subscription } });
}
