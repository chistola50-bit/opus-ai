import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const adminEmails = ['chistola50@gmail.com'];

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ===== USERS =====
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      credits: true,
      totalSpent: true,
      totalPurchased: true,
      isBlocked: true,
      createdAt: true,
      _count: {
        select: { transactions: true, purchases: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalUsers = users.length;
  const totalCreditsRemaining = users.reduce(
    (sum, u) => sum + u.credits,
    0,
  );

  // ===== TRANSACTIONS / CREDITS =====
  const creditsUsedAgg = await prisma.transaction.aggregate({
    _sum: { amount: true },
  });

  const totalCreditsUsed = Math.abs(creditsUsedAgg._sum.amount || 0);

  const purchases = await prisma.purchase.findMany({
    where: { status: 'completed' },
  });

  const totalRevenue = purchases.reduce(
    (sum, p) => sum + p.amount,
    0,
  );

  // ===== RECENT TRANSACTIONS =====
  const recentTransactions = await prisma.transaction.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true },
      },
    },
  });

  // ===== VISITS / REGISTRATIONS (последние 7 дней) =====
  const days = 7;
  const now = new Date();
  const from = new Date(
    now.getTime() - (days - 1) * 24 * 60 * 60 * 1000,
  );

  const visits = await prisma.visitLog.findMany({
    where: { createdAt: { gte: from } },
    select: { createdAt: true },
  });

  const registrations = await prisma.user.findMany({
    where: { createdAt: { gte: from } },
    select: { createdAt: true },
  });

  const makeDaily = (items: { createdAt: Date }[]) => {
    const map: Record<
      string,
      { date: string; count: number }
    > = {};

    for (let i = 0; i < days; i++) {
      const d = new Date(
        now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000,
      );
      const key = d.toISOString().slice(0, 10);
      map[key] = { date: key, count: 0 };
    }

    items.forEach((item) => {
      const key = item.createdAt.toISOString().slice(0, 10);
      if (map[key]) map[key].count += 1;
    });

    return Object.values(map);
  };

  const dailyVisits = makeDaily(visits);
  const dailyRegistrations = makeDaily(registrations);

  // ===== RECENT VISITS =====
  const recentVisits = await prisma.visitLog.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true },
      },
    },
  });

  // ===== SECURITY EVENTS =====
  const securityEvents = await prisma.securityEvent.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true } },
    },
  });

  return NextResponse.json({
    totalUsers,
    totalCreditsUsed,
    totalCreditsRemaining,
    totalPurchases: purchases.length,
    totalRevenue,
    users,
    recentTransactions,
    daily: {
      visits: dailyVisits,
      registrations: dailyRegistrations,
    },
    recentVisits,
    securityEvents,
  });
}
