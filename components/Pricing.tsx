'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { translations } from '@/lib/translations';
import { Check, Zap } from 'lucide-react';

export default function Pricing({ currentLang }: { currentLang: string }) {
  const { data: session } = useSession();
  const t = translations[currentLang as keyof typeof translations];

  const plans = [
    { 
      price: '$3.49', 
      credits: '300,000',
      key: 'starter',
      popular: false
    },
    { 
      price: '$7.49', 
      credits: '700,000',
      key: 'basic',
      popular: true
    },
    { 
      price: '$11.49', 
      credits: '1,100,000',
      key: 'pro',
      popular: false
    },
    { 
      price: '$15.49', 
      credits: '1,500,000',
      key: 'business',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            {t.pricing.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative bg-gray-900/50 rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]' 
                  : 'border-gray-700 hover:border-yellow-500/50'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap size={12} />
                    {t.pricing.popular}
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-lg font-bold text-white mb-2">
                {(t.pricing as any)[plan.key].name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-yellow-500">{plan.price}</span>
              </div>

              {/* Credits */}
              <div className="text-gray-400 mb-6">
                <span className="text-2xl font-bold text-white">{plan.credits}</span>
                <span className="ml-2">{t.pricing.credits}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {(t.pricing as any)[plan.key].features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-300 text-sm">
                    <Check size={16} className="text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
  href={session ? '/dashboard/buy' : '/register'}
  className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
    plan.popular
      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
      : 'bg-gray-800 text-white hover:bg-gray-700'
  }`}
>
  {session ? t.pricing.cta : t.pricing.cta}
</Link>
            </div>
          ))}
        </div>

        {/* Trust Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            {t.pricing.note}
          </p>
        </div>

      </div>
    </section>
  );
}