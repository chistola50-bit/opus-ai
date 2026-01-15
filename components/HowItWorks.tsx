'use client';

import { translations } from '@/lib/translations';
import { MousePointer, Cpu, CheckCheck } from 'lucide-react';

export default function HowItWorks({ currentLang }: { currentLang: string }) {
  const t = translations[currentLang as keyof typeof translations];

  const steps = [
    { icon: MousePointer, key: 'step1', number: '01' },
    { icon: Cpu, key: 'step2', number: '02' },
    { icon: CheckCheck, key: 'step3', number: '03' }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            {t.howItWorks.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.key} className="relative text-center">
                
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-yellow-500 to-transparent"></div>
                )}
                
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 mb-6">
                  <div className="text-center">
                    <div className="text-yellow-500 text-sm font-bold">{step.number}</div>
                    <IconComponent size={40} className="text-yellow-500 mx-auto mt-1" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {(t.howItWorks as any)[step.key].title}
                </h3>
                <p className="text-gray-400">
                  {(t.howItWorks as any)[step.key].text}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}