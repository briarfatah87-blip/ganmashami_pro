"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Play, Heart, Clock, Star, Share2, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ReviewSection from '@/components/content/ReviewSection'
import { ReportIssueDialog } from '@/components/content/ReportIssueDialog'
import { useLanguage } from '@/lib/language-context'
import type { MappedSeries } from '@/lib/xtream-api'

export default function SeriesDetailPage() {
  const params = useParams()
  const { t, dir } = useLanguage()
  const isRTL = dir === 'rtl'
  const [series, setSeries] = useState<MappedSeries | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInWatchLater, setIsInWatchLater] = useState(false)
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('')
  const [isTogglingAction, setIsTogglingAction] = useState(false)

  useEffect(() => {
    async function fetchSeries() {
      try {
        // Extract the numeric series ID from the URL param format "series-123"
        const idStr = params.id as string
        const numericId = idStr.replace('series-', '')

        const res = await fetch(`/api/series/${numericId}`)
        const data: MappedSeries = await res.json()
        setSeries(data)
        if (data.seasons?.length > 0) {
          setSelectedSeasonId(data.seasons[0].id)
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
    fetchSeries()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    )
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <p className="text-white text-xl">{t('seriesNotFound')}</p>
      </div>
    )
  }

  const currentSeason = series.seasons?.find(s => s.id === selectedSeasonId) || series.seasons?.[0]

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        {(series.backdrop || series.poster) && (
          <Image
            src={series.backdrop || series.poster}
            alt={series.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[var(--background)] via-[var(--background)]/80 to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-96 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl mx-auto md:mx-0">
              {series.poster && (
                <Image
                  src={series.poster}
                  alt={series.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-red-600">{t('tvSeriesLabel')}</Badge>
              {series.rating > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  {series.rating.toFixed(1)}
                </Badge>
              )}
              {series.genre && <Badge variant="secondary">{series.genre}</Badge>}
              {series.releaseYear > 0 && <Badge variant="secondary">{series.releaseYear}</Badge>}
              {series.seasons?.length > 0 && (
                <Badge variant="secondary">
                  {series.seasons.length} Season{series.seasons.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {series.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
              {series.releaseYear > 0 && <span>{series.releaseYear}</span>}
              {series.seasons?.length > 0 && (
                <>
                  <span>•</span>
                  <span>{series.seasons.length} Season{series.seasons.length > 1 ? 's' : ''}</span>
                </>
              )}
            </div>

            {series.description && (
              <p className="text-gray-300 text-lg mb-8 max-w-2xl">
                {series.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-8">
              {currentSeason?.episodes?.[0] && (
                <Button size="xl" asChild>
                  <Link href={`/series/${series.id}/watch?season=${currentSeason.id}&episode=${currentSeason.episodes[0].id}`}>
                    <Play className="me-2 h-5 w-5 fill-current" />
                  {t('watchNow')}
                  </Link>
                </Button>
              )}

              <Button
                size="xl"
                variant={isFavorite ? "default" : "outline"}
                disabled={isTogglingAction}
                onClick={async () => {
                  try {
                    setIsTogglingAction(true)
                    const numericId = series.id.replace('series-', '')
                    if (isFavorite) {
                      await fetch(`/api/profile/favorites?contentId=${numericId}&contentType=series`, { method: 'DELETE' })
                      setIsFavorite(false)
                    } else {
                      await fetch('/api/profile/favorites', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contentId: numericId,
                          contentType: 'series',
                          contentTitle: series.title,
                          contentPoster: series.poster || series.backdrop
                        })
                      })
                      setIsFavorite(true)
                    }
                  } catch (e) { console.error(e) } finally { setIsTogglingAction(false) }
                }}
              >
                <Heart className={`me-2 h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? t('inFavorites') : t('addToFavorites')}
              </Button>

              <Button
                size="xl"
                variant={isInWatchLater ? "secondary" : "outline"}
                disabled={isTogglingAction}
                onClick={async () => {
                  try {
                    setIsTogglingAction(true)
                    const numericId = series.id.replace('series-', '')
                    if (isInWatchLater) {
                      await fetch(`/api/profile/watchlater?contentId=${numericId}&contentType=series`, { method: 'DELETE' })
                      setIsInWatchLater(false)
                    } else {
                      await fetch('/api/profile/watchlater', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contentId: numericId,
                          contentType: 'series',
                          contentTitle: series.title,
                          contentPoster: series.poster || series.backdrop
                        })
                      })
                      setIsInWatchLater(true)
                    }
                  } catch (e) { console.error(e) } finally { setIsTogglingAction(false) }
                }}
              >
                {isInWatchLater ? (
                  <>
                    <Check className="me-2 h-5 w-5" />
                    {t('inWatchLater')}
                  </>
                ) : (
                  <>
                    <Clock className="me-2 h-5 w-5" />
                    {t('watchLater')}
                  </>
                )}
              </Button>

              <ReportIssueDialog
                contentId={series.id.replace('series-', '')}
                contentType="series"
                contentTitle={series.title}
              />
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        {series.seasons?.length > 0 && (
          <div className="mt-12">
            <Tabs defaultValue="episodes" className="w-full">
              <TabsList className="bg-gray-900 mb-6">
                <TabsTrigger value="episodes">{t('episodes')}</TabsTrigger>
              </TabsList>

              <TabsContent value="episodes">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium">{t('season')}:</span>
                    <Select value={selectedSeasonId} onValueChange={setSelectedSeasonId}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder={t('selectSeason')} />
                      </SelectTrigger>
                      <SelectContent>
                        {series.seasons.map((season) => (
                          <SelectItem key={season.id} value={season.id}>
                            {season.title || `${t('season')} ${season.seasonNumber}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4">
                    {currentSeason?.episodes?.map((episode) => (
                      <Link
                        key={episode.id}
                        href={`/series/${series.id}/watch?season=${currentSeason.id}&episode=${episode.id}`}
                        className="flex gap-4 bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group"
                      >
                        <div className="relative w-48 aspect-video flex-shrink-0">
                          {episode.thumbnail ? (
                            <Image
                              src={episode.thumbnail}
                              alt={episode.title || `Episode ${episode.episodeNumber}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <Play className="h-8 w-8 text-gray-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="h-6 w-6 text-black fill-black ml-1" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-medium mb-1">
                                {episode.episodeNumber}. {episode.title || `${t('episode')} ${episode.episodeNumber}`}
                              </h4>
                              {episode.description && (
                                <p className="text-gray-400 text-sm line-clamp-2">
                                  {episode.description}
                                </p>
                              )}
                            </div>
                            {episode.duration > 0 && (
                              <span className="text-gray-500 text-sm flex-shrink-0 ml-4">
                                {episode.duration}m
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewSection contentId={series.id} contentType="series" contentTitle={series.title} contentPoster={series.poster || series.backdrop || ''} />
        </div>
      </div>
    </div>
  )
}
