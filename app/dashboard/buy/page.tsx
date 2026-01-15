'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Coins, Check, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { authTranslations } from '@/lib/authTranslations';
import LanguageSelector from '@/components/LanguageSelector';

const plans = [
  { id: 'starter', name: 'Starter', price: 3.49, credits: 300000, popular: false },
  { id: 'basic', name: 'Basic', price: 7.49, credits: 700000, popular: true },
  { id: 'pro', name: 'Pro', price: 11.49, credits: 1100000, popular: false },
  { id: 'business', name: 'Business', price: 15.49, credits: 1500000, popular: false }
];

const paymentMethods = [
  { id: 'ton', name: 'TON', icon: '💎' },
  { id: 'usdt', name: 'USDT (TRC20)', icon: '💵' }
];

export default function BuyCreditsPage() {
  const { lang } = useLanguage();
  const t = authTranslations[lang] || authTranslations.EN;
  
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [selectedPayment, setSelectedPayment] = useState('ton');
  const [loading, setLoading] = useState(false);

  const currentPlan = plans.find(p => p.id === selectedPlan)!;

  const handlePurchase = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          currency: selectedPayment,
        }),
      });

      const data = await response.json();

      if (data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        alert('Error creating payment');
      }
    } catch (error) {
      alert('Error creating payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition"
            >
              <ArrowLeft size={20} />
              {t.backToDashboard}
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Link href="/" className="text-2xl font-bold text-yellow-500">
                Opus
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t.buyCredits}
          </h1>
          <p className="text-gray-400 text-lg">
            {t.buyCreditsSubtitle}
          </p>
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-6 rounded-xl border-2 transition text-left ${
                selectedPlan === plan.id
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Zap size={12} />
                    {t.popular}
                  </span>
                </div>
              )}
              
              <h3 className="text-white font-semibold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                ${plan.price}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Coins size={16} />
                <span>{plan.credits.toLocaleString()} {t.credits}</span>
              </div>
              
              {selectedPlan === plan.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-black" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Payment Method */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t.paymentMethod}
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition ${
                  selectedPayment === method.id
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className="text-white font-medium">{method.name}</span>
                
                {selectedPayment === method.id && (
                  <div className="ml-auto">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-black" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t.orderSummary}
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between text-gray-400">
              <span>{t.plan}</span>
              <span className="text-white">{currentPlan.name}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>{t.credits}</span>
              <span className="text-white">{currentPlan.credits.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>{t.payment}</span>
              <span className="text-white">
                {paymentMethods.find(p => p.id === selectedPayment)?.name}
              </span>
            </div>
            <div className="border-t border-gray-700 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-white font-semibold">{t.total}</span>
                <span className="text-2xl font-bold text-yellow-500">
                  ${currentPlan.price}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl text-lg hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? t.processing : `${t.pay} $${currentPlan.price}`}
        </button>

        {/* Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          {t.creditsNote}
        </p>

      </main>
    </div>
  );
}