"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { useSiteSettings } from '@/lib/site-settings-context'
import { useLanguage } from '@/lib/language-context'

export default function Footer() {
  const { currentTheme } = useTheme()
  const settings = useSiteSettings()
  const { t } = useLanguage()

  return (
    <footer className="bg-gradient-to-b from-transparent to-[var(--background)] border-t border-white/5">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src={settings.logoUrl}
                alt="Logo"
                width={380}
                height={85}
                className="h-[85px] w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-sm">
              {settings.footerDescription}
            </p>
            <div className="flex space-x-3">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t('browse')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('movies')}
                </Link>
              </li>
              <li>
                <Link href="/series" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('series')}
                </Link>
              </li>
              <li>
                <Link href="/movies?genre=action" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('action')}
                </Link>
              </li>
              <li>
                <Link href="/movies?genre=drama" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('drama')}
                </Link>
              </li>
              <li>
                <Link href="/movies?genre=comedy" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('comedy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t('help')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('helpCenter')}
                </Link>
              </li>
              <li>
                <Link href="/devices" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('supportedDevices')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t('legal')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('termsOfService')}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                  {t('cookiePolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {settings.copyrightText}. {t('allRightsReserved')}
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {t('allSystemsOperational')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
