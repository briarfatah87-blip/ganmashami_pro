"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, SlidersHorizontal, Tv, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import ContentCard from '@/components/content/ContentCard'
import PageBanner from '@/components/content/PageBanner'
import Pagination from '@/components/ui/Pagination'
import type { MappedSeries, XtreamCategory } from '@/lib/xtream-api'
import { useLanguage } from '@/lib/language-context'

const ITEMS_PER_PAGE = 24

export default function SeriesPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [seriesList, setSeriesList] = useState<MappedSeries[]>([])
  const [categories, setCategories] = useState<XtreamCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Read genre from URL query param
  useEffect(() => {
    const genreParam = searchParams.get('genre')
    if (genreParam) {
      setSelectedGenre(genreParam)
      setShowFilters(true)
    }
  }, [searchParams])

  useEffect(() => {
    async function fetchData() {
      try {
        const [seriesRes, catsRes] = await Promise.all([
          fetch('/api/series'),
          fetch('/api/series/categories'),
        ])
        const seriesData = await seriesRes.json()
        const catsData = await catsRes.json()
        setSeriesList(Array.isArray(seriesData) ? seriesData : [])
        setCategories(Array.isArray(catsData) ? catsData : [])
      } catch (error) {
        console.error('Error fetching series:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredSeries = useMemo(() => {
    let result = [...seriesList]

    if (searchQuery) {
      result = result.filter(series =>
        series.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedGenre && selectedGenre !== 'all') {
      result = result.filter(series =>
        series.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
      )
    }

    switch (sortBy) {
      case 'recent':
        // Use backend order (recently added)
        break
      case 'newest':
        result.sort((a, b) => b.releaseYear - a.releaseYear)
        break
      case 'oldest':
        result.sort((a, b) => a.releaseYear - b.releaseYear)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [seriesList, searchQuery, selectedGenre, sortBy])

  const totalPages = Math.ceil(filteredSeries.length / ITEMS_PER_PAGE)
  const paginatedSeries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredSeries.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredSeries, currentPage])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenre('all')
    setSortBy('newest')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || selectedGenre !== 'all'

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    )
  }

  // Sort options for dropdown
  const sortOptions = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'title', label: 'Title A-Z' },
  ]

  return (
    <div className="min-h-screen bg-transparent">
      <PageBanner
        title={t('series')}
        subtitle={`${t('browseMoviesSubtitle')} ${seriesList.length} ${t('seriesCount')}`}
        icon={<Tv className="h-6 w-6 text-white" />}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Search + Filter Toggle */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder={t('searchSeriesPlaceholder')}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10 w-full"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t('filters') || 'Filters'}
          </Button>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="flex flex-col md:flex-row gap-3 mb-4 p-4 rounded-lg bg-gray-800/50 border border-white/10">
            <Select value={selectedGenre} onValueChange={(val) => { setSelectedGenre(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue>{t('genre')}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allGenres')}</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.category_id} value={cat.category_name}>{cat.category_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue>{sortOptions.find(opt => opt.value === sortBy)?.label || t('sortBy')}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters} className="w-full md:w-auto">
              {t('clearFilters')}
            </Button>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-400">
            {t('showing')} {paginatedSeries.length} {t('of')} {filteredSeries.length} {t('seriesCount')}
            {filteredSeries.length !== seriesList.length && ` (${t('filteredFrom')} ${seriesList.length})`}
          </p>
          <p className="text-gray-500 text-sm">
            {t('page')} {currentPage} {t('of')} {totalPages || 1}
          </p>
        </div>

        {paginatedSeries.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {paginatedSeries.map((series) => (
                <ContentCard
                  key={series.id}
                  id={series.id}
                  title={series.title}
                  poster={series.poster}
                  releaseYear={series.releaseYear}
                  rating={series.rating}
                  genre={series.genre}
                  type="series"
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <Filter className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('noSeriesFound')}</h3>
            <p className="text-gray-400 mb-4">{t('tryAdjustingFilters')}</p>
            <Button onClick={clearFilters}>{t('clearAllFilters')}</Button>
          </div>
        )}
      </div>
    </div>
  )
}
