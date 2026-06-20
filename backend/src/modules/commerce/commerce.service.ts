import { z } from 'zod';
import { prisma } from '../../config/database';
import { AppError } from '../../common/middleware/error.middleware';
import type { SubscriptionPlan, Service, PortfolioItem } from '@prisma/client';

export const createStoreSchema = z.object({
  storeNameAr: z.string().min(1).max(255),
  storeNameEn: z.string().min(1).max(255),
  crNumber: z.string().optional(),
  vatNumber: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1).max(255),
  company: z.string().optional(),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  locale: z.enum(['ar-SA', 'en-GB', 'ur-PK']).default('ar-SA'),
});

export const recruitmentSchema = z.object({
  applicantName: z.string().min(1).max(255),
  contactPhone: z.string().min(9).max(20),
  contactEmail: z.string().email().optional(),
  portfolioUrl: z.string().url().optional(),
  coverLetter: z.string().max(5000).optional(),
});

export async function getPlans(locale = 'ar-SA') {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { priceSar: 'asc' },
  });

  return plans.map((p: SubscriptionPlan) => ({
    id: p.id,
    tier: p.tier,
    name: locale === 'ar-SA' ? p.nameAr : locale === 'ur-PK' ? (p.nameUr ?? p.nameAr) : p.nameEn,
    priceSar: p.priceSar,
    agentCount: p.agentCount,
    features: p.features,
  }));
}

export async function getServices(locale = 'ar-SA') {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  return services.map((s: Service) => ({
    id: s.id,
    title: locale === 'ar-SA' ? s.titleAr : locale === 'ur-PK' ? (s.titleUr ?? s.titleAr) : s.titleEn,
    description: locale === 'ar-SA' ? s.descriptionAr : s.descriptionEn,
    priceLabel: s.priceLabel,
  }));
}

export async function getPortfolio(locale = 'ar-SA') {
  const items = await prisma.portfolioItem.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return items.map((item: PortfolioItem) => ({
    id: item.id,
    title: locale === 'ar-SA' ? item.titleAr : locale === 'ur-PK' ? (item.titleUr ?? item.titleAr) : item.titleEn,
    description: locale === 'ar-SA' ? item.descAr : item.descEn,
    imageUrl: item.imageUrl,
    category: locale === 'ar-SA' ? item.categoryAr : item.categoryEn,
    metrics: item.metrics,
  }));
}

export async function createStore(ownerId: string, input: z.infer<typeof createStoreSchema>) {
  return prisma.store.create({
    data: { ownerId, ...input },
  });
}

export async function getUserStores(ownerId: string) {
  return prisma.store.findMany({
    where: { ownerId, isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function submitContact(input: z.infer<typeof contactSchema>) {
  return prisma.contactInquiry.create({ data: input });
}

export async function submitRecruitment(input: z.infer<typeof recruitmentSchema>) {
  return prisma.recruitmentApplication.create({ data: input });
}

export async function getUserSubscription(userId: string) {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: { in: ['ACTIVE', 'TRIALING'] } },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
  });
  if (!sub) return null;
  return { ...sub, plan: { tier: sub.plan.tier, priceSar: sub.plan.priceSar, agentCount: sub.plan.agentCount } };
}

export async function subscribeToPlan(userId: string, planId: string) {
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) throw new AppError(404, 'Plan not found', 'PLAN_NOT_FOUND');

  return prisma.subscription.create({
    data: {
      userId,
      planId,
      status: 'TRIALING',
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    include: { plan: true },
  });
}
