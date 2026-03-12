"use client"

import React, { useState, useEffect } from 'react'
import HeroSlider from '@/components/content/HeroSlider'
import ContentRow from '@/components/content/ContentRow'
import type { MappedMovie, MappedSeries } from '@/lib/xtream-api'
import { useLanguage } from '@/lib/language-context'

// Adapt API data to component format
function toContentItem(item: MappedMovie | MappedSeries) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    poster: item.poster,
    backdrop: item.backdrop,
    releaseYear: item.releaseYear,
    genre: item.genre,
    rating: item.rating,
    views: item.views,
    ...('duration' in item ? { duration: item.duration, streamUrl: item.streamUrl } : {}),
    ...('seasons' in item ? { seasons: item.seasons } : {}),
  }
}

export default function Home() {
  const { t } = useLanguage()
  const [movies, setMovies] = useState<MappedMovie[]>([])
  const [series, setSeries] = useState<MappedSeries[]>([])
  const [featuredItemsData, setFeaturedItemsData] = useState<(MappedMovie | MappedSeries)[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [moviesRes, seriesRes] = await Promise.all([
          fetch('/api/movies?limit=50'),
          fetch('/api/series?limit=50'),
        ])
        const moviesData = await moviesRes.json()
        const seriesData = await seriesRes.json()
        
        const basicMovies = Array.isArray(moviesData) ? moviesData : []
        const basicSeries = Array.isArray(seriesData) ? seriesData : []
        
        setMovies(basicMovies)
        setSeries(basicSeries)

        // Fetch detailed info for 6 featured items
        const featuredMovieIds = basicMovies.filter(m => m.poster).slice(0, 3).map(m => m.id.replace('movie-', ''))
        const featuredSeriesIds = basicSeries.filter(s => s.poster).slice(0, 3).map(s => s.id.replace('series-', ''))

        const featuredMoviesReq = featuredMovieIds.map(id => fetch(`/api/movies/${id}`).then(res => res.json()).catch(() => null))
        const featuredSeriesReq = featuredSeriesIds.map(id => fetch(`/api/series/${id}`).then(res => res.json()).catch(() => null))

        const detailedMovies = (await Promise.all(featuredMoviesReq)).filter(Boolean)
        const detailedSeries = (await Promise.all(featuredSeriesReq)).filter(Boolean)

        setFeaturedItemsData([...detailedMovies, ...detailedSeries])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const featuredItems = featuredItemsData.length > 0 
    ? featuredItemsData.map(toContentItem)
    : [...movies.filter(m => m.poster).slice(0, 3), ...series.filter(s => s.poster).slice(0, 3)].map(toContentItem)

  const newMovies = movies.slice(0, 12).map(toContentItem)
  const newSeries = series.slice(0, 12).map(toContentItem)
  const topRatedMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 12).map(toContentItem)
  const topRatedSeries = [...series].sort((a, b) => b.rating - a.rating).slice(0, 12).map(toContentItem)

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Slider */}
      {featuredItems.length > 0 && <HeroSlider items={featuredItems as Parameters<typeof HeroSlider>[0]['items']} />}

      {/* Content Sections */}
      <div className="container mx-auto px-4 -mt-32 relative z-10 space-y-8 pb-16">
        {newMovies.length > 0 && (
          <ContentRow
            title={t('newMovies')}
            items={newMovies as Parameters<typeof ContentRow>[0]['items']}
            type="movie"
          />
        )}

        {newSeries.length > 0 && (
          <ContentRow
            title={t('newTVSeries')}
            items={newSeries as Parameters<typeof ContentRow>[0]['items']}
            type="series"
          />
        )}

        {topRatedMovies.length > 0 && (
          <ContentRow
            title={t('topRatedMovies')}
            items={topRatedMovies as Parameters<typeof ContentRow>[0]['items']}
            type="movie"
          />
        )}

        {topRatedSeries.length > 0 && (
          <ContentRow
            title={t('topRatedSeries')}
            items={topRatedSeries as Parameters<typeof ContentRow>[0]['items']}
            type="series"
          />
        )}
      </div>
    </div>
  )
}
