"use client"

import React, { useState, useEffect } from 'react'
import { Activity, PlayCircle, Loader2, User, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import PageBanner from '@/components/content/PageBanner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m`
  return `${m}m`
}

export default function LiveWatchingPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  
  const [liveActivity, setLiveActivity] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const fetchLiveActivity = async () => {
    try {
      const res = await fetch('/api/admin/live-watching')
      if (res.ok) {
        const data = await res.json()
        setLiveActivity(data)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch live activity")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchLiveActivity()
      // Auto-refresh every 15 seconds
      const interval = setInterval(fetchLiveActivity, 15000)
      return () => clearInterval(interval)
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
      <PageBanner
        title="Live Activity"
        subtitle={`${liveActivity.length} users actively watching right now`}
        icon={<Activity className="h-6 w-6 text-white" />}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
            <span className="text-sm text-gray-400">
              Auto-refreshing · Last updated {timeAgo(lastRefresh.toISOString())}
            </span>
          </div>
          <button
            onClick={fetchLiveActivity}
            className="text-xs text-[var(--theme-primary)] hover:underline"
          >
            Refresh now
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : liveActivity.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveActivity.map((activity: any) => {
              const progress = activity.content.duration > 0
                ? Math.min(100, Math.round((activity.content.progress / activity.content.duration) * 100))
                : 0

              return (
                <div
                  key={activity.id}
                  className="group flex gap-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 hover:border-[var(--theme-primary)]/50 transition-all duration-200 hover:shadow-lg hover:shadow-[var(--theme-primary)]/10"
                >
                  {/* Poster */}
                  <div className="w-14 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-800 shadow">
                    {activity.content.poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={activity.content.poster}
                        alt={activity.content.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayCircle className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-red-600/20 text-red-400 border-red-500/40 text-[10px] px-1.5 py-0 font-semibold uppercase animate-pulse">
                        LIVE
                      </Badge>
                      <span className="text-[11px] text-gray-500 capitalize">{activity.content.type}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-white truncate leading-snug mb-0.5" title={activity.content.title}>
                      {activity.content.title}
                    </h3>

                    {/* Season/Episode for series */}
                    {activity.content.seasonNumber && activity.content.episodeNumber && (
                      <p className="text-xs text-gray-500 mb-1">
                        S{activity.content.seasonNumber} E{activity.content.episodeNumber}
                      </p>
                    )}

                    {/* Progress bar */}
                    {activity.content.duration > 0 && (
                      <div className="mb-2">
                        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-red-600 h-full rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
                          <span>{formatTime(activity.content.progress)}</span>
                          <span>{formatTime(activity.content.duration)}</span>
                        </div>
                      </div>
                    )}

                    {/* User info */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="w-5 h-5 border border-gray-700">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback className="bg-gray-700 text-[10px]">
                            <User className="h-2.5 w-2.5" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-300 font-medium truncate max-w-[80px]">
                          {activity.user.username}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-600 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {timeAgo(activity.content.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/40 rounded-2xl border border-gray-800">
            <PlayCircle className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">No active viewers</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              No users have watched anything in the last 30 minutes. Activity will appear here as soon as someone starts streaming.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
