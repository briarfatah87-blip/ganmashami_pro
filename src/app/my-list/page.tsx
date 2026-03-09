"use client"

import React, { useState } from 'react'
import { Heart, Clock, List } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ContentCard from '@/components/content/ContentCard'
import PageBanner from '@/components/content/PageBanner'
import { sampleMovies, sampleSeries } from '@/lib/sample-data'

export default function MyListPage() {
  const favorites = [...sampleMovies.slice(0, 4), ...sampleSeries.slice(0, 2)]
  const watchLater = [...sampleMovies.slice(2, 6), ...sampleSeries.slice(1, 4)]

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12">
      {/* Page Banner */}
      <PageBanner
        title="My List"
        subtitle="Your saved movies and TV series"
        icon={<List className="h-6 w-6 text-white" />}
      />

      <div className="container mx-auto px-4 py-8">

        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="bg-gray-900 mb-8">
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="watchlater" className="gap-2">
              <Clock className="h-4 w-4" />
              Watch Later ({watchLater.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {favorites.map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    poster={item.poster}
                    releaseYear={item.releaseYear}
                    rating={item.rating}
                    genre={item.genre}
                    type={'duration' in item ? 'movie' : 'series'}
                    duration={'duration' in item ? item.duration : undefined}
                    seasons={'seasons' in item ? item.seasons.length : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
                <p className="text-gray-400">Add movies and series to your favorites to see them here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="watchlater">
            {watchLater.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {watchLater.map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    poster={item.poster}
                    releaseYear={item.releaseYear}
                    rating={item.rating}
                    genre={item.genre}
                    type={'duration' in item ? 'movie' : 'series'}
                    duration={'duration' in item ? item.duration : undefined}
                    seasons={'seasons' in item ? item.seasons.length : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nothing to watch later</h3>
                <p className="text-gray-400">Save content to watch later and it will appear here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
