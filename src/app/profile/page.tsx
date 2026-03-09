"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { User, Heart, Clock, History, Star, Settings, Edit, Camera, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import ContentCard from '@/components/content/ContentCard'
import { sampleMovies, sampleSeries } from '@/lib/sample-data'
import { useAuth, User as AuthUser } from '@/lib/auth-context'

function ProfileContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = searchParams.get('tab') || 'overview'

  const { user, isLoading: authLoading } = useAuth()

  const [favorites, setFavorites] = useState<any[]>([])
  const [watchLater, setWatchLater] = useState<any[]>([])
  const [watchHistory, setWatchHistory] = useState<any[]>([])
  const [userReviews, setUserReviews] = useState<any[]>([])
  const [userReports, setUserReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const handleAvatarClick = () => {
    document.getElementById('avatar-upload')?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    try {
      // Convert to small webp using Canvas
      const webpBlob = await new Promise<Blob>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new window.Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 256;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('No canvas context');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject('Canvas toBlob failed');
            }, 'image/webp', 0.8);
          };
          img.onerror = () => reject('Image load failed');
          if (event.target?.result) {
            img.src = event.target.result as string;
          }
        };
        reader.onerror = () => reject('File read failed');
        reader.readAsDataURL(file);
      });

      // Upload Blob
      const formData = new FormData();
      formData.append('avatar', webpBlob, 'avatar.webp');

      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        window.location.reload();
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  React.useEffect(() => {
    if (user) {
      const fetchProfileData = async () => {
        try {
          const [favRes, wlRes, histRes, reviewsRes, reportsRes] = await Promise.all([
            fetch('/api/profile/favorites'),
            fetch('/api/profile/watchlater'),
            fetch('/api/profile/history'),
            fetch('/api/profile/reviews'),
            fetch('/api/reports')
          ])

          if (favRes.ok) setFavorites(await favRes.json())
          if (wlRes.ok) setWatchLater(await wlRes.json())
          if (histRes.ok) setWatchHistory(await histRes.json())
          if (reviewsRes.ok) setUserReviews(await reviewsRes.json())
          if (reportsRes.ok) setUserReports(await reportsRes.json())
        } catch (error) {
          console.error("Failed to fetch profile data")
        } finally {
          setIsLoading(false)
        }
      }
      fetchProfileData()
    }
  }, [user])

  if (authLoading || (!user && isLoading)) {
    return <div className="min-h-screen bg-transparent flex items-center justify-center pt-24"><div className="w-8 h-8 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin"></div></div>
  }

  if (!user) return null

  // Ensure user has required format for our UI
  const displayUser = {
    username: user.username,
    email: user.email,
    avatar: user.avatar || '',
    joinDate: (user as any).createdAt || new Date().toISOString(),
    stats: {
      favorites: favorites.length,
      watchLater: watchLater.length,
      watched: watchHistory.length,
      reviews: userReviews.length,
      reports: userReports.length
    }
  }

  return (
    <div className="min-h-screen bg-transparent pt-24">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-gray-900 rounded-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className={`h-28 w-28 md:h-32 md:w-32 transition-opacity ${isUploadingAvatar ? 'opacity-50' : ''}`}>
                <AvatarImage src={displayUser.avatar} />
                <AvatarFallback className="bg-[var(--theme-primary)] text-white text-3xl">
                  {displayUser.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute bottom-0 right-0 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-900 hover:bg-gray-700 transition-colors pointer-events-none"
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Camera className="h-5 w-5 text-white" />
                )}
              </button>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{displayUser.username}</h1>
                <Badge variant="secondary">Member since {new Date(displayUser.joinDate).getFullYear()}</Badge>
              </div>
              <p className="text-gray-400 mb-4">{displayUser.email}</p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{displayUser.stats.favorites}</p>
                  <p className="text-sm text-gray-400">Favorites</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{displayUser.stats.watchLater}</p>
                  <p className="text-sm text-gray-400">Watch Later</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{displayUser.stats.watched}</p>
                  <p className="text-sm text-gray-400">Watched</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{displayUser.stats.reviews}</p>
                  <p className="text-sm text-gray-400">Reviews</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="bg-gray-900 mb-8 flex-wrap h-auto p-1">
            <TabsTrigger value="overview" className="gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="watchlater" className="gap-2">
              <Clock className="h-4 w-4" />
              Watch Later
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-8">
              {/* Continue Watching */}
              {watchHistory.filter(h => !h.completed && h.progress > 0).length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Continue Watching</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {watchHistory.filter(h => !h.completed && h.progress > 0).map((item, idx) => {
                      // Fallback carefully: If duration is missing but progress is saved, we cap at 95% to leave it in "Continue"
                      const percent = item.duration && item.duration > 0 ? Math.min(Math.round((item.progress / item.duration) * 100), 100) : Math.min(item.progress, 95);
                      return (
                        <div key={idx} className="relative">
                          <ContentCard
                            id={item.contentId || item.id}
                            title={item.title || item.contentTitle}
                            poster={item.poster || item.contentPoster}
                            releaseYear={item.releaseYear}
                            rating={item.rating}
                            genre={item.genre}
                            type={item.contentType || ('duration' in item ? 'movie' : 'series')}
                          />
                          <div className="mt-2">
                            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--theme-primary)] rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{percent}% watched</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Recent Favorites */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Recent Favorites</h3>
                  <Link href="/profile?tab=favorites" className="text-[var(--theme-primary)] hover:text-[var(--theme-primary-hover)] text-sm">
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {favorites.slice(0, 5).map((item) => (
                    <ContentCard
                      key={item.id}
                      id={item.contentId || item.id}
                      title={item.title || item.contentTitle}
                      poster={item.poster || item.contentPoster}
                      releaseYear={item.releaseYear || ''}
                      rating={item.rating || 0}
                      genre={item.genre || ''}
                      type={item.type || item.contentType || ('duration' in item ? 'movie' : 'series')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                My Favorites ({favorites.length})
              </h3>
              {favorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {favorites.map((item) => (
                    <ContentCard
                      key={item.id}
                      id={item.contentId || item.id}
                      title={item.title || item.contentTitle}
                      poster={item.poster || item.contentPoster}
                      releaseYear={item.releaseYear || ''}
                      rating={item.rating || 0}
                      genre={item.genre || ''}
                      type={item.type || item.contentType || ('duration' in item ? 'movie' : 'series')}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">No favorites yet</h4>
                  <p className="text-gray-400">Start adding movies and series to your favorites!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Watch Later Tab */}
          <TabsContent value="watchlater">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Watch Later ({watchLater.length})
              </h3>
              {watchLater.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {watchLater.map((item) => (
                    <ContentCard
                      key={item.id}
                      id={item.contentId || item.id}
                      title={item.title || item.contentTitle}
                      poster={item.poster || item.contentPoster}
                      releaseYear={item.releaseYear || ''}
                      rating={item.rating || 0}
                      genre={item.genre || ''}
                      type={item.type || item.contentType || ('duration' in item ? 'movie' : 'series')}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">Nothing in watch later</h4>
                  <p className="text-gray-400">Save movies and series to watch them later!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Watch History</h3>
              {watchHistory.length > 0 ? (
                <div className="space-y-4">
                  {watchHistory.map((item, idx) => {
                    const MathPercent = item.duration && item.duration > 0 ? Math.round((item.progress / item.duration) * 100) : item.progress;
                    const percent = Math.min(MathPercent, 100);
                    return (
                      <div key={idx} className="flex gap-4 bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
                        <div className="relative w-32 md:w-48 aspect-video flex-shrink-0">
                          <Image
                            src={item.backdrop || item.contentPoster || '/placeholder-backdrop.jpg'}
                            alt={item.title || item.contentTitle || 'Video'}
                            fill
                            className="object-cover"
                          />
                          {!item.completed && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                              <div
                                className="h-full bg-[var(--theme-primary)]"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 py-3 pr-4">
                          <Link href={`/${item.contentType || ('duration' in item ? 'movie' : 'series')}/${String(item.contentId || item.id).replace(/^(movie-|series-)/, '')}`}>
                            <h4 className="text-white font-medium hover:text-[var(--theme-primary-hover)] transition-colors">
                              {item.title || item.contentTitle}
                            </h4>
                          </Link>
                          {item.episodeNumber ? (
                            <p className="text-gray-400 text-sm mt-1">
                              Season {item.seasonNumber} • Episode {item.episodeNumber}
                            </p>
                          ) : item.genre ? (
                            <p className="text-gray-400 text-sm mt-1">{item.genre}</p>
                          ) : null}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Watched on {new Date(item.watchedAt || item.updatedAt).toLocaleDateString()}</span>
                            {!item.completed && percent > 0 && (
                              <Badge variant="outline" className="text-xs text-gray-400 border-gray-700">
                                {percent}% complete
                              </Badge>
                            )}
                            {item.completed && (
                              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <History className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">No watch history</h4>
                  <p className="text-gray-400">Start watching to build your history!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                My Reviews ({userReviews.length})
              </h3>
              {userReviews.length > 0 ? (
                <div className="space-y-4">
                  {userReviews.map((review) => (
                    <div key={review.id} className="bg-gray-900 rounded-lg p-6">
                      <div className="flex gap-4">
                        <div className="relative w-20 aspect-[2/3] flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={review.contentPoster || '/placeholder-backdrop.jpg'}
                            alt={review.contentTitle || 'Review'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <Link href={`/${review.contentType}/${String(review.contentId).replace(/^(movie-|series-)/, '')}`}>
                              <h4 className="text-white font-medium hover:text-red-500 transition-colors">
                                {review.contentTitle || 'Unknown Content'}
                              </h4>
                            </Link>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-600'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                          <p className="text-gray-500 text-xs">{new Date(review.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">No reviews yet</h4>
                  <p className="text-gray-400">Share your thoughts on movies and series!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                My Reports ({userReports.length})
              </h3>
              {userReports.length > 0 ? (
                <div className="space-y-4">
                  {userReports.map((report) => (
                    <div key={report.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                            <h4 className="text-lg font-medium text-white">
                              {report.issueType}
                            </h4>
                            <Badge variant={report.status === 'RESOLVED' ? 'default' : 'secondary'} className={report.status === 'RESOLVED' ? 'bg-green-600' : 'bg-yellow-600/20 text-yellow-500'}>
                              {report.status}
                            </Badge>
                          </div>

                          <Link href={`/${report.contentType}/${report.contentId}`}>
                            <p className="text-[var(--theme-primary)] hover:underline mb-3">
                              Content: {report.contentTitle || 'Unknown'}
                            </p>
                          </Link>

                          {report.details && (
                            <div className="bg-gray-950 rounded p-3 text-sm text-gray-300 md:max-w-xl">
                              <span className="text-gray-500 block mb-1">Details Provided:</span>
                              {report.details}
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-4">
                            Submitted on {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <AlertCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">No reports submitted</h4>
                  <p className="text-gray-400">If you experience issues with any content, you can report them directly from the movie or series page.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-transparent flex items-center justify-center"><div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProfileContent />
    </React.Suspense>
  )
}
