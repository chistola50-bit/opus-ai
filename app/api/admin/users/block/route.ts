import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createSecurityEvent } from '@/lib/security';

const adminEmails = ['chistola50@gmail.com'];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, block } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: !!block },
  });

  await createSecurityEvent({
    userId: user.id,
    type: block ? 'user_blocked' : 'user_unblocked',
    details: `By admin ${session.user.email}`,
    level: block ? 'high' : 'info',
  });

  return NextResponse.json({ success: true });
}
