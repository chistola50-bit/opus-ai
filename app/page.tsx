'use client';

import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import Tools from '@/components/Tools';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  const { lang, setLang } = useLanguage();

  return (
    <main className="bg-black min-h-screen">
      <Header currentLang={lang} setCurrentLang={setLang} />
      <Hero currentLang={lang} />
      <Problem currentLang={lang} />
      <Tools currentLang={lang} />
      <HowItWorks currentLang={lang} />
      <Pricing currentLang={lang} />
      <FAQ currentLang={lang} />
      <Footer currentLang={lang} />
    </main>
  );
}