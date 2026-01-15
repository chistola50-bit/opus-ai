import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

const FREE_CREDITS = 1000;

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, referralCode } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // find referrer if referral code provided
    let referrerId: string | null = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      });
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // simple password check (минимум 6 символов, как при сбросе)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // generate unique referral code for new user
    const newReferralCode = nanoid(8);

    // create user with free credits
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        credits: FREE_CREDITS,
        referralCode: newReferralCode,
        referredBy: referrerId,
      },
    });

    // record the free credits transaction (плюс 1000, как в балансе)
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'bonus',
        amount: FREE_CREDITS,
        details: 'Welcome bonus credits',
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
