// lib/security.ts
import { prisma } from './prisma';
import { sendTelegramAlert } from './telegram';

interface SecurityEventInput {
  userId?: string;
  type: string;
  ip?: string | null;
  userAgent?: string | null;
  details?: string;
  level?: 'info' | 'warning' | 'high';
}

export async function createSecurityEvent(input: SecurityEventInput) {
  const { userId, type, ip, userAgent, details, level = 'info' } = input;

  const event = await prisma.securityEvent.create({
    data: {
      userId,
      type,
      ip: ip || undefined,
      userAgent: userAgent || undefined,
      details,
      level,
    },
  });

  if (level === 'high') {
    const msg = [
      '🚨 <b>Security alert</b>',
      `Type: <code>${type}</code>`,
      userId ? `User: <code>${userId}</code>` : '',
      ip ? `IP: <code>${ip}</code>` : '',
      details ? `Details: ${details}` : '',
      `Time: ${event.createdAt.toISOString()}`,
    ]
      .filter(Boolean)
      .join('\n');

    await sendTelegramAlert(msg);
  }

  return event;
}
