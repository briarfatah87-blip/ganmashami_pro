"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Plus, Heart, Star, Clock, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme-context'

interface ContentCardProps {
  id: string
  title: string
  poster: string
  releaseYear?: number
  rating?: number
  genre?: string
  type: 'movie' | 'series'
  duration?: number
  seasons?: number
  className?: string
}

export default function ContentCard({
  id,
  title,
  poster,
  releaseYear,
  rating,
  genre,
  type,
  duration,
  seasons,
  className
}: ContentCardProps) {
  const prefix = type === 'movie' ? 'movie-' : 'series-'
  // If id already starts with prefix, cleanId is just id. Otherwise, prepend prefix.
  const cleanId = String(id).startsWith(prefix) ? id : `${prefix}${id}`
  const href = `/${type}/${cleanId}`
  const { currentTheme } = useTheme()

  return (
    <div className={cn("group/card relative flex-shrink-0", className)}>
      <Link href={href}>
        <div
          className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800/50 shadow-lg transition-all duration-300 group-hover/card:shadow-2xl group-hover/card:-translate-y-2 border border-white/10 group-hover/card:border-transparent"
          style={{
            boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.5), 0 0 0 2px ${currentTheme.primary}`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3)`
          }}
        >
          <Image
            src={poster}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover/card:scale-105"
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 220px"
          />

          {/* Gradient overlay - always visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-all duration-300" />

          {/* Content - slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-sm line-clamp-2 mb-1 drop-shadow-lg">{title}</h3>

            <div className="flex items-center gap-2 text-xs text-gray-300 mb-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
              {releaseYear && <span className="font-medium">{releaseYear}</span>}
              {releaseYear && (rating || duration || seasons) && <span className="text-gray-500">•</span>}
              {rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  {rating.toFixed(1)}
                </span>
              )}
              {duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.floor(duration / 60)}h {duration % 60}m
                </span>
              )}
              {seasons && <span>{seasons}S</span>}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full text-white transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 hover:scale-110">
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 hover:scale-110">
                <Heart className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 right-2 opacity-100 group-hover/card:opacity-0 transition-opacity duration-300">
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                {rating.toFixed(1)}
              </div>
            </div>
          )}

          {/* Genre badge */}
          {genre && (
            <div className="absolute top-2 left-2 opacity-100 group-hover/card:opacity-0 transition-opacity duration-300">
              <div className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                {genre}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Title below card (visible on mobile) */}
      <div className="mt-2 md:hidden">
        <h3 className="text-white text-sm font-medium line-clamp-1">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {releaseYear && <span>{releaseYear}</span>}
          {rating && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
