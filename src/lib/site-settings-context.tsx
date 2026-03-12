"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface SiteSettings {
  logoUrl: string
  footerDescription: string
  copyrightText: string
  facebookUrl: string | null
  twitterUrl: string | null
  instagramUrl: string | null
  youtubeUrl: string | null
}

const defaults: SiteSettings = {
  logoUrl: '/logo.png',
  footerDescription: 'Your ultimate destination for movies and TV series. Stream unlimited content anytime, anywhere on any device.',
  copyrightText: 'Ganma Shami',
  facebookUrl: null,
  twitterUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
}

const SiteSettingsContext = createContext<SiteSettings>(defaults)

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults)

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setSettings(data) })
      .catch(() => {})
  }, [])

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
