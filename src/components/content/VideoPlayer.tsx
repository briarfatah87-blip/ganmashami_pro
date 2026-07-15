"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, Settings, Subtitles
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  streamUrl: string
  title: string
  onProgress?: (progress: number, duration: number) => void
  onEnded?: () => void
  autoPlay?: boolean
  initialProgress?: number
}

interface AdData {
  id: string
  imageUrl: string
  link?: string
  videoUrl?: string
  showAfterSeconds: number
  skipAfterSeconds: number
  isActive: boolean
}

export default function VideoPlayer({
  streamUrl,
  title,
  onProgress,
  onEnded,
  autoPlay = false,
  initialProgress = 0
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const adVideoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialProgress)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)

  // --- Ad State ---
  const [adData, setAdData] = useState<AdData | null>(null)
  const [showAd, setShowAd] = useState(false)
  const [adTriggered, setAdTriggered] = useState(false)
  const [skipCountdown, setSkipCountdown] = useState(0)
  const [canSkip, setCanSkip] = useState(false)
  const [adCurrentTime, setAdCurrentTime] = useState(0)
  const [adDuration, setAdDuration] = useState(0)
  const skipTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch active ad on mount
  useEffect(() => {
    fetch('/api/ads')
      .then(r => r.ok ? r.json() : null)
      .then((ad: AdData | null) => {
        if (ad && ad.isActive && ad.videoUrl) {
          setAdData(ad)
        }
      })
      .catch(() => {})
  }, [])

  // Trigger ad when main video reaches showAfterSeconds
  useEffect(() => {
    if (!adData || adTriggered || !isPlaying) return
    const triggerAt = adData.showAfterSeconds ?? 0

    if (currentTime >= triggerAt) {
      // Pause main video and show ad overlay
      videoRef.current?.pause()
      setIsPlaying(false)
      setShowAd(true)
      setAdTriggered(true)
      setCanSkip(false)
      setSkipCountdown(adData.skipAfterSeconds ?? 5)
    }
  }, [currentTime, adData, adTriggered, isPlaying])

  // Countdown timer for skip button
  useEffect(() => {
    if (!showAd) return

    skipTimerRef.current = setInterval(() => {
      setSkipCountdown(prev => {
        if (prev <= 1) {
          clearInterval(skipTimerRef.current!)
          setCanSkip(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (skipTimerRef.current) clearInterval(skipTimerRef.current)
    }
  }, [showAd])

  // Auto-play ad video when overlay shown
  useEffect(() => {
    if (showAd && adVideoRef.current) {
      adVideoRef.current.currentTime = 0
      adVideoRef.current.play().catch(() => {})
    }
  }, [showAd])

  const handleSkipAd = useCallback(() => {
    if (!canSkip) return
    adVideoRef.current?.pause()
    setShowAd(false)
    setAdCurrentTime(0)
    setAdDuration(0)
    // Resume main video
    videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {})
  }, [canSkip])

  const handleAdEnded = useCallback(() => {
    setShowAd(false)
    setAdCurrentTime(0)
    setAdDuration(0)
    // Resume main video
    videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {})
  }, [])

  // Reload main video when streamUrl changes
  useEffect(() => {
    const video = videoRef.current
    if (!video || !streamUrl) return

    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setIsBuffering(false)
    setAdTriggered(false)
    setShowAd(false)

    video.load()

    if (autoPlay) {
      video.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Auto-play failed:', err)
        }
      })
    }
  }, [streamUrl, autoPlay])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const hideControls = () => {
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000)
      }
    }

    hideControls()
    return () => clearTimeout(timeout)
  }, [isPlaying, showControls])

  const safePlay = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    try {
      await video.play()
      setIsPlaying(true)
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.log('Play interrupted — video source changed')
      } else {
        console.error('Video playback error:', err)
      }
      setIsPlaying(false)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      safePlay()
    }
  }, [isPlaying, safePlay])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0]
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      onProgress?.(videoRef.current.currentTime, videoRef.current.duration)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      if (initialProgress > 0) {
        videoRef.current.currentTime = initialProgress
      }
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00'
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Main Video Element */}
      <video
        ref={videoRef}
        src={streamUrl || undefined}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => { setIsBuffering(false); setIsPlaying(true) }}
        onPause={() => setIsPlaying(false)}
        onEnded={onEnded}
        onError={(e) => console.error('Video error:', e)}
        onClick={togglePlay}
        playsInline
      />

      {/* ===== VIDEO AD OVERLAY ===== */}
      {showAd && adData?.videoUrl && (
        <div className="absolute inset-0 z-20 bg-black">
          {/* Ad Video */}
          <video
            ref={adVideoRef}
            src={adData.videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={() => {
              if (adVideoRef.current) setAdCurrentTime(adVideoRef.current.currentTime)
            }}
            onLoadedMetadata={() => {
              if (adVideoRef.current) setAdDuration(adVideoRef.current.duration)
            }}
            onEnded={handleAdEnded}
            playsInline
          />

          {/* Ad UI Overlay — top & bottom HUD */}
          <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
            {/* Top bar: Ad label + timer */}
            <div className="flex items-center justify-between">
              <span className="bg-black/70 text-yellow-400 text-xs font-bold px-2.5 py-1 rounded-md border border-yellow-400/40 tracking-wider">
                ئاگاهداری
              </span>
              {adDuration > 0 && (
                <span className="bg-black/70 text-white text-xs px-2.5 py-1 rounded-md tabular-nums">
                  {formatTime(adCurrentTime)} / {formatTime(adDuration)}
                </span>
              )}
            </div>

            {/* Bottom bar: Skip button */}
            <div className="flex justify-end pointer-events-auto">
              {canSkip ? (
                <button
                  onClick={handleSkipAd}
                  className="flex items-center gap-2 bg-white text-black font-bold text-sm px-4 py-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
                >
                  <span>تێپەڕاندن</span>
                  <SkipForward className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-black/70 text-white text-sm px-4 py-2 rounded-lg border border-white/20">
                  <span>تێپەڕاندن لە دواى</span>
                  <span className="font-bold text-yellow-400 min-w-[20px] text-center tabular-nums">
                    {skipCountdown}
                  </span>
                  <span>چرکەدا</span>
                </div>
              )}
            </div>
          </div>

          {/* Ad progress bar at very bottom */}
          {adDuration > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${Math.min(100, (adCurrentTime / adDuration) * 100)}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Buffering Indicator (only when no ad) */}
      {isBuffering && !showAd && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Play button overlay (when paused, no ad) */}
      {!isPlaying && !isBuffering && !showAd && (
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="absolute inset-0 hidden md:flex items-center justify-center bg-black/30"
        >
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors">
            <Play className="h-6 w-6 md:h-10 md:w-10 text-white fill-white ml-0.5" />
          </div>
        </button>
      )}

      {/* Controls (hidden during ad) */}
      {!showAd && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-6 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Title */}
          <div className="text-white text-lg font-medium mb-4">{title}</div>

          {/* Progress bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>

              {/* Skip back/forward */}
              <button onClick={() => skip(-10)} className="text-white hover:text-red-500 transition-colors">
                <SkipBack className="h-5 w-5" />
              </button>
              <button onClick={() => skip(10)} className="text-white hover:text-red-500 transition-colors">
                <SkipForward className="h-5 w-5" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-white hover:text-red-500 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-24"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Subtitles */}
              <button className="text-white hover:text-red-500 transition-colors">
                <Subtitles className="h-5 w-5" />
              </button>

              {/* Settings */}
              <button className="text-white hover:text-red-500 transition-colors">
                <Settings className="h-5 w-5" />
              </button>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="text-white hover:text-red-500 transition-colors">
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
