"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from '@/lib/theme-context'

const defaultBackdrops = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
]

interface PageBannerProps {
  title: string
  subtitle?: string
  backdrops?: string[]
  icon?: React.ReactNode
}

export default function PageBanner({ 
  title, 
  subtitle, 
  backdrops = defaultBackdrops, 
  icon
}: PageBannerProps) {
  const { currentTheme } = useTheme()
  const [currentBackdrop, setCurrentBackdrop] = useState(backdrops[0])

  useEffect(() => {
    // Pick random backdrop on page load
    const randomIndex = Math.floor(Math.random() * backdrops.length)
    setCurrentBackdrop(backdrops[randomIndex])
  }, [backdrops])

  return (
    <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
      {/* Backdrop Image - changes on page refresh */}
      <Image
        src={currentBackdrop}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      {/* Gradient Overlays - More cinematic */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-[var(--background)]/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/60 via-transparent to-[var(--background)]/60" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-12 md:pb-16">
          <div className="flex items-center gap-5">
            {icon && (
              <div 
                className="p-4 rounded-2xl shadow-2xl"
                style={{ 
                  backgroundColor: currentTheme.primary,
                  boxShadow: `0 20px 40px ${currentTheme.primary}40`
                }}
              >
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-2xl">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg md:text-xl text-gray-300 mt-3 font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent" />
    </div>
  )
}
