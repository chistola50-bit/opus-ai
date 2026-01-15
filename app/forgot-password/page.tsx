'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { authTranslations } from '@/lib/authTranslations';
import LanguageSelector from '@/components/LanguageSelector';

export default function ForgotPasswordPage() {
  const { lang } = useLanguage();
  const t = authTranslations[lang] || authTranslations.EN;
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link 
          href="/login"
          className="text-gray-400 hover:text-white transition flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          {t.backToLogin}
        </Link>
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-yellow-500">
            Opus
          </Link>
        </div>

        {sent ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t.checkEmail}</h2>
            <p className="text-gray-400 mb-6">{t.checkEmailSubtitle}</p>
            <Link 
              href="/login"
              className="text-yellow-500 hover:underline"
            >
              {t.backToLogin}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-yellow-500" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{t.forgotPasswordTitle}</h2>
              <p className="text-gray-400">{t.forgotPasswordSubtitle}</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">{t.email}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {loading ? t.sending : t.sendResetLink}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}