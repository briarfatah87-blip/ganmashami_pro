"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Lock, Bell, Eye, EyeOff, Palette, Check } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTheme, themeColors } from '@/lib/theme-context'

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const { currentTheme, setTheme } = useTheme()

  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    username: '',
    email: ''
  })

  // Settings
  const [settings, setSettings] = useState({
    themeColor: 'Red',
    language: 'en',
    notifyNewReleases: true,
    notifyRecommendations: true,
    notifyEmailUpdates: false,
    autoplayNext: true,
    defaultQuality: '1080p'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
    if (user) {
      setProfileData({ username: user.username, email: user.email })

      // Fetch settings
      fetch('/api/settings').then(res => res.json()).then(data => {
        if (!data.error) {
          setSettings({
            themeColor: data.themeColor || 'Red',
            language: data.language || 'en',
            notifyNewReleases: data.notifyNewReleases ?? true,
            notifyRecommendations: data.notifyRecommendations ?? true,
            notifyEmailUpdates: data.notifyEmailUpdates ?? false,
            autoplayNext: data.autoplayNext ?? true,
            defaultQuality: data.defaultQuality || '1080p'
          })

          // Apply theme from DB if necessary
          const dbTheme = themeColors.find(t => t.name === data.themeColor)
          if (dbTheme) setTheme(dbTheme)
        }
      })
    }
  }, [user, authLoading, router, setTheme])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setSaveMessage('')
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) setSaveMessage('Preferences saved successfully')
      else setSaveMessage('Failed to save settings')
    } catch {
      setSaveMessage('Error saving settings')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleApplyTheme = async (theme: any) => {
    setTheme(theme)
    setSettings(prev => ({ ...prev, themeColor: theme.name }))
    // Automatically save theme
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, themeColor: theme.name })
    })
  }

  if (authLoading || !user) return null

  return (
    <div className="min-h-screen bg-transparent pt-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="bg-gray-900 mb-8 flex-wrap h-auto p-1">
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-2">
              <Lock className="h-4 w-4" />
              Password
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Theme Color</CardTitle>
                <CardDescription>Choose your preferred accent color for the interface</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {themeColors.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => handleApplyTheme(theme)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${currentTheme.name === theme.name
                        ? 'border-white bg-gray-800'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        }`}
                    >
                      <div
                        className="w-12 h-12 rounded-full shadow-lg"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <span className="text-sm text-white font-medium">{theme.name}</span>
                      {currentTheme.name === theme.name && (
                        <div
                          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: theme.primary }}
                        >
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-gray-800">
                  <p className="text-sm text-gray-400 mb-3">Preview</p>
                  <div className="flex items-center gap-3">
                    <Button>Primary Button</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription>Update your account profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Username</label>
                  <Input
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Email</label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">New Password</label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Confirm New Password</label>
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">New Releases</p>
                    <p className="text-sm text-gray-400">Get notified about new movies and series</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.notifyNewReleases} onChange={(e) => setSettings({ ...settings, notifyNewReleases: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">Recommendations</p>
                    <p className="text-sm text-gray-400">Personalized content suggestions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.notifyRecommendations} onChange={(e) => setSettings({ ...settings, notifyRecommendations: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-white font-medium">Email Updates</p>
                    <p className="text-sm text-gray-400">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.notifyEmailUpdates} onChange={(e) => setSettings({ ...settings, notifyEmailUpdates: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                {/* Debug Tool: Send Test Notification */}
                <div className="flex items-center justify-between py-3 border-y border-gray-800 my-4">
                  <div>
                    <p className="text-white font-medium">Test Notification System</p>
                    <p className="text-sm text-gray-400">Send a test alert to your account</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        await fetch('/api/notifications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: 'Test Notification Received! 🎉',
                            message: 'Your notification system is working perfectly. Click the Bell icon to view it!',
                            type: 'system',
                            link: '/profile'
                          })
                        });
                        alert('Test notification sent! Check the bell icon in your header.');
                      } catch (e) {
                        alert('Failed to send notification.');
                      }
                    }}
                  >
                    Ping Me
                  </Button>
                </div>

                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </Button>
                {saveMessage && <p className="text-sm text-green-500 mt-2">{saveMessage}</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
