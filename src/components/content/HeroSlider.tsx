"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Plus, Info, ChevronLeft, ChevronRight, Star, Clock, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Movie, Series } from '@/lib/sample-data'
import { useTheme } from '@/lib/theme-context'

interface HeroSliderProps {
  items: (Movie | Series)[]
}

export default function HeroSlider({ items }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { currentTheme } = useTheme()

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
        setIsTransitioning(false)
      }, 500)
    }, 6000)

    return () => clearInterval(interval)
  }, [items.length, isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
      setIsTransitioning(false)
    }, 300)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
      setIsTransitioning(false)
    }, 300)
  }

  const currentItem = items[currentIndex]
  const isMovie = 'duration' in currentItem
  const href = isMovie ? `/movie/${currentItem.id}` : `/series/${currentItem.id}`

  return (
    <div className="relative h-[75vh] md:h-[90vh] overflow-hidden">
      {/* Background Image with transition */}
      <div className={`absolute inset-0 transition-all duration-700 ${isTransitioning ? 'scale-105 opacity-50' : 'scale-100 opacity-100'}`}>
        <Image
          src={currentItem.backdrop}
          alt={currentItem.title}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Gradient Overlays - More cinematic */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/20 to-[var(--background)]/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/60 via-transparent to-transparent h-32" />

      {/* Content */}
      <div className={`relative h-full container mx-auto px-4 flex items-center transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-2xl pt-20">
          {/* Type Badge with glow */}
          <div className="flex items-center gap-3 mb-6">
            <span 
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-lg"
              style={{ backgroundColor: currentTheme.primary, boxShadow: `0 0 20px ${currentTheme.primary}40` }}
            >
              {isMovie ? '🎬 Movie' : '📺 TV Series'}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              {currentItem.rating.toFixed(1)}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm">
              {currentItem.genre}
            </span>
          </div>

          {/* Title with text shadow */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-[1.1] tracking-tight drop-shadow-2xl">
            {currentItem.title}
          </h1>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-gray-300 text-sm mb-4">
            <span className="font-semibold text-white">{currentItem.releaseYear}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            {isMovie && (currentItem as Movie).duration && (
              <>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {Math.floor((currentItem as Movie).duration / 60)}h {(currentItem as Movie).duration % 60}m
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-500" />
              </>
            )}
            {!isMovie && (currentItem as Series).seasons && (
              <>
                <span>{(currentItem as Series).seasons.length} Season{(currentItem as Series).seasons.length > 1 ? 's' : ''}</span>
                <span className="w-1 h-1 rounded-full bg-gray-500" />
              </>
            )}
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {currentItem.views.toLocaleString()}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-lg mb-8 line-clamp-3 leading-relaxed max-w-xl">
            {currentItem.description}
          </p>

          {/* Buttons - Modern style */}
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              href={`${href}/watch`}
              className="group flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ backgroundColor: currentTheme.primary, boxShadow: `0 10px 40px ${currentTheme.primary}50` }}
            >
              <Play className="h-6 w-6 fill-current transition-transform group-hover:scale-110" />
              Watch Now
            </Link>
            <Link 
              href={href}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md text-white font-bold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <Info className="h-6 w-6" />
              More Info
            </Link>
            <button className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Modern glassmorphism */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/10 hover:scale-110"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/10 hover:scale-110"
      >
        <ChevronRight className="h-7 w-7" />
      </button>

      {/* Progress Indicator - Modern style */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false)
              setCurrentIndex(index)
            }}
            className="group relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
            style={{ 
              width: index === currentIndex ? '48px' : '16px',
              backgroundColor: index === currentIndex ? currentTheme.primary : 'rgba(255,255,255,0.3)'
            }}
          >
            {index === currentIndex && (
              <span 
                className="absolute inset-0 animate-pulse"
                style={{ backgroundColor: currentTheme.primary }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-10 right-6 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white text-sm font-medium">
        {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
      </div>
    </div>
  )
}
