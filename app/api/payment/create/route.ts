import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const plans: Record<string, { price: number; credits: number }> = {
  starter: { price: 3.49, credits: 300000 },
  basic: { price: 7.49, credits: 700000 },
  pro: { price: 11.49, credits: 1100000 },
  business: { price: 15.49, credits: 1500000 },
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await request.json();

    const plan = plans[planId];
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      return NextResponse.json({ error: 'NEXTAUTH_URL is missing' }, { status: 500 });
    }

    const order_id = `${session.user.email}_${planId}_${Date.now()}`;

    const response = await fetch('https://api.cryptocloud.plus/v2/invoice/create', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.CRYPTOCLOUD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shop_id: process.env.CRYPTOCLOUD_SHOP_ID,
        amount: plan.price,
        currency: 'USD',
        order_id,
        email: session.user.email,
        success_url: `${baseUrl}/payment/success`,
        fail_url: `${baseUrl}/dashboard/buy`,
      }),
    });

    const data = await response.json();
    
    console.log('CryptoCloud response:', data);

    if (data?.status === 'success' && data?.result?.link) {
      return NextResponse.json({
        payUrl: data.result.link,
        invoiceId: data.result.uuid,
        orderId: order_id,
      });
    }

    return NextResponse.json(
      { error: 'Payment creation failed', details: data },
      { status: 500 }
    );
  } catch (e) {
    console.error('Payment create error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}