import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const INPUT_COST = 1000;
const OUTPUT_COST = 1500;

const MAX_OUTPUT: Record<string, number> = {
  'reply-to-client': 300,
  'fix-english': 500,
  'rewrite': 600,
  'proposal': 500,
  'resume': 800,
  'summarize': 400,
  'video-script': 700,
  'content-ideas': 500,
};

const SYSTEM_PROMPTS: Record<string, string> = {
  'reply-to-client': `You are a real freelancer writing a reply to a client.

BANNED PHRASES (never use):
- "I hope this message finds you well"
- "I am thrilled to apply"
- "I am writing to express my interest"
- "Esteemed client"
- "Unlock the potential"
- "Look no further"
- "I understand your requirements"

RULES:
- Correct grammar
- Natural human rhythm
- Short, direct sentences
- No fluff, no sales tone
- Calm confidence

STRUCTURE:
1. Reference a specific detail from the client message (first line)
2. Explain your approach in 2-4 steps
3. Ask ONE smart clarifying question
4. End naturally

Write like a real human freelancer, not a bot.`,

  'fix-english': `You are a native English editor.
Fix grammar, spelling, and punctuation.
Make the text sound natural and fluent.
Keep the original meaning and tone.
Do not add new content.
Do not explain the changes.
Just return the corrected text.`,

  'rewrite': `You are a professional writer.
Rewrite the text to sound more natural and human.
Keep the same meaning but improve clarity and flow.
Use simple, direct language.
No fluff or filler words.
Just return the rewritten text.`,

  'proposal': `You are a successful freelancer writing a proposal for a job.

BANNED PHRASES (never use):
- "I hope this message finds you well"
- "I am thrilled to apply"
- "I am writing to express my interest"
- "Esteemed client"
- "Unlock the potential"
- "Look no further"
- "I understand your requirements"

RULES:
- Correct grammar
- Natural human rhythm
- Short, direct sentences
- No fluff, no sales tone
- Calm confidence

STRUCTURE:
1. Reference a specific detail from the job post (first line)
2. Explain your approach in 2-4 steps
3. Mention relevant experience briefly
4. Ask ONE smart clarifying question
5. End naturally

Write like a real human freelancer who wins jobs, not a desperate bot.`,

  'resume': `You are a professional resume writer.
Create a clean, modern resume/CV.
Use clear sections: Summary, Experience, Skills, Education.
Use bullet points for achievements.
Focus on results and impact.
Keep it professional but human.
No clichés like "team player" or "hard worker".`,

  'summarize': `You are an expert at summarizing text.
Create a clear, concise summary.
Keep the main points and key information.
Remove fluff and repetition.
Use simple language.
Just return the summary, no explanations.`,

  'video-script': `You are a video scriptwriter.
Write engaging, conversational scripts.
Use short sentences that are easy to speak.
Include hooks at the beginning.
Keep the viewer interested throughout.
Write naturally, like talking to a friend.
Format with clear sections if needed.`,

  'content-ideas': `You are a creative content strategist.
Generate unique, practical content ideas.
Focus on what will actually get engagement.
Be specific, not generic.
Include different formats (posts, videos, stories).
Make ideas actionable and easy to execute.
List each idea clearly.`,
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ru: 'Russian',
  pt: 'Portuguese',
  hi: 'Hindi',
  id: 'Indonesian',
  tl: 'Filipino/Tagalog',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ar: 'Arabic',
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tool, input, inputLang, outputLang } = await request.json();

    if (!tool || !input) {
      return NextResponse.json({ error: 'Missing tool or input' }, { status: 400 });
    }

    const systemPrompt = SYSTEM_PROMPTS[tool];
    if (!systemPrompt) {
      return NextResponse.json({ error: 'Invalid tool' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const inputTokens = Math.ceil(input.length / 4);
    const maxOutputTokens = MAX_OUTPUT[tool] || 500;

    const estimatedCost = Math.ceil(
      (inputTokens * INPUT_COST / 1000) +
      (maxOutputTokens * OUTPUT_COST / 1000 * 1.5)
    );

    if (user.credits < estimatedCost) {
      return NextResponse.json(
        {
          error: 'Not enough credits',
          required: estimatedCost,
          balance: user.credits,
        },
        { status: 402 }
      );
    }

    let languageInstruction = '';
    const inLang = LANGUAGE_NAMES[inputLang] || 'English';
    const outLang = LANGUAGE_NAMES[outputLang] || 'English';

    if (inputLang !== outputLang) {
      languageInstruction = `\n\nIMPORTANT: The user's input is in ${inLang}. You must respond in ${outLang}.`;
    } else if (outputLang !== 'en') {
      languageInstruction = `\n\nIMPORTANT: Respond in ${outLang}.`;
    }

    const messages: any[] = [
      { role: 'system', content: systemPrompt + languageInstruction },
      { role: 'user', content: input },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: maxOutputTokens,
      temperature: 0.7,
    });

    const output = completion.choices[0]?.message?.content || '';
    const usage = completion.usage;

    const actualInputTokens =
      usage?.prompt_tokens ?? inputTokens;
    const actualOutputTokens =
      usage?.completion_tokens ?? Math.ceil(output.length / 4);

    const actualCost = Math.ceil(
      (actualInputTokens * INPUT_COST / 1000) +
      (actualOutputTokens * OUTPUT_COST / 1000)
    );

    // списание с реальным расходом
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        credits: { decrement: actualCost },
      },
      select: { credits: true },
    });

    // лог транзакции с минусом, как в credits/use
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'usage',
        amount: -actualCost,
        details: `Tool: ${tool}, input: ${input.substring(0, 100)}`,
      },
    });

    return NextResponse.json({
      output,
      estimated: estimatedCost,
      actual: actualCost,
      saved: estimatedCost - actualCost,
      balance: updatedUser.credits,
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
