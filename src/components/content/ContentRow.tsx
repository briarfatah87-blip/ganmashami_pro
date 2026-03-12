"use client"

import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import ContentCard from './ContentCard'
import { Movie, Series } from '@/lib/sample-data'
import { useTheme } from '@/lib/theme-context'
import { useLanguage } from '@/lib/language-context'

interface ContentRowProps {
  title: string
  items: (Movie | Series)[]
  type: 'movie' | 'series'
  showViewAll?: boolean
}

export default function ContentRow({ title, items, type, showViewAll = true }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { currentTheme } = useTheme()
  const { t } = useLanguage()

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 800
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="relative py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-4 md:px-0">
        <div className="flex items-center gap-3">
          <div 
            className="w-1 h-6 rounded-full"
            style={{ backgroundColor: currentTheme.primary }}
          />
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {title}
          </h2>
        </div>
        {showViewAll && (
          <Link 
            href={`/${type === 'movie' ? 'movies' : 'series'}`}
            className="text-sm font-medium transition-colors hover:underline"
            style={{ color: currentTheme.primary }}
          >
            {t('viewAll')} →
          </Link>
        )}
      </div>
      
      <div className="group relative">
        {/* Scroll buttons - Modern glassmorphism */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:bg-white/20 hover:scale-110 border border-white/10 shadow-xl"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:bg-white/20 hover:scale-110 border border-white/10 shadow-xl"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Content scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-0 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              id={item.id}
              title={item.title}
              poster={item.poster}
              releaseYear={item.releaseYear}
              rating={item.rating}
              genre={item.genre}
              type={type}
              duration={type === 'movie' ? (item as Movie).duration : undefined}
              seasons={type === 'series' ? (item as Series).seasons?.length : undefined}
              className="w-[150px] md:w-[185px] lg:w-[210px]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
