import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ credits: 0 }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true },
    });

    return NextResponse.json({ credits: user?.credits || 0 });
  } catch (error) {
    return NextResponse.json({ credits: 0 }, { status: 500 });
  }
}