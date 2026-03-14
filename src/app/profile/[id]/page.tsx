"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { User, Heart, History, Star, Calendar, Loader2, ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'

interface PublicProfile {
  id: string
  username: string
  avatar: string | null
  joinedAt: string
  stats: {
    favorites: number
    watched: number
    reviews: number
  }
}

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { t } = useLanguage()

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user || !params.id) return
    // If viewing own profile, redirect to /profile
    if (params.id === user.id) {
      router.replace('/profile')
      return
    }
    fetch(`/api/profile/${params.id}`)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null }
        return res.json()
      })
      .then(data => { if (data) setProfile(data) })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false))
  }, [user, params.id, router])

  if (authLoading || (isLoading && !notFound)) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 text-[var(--theme-primary)] animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 gap-4">
        <User className="w-16 h-16 text-gray-600" />
        <h2 className="text-xl font-bold text-white">User not found</h2>
        <button onClick={() => router.back()} className="text-[var(--theme-primary)] hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    )
  }

  if (!profile) return null

  const joinedDate = new Date(profile.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back') ?? 'Back'}
        </button>

        {/* Profile card */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 flex flex-col items-center text-center gap-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-[var(--theme-primary)]/40">
              <AvatarImage src={profile.avatar || undefined} />
              <AvatarFallback className="text-3xl font-bold bg-gray-800 text-white">
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gray-900" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
            <div className="flex items-center justify-center gap-1.5 text-sm text-gray-400 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {joinedDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full mt-4">
            <div className="bg-gray-800/60 rounded-xl p-4 flex flex-col items-center gap-1">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-2xl font-bold text-white">{profile.stats.favorites}</span>
              <span className="text-xs text-gray-400">{t('favorites') ?? 'Favorites'}</span>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-4 flex flex-col items-center gap-1">
              <History className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-white">{profile.stats.watched}</span>
              <span className="text-xs text-gray-400">{t('watched') ?? 'Watched'}</span>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-4 flex flex-col items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{profile.stats.reviews}</span>
              <span className="text-xs text-gray-400">{t('reviews') ?? 'Reviews'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
