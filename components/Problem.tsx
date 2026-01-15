'use client';

import { translations } from '@/lib/translations';
import { Bot, Languages, TrendingDown } from 'lucide-react';

export default function Problem({ currentLang }: { currentLang: string }) {
  const t = translations[currentLang as keyof typeof translations];

  const problems = [
    { icon: Bot, key: 'problem1', color: 'text-red-400' },
    { icon: Languages, key: 'problem2', color: 'text-red-400' },
    { icon: TrendingDown, key: 'problem3', color: 'text-red-400' }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            {t.problem.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t.problem.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem) => {
            const IconComponent = problem.icon;
            return (
              <div 
                key={problem.key}
                className="bg-gray-900/50 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition"
              >
                <div className={`w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 ${problem.color}`}>
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {(t.problem as any)[problem.key].title}
                </h3>
                <p className="text-gray-400">
                  {(t.problem as any)[problem.key].text}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}