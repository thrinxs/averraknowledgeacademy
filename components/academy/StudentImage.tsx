'use client'

import { useState } from 'react'

interface Props {
  src: string
  alt: string
  fallback?: string
}

export default function StudentImage({
  src,
  alt,
  fallback = '👦👧',
}: Props) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className="w-full h-full flex items-center
        justify-center text-6xl"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        {fallback}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover
      object-top transition-transform duration-700
      group-hover:scale-105"
      onError={() => setError(true)}
    />
  )
}
