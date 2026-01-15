// app/api/user/referral/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      referralCode: true,
      referralEarnings: true,
      referralBonusesThisMonth: true,
      referrals: {
        select: {
          id: true,
          createdAt: true,
          referralBonusGiven: true,
          totalPurchased: true,
        }
      }
    }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const totalReferrals = user.referrals.length;
  const completedReferrals = user.referrals.filter(r => r.referralBonusGiven).length;
  const pendingReferrals = user.referrals.filter(r => r.totalPurchased > 0 && !r.referralBonusGiven).length;

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const referralLink = `${baseUrl}/register?ref=${user.referralCode}`;

  return NextResponse.json({
    referralCode: user.referralCode,
    referralLink,
    stats: {
      total: totalReferrals,
      completed: completedReferrals,
      pending: pendingReferrals,
      earned: user.referralEarnings,
      bonusesThisMonth: user.referralBonusesThisMonth,
      maxBonusesPerMonth: 50,
    }
  });
}