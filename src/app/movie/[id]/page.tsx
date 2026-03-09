"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Play, Heart, Clock, Star, Share2, Check, Loader2, Film, Globe, User, Monitor, Volume2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ReviewSection from '@/components/content/ReviewSection'
import { ReportIssueDialog } from '@/components/content/ReportIssueDialog'
import type { MappedMovie } from '@/lib/xtream-api'

export default function MoviePage() {
  const params = useParams()
  const [movie, setMovie] = useState<MappedMovie | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInWatchLater, setIsInWatchLater] = useState(false)
  const [isTogglingAction, setIsTogglingAction] = useState(false)

  useEffect(() => {
    async function fetchMovie() {
      try {
        // Extract numeric ID from "movie-6039"
        const idStr = params.id as string
        const numericId = idStr.replace('movie-', '')

        // First try detailed info endpoint
        const detailRes = await fetch(`/api/movies/${numericId}`)
        if (detailRes.ok) {
          const data: MappedMovie = await detailRes.json()
          if (data && !('error' in data)) {
            data.id = idStr // ensure correct ID
            setMovie(data)
            setLoading(false)
            return
          }
        }

        // Fallback: find movie in full list
        const res = await fetch('/api/movies')
        const movies: MappedMovie[] = await res.json()
        const found = movies.find(m => m.id === idStr)
        if (found) {
          found.id = idStr
          setMovie(found)
        }

        // Check favorite/watchlater status
        const [favRes, wlRes] = await Promise.all([
          fetch('/api/profile/favorites'),
          fetch('/api/profile/watchlater')
        ])

        if (favRes.ok) {
          const favorites: any[] = await favRes.json()
          setIsFavorite(favorites.some(f => f.contentId === numericId || f.contentId === idStr))
        }

        if (wlRes.ok) {
          const watchLater: any[] = await wlRes.json()
          setIsInWatchLater(watchLater.some(w => w.contentId === numericId || w.contentId === idStr))
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
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <p className="text-white text-xl">Movie not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh]">
        {(movie.backdrop || movie.poster) && (
          <Image
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-96 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl mx-auto md:mx-0">
              {movie.poster && (
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-red-600">Movie</Badge>
              {movie.rating > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  {movie.rating.toFixed(1)}
                </Badge>
              )}
              {movie.quality && (
                <Badge variant="outline" className="bg-blue-600/20 border-blue-500 text-blue-400">
                  {movie.quality}
                </Badge>
              )}
              {movie.audioChannels && (
                <Badge variant="outline" className="bg-purple-600/20 border-purple-500 text-purple-400">
                  {movie.audioChannels}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm mb-6">
              {movie.releaseYear > 0 && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {movie.releaseDate || movie.releaseYear}
                </span>
              )}
              {movie.durationText && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {movie.durationText}
                </span>
              )}
              {movie.genre && (
                <span className="flex items-center gap-1">
                  <Film className="h-4 w-4" />
                  {movie.genre}
                </span>
              )}
              {movie.country && (
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {movie.country}
                </span>
              )}
              {movie.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  {movie.rating.toFixed(1)} / 10
                </span>
              )}
            </div>

            {/* Genre Tags */}
            {movie.genre && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.split(',').map((g, i) => (
                  <Badge key={i} variant="secondary" className="bg-gray-800 text-gray-300">
                    {g.trim()}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description / Plot */}
            {movie.description && (
              <p className="text-gray-300 text-lg mb-8 max-w-2xl leading-relaxed">
                {movie.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button size="xl" asChild>
                <Link href={`/movie/${movie.id}/watch`}>
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Watch Now
                </Link>
              </Button>

              {movie.youtubeTrailer && (
                <Button size="xl" variant="outline" asChild>
                  <a href={`https://www.youtube.com/watch?v=${movie.youtubeTrailer}`} target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-5 w-5" />
                    Trailer
                  </a>
                </Button>
              )}

              <Button
                size="xl"
                variant={isFavorite ? "default" : "outline"}
                disabled={isTogglingAction}
                onClick={async () => {
                  try {
                    setIsTogglingAction(true)
                    if (isFavorite) {
                      await fetch(`/api/profile/favorites?contentId=${movie.id.replace('movie-', '')}&contentType=movie`, { method: 'DELETE' })
                      setIsFavorite(false)
                    } else {
                      await fetch('/api/profile/favorites', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contentId: movie.id.replace('movie-', ''),
                          contentType: 'movie',
                          contentTitle: movie.title,
                          contentPoster: movie.poster || movie.backdrop
                        })
                      })
                      setIsFavorite(true)
                    }
                  } catch (e) { console.error(e) } finally { setIsTogglingAction(false) }
                }}
              >
                <Heart className={`mr-2 h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'In Favorites' : 'Add to Favorites'}
              </Button>

              <Button
                size="xl"
                variant={isInWatchLater ? "secondary" : "outline"}
                disabled={isTogglingAction}
                onClick={async () => {
                  try {
                    setIsTogglingAction(true)
                    if (isInWatchLater) {
                      await fetch(`/api/profile/watchlater?contentId=${movie.id.replace('movie-', '')}&contentType=movie`, { method: 'DELETE' })
                      setIsInWatchLater(false)
                    } else {
                      await fetch('/api/profile/watchlater', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contentId: movie.id.replace('movie-', ''),
                          contentType: 'movie',
                          contentTitle: movie.title,
                          contentPoster: movie.poster || movie.backdrop
                        })
                      })
                      setIsInWatchLater(true)
                    }
                  } catch (e) { console.error(e) } finally { setIsTogglingAction(false) }
                }}
              >
                {isInWatchLater ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    In Watch Later
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-5 w-5" />
                    Watch Later
                  </>
                )}
              </Button>

              <ReportIssueDialog
                contentId={movie.id.replace('movie-', '')}
                contentType="movie"
                contentTitle={movie.title}
              />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-t border-gray-800">
              {movie.director && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 text-sm block">Director</span>
                    <p className="text-white font-medium">{movie.director}</p>
                  </div>
                </div>
              )}
              {movie.releaseDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 text-sm block">Release Date</span>
                    <p className="text-white font-medium">{movie.releaseDate}</p>
                  </div>
                </div>
              )}
              {movie.durationText && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 text-sm block">Duration</span>
                    <p className="text-white font-medium">{movie.durationText}</p>
                  </div>
                </div>
              )}
              {movie.country && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 text-sm block">Country</span>
                    <p className="text-white font-medium">{movie.country}</p>
                  </div>
                </div>
              )}
              {movie.quality && (
                <div className="flex items-start gap-3">
                  <Monitor className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 text-sm block">Quality</span>
                    <p className="text-white font-medium">{movie.quality}</p>
                  </div>
                </div>
              )}
              {movie.audioChannels && (
                <div className="flex items-start gap-3">
                  <Volume2 className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 text-sm block">Audio</span>
                    <p className="text-white font-medium">{movie.audioChannels}</p>
                  </div>
                </div>
              )}
              {movie.rating > 0 && (
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 text-sm block">Rating</span>
                    <p className="text-white font-medium">{movie.rating.toFixed(1)} / 10</p>
                  </div>
                </div>
              )}
            </div>

            {/* Cast */}
            {movie.cast && (
              <div className="py-6 border-t border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-3">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.split(',').map((actor, i) => (
                    <Badge key={i} variant="outline" className="text-gray-300 border-gray-700">
                      {actor.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <ReviewSection contentId={movie.id} contentType="movie" contentTitle={movie.title} contentPoster={movie.poster || movie.backdrop || ''} />
          </div>
        </div>
      </div>
    </div>
  )
}
