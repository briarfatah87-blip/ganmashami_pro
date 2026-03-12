"use client"

import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/lib/language-context'

interface ReportIssueDialogProps {
    contentId: string
    contentType: 'movie' | 'series'
    contentTitle?: string
}

export function ReportIssueDialog({ contentId, contentType, contentTitle }: ReportIssueDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [issueType, setIssueType] = useState('Server not working')
    const [details, setDetails] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const { t } = useLanguage()

    const issueOptions = [
        t('serverNotWorking'),
        t('subtitleProblem'),
        t('soundProblem'),
        t('videoPlaybackIssue'),
        t('incorrectMetadata'),
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contentId,
                    contentType,
                    contentTitle,
                    issueType,
                    details
                }),
            })

            if (res.ok) {
                setIsSuccess(true)
                setTimeout(() => {
                    setIsOpen(false)
                    // Reset after closing
                    setTimeout(() => {
                        setIsSuccess(false)
                        setIssueType('Server not working')
                        setDetails('')
                    }, 500)
                }, 2000)
            } else {
                const errorData = await res.json().catch(() => ({}))
                alert(`Error: ${errorData.error || res.statusText || 'Unknown backend failure'}`)
            }
        } catch (error: any) {
            console.error('Error submitting report:', error)
            alert(`Network Error: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="xl">
                    <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                    {t('reportIssue')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl">{t('reportTitle')} {contentTitle ? `- ${contentTitle}` : ''}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {t('havingTroubleDesc')}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">{t('reportSubmitted')}!</h3>
                        <p className="text-gray-400 text-sm">
                            {t('reportSubmittedThankYou')}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t('reportType')}</label>
                            <select
                                value={issueType}
                                onChange={(e) => setIssueType(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-md p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em_1em]"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                            >
                                {issueOptions.map((option) => (
                                    <option key={option} value={option} className="bg-gray-900 text-white">
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                {t('additionalDetails')} <span className="text-gray-500 font-normal">({t('optional')})</span>
                            </label>
                            <Textarea
                                placeholder={t('describeTheProblem')}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="min-h-[100px] bg-gray-950 border-gray-800 resize-none focus-visible:ring-red-600"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('submitting') : t('submitReport')}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog >
    )
}
