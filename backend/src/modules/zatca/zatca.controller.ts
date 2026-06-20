import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import { createInvoiceSchema } from './zatca.service';
import * as zatcaService from './zatca.service';

export async function createInvoice(req: AuthenticatedRequest, res: Response) {
  const input = createInvoiceSchema.parse(req.body);
  const invoice = await zatcaService.createInvoice(input, req.user?.id);
  res.status(201).json({ success: true, data: { invoice } });
}

export async function submitInvoice(req: AuthenticatedRequest, res: Response) {
  const invoice = await zatcaService.submitToZatca(String(req.params.id));
  res.status(200).json({ success: true, data: { invoice } });
}

export async function getInvoice(req: AuthenticatedRequest, res: Response) {
  const invoice = await zatcaService.getInvoice(String(req.params.id));
  res.status(200).json({ success: true, data: { invoice } });
}

export async function listInvoices(req: AuthenticatedRequest, res: Response) {
  const invoices = await zatcaService.listStoreInvoices(String(req.params.storeId));
  res.status(200).json({ success: true, data: { invoices } });
}
