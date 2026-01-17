'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Coins, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    // Получаем актуальный баланс
    fetch('/api/user/credits')
      .then(res => res.json())
      .then(data => setCredits(data.credits))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <CheckCircle size={40} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-400 mb-8">
          Your credits have been added to your account.
        </p>

        {/* Balance Card */}
        {credits !== null && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
              <Coins size={20} className="text-yellow-500" />
              <span>Your Balance</span>
            </div>
            <div className="text-4xl font-bold text-yellow-500">
              {credits.toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm mt-1">credits</div>
          </div>
        )}

        {/* CTA Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-yellow-500 text-black font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition"
        >
          Start Using Tools
          <ArrowRight size={20} />
        </Link>

      </div>
    </div>
  );
}