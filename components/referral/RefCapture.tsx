'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function RefCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      localStorage.setItem('averra_ref_code', ref)
      document.cookie = `averra_ref=${ref};path=/;max-age=2592000` // 30 days
    }
  }, [searchParams])

  return null
}
