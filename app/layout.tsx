import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'AI Humanizer Pro - Сделай ИИ-текст человечным',
  description:
    'Профессиональные инструменты для гуманизации текста, обхода AI-детекторов и улучшения контента',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-black`}>
        <SessionProvider>
          <AnalyticsTracker />
          {children}
        </SessionProvider>

        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}
