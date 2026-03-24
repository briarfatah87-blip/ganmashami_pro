"use client"

import React, { useState, useEffect, useMemo, Suspense } from 'react'

// ... existing imports ...

function SeriesContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  // ... rest of the component logic ...
}

export default function SeriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    }>
      <SeriesContent />
    </Suspense>
  )
}
