// app/api/payment/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Твои тарифы – подставь реальные IDs и кредиты
const PLANS: Record<string, { credits: number }> = {
  basic: { credits: 100_000 },
  pro: { credits: 250_000 },
  max: { credits: 600_000 },
};

export async function POST(req: NextRequest) {
  try {
    // CryptoCloud может слать JSON – берём как текст, потом парсим
    const rawBody = await req.text();
    const data = JSON.parse(rawBody || '{}');

    console.log('CryptoCloud webhook payload:', data);

    // ✅ ГЛАВНОЕ ИСПРАВЛЕНИЕ:
    // У них status = "paid" / "failed" / "canceled"
    if (data.status !== 'paid') {
      // просто игнорируем всё, что не оплаченное
      return NextResponse.json({ ok: true });
    }

    const orderId: string | undefined = data.order_id || data.orderId;

    if (!orderId) {
      console.error('Webhook error: no order_id in payload');
      return NextResponse.json({ error: 'No order_id' }, { status: 400 });
    }

    // Мы раньше делали order_id типа: `${email}_${planId}_${Date.now()}`
    const [email, planId] = orderId.split('_');

    if (!email || !planId) {
      console.error('Webhook error: cannot parse email/planId from orderId', orderId);
      return NextResponse.json({ error: 'Bad orderId format' }, { status: 400 });
    }

    const plan = PLANS[planId];

    if (!plan) {
      console.error('Webhook error: unknown planId', planId);
      return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });
    }

    // Проверяем, есть ли уже такой платёж
    const existing = await prisma.payment.findUnique({
      where: { orderId },
    });

    // Если уже обработали – просто выходим, чтобы не начислить второй раз
    if (existing?.processed) {
      console.log('Webhook: payment already processed', orderId);
      return NextResponse.json({ ok: true });
    }

    // Транзакция: начисляем кредиты + отмечаем платёж как processed
    await prisma.$transaction(async (tx) => {
      // 1) создаём или обновляем запись Payment
      if (existing) {
        await tx.payment.update({
          where: { orderId },
          data: {
            status: 'paid',
            processed: true,
          },
        });
      } else {
        await tx.payment.create({
          data: {
            orderId,
            email,
            planId,
            status: 'paid',
            processed: true,
          },
        });
      }

      // 2) начисляем кредиты пользователю
      await tx.user.update({
        where: { email },
        data: {
          credits: { increment: plan.credits },
          totalPurchased: { increment: plan.credits },
        },
      });
    });

    console.log('Webhook: credits added successfully for', email, 'order', orderId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('CryptoCloud webhook error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
