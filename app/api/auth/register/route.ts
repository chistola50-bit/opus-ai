// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const WELCOME_CREDITS = 1000;

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, referralCode } = await request.json();

    // базовые проверки
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // проверяем, есть ли уже такой пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // ищем реферера по коду (если код введён)
    let referrerId: string | null = null;
    if (referralCode && referralCode.trim()) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: referralCode.trim() },
        select: { id: true },
      });

      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 12);

    // создаём пользователя
    // referralCode НЕ задаём — его создаст сам Prisma (cuid())
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        credits: WELCOME_CREDITS,
        referredBy: referrerId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // записываем транзакцию приветственного бонуса
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'welcome_bonus',
        amount: WELCOME_CREDITS, // +1000, как на балансе
        details: 'Welcome bonus credits',
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      user,
    });
  } catch (error: any) {
    console.error('Registration error:', error);

    // если вдруг Prisma ругается на уникальность
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
