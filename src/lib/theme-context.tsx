"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface ThemeColor {
  name: string
  primary: string
  primaryHover: string
  primaryLight: string
  gradient: string
}

export const themeColors: ThemeColor[] = [
  {
    name: 'Red',
    primary: '#dc2626',
    primaryHover: '#b91c1c',
    primaryLight: '#fecaca',
    gradient: 'from-red-600 to-red-800'
  },
  {
    name: 'Blue',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: '#bfdbfe',
    gradient: 'from-blue-600 to-blue-800'
  },
  {
    name: 'Purple',
    primary: '#9333ea',
    primaryHover: '#7e22ce',
    primaryLight: '#e9d5ff',
    gradient: 'from-purple-600 to-purple-800'
  },
  {
    name: 'Green',
    primary: '#16a34a',
    primaryHover: '#15803d',
    primaryLight: '#bbf7d0',
    gradient: 'from-green-600 to-green-800'
  },
  {
    name: 'Orange',
    primary: '#ea580c',
    primaryHover: '#c2410c',
    primaryLight: '#fed7aa',
    gradient: 'from-orange-600 to-orange-800'
  },
  {
    name: 'Pink',
    primary: '#db2777',
    primaryHover: '#be185d',
    primaryLight: '#fbcfe8',
    gradient: 'from-pink-600 to-pink-800'
  },
  {
    name: 'Cyan',
    primary: '#0891b2',
    primaryHover: '#0e7490',
    primaryLight: '#a5f3fc',
    gradient: 'from-cyan-600 to-cyan-800'
  },
  {
    name: 'Yellow',
    primary: '#ca8a04',
    primaryHover: '#a16207',
    primaryLight: '#fef08a',
    gradient: 'from-yellow-600 to-yellow-800'
  }
]

interface ThemeContextType {
  currentTheme: ThemeColor
  setTheme: (theme: ThemeColor) => void
  themeColors: ThemeColor[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(themeColors[0])

  useEffect(() => {
    const savedTheme = localStorage.getItem('ganmashami-theme')
    if (savedTheme) {
      const theme = themeColors.find(t => t.name === savedTheme)
      if (theme) setCurrentTheme(theme)
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', currentTheme.primary)
    document.documentElement.style.setProperty('--theme-primary-hover', currentTheme.primaryHover)
    document.documentElement.style.setProperty('--theme-primary-light', currentTheme.primaryLight)
  }, [currentTheme])

  const setTheme = (theme: ThemeColor) => {
    setCurrentTheme(theme)
    localStorage.setItem('ganmashami-theme', theme.name)
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
