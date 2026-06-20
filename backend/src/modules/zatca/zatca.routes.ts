import { Router } from 'express';
import { requireAuth } from '../../common/middleware/auth.middleware';
import * as zatcaController from './zatca.controller';

const router = Router();

/** POST /api/v1/zatca/invoices — Generate & stamp e-invoice XML */
router.post('/invoices', requireAuth, zatcaController.createInvoice);

/** POST /api/v1/zatca/invoices/:id/submit — Submit to ZATCA Fatoora API */
router.post('/invoices/:id/submit', requireAuth, zatcaController.submitInvoice);

/** GET /api/v1/zatca/invoices/:id — Get invoice details */
router.get('/invoices/:id', requireAuth, zatcaController.getInvoice);

/** GET /api/v1/zatca/stores/:storeId/invoices — List store invoices */
router.get('/stores/:storeId/invoices', requireAuth, zatcaController.listInvoices);

export default router;
