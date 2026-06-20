import { prisma } from '../../config/database';
import type { ChatInput, AgentNode } from './ai.schema';

const NODE_KEYWORDS: Record<AgentNode, string[]> = {
  COORDINATOR: [],
  ZATCA: ['zatca', 'vat', 'tax', 'invoice', 'فاتورة', 'زاتكا', 'ضريبة'],
  SUPPORT: ['help', 'support', 'issue', 'problem', 'مساعدة', 'دعم', 'مشكلة'],
  MARKETING: ['marketing', 'campaign', 'sales', 'تسويق', 'حملة'],
  BUILDER: ['code', 'build', 'develop', 'كود', 'برمجة'],
  VISION: ['design', 'ui', 'ux', 'تصميم', 'واجهة'],
  AUTOMATION: ['automate', 'workflow', 'أتمتة', 'سير'],
  QUALITY: ['test', 'quality', 'qa', 'اختبار', 'جودة'],
  SECURITY: ['security', 'audit', 'pdpl', 'أمان', 'حماية'],
};

function routeToNode(message: string): AgentNode {
  const lower = message.toLowerCase();
  for (const [node, keywords] of Object.entries(NODE_KEYWORDS)) {
    if (node === 'COORDINATOR') continue;
    if (keywords.some((kw) => lower.includes(kw))) {
      return node as AgentNode;
    }
  }
  return 'SUPPORT';
}

const NODE_RESPONSES: Record<AgentNode, Record<string, string>> = {
  COORDINATOR: {
    'ar-SA': 'تم توجيه طلبك إلى الوكيل المناسب.',
    'en-GB': 'Your request has been routed to the appropriate agent.',
    'ur-PK': 'آپ کی درخواست مناسب ایجنٹ کو بھیج دی گئی ہے۔',
  },
  ZATCA: {
    'ar-SA': 'منصة AFAQ متوافقة بالكامل مع متطلبات زاتكا المرحلة الثانية. يمكننا مساعدتك في إعداد الفوترة الإلكترونية.',
    'en-GB': 'AFAQ is fully compliant with ZATCA Phase 2. We can help you set up e-invoicing.',
    'ur-PK': 'AFAQ ZATCA فیز 2 کے ساتھ مکمل مطابقت رکھتا ہے۔',
  },
  SUPPORT: {
    'ar-SA': 'فريق الدعم الفني متاح على مدار الساعة. كيف يمكننا مساعدتك اليوم؟',
    'en-GB': 'Our technical support team is available 24/7. How can we help you today?',
    'ur-PK': 'ہماری تکنیکی سپورٹ ٹیم 24/7 دستیاب ہے۔',
  },
  MARKETING: {
    'ar-SA': 'وكيل التسويق الذكي يمكنه تحليل بياناتك وإطلاق حملات موجهة بدقة.',
    'en-GB': 'Our AI Marketing agent can analyze your data and launch targeted campaigns.',
    'ur-PK': 'ہمارا AI مارکیٹنگ ایجنٹ آپ کے ڈیٹا کا تجزیہ کر سکتا ہے۔',
  },
  BUILDER: {
    'ar-SA': 'وكيل البناء جاهز لمساعدتك في تطوير حلولك التقنية.',
    'en-GB': 'The Builder agent is ready to help develop your technical solutions.',
    'ur-PK': 'بلڈر ایجنٹ آپ کے تکنیکی حل تیار کرنے میں مدد کر سکتا ہے۔',
  },
  VISION: {
    'ar-SA': 'وكيل الرؤية يحلل واجهات المستخدم ويقترح تحسينات تصميمية.',
    'en-GB': 'The Vision agent analyzes UI and suggests design improvements.',
    'ur-PK': 'ویژن ایجنٹ UI کا تجزیہ کرتا ہے۔',
  },
  AUTOMATION: {
    'ar-SA': 'وكيل الأتمتة يمكنه أتمتة سير عملك التجاري بالكامل.',
    'en-GB': 'The Automation agent can fully automate your business workflows.',
    'ur-PK': 'آٹومیشن ایجنٹ آپ کے کاروباری ورک فلو کو خودکار بنا سکتا ہے۔',
  },
  QUALITY: {
    'ar-SA': 'وكيل الجودة يضمن مطابقة جميع المخرجات لأعلى المعايير.',
    'en-GB': 'The Quality agent ensures all outputs meet the highest standards.',
    'ur-PK': 'کوالٹی ایجنٹ تمام آؤٹ پٹس کو اعلیٰ معیار پر پورا کرتا ہے۔',
  },
  SECURITY: {
    'ar-SA': 'وكيل الأمان يضمن امتثالك الكامل لنظام PDPL وحماية بياناتك.',
    'en-GB': 'The Security agent ensures full PDPL compliance and data protection.',
    'ur-PK': 'سیکیورٹی ایجنٹ PDPL تعمیل اور ڈیٹا تحفظ کو یقینی بناتا ہے۔',
  },
};

export async function processChat(
  input: ChatInput,
  userId?: string
): Promise<{ sessionId: string; response: string; node: AgentNode; ttfbMs: number }> {
  const start = Date.now();
  const node = routeToNode(input.message);

  let session = input.sessionId
    ? await prisma.aiSession.findUnique({ where: { id: input.sessionId } })
    : null;

  if (!session) {
    session = await prisma.aiSession.create({
      data: { userId, locale: input.locale },
    });
  }

  await prisma.aiMessage.create({
    data: { sessionId: session.id, role: 'user', content: input.message },
  });

  const response = NODE_RESPONSES[node][input.locale] ?? NODE_RESPONSES[node]['ar-SA'];

  await prisma.aiMessage.create({
    data: { sessionId: session.id, role: 'assistant', content: response, agentNode: node },
  });

  const ttfbMs = Date.now() - start;

  await prisma.aiLog.create({
    data: {
      userId,
      agentNode: node,
      action: 'chat_response',
      processingTimeMs: ttfbMs,
      status: 'success',
      metadata: { locale: input.locale, sessionId: session.id },
    },
  });

  return { sessionId: session.id, response, node, ttfbMs };
}

export async function getSessionHistory(sessionId: string, userId?: string) {
  const session = await prisma.aiSession.findFirst({
    where: { id: sessionId, ...(userId ? { userId } : {}) },
    include: {
      messages: { orderBy: { createdAt: 'asc' }, take: 50 },
    },
  });
  return session;
}
