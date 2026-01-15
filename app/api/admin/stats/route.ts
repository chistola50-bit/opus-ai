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
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      credits: true,
      totalSpent: true,
      totalPurchased: true,
      createdAt: true,
      _count: {
        select: { transactions: true, purchases: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Всего кредитов осталось
  const totalCreditsRemaining = users.reduce((sum, user) => sum + user.credits, 0);

  // Всего кредитов потрачено
  const creditsUsed = await prisma.transaction.aggregate({
    _sum: { amount: true }
  });

  // Последние транзакции
  const recentTransactions = await prisma.transaction.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true }
      }
    }
  });

  // Покупки
  const purchases = await prisma.purchase.findMany({
    where: { status: 'completed' }
  });

  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);

  return NextResponse.json({
    totalUsers: users.length,
    totalCreditsUsed: creditsUsed._sum.amount || 0,
    totalCreditsRemaining,
    totalPurchases: purchases.length,
    totalRevenue,
    users,
    recentTransactions
  });
}