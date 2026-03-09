"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Play, Loader2, Check } from 'lucide-react'
import VideoPlayer from '@/components/content/VideoPlayer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { MappedSeries } from '@/lib/xtream-api'

export default function WatchSeriesPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [series, setSeries] = useState<MappedSeries | null>(null)
  const [loading, setLoading] = useState(true)
  const [watchedEpisodes, setWatchedEpisodes] = useState<Set<string>>(new Set())

  const seasonId = searchParams.get('season') || ''
  const episodeId = searchParams.get('episode') || ''
  const shouldAutoPlay = searchParams.get('autoplay') === '1'

  useEffect(() => {
    async function fetchSeries() {
      try {
        const idStr = params.id as string
        const numericId = idStr.replace('series-', '')

        const res = await fetch(`/api/series/${numericId}`)
        const data: MappedSeries = await res.json()
        setSeries(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSeries()
  }, [params.id])

  // Load watched episodes from localStorage and mark current as watched
  useEffect(() => {
    const seriesId = params.id as string
    if (!seriesId || !episodeId) return

    const storageKey = `watched-${seriesId}`
    try {
      const stored = localStorage.getItem(storageKey)
      const watched = stored ? new Set<string>(JSON.parse(stored)) : new Set<string>()
      watched.add(episodeId)
      setWatchedEpisodes(watched)
      localStorage.setItem(storageKey, JSON.stringify([...watched]))
    } catch {
      // ignore localStorage errors
    }
  }, [params.id, episodeId])

  const currentSeason = series?.seasons?.find(s => s.id === seasonId) || series?.seasons?.[0]
  const currentEpisode = currentSeason?.episodes?.find(e => e.id === episodeId) || currentSeason?.episodes?.[0]
  const currentEpisodeIndex = currentSeason?.episodes?.findIndex(e => e.id === currentEpisode?.id) ?? 0
  const nextEpisode = currentSeason?.episodes?.[currentEpisodeIndex + 1]

  const handleEpisodeEnded = useCallback(() => {
    if (nextEpisode && currentSeason && series) {
      router.push(`/series/${series.id}/watch?season=${currentSeason.id}&episode=${nextEpisode.id}&autoplay=1`)
    }
  }, [nextEpisode, currentSeason, series, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    )
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Series not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href={`/series/${series.id}`}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to {series.title}
        </Link>
      </div>

      {/* Video Player */}
      <div className="container mx-auto px-4">
        {currentEpisode?.streamUrl ? (
          <VideoPlayer
            streamUrl={currentEpisode.streamUrl}
            title={`${series.title} - S${currentSeason?.seasonNumber}E${currentEpisode?.episodeNumber}: ${currentEpisode?.title || ''}`}
            autoPlay={shouldAutoPlay}
            onProgress={(progress, duration) => {
              if (Math.floor(progress) % 10 === 0 && progress > 0) {
                fetch('/api/profile/history', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contentId: series.id.replace('series-', ''),
                    contentType: 'series',
                    contentTitle: series.title,
                    contentPoster: series.poster || series.backdrop,
                    episodeId: currentEpisode.id,
                    seasonNumber: currentSeason?.seasonNumber,
                    episodeNumber: currentEpisode.episodeNumber,
                    progress: Math.floor(progress),
                    duration: Math.floor(duration),
                    completed: progress / duration > 0.95
                  })
                }).catch(err => console.error('Failed to update history', err))
              }
            }}
            onEnded={() => {
              // Mark as completed
              fetch('/api/profile/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contentId: series.id.replace('series-', ''),
                  contentType: 'series',
                  contentTitle: series.title,
                  contentPoster: series.poster || series.backdrop,
                  episodeId: currentEpisode.id,
                  seasonNumber: currentSeason?.seasonNumber,
                  episodeNumber: currentEpisode.episodeNumber,
                  progress: 100,
                  duration: 100,
                  completed: true
                })
              }).catch(err => console.error('Failed to update history', err))

              handleEpisodeEnded()
            }}
          />
        ) : (
          <div className="w-full aspect-video bg-gray-900 flex items-center justify-center rounded-lg">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
          </div>
        )}
      </div>

      {/* Episode Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {currentEpisode?.title || `Episode ${currentEpisode?.episodeNumber}`}
            </h1>
            <p className="text-gray-400">
              {series.title} • Season {currentSeason?.seasonNumber} • Episode {currentEpisode?.episodeNumber}
            </p>
          </div>

          {/* Season Selector */}
          {series.seasons?.length > 0 && (
            <div className="flex gap-4">
              <Select
                value={currentSeason?.id || ''}
                onValueChange={(value) => {
                  const season = series.seasons?.find(s => s.id === value)
                  if (season) {
                    window.location.href = `/series/${series.id}/watch?season=${value}&episode=${season.episodes[0]?.id}`
                  }
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  {series.seasons.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      Season {season.seasonNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {currentEpisode?.description && (
          <p className="text-gray-300 max-w-3xl mb-8">{currentEpisode.description}</p>
        )}

        {/* Next Episode */}
        {nextEpisode && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Next Episode</h3>
            <Link
              href={`/series/${series.id}/watch?season=${currentSeason?.id}&episode=${nextEpisode.id}`}
              className="flex gap-4 bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group max-w-2xl"
            >
              <div className="relative w-48 aspect-video flex-shrink-0">
                {nextEpisode.thumbnail ? (
                  <Image
                    src={nextEpisode.thumbnail}
                    alt={nextEpisode.title || `Episode ${nextEpisode.episodeNumber}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Play className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4">
                <h4 className="text-white font-medium mb-1">
                  {nextEpisode.episodeNumber}. {nextEpisode.title || `Episode ${nextEpisode.episodeNumber}`}
                </h4>
                {nextEpisode.description && (
                  <p className="text-gray-400 text-sm line-clamp-2">{nextEpisode.description}</p>
                )}
              </div>
            </Link>
          </div>
        )}

        {/* All Episodes */}
        {currentSeason?.episodes && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">All Episodes - Season {currentSeason.seasonNumber}</h3>
            <div className="grid gap-3">
              {currentSeason.episodes.map((episode) => (
                <Link
                  key={episode.id}
                  href={`/series/${series.id}/watch?season=${currentSeason.id}&episode=${episode.id}`}
                  className={`flex gap-4 rounded-lg overflow-hidden transition-colors ${episode.id === currentEpisode?.id
                    ? 'bg-red-600/20 border border-red-600'
                    : watchedEpisodes.has(episode.id)
                      ? 'bg-green-900/20 border border-green-800/50 hover:bg-green-900/30'
                      : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                >
                  <div className="relative w-32 aspect-video flex-shrink-0">
                    {episode.thumbnail ? (
                      <Image
                        src={episode.thumbnail}
                        alt={episode.title || `Episode ${episode.episodeNumber}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Play className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 py-3 pr-4 flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium text-sm ${watchedEpisodes.has(episode.id) && episode.id !== currentEpisode?.id ? 'text-gray-400' : 'text-white'}`}>
                        {episode.episodeNumber}. {episode.title || `Episode ${episode.episodeNumber}`}
                      </h4>
                      {episode.duration > 0 && (
                        <p className="text-gray-500 text-xs">{episode.duration}m</p>
                      )}
                    </div>
                    {watchedEpisodes.has(episode.id) && episode.id !== currentEpisode?.id && (
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
