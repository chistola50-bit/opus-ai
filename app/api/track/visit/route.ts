import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { path } = await req.json();

    const ipHeader = req.headers.get('x-forwarded-for') || '';
    const ip = ipHeader.split(',')[0]?.trim() || null;
    const userAgent = req.headers.get('user-agent');
    const referer = req.headers.get('referer');
    const country = req.headers.get('cf-ipcountry') || null;

    // Получаем userId только если есть сессия
    let userId: string | null = null;
    
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id || null;
    }

    await prisma.visitLog.create({
      data: {
        path: path || '/',
        ip: ip || null,
        userAgent: userAgent || null,
        referer: referer || null,
        country: country || null,
        userId: userId, // теперь либо реальный id, либо null
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Visit log error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}