"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const backdropImages = [
  "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1509248961895-b5c5c5a74648?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
]

interface DynamicBackdropProps {
  interval?: number // in milliseconds
  overlay?: boolean
  overlayOpacity?: number
}

export default function DynamicBackdrop({ 
  interval = 8000, 
  overlay = true,
  overlayOpacity = 0.7 
}: DynamicBackdropProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nextIndex, setNextIndex] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setNextIndex((currentIndex + 1) % backdropImages.length)
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % backdropImages.length)
        setIsTransitioning(false)
      }, 1000) // transition duration
    }, interval)

    return () => clearInterval(timer)
  }, [currentIndex, interval])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Current Image */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={backdropImages[currentIndex]}
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={75}
        />
      </div>

      {/* Next Image (for smooth transition) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Image
          src={backdropImages[nextIndex]}
          alt="Background"
          fill
          className="object-cover"
          quality={75}
        />
      </div>

      {/* Gradient Overlays */}
      {overlay && (
        <>
          {/* Dark overlay */}
          <div 
            className="absolute inset-0 bg-transparent"
            style={{ opacity: overlayOpacity }}
          />
          
          {/* Top gradient for header */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0f172a] to-transparent" />
          
          {/* Bottom gradient for footer */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent" />
          
          {/* Side gradients */}
          <div className="absolute inset-y-0 start-0 w-32 bg-gradient-to-e from-[var(--background)]/50 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--background)]/50 to-transparent" />
        </>
      )}

      {/* Subtle animated grain effect */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-noise" />
    </div>
  )
}
