"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/language-context'

export default function SignupPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'))
      return
    }

    if (formData.password.length < 6) {
      setError(t('passwordTooShort'))
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      if (res.ok) {
        // Successful registration auto-logs in via the API (sets session cookie)
        // Redirection to login is fine, or we can go to root. Let's go to root since we're logged in now.
        router.push('/')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to create account')
        setIsLoading(false)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <Card className="bg-gray-800/80 backdrop-blur border-gray-700">
          <CardHeader className="text-center">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Ganma Shami Logo"
                width={250}
                height={70}
                className="h-12 w-auto object-contain mx-auto"
                priority
              />
            </Link>
            <CardTitle className="text-2xl text-white">{t('createAccount')}</CardTitle>
            <CardDescription>{t('signUpToStream')}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t('username')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder={t('chooseUsername')}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t('email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    type="email"
                    placeholder={t('enterYourEmail')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t('password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('createPassword')}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t('confirmPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('confirmYourPassword')}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-gray-600 bg-gray-800 text-red-600 focus:ring-red-600"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  {t('iAgreeToThe')}{' '}
                  <Link href="/terms" className="text-red-500 hover:text-red-400">{t('termsOfService')}</Link>
                  {' '}{t('and')}{' '}
                  <Link href="/privacy" className="text-red-500 hover:text-red-400">{t('privacyPolicy')}</Link>
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? t('creatingAccount') : t('createAccount')}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-gray-400 text-sm">
              {t('alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-red-500 hover:text-red-400 font-medium">
                {t('signIn')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
