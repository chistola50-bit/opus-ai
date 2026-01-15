'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Referral Program',
    howItWorks: 'How it works',
    step1: '1. Share your link with friends',
    step2: '2. Friend registers and buys credits',
    step3: '3. When friend spends 15% of purchased credits',
    step4: '4. You both get 10,000 credits!',
    yourLink: 'Your referral link',
    code: 'Code',
    copy: 'Copy',
    copied: 'Copied!',
    stats: 'Statistics',
    totalReferrals: 'Total referrals',
    completed: 'Completed',
    pending: 'Pending',
    earned: 'Credits earned',
    bonusesThisMonth: 'Bonuses this month',
    dashboard: 'Dashboard',
    referrals: 'Referrals',
    loading: 'Loading...',
    buyCredits: 'Buy Credits',
  },
  ru: {
    title: 'Реферальная программа',
    howItWorks: 'Как это работает',
    step1: '1. Поделись своей ссылкой с друзьями',
    step2: '2. Друг регистрируется и покупает кредиты',
    step3: '3. Когда друг потратит 15% купленных кредитов',
    step4: '4. Вы оба получаете по 10,000 кредитов!',
    yourLink: 'Твоя реферальная ссылка',
    code: 'Код',
    copy: 'Копировать',
    copied: 'Скопировано!',
    stats: 'Статистика',
    totalReferrals: 'Всего рефералов',
    completed: 'Завершённых',
    pending: 'Ожидают',
    earned: 'Заработано кредитов',
    bonusesThisMonth: 'Бонусов в этом месяце',
    dashboard: 'Dashboard',
    referrals: 'Рефералы',
    loading: 'Загрузка...',
    buyCredits: 'Купить кредиты',
  },
  hi: {
    title: 'रेफरल प्रोग्राम',
    howItWorks: 'यह कैसे काम करता है',
    step1: '1. अपना लिंक दोस्तों के साथ साझा करें',
    step2: '2. दोस्त रजिस्टर करता है और क्रेडिट खरीदता है',
    step3: '3. जब दोस्त 15% क्रेडिट खर्च करता है',
    step4: '4. आप दोनों को 10,000 क्रेडिट मिलते हैं!',
    yourLink: 'आपका रेफरल लिंक',
    code: 'कोड',
    copy: 'कॉपी करें',
    copied: 'कॉपी हो गया!',
    stats: 'आंकड़े',
    totalReferrals: 'कुल रेफरल',
    completed: 'पूर्ण',
    pending: 'लंबित',
    earned: 'अर्जित क्रेडिट',
    bonusesThisMonth: 'इस महीने बोनस',
    dashboard: 'डैशबोर्ड',
    referrals: 'रेफरल',
    loading: 'लोड हो रहा है...',
    buyCredits: 'क्रेडिट खरीदें',
  },
  pt: {
    title: 'Programa de Indicação',
    howItWorks: 'Como funciona',
    step1: '1. Compartilhe seu link com amigos',
    step2: '2. Amigo se registra e compra créditos',
    step3: '3. Quando amigo gastar 15% dos créditos',
    step4: '4. Vocês dois ganham 10.000 créditos!',
    yourLink: 'Seu link de indicação',
    code: 'Código',
    copy: 'Copiar',
    copied: 'Copiado!',
    stats: 'Estatísticas',
    totalReferrals: 'Total de indicações',
    completed: 'Concluídas',
    pending: 'Pendentes',
    earned: 'Créditos ganhos',
    bonusesThisMonth: 'Bônus este mês',
    dashboard: 'Painel',
    referrals: 'Indicações',
    loading: 'Carregando...',
    buyCredits: 'Comprar Créditos',
  },
  id: {
    title: 'Program Referral',
    howItWorks: 'Cara kerjanya',
    step1: '1. Bagikan link Anda dengan teman',
    step2: '2. Teman mendaftar dan membeli kredit',
    step3: '3. Ketika teman menghabiskan 15% kredit',
    step4: '4. Kalian berdua mendapat 10.000 kredit!',
    yourLink: 'Link referral Anda',
    code: 'Kode',
    copy: 'Salin',
    copied: 'Tersalin!',
    stats: 'Statistik',
    totalReferrals: 'Total referral',
    completed: 'Selesai',
    pending: 'Tertunda',
    earned: 'Kredit diperoleh',
    bonusesThisMonth: 'Bonus bulan ini',
    dashboard: 'Dasbor',
    referrals: 'Referral',
    loading: 'Memuat...',
    buyCredits: 'Beli Kredit',
  },
  ph: {
    title: 'Referral Program',
    howItWorks: 'Paano ito gumagana',
    step1: '1. Ibahagi ang iyong link sa mga kaibigan',
    step2: '2. Mag-register ang kaibigan at bumili ng credits',
    step3: '3. Kapag gumastos ang kaibigan ng 15% ng credits',
    step4: '4. Pareho kayong makakakuha ng 10,000 credits!',
    yourLink: 'Iyong referral link',
    code: 'Code',
    copy: 'Kopyahin',
    copied: 'Nakopya!',
    stats: 'Estadistika',
    totalReferrals: 'Kabuuang referral',
    completed: 'Nakumpleto',
    pending: 'Naghihintay',
    earned: 'Nakuhang credits',
    bonusesThisMonth: 'Bonus ngayong buwan',
    dashboard: 'Dashboard',
    referrals: 'Mga Referral',
    loading: 'Naglo-load...',
    buyCredits: 'Bumili ng Credits',
  },
};

