"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Search, Filter, SlidersHorizontal, Film, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import ContentCard from '@/components/content/ContentCard'
import PageBanner from '@/components/content/PageBanner'
import Pagination from '@/components/ui/Pagination'
import type { MappedMovie, XtreamCategory } from '@/lib/xtream-api'
import { useLanguage } from '@/lib/language-context'

const ITEMS_PER_PAGE = 24

export default function MoviesPage() {
  const { t } = useLanguage()
  const [movies, setMovies] = useState<MappedMovie[]>([])
  const [categories, setCategories] = useState<XtreamCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchData() {
      try {
        const [moviesRes, catsRes] = await Promise.all([
          fetch('/api/movies'),
          fetch('/api/movies/categories'),
        ])
        const moviesData = await moviesRes.json()
        const catsData = await catsRes.json()
        setMovies(Array.isArray(moviesData) ? moviesData : [])
        setCategories(Array.isArray(catsData) ? catsData : [])
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredMovies = useMemo(() => {
    let result = [...movies]

    if (searchQuery) {
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedGenre && selectedGenre !== 'all') {
      result = result.filter(movie => movie.genre === selectedGenre)
    }

    switch (sortBy) {
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
  }, [movies, searchQuery, selectedGenre, sortBy])

  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE)
  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredMovies, currentPage])

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

  return (
    <div className="min-h-screen bg-transparent">
      <PageBanner
        title={t('movies')}
        subtitle={`${t('browseMoviesSubtitle')} ${movies.length} ${t('moviesCount')}`}
        icon={<Film className="h-6 w-6 text-white" />}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type="text"
              placeholder={t('searchMoviesPlaceholder')}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t('filters')}
              {hasActiveFilters && (
                <Badge className="ml-1 bg-red-600">{t('filterActive')}</Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 p-4 bg-gray-900 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t('genre')}</label>
                <Select value={selectedGenre} onValueChange={(v) => { setSelectedGenre(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t('allGenres')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allGenres')}</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.category_id} value={cat.category_name}>
                        {cat.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t('sortBy')}</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('newestFirst')}</SelectItem>
                    <SelectItem value="oldest">{t('oldestFirst')}</SelectItem>
                    <SelectItem value="rating">{t('topRated')}</SelectItem>
                    <SelectItem value="title">{t('titleAZ')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button variant="ghost" onClick={clearFilters} className="text-red-500">
                    {t('clearFilters')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-400">
            {t('showing')} {paginatedMovies.length} {t('of')} {filteredMovies.length} {t('moviesCount')}
            {filteredMovies.length !== movies.length && ` (${t('filteredFrom')} ${movies.length})`}
          </p>
          <p className="text-gray-500 text-sm">
            {t('page')} {currentPage} {t('of')} {totalPages || 1}
          </p>
        </div>

        {paginatedMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {paginatedMovies.map((movie) => (
                <ContentCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  poster={movie.poster}
                  releaseYear={movie.releaseYear}
                  rating={movie.rating}
                  genre={movie.genre}
                  type="movie"
                  duration={movie.duration}
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
            <h3 className="text-xl font-semibold text-white mb-2">{t('noMoviesFound')}</h3>
            <p className="text-gray-400 mb-4">{t('tryAdjustingFilters')}</p>
            <Button onClick={clearFilters}>{t('clearAllFilters')}</Button>
          </div>
        )}
      </div>
    </div>
  )
}
