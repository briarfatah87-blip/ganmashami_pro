"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Language, TranslationKey, languageDir, languageNames, translations } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  dir: 'ltr' | 'rtl'
  languageNames: typeof languageNames
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations.en[key],
  dir: 'ltr',
  languageNames,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  // Load from localStorage on mount for instant apply (before settings API responds)
  useEffect(() => {
    const stored = localStorage.getItem('app-language') as Language | null
    if (stored && stored in translations) {
      setLanguageState(stored)
    }
  }, [])

  // Sync from user settings API when available
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.language && data.language in translations) {
          setLanguageState(data.language as Language)
          localStorage.setItem('app-language', data.language)
        }
      })
      .catch(() => {})
  }, [])

  // Apply dir and lang attribute to <html>
  useEffect(() => {
    const dir = languageDir[language]
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', language)
    localStorage.setItem('app-language', language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: TranslationKey): string => {
    return (translations[language] as Record<string, string>)[key] ?? (translations.en as Record<string, string>)[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: languageDir[language], languageNames }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
