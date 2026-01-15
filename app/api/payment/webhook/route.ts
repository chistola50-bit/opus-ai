import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const plans: Record<string, number> = {
  starter: 300000,
  basic: 700000,
  pro: 1100000,
  business: 1500000,
};

// Обходим строгие типы PrismaClient
const prismaAny = prisma as any;

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // если оплата не успешна — ничего не делаем
    if (data.status !== 'success') {
      return NextResponse.json({ ok: true });
    }

    const orderId = data.order_id;
    if (!orderId) {
      return NextResponse.json({ error: 'No order_id' }, { status: 400 });
    }

    // email_planId_timestamp
    const parts = orderId.split('_');
    const email = parts[0];
    const planId = parts[1];
    const credits = plans[planId];

    if (!email || !credits) {
      return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
    }

    // проверяем, не обрабатывали ли этот orderId ранее
    const existing = await prismaAny.payment.findUnique({
      where: { orderId },
    });

    if (existing?.processed) {
      // уже начисляли — просто выходим
      return NextResponse.json({ ok: true });
    }

    // транзакция: +кредиты + отметка payment.processed = true
    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: {
          credits: { increment: credits },
        },
      }),
      prismaAny.payment.upsert({
        where: { orderId },
        update: {
          status: 'success',
          processed: true,
        },
        create: {
          orderId,
          email,
          planId,
          status: 'success',
          processed: true,
        },
      }),
    ]);

    console.log(`Credits added ONCE: ${email} +${credits}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
