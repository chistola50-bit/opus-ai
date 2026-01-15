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

  // Все пользователи
  const rawUsers = await prisma.user.findMany({
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

  const users = rawUsers.map((u) => {
    const ageHours =
      (Date.now() - u.createdAt.getTime()) / 36e5;

    // 🔥 очень простая "подозрительность"
    const suspicious =
      // много кредитов без покупок
      (u.totalPurchased === 0 && u.credits > 1_500_000) ||
      // свежий аккаунт, но много действий
      (ageHours < 24 && u._count.transactions > 50);

    return { ...u, suspicious };
  });

  const totalCreditsRemaining = users.reduce(
    (sum, user) => sum + user.credits,
    0
  );

  const creditsUsed = await prisma.transaction.aggregate({
    _sum: { amount: true },
  });

  const recentTransactions = await prisma.transaction.findMany({
    take: 200,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true },
      },
    },
  });

  const purchases = await prisma.purchase.findMany({
    where: { status: 'completed' },
  });

  const totalRevenue = purchases.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  return NextResponse.json({
    totalUsers: users.length,
    totalCreditsUsed: creditsUsed._sum.amount || 0,
    totalCreditsRemaining,
    totalPurchases: purchases.length,
    totalRevenue,
    users,
    recentTransactions,
  });
}
