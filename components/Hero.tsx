'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { translations } from '@/lib/translations';

export default function Hero({ currentLang }: { currentLang: string }) {
  const { data: session } = useSession();
  const t = translations[currentLang as keyof typeof translations];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black pt-16 overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,200,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,200,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-8 animate-pulse">
          <span className="text-yellow-500 text-sm font-medium">
            ⚡ AI-Powered Results
          </span>
        </div>

        {/* Main Title with Gradient */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
            {t.hero.title}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
          {t.hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={session ? '/dashboard' : '/register'}
            className="group relative w-full sm:w-auto bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(234,179,8,0.5)]"
          >
            <span className="relative z-10">
              {session ? 'Dashboard' : t.hero.cta}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg hover:border-yellow-500 hover:text-yellow-500 transition-all duration-300"
          >
            {t.nav.howItWorks} →
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="group">
            <div className="text-3xl sm:text-4xl font-bold text-yellow-500 group-hover:scale-110 transition-transform">1K+</div>
            <div className="text-gray-500 text-sm mt-1">Users</div>
          </div>
          <div className="group">
            <div className="text-3xl sm:text-4xl font-bold text-yellow-500 group-hover:scale-110 transition-transform">50K+</div>
            <div className="text-gray-500 text-sm mt-1">Results</div>
          </div>
          <div className="group">
            <div className="text-3xl sm:text-4xl font-bold text-yellow-500 group-hover:scale-110 transition-transform">8</div>
            <div className="text-gray-500 text-sm mt-1">Tools</div>
          </div>
        </div>

      </div>
    </section>
  );
}