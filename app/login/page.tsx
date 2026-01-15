'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { authTranslations } from '@/lib/authTranslations';
import LanguageSelector from '@/components/LanguageSelector';

export default function LoginPage() {
  const { lang } = useLanguage();
  const t = authTranslations[lang] || authTranslations.EN;
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe.toString(),
        redirect: false,
      });
      
      if (result?.error) {
        alert('Invalid email or password');
      } else {
        window.location.href = '/dashboard';
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
          href="/"
          className="text-gray-400 hover:text-white transition flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          {t.back}
        </Link>
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-yellow-500">
            Opus
          </Link>
          <p className="text-gray-400 mt-2">{t.welcomeBack}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">{t.email}</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition"
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">{t.password}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-gray-400 text-sm">{t.rememberMe}</span>
            </label>
            <Link href="/forgot-password" className="text-yellow-500 text-sm hover:underline">
              {t.forgotPassword}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? t.loggingIn : t.login}
          </button>

          <p className="text-center text-gray-400 mt-6">
            {t.noAccount}{' '}
            <Link href="/register" className="text-yellow-500 hover:underline">
              {t.signUp}
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}