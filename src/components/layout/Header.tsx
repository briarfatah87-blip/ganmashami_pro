"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Bell, User, Menu, X, Heart, Clock, History, LogOut, Settings, Film, Tv, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ThemeSwitcher from '@/components/ui/theme-switcher'
import { useTheme } from '@/lib/theme-context'
import { useAuth } from '@/lib/auth-context'
import { useSiteSettings } from '@/lib/site-settings-context'
import { useLanguage } from '@/lib/language-context'

export default function Header() {
  const { user, logout } = useAuth()
  const isLoggedIn = !!user
  const settings = useSiteSettings()
  const { t, dir } = useLanguage()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ movies: any[], series: any[] }>({ movies: [], series: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const { currentTheme } = useTheme()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
        setSearchResults({ movies: [], series: [] })
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setSearchResults({ movies: [], series: [] })
      return
    }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const [moviesRes, seriesRes] = await Promise.all([
          fetch('/api/movies'),
          fetch('/api/series'),
        ])
        const [movies, series] = await Promise.all([moviesRes.json(), seriesRes.json()])
        const q = value.toLowerCase()
        setSearchResults({
          movies: (Array.isArray(movies) ? movies : []).filter((m: any) => m.title?.toLowerCase().includes(q)).slice(0, 5),
          series: (Array.isArray(series) ? series : []).filter((s: any) => s.title?.toLowerCase().includes(q)).slice(0, 5),
        })
      } catch {
        setSearchResults({ movies: [], series: [] })
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }, [])

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/movies?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchResults({ movies: [], series: [] })
      setSearchQuery('')
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false)
      setSearchResults({ movies: [], series: [] })
      setSearchQuery('')
    }
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchResults({ movies: [], series: [] })
    setSearchQuery('')
  }

  const navigateToResult = (type: 'movie' | 'series', id: string | number) => {
    const path = type === 'movie' ? `/movie/${id}` : `/series/${id}`
    router.push(path)
    closeSearch()
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setNotifications(data)
        })
        .catch(console.error)
    }
  }, [isLoggedIn])

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string, link: string | null) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      })
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
      if (link) window.location.href = link;
    } catch (error) {
      console.error('Failed to mark notification as read', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      })
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Failed to mark all as read', error)
    }
  }

  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('movies'), href: '/movies' },
    { label: t('series'), href: '/series' },
    { label: t('profile'), href: '/profile' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={settings.logoUrl}
              alt="Logo"
              width={350}
              height={75}
              className="h-[75px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative" ref={searchContainerRef}>
              {isSearchOpen ? (
                <div className="flex flex-col">
                  <div className="flex items-center bg-gray-900/90 border border-gray-700 rounded-md">
                    <Input
                      type="text"
                      placeholder={t('searchMoviesAndSeries')}
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-48 md:w-64 border-0 bg-transparent focus:ring-0"
                      autoFocus
                    />
                    {isSearching ? (
                      <span className="p-2"><Loader2 className="h-4 w-4 text-gray-400 animate-spin" /></span>
                    ) : (
                      <button onClick={closeSearch} className="p-2 text-gray-400 hover:text-white">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {/* Results Dropdown */}
                  {(searchResults.movies.length > 0 || searchResults.series.length > 0) && (
                    <div className="absolute top-full mt-1 start-0 w-full min-w-[280px] bg-gray-900 border border-gray-700 rounded-md shadow-xl z-50 overflow-hidden">
                      {searchResults.movies.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 text-xs text-gray-400 uppercase tracking-wide">
                            <Film className="h-3 w-3" />{t('movies')}
                          </div>
                          {searchResults.movies.map((movie: any) => (
                            <button
                              key={movie.id}
                              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-800 transition-colors text-start"
                              onClick={() => navigateToResult('movie', movie.id)}
                            >
                              {movie.poster ? (
                                <img src={movie.poster} alt="" className="w-8 h-11 object-cover rounded flex-shrink-0" />
                              ) : (
                                <div className="w-8 h-11 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
                                  <Film className="h-4 w-4 text-gray-500" />
                                </div>
                              )}
                              <span className="text-sm text-white truncate">{movie.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchResults.series.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 text-xs text-gray-400 uppercase tracking-wide">
                            <Tv className="h-3 w-3" />{t('series')}
                          </div>
                          {searchResults.series.map((s: any) => (
                            <button
                              key={s.id}
                              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-800 transition-colors text-start"
                              onClick={() => navigateToResult('series', s.id)}
                            >
                              {s.poster ? (
                                <img src={s.poster} alt="" className="w-8 h-11 object-cover rounded flex-shrink-0" />
                              ) : (
                                <div className="w-8 h-11 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
                                  <Tv className="h-4 w-4 text-gray-500" />
                                </div>
                              )}
                              <span className="text-sm text-white truncate">{s.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchQuery.trim() && (
                        <button
                          className="flex items-center gap-2 w-full px-3 py-2.5 border-t border-gray-700 hover:bg-gray-800 transition-colors text-sm text-gray-400 hover:text-white"
                          onClick={() => {
                            router.push(`/movies?q=${encodeURIComponent(searchQuery.trim())}`)
                            closeSearch()
                          }}
                        >
                          <Search className="h-3.5 w-3.5" />
                          {t('searchResults')}: &ldquo;{searchQuery}&rdquo;
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Notifications */}
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:block p-2 text-gray-300 hover:text-white transition-colors relative cursor-pointer">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.primary }}></span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
                    <span className="font-semibold text-white">{t('notificationsTitle')}</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllAsRead} className="text-xs text-gray-400 hover:text-white transition-colors">
                        {t('markAllRead')}
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      {t('noNotificationsYet')}
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`p-4 cursor-pointer border-b border-gray-800/50 last:border-0 flex flex-col items-start gap-1 focus:bg-gray-800 transition-colors ${!notification.isRead ? 'bg-gray-900/50' : ''}`}
                        onClick={() => handleMarkAsRead(notification.id, notification.link)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: currentTheme.primary }} />
                          )}
                          <span className={`font-medium text-sm ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                            {notification.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 pr-2 pb-1 block w-full">{notification.message}</span>
                        <span className="text-[10px] text-gray-500">{new Date(notification.createdAt).toLocaleDateString()}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Menu / Auth Buttons */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || undefined} />
                      <AvatarFallback className="text-white text-sm" style={{ backgroundColor: currentTheme.primary }}>
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="me-2 h-4 w-4" />
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=favorites" className="flex items-center">
                      <Heart className="me-2 h-4 w-4" />
                      {t('favorites')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=watchlater" className="flex items-center">
                      <Clock className="me-2 h-4 w-4" />
                      {t('watchLater')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=history" className="flex items-center">
                      <History className="me-2 h-4 w-4" />
                      {t('watchHistory')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="me-2 h-4 w-4" />
                      {t('settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer" onClick={() => logout()}>
                    <LogOut className="me-2 h-4 w-4" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">{t('login')}</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">{t('signup')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-sm rounded-lg mt-2 p-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!isLoggedIn && (
                <>
                  <hr className="border-gray-700" />
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-white transition-colors py-2"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/signup"
                    className="text-red-600 hover:text-red-500 transition-colors py-2"
                  >
                    {t('signup')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
