"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import VideoPlayer from '@/components/content/VideoPlayer'
import type { MappedMovie } from '@/lib/xtream-api'

export default function WatchMoviePage() {
  const params = useParams()
  const [movie, setMovie] = useState<MappedMovie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch('/api/movies')
        const movies: MappedMovie[] = await res.json()
        const found = movies.find(m => m.id === params.id)
        if (found) setMovie(found)
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
    <div className="min-h-screen bg-black pt-16">
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href={`/movie/${movie.id}`}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to {movie.title}
        </Link>
      </div>

      {/* Video Player */}
      <div className="container mx-auto px-4">
        <VideoPlayer
          streamUrl={movie.streamUrl}
          title={movie.title}
          onProgress={(progress, duration) => {
            // Only update history every 10 seconds to avoid spamming the DB
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
                duration: 100, // generic since we might not have exact here if it just ended
                completed: true
              })
            }).catch(err => console.error('Failed to update history', err))
          }}
        />
      </div>

      {/* Movie Info */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
        <p className="text-gray-400 mb-4">
          {movie.releaseYear > 0 ? movie.releaseYear : ''}
          {movie.genre ? ` • ${movie.genre}` : ''}
          {movie.rating > 0 ? ` • ⭐ ${movie.rating.toFixed(1)}` : ''}
        </p>
        {movie.description && (
          <p className="text-gray-300 max-w-3xl">{movie.description}</p>
        )}
      </div>
    </div>
  )
}
