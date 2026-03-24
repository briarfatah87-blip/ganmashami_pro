"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Loader2, Star, Clock, Calendar, Tag } from 'lucide-react'
import VideoPlayer from '@/components/content/VideoPlayer'
import ContentCard from '@/components/content/ContentCard'
import type { MappedMovie } from '@/lib/xtream-api'

export default function WatchMoviePage() {
  const params = useParams()
  const [movie, setMovie] = useState<MappedMovie | null>(null)
  const [similarMovies, setSimilarMovies] = useState<MappedMovie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch('/api/movies')
        const movies: MappedMovie[] = await res.json()
        const found = movies.find(m => m.id === params.id)
        if (found) {
          setMovie(found)
          const similar = movies
            .filter(m => m.id !== found.id && m.genre && found.genre && m.genre.split(',')[0]?.trim() === found.genre.split(',')[0]?.trim())
            .slice(0, 12)
          if (similar.length < 6) {
            const extras = movies.filter(m => m.id !== found.id && !similar.find(s => s.id === m.id)).slice(0, 12 - similar.length)
            similar.push(...extras)
          }
          setSimilarMovies(similar)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMovie()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Movie not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Backdrop Hero */}
      <div className="relative h-[35vh] md:h-[50vh] overflow-hidden">
        <Image
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/70 to-transparent h-24" />

        {/* Back button on backdrop */}
        <div className="absolute top-20 md:top-24 left-4 md:left-8 z-10">
          <Link
            href={`/movie/${movie.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all border border-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>

        {/* Movie title overlay on backdrop */}
        <div className="absolute bottom-6 md:bottom-10 left-0 right-0 container mx-auto px-4 md:px-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-2xl mb-2">
            {movie.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            {movie.releaseYear > 0 && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {movie.releaseYear}
              </span>
            )}
            {movie.genre && (
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                {movie.genre}
              </span>
            )}
            {movie.rating > 0 && (
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                {movie.rating.toFixed(1)}
              </span>
            )}
            {movie.duration > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Video Player - pulled up into the backdrop */}
      <div className="container mx-auto px-4 md:px-8 -mt-2 relative z-10">
        <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5">
          <VideoPlayer
            streamUrl={movie.streamUrl}
            title={movie.title}
            onProgress={(progress, duration) => {
              if (Math.floor(progress) % 10 === 0 && progress > 0) {
                fetch('/api/profile/history', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contentId: movie.id.replace('movie-', ''),
                    contentType: 'movie',
                    contentTitle: movie.title,
                    contentPoster: movie.poster || movie.backdrop,
                    progress: Math.floor(progress),
                    duration: Math.floor(duration),
                    completed: progress / duration > 0.95
                  })
                }).catch(err => console.error('Failed to update history', err))
              }
            }}
            onEnded={() => {
              fetch('/api/profile/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contentId: movie.id.replace('movie-', ''),
                  contentType: 'movie',
                  contentTitle: movie.title,
                  contentPoster: movie.poster || movie.backdrop,
                  progress: 100,
                  duration: 100,
                  completed: true
                })
              }).catch(err => console.error('Failed to update history', err))
            }}
          />
        </div>
      </div>

      {/* Movie Description */}
      {movie.description && (
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="max-w-3xl">
            <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
            <p className="text-gray-400 leading-relaxed">{movie.description}</p>
          </div>
        </div>
      )}

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="container mx-auto px-4 md:px-8 py-6 pb-16">
          <h2 className="text-xl font-bold text-white mb-4">Similar Movies</h2>
          <div
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {similarMovies.map((m) => (
              <ContentCard
                key={m.id}
                id={m.id}
                title={m.title}
                poster={m.poster}
                releaseYear={m.releaseYear}
                rating={m.rating}
                genre={m.genre}
                type="movie"
                duration={m.duration}
                className="w-[140px] md:w-[185px] flex-shrink-0"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
