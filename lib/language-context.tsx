'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'vi' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (vi: string, en: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  t: (vi) => vi,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wispic_lang') as Language | null
      if (saved === 'vi' || saved === 'en') {
        setLanguageState(saved)
        document.documentElement.lang = saved
      } else {
        // Default is Vietnamese
        document.documentElement.lang = 'vi'
      }
    } catch {
      // LocalStorage unavailable
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('wispic_lang', lang)
      document.documentElement.lang = lang
    } catch {
      // ignore
    }
  }

  const t = (vi: string, en: string) => (language === 'vi' ? vi : en)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
