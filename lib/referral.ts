// lib/referral.ts

import { prisma } from '@/lib/prisma';

export async function checkAndGrantReferralBonus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      totalPurchased: true,
      totalSpent: true,
      referralBonusGiven: true,
      referredBy: true,
    }
  });

  if (!user) return;
  
  // Условия для бонуса:
  // 1. Есть реферер
  // 2. Бонус ещё не выдан
  // 3. Купил кредиты (totalPurchased > 0)
  // 4. Потратил >= 15% от купленных
  
  if (
    user.referredBy &&
    !user.referralBonusGiven &&
    user.totalPurchased > 0 &&
    user.totalSpent >= user.totalPurchased * 0.15
  ) {
    // Находим реферера
    const referrer = await prisma.user.findUnique({
      where: { id: user.referredBy },
      select: {
        id: true,
        referralBonusesThisMonth: true,
        referralBonusesResetAt: true,
      }
    });

    if (!referrer) return;

    // Проверяем месячный лимит
    const now = new Date();
    const resetDate = new Date(referrer.referralBonusesResetAt);
    
    let bonusesThisMonth = referrer.referralBonusesThisMonth;
    
    // Если новый месяц - сбрасываем
    if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
      bonusesThisMonth = 0;
    }

    // Лимит 50 бонусов в месяц
    if (bonusesThisMonth >= 50) return;

    // Выдаём бонусы
    await prisma.$transaction([
      // Бонус рефереру: 10,000 кредитов
      prisma.user.update({
        where: { id: referrer.id },
        data: {
          credits: { increment: 10000 },
          referralEarnings: { increment: 10000 },
          referralBonusesThisMonth: bonusesThisMonth + 1,
          referralBonusesResetAt: now,
        }
      }),
      // Бонус рефери: 10,000 кредитов
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: { increment: 10000 },
          referralBonusGiven: true,
        }
      })
    ]);

    console.log(`Referral bonus granted! User ${user.id} -> Referrer ${referrer.id}`);
  }
}