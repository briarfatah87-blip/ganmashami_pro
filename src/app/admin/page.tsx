"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    BarChart,
    Flag,
    MessageSquare,
    Bell,
    Trash2,
    CheckCircle,
    Loader2,
    AlertCircle,
    Star,
    Image as ImageIcon
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth-context'

export default function AdminDashboard() {
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()

    const [activeTab, setActiveTab] = useState('overview')
    const [stats, setStats] = useState<any>(null)
    const [reports, setReports] = useState<any[]>([])
    const [reviews, setReviews] = useState<any[]>([])
    const [ads, setAds] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Notification form state
    const [notifTitle, setNotifTitle] = useState('')
    const [notifMessage, setNotifMessage] = useState('')
    const [notifEmail, setNotifEmail] = useState('')
    const [isSendingNotif, setIsSendingNotif] = useState(false)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        } else if (user && user.role !== 'admin') {
            router.push('/')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [statsRes, reportsRes, reviewsRes, adsRes] = await Promise.all([
                fetch('/api/admin/stats'),
                fetch('/api/admin/reports'),
                fetch('/api/admin/reviews'),
                fetch('/api/admin/ads')
            ])

            if (statsRes.ok) setStats(await statsRes.json())
            if (reportsRes.ok) setReports(await reportsRes.json())
            if (reviewsRes.ok) setReviews(await reviewsRes.json())
            if (adsRes.ok) setAds(await adsRes.json())
        } catch (e) {
            console.error('Error fetching admin data:', e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResolveReport = async (reportId: string) => {
        try {
            const res = await fetch('/api/reports', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId, status: 'RESOLVED' })
            })
            if (res.ok) {
                setReports(reports.map(r => r.id === reportId ? { ...r, status: 'RESOLVED' } : r))
                // Refresh stats
                fetchData()
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleDeleteReport = async (reportId: string) => {
        if (!confirm('Are you sure you want to delete this report?')) return
        try {
            const res = await fetch(`/api/admin/reports?id=${reportId}`, { method: 'DELETE' })
            if (res.ok) {
                setReports(reports.filter(r => r.id !== reportId))
                fetchData()
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return
        try {
            const res = await fetch(`/api/admin/reviews?id=${reviewId}`, { method: 'DELETE' })
            if (res.ok) {
                setReviews(reviews.filter(r => r.id !== reviewId))
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSendingNotif(true)
        try {
            const payload: any = { title: notifTitle, message: notifMessage }
            if (notifEmail) payload.targetUserEmail = notifEmail

            const res = await fetch('/api/admin/notifications/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            if (res.ok) {
                alert(data.message)
                setNotifTitle('')
                setNotifMessage('')
                setNotifEmail('')
            } else {
                alert(`Error: ${data.error}`)
            }
        } catch (e) {
            console.error(e)
            alert("Failed to send notification")
        } finally {
            setIsSendingNotif(false)
        }
    }

    const [adForm, setAdForm] = useState({
        id: '',
        imageUrl: '',
        link: '',
        showCountPerDay: '1',
        isActive: true
    })
    const [isSavingAd, setIsSavingAd] = useState(false)

    const handleSaveAd = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSavingAd(true)
        try {
            const res = await fetch('/api/admin/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adForm)
            })
            if (res.ok) {
                alert('Advertisement saved successfully')
                setAdForm({ id: '', imageUrl: '', link: '', showCountPerDay: '1', isActive: true })
                fetchData()
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsSavingAd(false)
        }
    }

    const handleDeleteAd = async (id: string) => {
        if (!confirm('Are you sure you want to delete this ad?')) return
        try {
            const res = await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setAds(ads.filter(a => a.id !== id))
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (authLoading || isLoading) {
        return <div className="min-h-screen bg-gray-950 flex items-center justify-center pt-24"><Loader2 className="h-8 w-8 text-[var(--theme-primary)] animate-spin" /></div>
    }

    if (!user || user.role !== 'admin') return null

    return (
        <div className="min-h-screen bg-gray-950 pt-24">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Manage reports, reviews, and system notifications.</p>
                    </div>
                    <Badge className="bg-[var(--theme-primary)] text-white px-3 py-1 text-sm">Admin Access</Badge>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-gray-900 mb-8 flex-wrap h-auto p-1 w-full justify-start">
                        <TabsTrigger value="overview" className="gap-2 px-6 py-3">
                            <BarChart className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="reports" className="gap-2 px-6 py-3">
                            <Flag className="h-4 w-4" />
                            Reports
                        </TabsTrigger>
                        <TabsTrigger value="reviews" className="gap-2 px-6 py-3">
                            <MessageSquare className="h-4 w-4" />
                            Reviews
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="gap-2 px-6 py-3">
                            <Bell className="h-4 w-4" />
                            Notify Users
                        </TabsTrigger>
                        <TabsTrigger value="ads" className="gap-2 px-6 py-3">
                            <ImageIcon className="h-4 w-4" />
                            Ads Popup
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Trends */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h3 className="text-gray-400 font-medium mb-4 flex items-center gap-2">
                                    <BarChart className="h-5 w-5 text-blue-500" />
                                    Issue Reports Received
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Today</span>
                                        <span className="text-2xl font-bold text-white">{stats?.trends.today || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">This Week</span>
                                        <span className="text-2xl font-bold text-white">{stats?.trends.week || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">This Month</span>
                                        <span className="text-2xl font-bold text-white">{stats?.trends.month || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pending */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex flex-col justify-center items-center text-center">
                                <AlertCircle className="h-10 w-10 text-yellow-500 mb-2" />
                                <h3 className="text-gray-400 font-medium mb-1">Pending Tickets</h3>
                                <p className="text-5xl font-bold text-white">{stats?.totals.pending || 0}</p>
                            </div>

                            {/* Resolved */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex flex-col justify-center items-center text-center">
                                <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                                <h3 className="text-gray-400 font-medium mb-1">Resolved Tickets</h3>
                                <p className="text-5xl font-bold text-white">{stats?.totals.resolved || 0}</p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Reports Tab */}
                    <TabsContent value="reports">
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h2 className="text-xl font-bold text-white mb-6">Manage Issue Reports</h2>
                            {reports.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">No reports found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-800 text-gray-400">
                                                <th className="pb-3 font-medium">Status</th>
                                                <th className="pb-3 font-medium">User</th>
                                                <th className="pb-3 font-medium">Issue Type</th>
                                                <th className="pb-3 font-medium">Content</th>
                                                <th className="pb-3 font-medium">Date</th>
                                                <th className="pb-3 font-medium text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {reports.map((report) => (
                                                <tr key={report.id} className="text-gray-300 hover:bg-gray-800/50 transition-colors">
                                                    <td className="py-4">
                                                        <Badge variant={report.status === 'RESOLVED' ? 'default' : 'secondary'} className={report.status === 'RESOLVED' ? 'bg-green-600' : 'bg-yellow-600/20 text-yellow-500'}>
                                                            {report.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="font-medium">{report.user?.username || 'Unknown'}</div>
                                                        <div className="text-xs text-gray-500">{report.user?.email}</div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="font-medium">{report.issueType}</div>
                                                        {report.details && (
                                                            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={report.details}>
                                                                {report.details}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 font-medium text-[var(--theme-primary)] hover:underline">
                                                        <Link href={`/${report.contentType}/${report.contentId}`}>
                                                            {report.contentTitle || 'View Content'}
                                                        </Link>
                                                    </td>
                                                    <td className="py-4 text-xs text-gray-500">
                                                        {new Date(report.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {report.status === 'PENDING' && (
                                                                <Button size="sm" variant="outline" className="text-green-500 border-green-500/20 hover:bg-green-500/10" onClick={() => handleResolveReport(report.id)}>
                                                                    Resolve
                                                                </Button>
                                                            )}
                                                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDeleteReport(report.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Reviews Tab */}
                    <TabsContent value="reviews">
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h2 className="text-xl font-bold text-white mb-6">Manage User Reviews</h2>
                            {reviews.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">No reviews found.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="text-sm font-medium text-white">{review.user?.username || 'Unknown User'}</p>
                                                    <Link href={`/${review.contentType}/${review.contentId}`}>
                                                        <p className="text-xs text-[var(--theme-primary)] hover:underline truncate max-w-[150px]">
                                                            {review.contentTitle || 'View Content'}
                                                        </p>
                                                    </Link>
                                                </div>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-300 mb-4 line-clamp-3">"{review.comment}"</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                <Button size="sm" variant="ghost" className="h-auto py-1 px-2 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDeleteReview(review.id)}>
                                                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 max-w-2xl mx-auto">
                            <div className="text-center mb-6">
                                <Bell className="h-12 w-12 text-[var(--theme-primary)] mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-white">Broadcast Notification</h2>
                                <p className="text-sm text-gray-400 mt-2">Send an alert directly to a specific user's inbox, or omit the email address to broadcast the notification to ALL registered users globally.</p>
                            </div>

                            <form onSubmit={handleSendNotification} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Title <span className="text-red-500">*</span></label>
                                    <Input
                                        required
                                        value={notifTitle}
                                        onChange={e => setNotifTitle(e.target.value)}
                                        placeholder="E.g., Server Maintenance"
                                        className="bg-gray-950 border-gray-800 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Message <span className="text-red-500">*</span></label>
                                    <Textarea
                                        required
                                        value={notifMessage}
                                        onChange={e => setNotifMessage(e.target.value)}
                                        placeholder="Enter the notification message..."
                                        className="bg-gray-950 border-gray-800 text-white min-h-[100px]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Target User Email (Optional)</label>
                                    <Input
                                        type="email"
                                        value={notifEmail}
                                        onChange={e => setNotifEmail(e.target.value)}
                                        placeholder="Leave blank to broadcast to ALL users"
                                        className="bg-gray-950 border-gray-800 text-white"
                                    />
                                </div>
                                <div className="pt-4">
                                    <Button type="submit" disabled={isSendingNotif} className="w-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white">
                                        {isSendingNotif ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
                                        {notifEmail ? 'Send to User' : 'Broadcast to ALL Users'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </TabsContent>

                    {/* Ads Tab */}
                    <TabsContent value="ads">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Form */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-bold text-white mb-6">Create / Edit Popup Ad</h2>
                                <form onSubmit={handleSaveAd} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Photo URL <span className="text-red-500">*</span></label>
                                        <Input
                                            required
                                            value={adForm.imageUrl}
                                            onChange={e => setAdForm({ ...adForm, imageUrl: e.target.value })}
                                            placeholder="https://example.com/image.jpg"
                                            className="bg-gray-950 border-gray-800 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Click Link (Optional)</label>
                                        <Input
                                            value={adForm.link}
                                            onChange={e => setAdForm({ ...adForm, link: e.target.value })}
                                            placeholder="https://example.com"
                                            className="bg-gray-950 border-gray-800 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Frequency Per User</label>
                                        <select
                                            value={adForm.showCountPerDay}
                                            onChange={e => setAdForm({ ...adForm, showCountPerDay: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                                        >
                                            <option value="0">Every time site opens</option>
                                            <option value="1">1 time per day</option>
                                            <option value="2">2 times per day</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isActiveAd"
                                            checked={adForm.isActive}
                                            onChange={e => setAdForm({ ...adForm, isActive: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-800 bg-gray-950 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                                        />
                                        <label htmlFor="isActiveAd" className="text-sm font-medium text-gray-300">Active (Visible to users)</label>
                                    </div>
                                    <div className="pt-4 flex gap-2">
                                        <Button type="submit" disabled={isSavingAd} className="flex-1 bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white">
                                            {isSavingAd ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                            {adForm.id ? 'Update Advertisement' : 'Create Advertisement'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="border-gray-800 text-white hover:bg-gray-800"
                                            onClick={() => setAdForm({ id: '', imageUrl: '', link: '', showCountPerDay: '1', isActive: true })}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            {/* List */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-bold text-white mb-6">Existing Advertisements</h2>
                                {ads.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8">No ads found.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {ads.map((ad) => (
                                            <div key={ad.id} className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                                                <div className="flex gap-4">
                                                    <div className="w-24 h-24 bg-gray-900 rounded border border-gray-800 overflow-hidden flex-shrink-0">
                                                        <img src={ad.imageUrl} alt="Ad" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <Badge variant={ad.isActive ? 'default' : 'secondary'} className={ad.isActive ? 'bg-green-600' : 'bg-gray-700'}>
                                                                {ad.isActive ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                            <div className="flex gap-1">
                                                                <Button size="sm" variant="ghost" className="h-auto p-1 text-[var(--theme-primary)]" onClick={() => setAdForm({ ...ad, showCountPerDay: ad.showCountPerDay.toString() })}>
                                                                    Edit
                                                                </Button>
                                                                <Button size="sm" variant="ghost" className="h-auto p-1 text-red-500" onClick={() => handleDeleteAd(ad.id)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-300 truncate" title={ad.link}>Link: {ad.link || 'None'}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Frequency: {ad.showCountPerDay === 0 ? 'Every time' : `${ad.showCountPerDay}x per day`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
