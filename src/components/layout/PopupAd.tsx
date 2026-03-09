"use client"

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function PopupAd() {
    const [ad, setAd] = useState<any>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await fetch('/api/ads')
                if (res.ok) {
                    const data = await res.json()
                    if (data && data.isActive) {
                        checkFrequency(data)
                    }
                }
            } catch (e) {
                console.error('Error fetching popup ad:', e)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAd()
    }, [])

    const checkFrequency = (adData: any) => {
        const storageKey = `ad_last_seen_${adData.id}`
        const today = new Date().toDateString()

        const localData = localStorage.getItem(storageKey)
        const parsedData = localData ? JSON.parse(localData) : { date: '', count: 0 }

        if (parsedData.date !== today) {
            // New day, reset count
            showAd(adData, storageKey, today, 1)
        } else {
            // Same day, check showCountPerDay
            if (adData.showCountPerDay === 0) {
                // 0 means every time
                showAd(adData, storageKey, today, parsedData.count + 1)
            } else if (parsedData.count < adData.showCountPerDay) {
                // Still under limit
                showAd(adData, storageKey, today, parsedData.count + 1)
            }
        }
    }

    const showAd = (adData: any, storageKey: string, date: string, newCount: number) => {
        setAd(adData)
        setIsVisible(true)
        localStorage.setItem(storageKey, JSON.stringify({ date, count: newCount }))
    }

    if (isLoading || !ad || !isVisible) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative max-w-lg w-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl"
                >
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-3 right-3 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="relative aspect-video w-full overflow-hidden">
                        {ad.link ? (
                            <Link href={ad.link} target="_blank" onClick={() => setIsVisible(false)}>
                                <img
                                    src={ad.imageUrl}
                                    alt="Advertisement"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </Link>
                        ) : (
                            <img
                                src={ad.imageUrl}
                                alt="Advertisement"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
