'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageStore {
  lang: string;
  setLang: (lang: string) => void;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: 'EN',
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'opus-language',
    }
  )
);