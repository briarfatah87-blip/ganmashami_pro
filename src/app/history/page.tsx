"use client"

import React, { useState, useEffect } from 'react'
import { Clock, History, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import ContentCard from '@/components/content/ContentCard'
import PageBanner from '@/components/content/PageBanner'

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  
  const [watchHistory, setWatchHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          const res = await fetch('/api/profile/history')
          if (res.ok) {
            const data = await res.json()
            setWatchHistory(data)
          }
        } catch (error) {
          console.error("Failed to fetch history data")
        } finally {
          setIsLoading(false)
        }
      }
      fetchHistory()
    }
  }, [user])

  if (authLoading || (!user && isLoading)) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 text-[var(--theme-primary)] animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12">
      {/* Page Banner */}
      <PageBanner
        title="Continue Watching"
        subtitle="Pick up exactly where you left off"
        icon={<History className="h-6 w-6 text-white" />}
      />

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : watchHistory.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {watchHistory.map((item: any) => {
              const progressPercentage = Math.round((item.progress / (item.duration || 1)) * 100)
              
              return (
                <div key={item.id} className="relative group flex flex-col">
                  <ContentCard
                    id={item.contentId}
                    title={item.movie ? item.movie.title : item.series?.title || 'Unknown Content'}
                    poster={item.movie ? item.movie.poster : item.series?.poster || ''}
                    type={item.movie ? 'movie' : 'series'}
                    rating={item.movie ? item.movie.rating : item.series?.rating || 0}
                    releaseYear={item.movie ? item.movie.releaseYear : item.series?.releaseYear || 0}
                  />
                  {/* Progress overlay tag */}
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white shadow-lg z-10">
                    {progressPercentage > 100 ? 100 : progressPercentage}%
                  </div>
                  {/* Progress bar underneath the card */}
                  <div className="w-full bg-gray-800 h-1.5 mt-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage > 100 ? 100 : progressPercentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/40 rounded-2xl border border-gray-800">
            <Clock className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">No watching history</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              You haven't watched any movies or series yet. Start streaming to see your history here!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
