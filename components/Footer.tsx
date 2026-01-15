'use client';

import Link from 'next/link';
import { translations } from '@/lib/translations';

export default function Footer({ currentLang }: { currentLang: string }) {
  const t = translations[currentLang as keyof typeof translations];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-yellow-500">
              Opus
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              {t.footer.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.navigation}</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('tools')}
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t.nav.features}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t.nav.howItWorks}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t.nav.pricing}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t.nav.faq}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.legal}</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500">
            © 2025 Opus. {t.footer.rights}
          </p>
        </div>

      </div>
    </footer>
  );
}