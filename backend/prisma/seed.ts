import { PrismaClient, SubscriptionTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const plans: Array<{
    tier: SubscriptionTier;
    nameAr: string;
    nameEn: string;
    nameUr: string;
    priceSar: number;
    agentCount: number;
    features: string[];
  }> = [
    {
      tier: 'BASIC',
      nameAr: 'الأساسية',
      nameEn: 'Basic',
      nameUr: 'بنیادی',
      priceSar: 499,
      agentCount: 3,
      features: ['weekly_reports', 'standard_support', '5gb_storage'],
    },
    {
      tier: 'PROFESSIONAL',
      nameAr: 'الاحترافية',
      nameEn: 'Professional',
      nameUr: 'پروفیشنل',
      priceSar: 1499,
      agentCount: 6,
      features: ['daily_reports', 'priority_support_24_7', 'zatca_phase_2', '50gb_storage'],
    },
    {
      tier: 'ENTERPRISE',
      nameAr: 'الشركات',
      nameEn: 'Enterprise',
      nameUr: 'انٹرپرائز',
      priceSar: 0,
      agentCount: 9,
      features: ['all_agents', 'private_hosting', 'dedicated_manager', '99_99_sla'],
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { tier: plan.tier },
      update: plan,
      create: plan,
    });
  }

  console.info('[SEED] Subscription plans seeded (499 / 1499 / Custom SAR)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
