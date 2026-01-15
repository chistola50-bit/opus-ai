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
    console.log('Payment create started');
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session?.user?.email);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const { planId, currency } = body;
    const plan = plans[planId];
    
    if (!plan) {
      console.log('Invalid plan:', planId);
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    console.log('Creating invoice for plan:', planId, plan);
    console.log('API Key exists:', !!process.env.CRYPTOCLOUD_API_KEY);
    console.log('Shop ID exists:', !!process.env.CRYPTOCLOUD_SHOP_ID);

    const response = await fetch('https://api.cryptocloud.plus/v2/invoice/create', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.CRYPTOCLOUD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shop_id: process.env.CRYPTOCLOUD_SHOP_ID,
        amount: plan.price,
        currency: 'USD',
        order_id: `${session.user.email}_${planId}_${Date.now()}`,
        email: session.user.email,
      }),
    });

    const data = await response.json();
    console.log('CryptoCloud response:', data);

    if (data.status === 'success') {
      return NextResponse.json({ 
        payUrl: data.result.link,
        invoiceId: data.result.uuid 
      });
    }

    console.log('Payment failed:', data);
    return NextResponse.json({ error: 'Payment creation failed', details: data }, { status: 500 });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}