import { z } from 'zod';
import { createHash, randomUUID } from 'crypto';
import { prisma } from '../../config/database';
import { AppError } from '../../common/middleware/error.middleware';

export const createInvoiceSchema = z.object({
  storeId: z.string().uuid(),
  invoiceNumber: z.string().min(1).max(50),
  totalAmount: z.number().positive(),
  vatAmount: z.number().min(0),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    vatRate: z.number().default(15),
  })).min(1),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

/** Generate UBL 2.1 XML skeleton for ZATCA Phase 2 */
function generateInvoiceXml(input: CreateInvoiceInput, invoiceUuid: string): string {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:ID>${input.invoiceNumber}</cbc:ID>
  <cbc:UUID>${invoiceUuid}</cbc:UUID>
  <cbc:IssueDate>${now.split('T')[0]}</cbc:IssueDate>
  <cbc:IssueTime>${now.split('T')[1]?.slice(0, 8)}</cbc:IssueTime>
  <cbc:InvoiceTypeCode name="0100000">388</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>SAR</cbc:DocumentCurrencyCode>
  <cbc:TaxCurrencyCode>SAR</cbc:TaxCurrencyCode>
  <cac:LegalMonetaryTotal>
    <cbc:TaxExclusiveAmount currencyID="SAR">${(input.totalAmount - input.vatAmount).toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="SAR">${input.totalAmount.toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="SAR">${input.totalAmount.toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="SAR">${input.vatAmount.toFixed(2)}</cbc:TaxAmount>
  </cac:TaxTotal>
</Invoice>`;
}

function hashXml(xml: string): string {
  return createHash('sha256').update(xml).digest('hex');
}

/** Placeholder for ECDSA cryptographic stamping (requires ZATCA CSID certificate) */
function applyCryptographicStamp(xmlHash: string): string {
  // TODO: Load private key from AWS Secrets Manager / HashiCorp Vault (KSA region)
  // TODO: Sign with ECDSA secp256k1 per ZATCA spec
  return `STAMP_PLACEHOLDER_${xmlHash.slice(0, 16)}`;
}

export async function createInvoice(input: CreateInvoiceInput, userId?: string) {
  const store = await prisma.store.findUnique({ where: { id: input.storeId } });
  if (!store) throw new AppError(404, 'Store not found', 'STORE_NOT_FOUND');

  const invoiceUuid = randomUUID();
  const xml = generateInvoiceXml(input, invoiceUuid);
  const xmlHash = hashXml(xml);
  const stamp = applyCryptographicStamp(xmlHash);

  const invoice = await prisma.zatcaInvoice.create({
    data: {
      storeId: input.storeId,
      userId,
      invoiceNumber: input.invoiceNumber,
      invoiceUuid,
      status: 'STAMPED' as const,
      xmlPayload: xml,
      xmlHash,
      cryptographicStamp: stamp,
      totalAmount: input.totalAmount,
      vatAmount: input.vatAmount,
      issuedAt: new Date(),
    },
  });

  return invoice;
}

export async function submitToZatca(invoiceId: string) {
  const invoice = await prisma.zatcaInvoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) throw new AppError(404, 'Invoice not found', 'INVOICE_NOT_FOUND');
  if (invoice.status !== 'STAMPED') {
    throw new AppError(400, 'Invoice must be stamped before submission', 'INVALID_STATUS');
  }

  // TODO: POST to ZATCA Fatoora API (sandbox/production endpoints)
  const mockResponse = { clearanceStatus: 'CLEARED', reportingStatus: 'REPORTED' };

  return prisma.zatcaInvoice.update({
    where: { id: invoiceId },
    data: {
      status: 'CLEARED' as const,
      zatcaResponse: mockResponse,
      submittedAt: new Date(),
      clearedAt: new Date(),
    },
  });
}

export async function getInvoice(invoiceId: string) {
  const invoice = await prisma.zatcaInvoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) throw new AppError(404, 'Invoice not found', 'INVOICE_NOT_FOUND');
  return invoice;
}

export async function listStoreInvoices(storeId: string) {
  return prisma.zatcaInvoice.findMany({
    where: { storeId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      invoiceNumber: true,
      status: true,
      totalAmount: true,
      vatAmount: true,
      issuedAt: true,
      clearedAt: true,
    },
  });
}
