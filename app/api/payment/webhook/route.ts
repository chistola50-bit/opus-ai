import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const plans: Record<string, { credits: number; amount: number }> = {
  starter: { credits: 300000, amount: 3.49 },
  basic: { credits: 700000, amount: 7.49 },
  pro: { credits: 1100000, amount: 11.49 },
  business: { credits: 1500000, amount: 15.49 },
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Webhook received:', JSON.stringify(data, null, 2));

    if (data?.status !== 'success') {
      console.log('Payment not successful, status:', data?.status);
      return NextResponse.json({ ok: true });
    }

    const orderId: string | undefined = data?.order_id;
    if (!orderId) {
      console.log('No order_id in webhook');
      return NextResponse.json({ error: 'No order_id' }, { status: 400 });
    }

    const parts = orderId.split('_');
    const email = parts[0];
    const planId = parts[1];
    const plan = plans[planId];

    if (!email || !plan) {
      console.log('Invalid order format:', { email, planId });
      return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.payment.findUnique({
        where: { orderId },
        select: { id: true, processed: true },
      });

      if (existing?.processed) {
        return { alreadyProcessed: true };
      }

      await tx.payment.upsert({
        where: { orderId },
        update: { status: 'confirmed' },
        create: {
          orderId,
          email,
          planId,
          currency: 'USD',
          amount: String(plan.amount),
          credits: plan.credits,
          status: 'confirmed',
          processed: false,
        },
      });

      const user = await tx.user.update({
        where: { email },
        data: {
          credits: { increment: plan.credits },
          totalPurchased: { increment: plan.credits },
        },
        select: { id: true, credits: true },
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          type: 'purchase',
          amount: plan.credits,
          details: `CryptoCloud: ${planId} (+${plan.credits.toLocaleString()} credits)`,
        },
      });

      await tx.payment.update({
        where: { orderId },
        data: { processed: true, userId: user.id },
      });

      return { alreadyProcessed: false };
    });

    if (result.alreadyProcessed) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}