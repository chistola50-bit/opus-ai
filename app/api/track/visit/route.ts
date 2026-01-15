// app/api/track/visit/route.ts
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
    const country =
      req.headers.get('cf-ipcountry') || // Cloudflare
      null;

    await prisma.visitLog.create({
      data: {
        path: path || '/',
        ip: ip || undefined,
        userAgent: userAgent || undefined,
        referer: referer || undefined,
        country: country || undefined,
        userId: (session?.user as any)?.id || undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Visit log error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
