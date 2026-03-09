"use client"

import React, { useState, useEffect } from 'react'
import { Star, Send, Loader2, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ReviewWithUser {
    id: string
    userId: string
    contentId: string
    contentType: string
    rating: number
    comment: string | null
    createdAt: string
    updatedAt: string
    user: {
        username: string
        avatar: string | null
    }
}

export default function ReviewSection({ contentId, contentType, contentTitle, contentPoster }: { contentId: string, contentType: 'movie' | 'series', contentTitle: string, contentPoster: string }) {
    const { user } = useAuth()
    const [reviews, setReviews] = useState<ReviewWithUser[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [ratingInput, setRatingInput] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [commentInput, setCommentInput] = useState('')

    const numericId = contentId.replace(`${contentType}-`, '')

    useEffect(() => {
        async function fetchReviews() {
            try {
                setLoading(true)
                const res = await fetch(`/api/reviews?contentId=${numericId}&contentType=${contentType}`)
                if (res.ok) {
                    const data = await res.json()
                    setReviews(data)
                    // If the logged-in user already has a review, pre-fill it
                    if (user) {
                        const myReview = data.find((r: ReviewWithUser) => r.user.username === user.username)
                        if (myReview) {
                            setRatingInput(myReview.rating)
                            setCommentInput(myReview.comment || '')
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to load reviews', err)
            } finally {
                setLoading(false)
            }
        }
        fetchReviews()
    }, [numericId, contentType, user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        if (ratingInput < 1 || ratingInput > 5) return

        setSubmitting(true)
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contentId: numericId,
                    contentType,
                    contentTitle,
                    contentPoster: contentPoster || '',
                    rating: ratingInput,
                    comment: commentInput
                })
            })

            if (res.ok) {
                // Optimistic UI update by refetching
                const freshRes = await fetch(`/api/reviews?contentId=${numericId}&contentType=${contentType}`)
                setReviews(await freshRes.json())
            }
        } catch (error) {
            console.error('Failed to submit review', error)
        } finally {
            setSubmitting(false)
        }
    }

    // Calculate average rating
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0

    return (
        <div className="py-8 border-t border-gray-800 mt-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Reviews & Ratings</h2>
                {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xl font-bold text-white">{avgRating}</span>
                        <span className="text-gray-400 text-sm">({reviews.length})</span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Review List */}
                    <div className="lg:col-span-2 space-y-6">
                        {reviews.length === 0 ? (
                            <div className="text-center py-12 bg-gray-900 rounded-lg">
                                <Star className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-400 text-lg">No reviews yet. Be the first!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-gray-900 rounded-lg p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={review.user.avatar || undefined} />
                                                <AvatarFallback className="bg-red-600 text-white">
                                                    {review.user.username.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-white font-medium">{review.user.username}</p>
                                                <p className="text-gray-500 text-xs">
                                                    {new Date(review.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Write Review Box */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-lg p-6 sticky top-24">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                {user ? 'Write a Review' : 'Log in to Review'}
                            </h3>

                            {!user ? (
                                <div className="text-center py-6">
                                    <UserIcon className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                                    <p className="text-gray-400 mb-4 text-sm">Join the community to share your thoughts.</p>
                                    <Button asChild className="w-full">
                                        <a href="/login">Log In</a>
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Rating</label>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRatingInput(star)}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`h-8 w-8 transition-colors ${(hoverRating || ratingInput) >= star
                                                            ? 'text-yellow-500 fill-yellow-500'
                                                            : 'text-gray-700'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Review (Optional)</label>
                                        <Textarea
                                            placeholder="What did you think about this?"
                                            className="bg-gray-800 border-gray-700 text-white min-h-[120px] resize-none focus:ring-red-500 focus:border-red-500"
                                            value={commentInput}
                                            onChange={(e) => setCommentInput(e.target.value)}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                                        disabled={submitting || ratingInput === 0}
                                    >
                                        {submitting ? (
                                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Submit Review
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
