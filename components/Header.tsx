'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { translations } from '@/lib/translations';
import { ChevronDown, Menu, X } from 'lucide-react';

const languages = ['EN', 'RU', 'PT', 'HI', 'ID', 'PH'];

export default function Header({ 
  currentLang, 
  setCurrentLang 
}: { 
  currentLang: string;
  setCurrentLang: (lang: string) => void;
}) {
  const { data: session, status } = useSession();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang as keyof typeof translations];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: t.nav.features, id: 'tools' },
    { label: t.nav.howItWorks, id: 'how-it-works' },
    { label: t.nav.pricing, id: 'pricing' },
    { label: t.nav.faq, id: 'faq' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-yellow-500">
              Opus
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-300 hover:text-yellow-500 transition"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop Right side */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                >
                  <span>{currentLang}</span>
                  <ChevronDown size={16} />
                </button>
                
                {langOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setLangOpen(false)} 
                    />
                    <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-2 min-w-[80px] z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setCurrentLang(lang);
                            setLangOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-800 transition ${
                            currentLang === lang ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Auth Buttons - проверяем сессию */}
              {status === 'loading' ? (
                <div className="w-24 h-10 bg-gray-800 animate-pulse rounded-lg" />
              ) : session ? (
                <Link
                  href="/dashboard"
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="text-gray-300 hover:text-white transition"
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/register"
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                  >
                    {t.nav.getStarted}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white transition p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-6">
            
            <nav className="space-y-4 mb-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-lg text-gray-300 hover:text-yellow-500 transition py-2"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="border-t border-gray-800 my-4" />

            <div className="mb-6">
              <p className="text-gray-500 text-sm mb-2">Language</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setCurrentLang(lang)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      currentLang === lang 
                        ? 'bg-yellow-500 text-black' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Auth Buttons - проверяем сессию */}
            <div className="space-y-3">
              {status === 'loading' ? (
                <div className="w-full h-12 bg-gray-800 animate-pulse rounded-lg" />
              ) : session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition"
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                  >
                    {t.nav.getStarted}
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}