import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Credit costs per tool
const TOOL_COSTS: { [key: string]: number } = {
  humanizer: 5,
  detector: 3,
  grammar: 2,
  summarizer: 4,
  paraphraser: 4,
  translator: 3,
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { tool, inputLength } = await request.json();

    if (!tool || !TOOL_COSTS[tool]) {
      return NextResponse.json(
        { error: 'Invalid tool' },
        { status: 400 }
      );
    }

    // Calculate cost based on tool and input length
    const baseCost = TOOL_COSTS[tool];
    const lengthMultiplier = Math.ceil((inputLength || 100) / 500);
    const totalCost = baseCost * Math.max(1, lengthMultiplier);

    // Get current user credits
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, credits: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.credits < totalCost) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          required: totalCost,
          available: user.credits,
        },
        { status: 402 }
      );
    }

    // Deduct credits
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { credits: user.credits - totalCost },
      select: { credits: true },
    });

    // Record transaction — без поля `tool`, только details
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'usage',
        amount: -totalCost,
        details: `Used ${tool} tool`,
      },
    });

    return NextResponse.json({
      success: true,
      creditsUsed: totalCost,
      remainingCredits: updatedUser.credits,
    });
  } catch (error) {
    console.error('Use credits error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}  

