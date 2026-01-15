'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from '@/components/LanguageSelector';

const texts: { [key: string]: {
  title: string;
  subtitle: string;
  description: string;
  button: string;
}} = {
  EN: {
    title: '404',
    subtitle: 'Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved.",
    button: 'Go Home'
  },
  RU: {
    title: '404',
    subtitle: 'Страница не найдена',
    description: 'Страница, которую вы ищете, не существует или была перемещена.',
    button: 'На главную'
  },
  PT: {
    title: '404',
    subtitle: 'Página Não Encontrada',
    description: 'A página que você procura não existe ou foi movida.',
    button: 'Ir para Início'
  },
  HI: {
    title: '404',
    subtitle: 'पेज नहीं मिला',
    description: 'आप जो पेज ढूंढ रहे हैं वह मौजूद नहीं है या हटा दिया गया है।',
    button: 'होम जाएं'
  },
  ID: {
    title: '404',
    subtitle: 'Halaman Tidak Ditemukan',
    description: 'Halaman yang Anda cari tidak ada atau telah dipindahkan.',
    button: 'Ke Beranda'
  },
  PH: {
    title: '404',
    subtitle: 'Hindi Nahanap ang Pahina',
    description: 'Ang pahina na hinahanap mo ay hindi umiiral o inilipat na.',
    button: 'Pumunta sa Home'
  }
};

export default function NotFound() {
  const { lang } = useLanguage();
  const t = texts[lang] || texts.EN;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      
      {/* Language Selector */}
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>

      <div className="text-center">
        
        <h1 className="text-8xl font-bold text-yellow-500 mb-4">{t.title}</h1>
        
        <h2 className="text-2xl font-semibold text-white mb-4">
          {t.subtitle}
        </h2>
        
        <p className="text-gray-400 mb-8 max-w-md">
          {t.description}
        </p>
        
        <Link
          href="/"
          className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          {t.button}
        </Link>
        
      </div>
    </div>
  );
}