type Lang = keyof typeof translations;

export default function ReferralPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const saved = localStorage.getItem('language') as Lang;
    if (saved && translations[saved]) {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/user/referral')
        .then(res => res.json())
        .then(setData);
    }
  }, [session]);

  const copyLink = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const changeLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('language', newLang);
    setShowLangMenu(false);
  };

  if (status === 'loading' || !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-green-400">
            Opus
          </Link>
          
          <div className="flex items-center gap-4">
            {/* language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 text-gray-300 hover:text-white"
              >
                🌐 {lang.toUpperCase()} ▼
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                  {Object.keys(translations).map((l) => (
                    <button
                      key={l}
                      onClick={() => changeLang(l as Lang)}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                        lang === l ? 'text-green-400' : 'text-gray-300'
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/dashboard" className="text-gray-300 hover:text-white">
              {t.dashboard}
            </Link>
            <Link href="/referral" className="text-green-400">
              {t.referrals}
            </Link>
            <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
              💰 {(session as any)?.user?.credits || 0}
            </span>
          </div>
        </div>
      </header>

      {/* content */}
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">{t.title}</h1>
        
        {/* how it works */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t.howItWorks}</h2>
          <ul className="space-y-2 text-gray-300">
            <li>{t.step1}</li>
            <li>{t.step2}</li>
            <li>{t.step3}</li>
            <li>{t.step4}</li>
          </ul>
        </div>

        {/* your link */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t.yourLink}</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={data.referralLink}
              readOnly
              className="flex-1 bg-gray-700 rounded px-4 py-2 text-sm"
            />
            <button
              onClick={copyLink}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium"
            >
              {copied ? t.copied : t.copy}
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {t.code}: <span className="text-green-400">{data.referralCode}</span>
          </p>
        </div>

        {/* stats */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{t.stats}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded p-4">
              <div className="text-2xl font-bold text-green-400">{data.stats.total}</div>
              <div className="text-gray-400 text-sm">{t.totalReferrals}</div>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <div className="text-2xl font-bold text-green-400">{data.stats.completed}</div>
              <div className="text-gray-400 text-sm">{t.completed}</div>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <div className="text-2xl font-bold text-yellow-400">{data.stats.pending}</div>
              <div className="text-gray-400 text-sm">{t.pending}</div>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <div className="text-2xl font-bold text-green-400">{data.stats.earned.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">{t.earned}</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            {t.bonusesThisMonth}: {data.stats.bonusesThisMonth} / {data.stats.maxBonusesPerMonth}
          </p>
        </div>
      </div>
    </div>
  );
}