'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  X,
  CheckCircle,
} from 'lucide-react'

interface RedirectOverlayProps {
  message: string
  subtitle: string
  redirectTo: string
  countdown?: number
  onStay?: () => void
}

export default function RedirectOverlay({
  message,
  subtitle,
  redirectTo,
  countdown: initialCountdown = 10,
  onStay,
}: RedirectOverlayProps) {
  const [count, setCount] = useState(initialCountdown)
  const [visible, setVisible] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!visible) return
    if (count <= 0) {
      router.push(redirectTo)
      return
    }

    const timer = setInterval(() => {
      setCount((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [count, visible, redirectTo, router])

  const handleGoNow = () => {
    setVisible(false)
    router.push(redirectTo)
  }

  const handleStay = () => {
    setVisible(false)
    if (onStay) onStay()
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex
      items-center justify-center"
      style={{ backgroundColor: 'rgba(6, 40, 80, 0.95)' }}
    >
      <div className="max-w-md w-full mx-4 text-center">

        {/* Logo */}
        <Image
          src="/footer-logo.png"
          alt="Averra Knowledge Academy"
          width={64}
          height={64}
          className="mx-auto mb-4 object-contain"
        />
        <p className="text-sm text-blue-300 mb-8">
          Averra Knowledge Academy
        </p>

        {/* Success Icon */}
        <div
          className="w-16 h-16 rounded-full flex
          items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
        >
          <CheckCircle
            className="w-8 h-8"
            style={{ color: '#22C55E' }}
          />
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {message}
        </h2>
        <p className="text-blue-200 text-sm mb-8">
          {subtitle}
        </p>

        {/* Countdown */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2
            px-5 py-2.5 rounded-full border
            border-white/20 bg-white/10
            backdrop-blur-sm"
          >
            <span className="text-blue-200 text-sm">
              Redirecting to your dashboard in
            </span>
            <span
              className="text-xl font-bold text-white
              min-w-[2ch] text-center"
            >
              {count}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto
        h-1.5 rounded-full overflow-hidden mb-8"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <div
            className="h-full rounded-full
            transition-all duration-1000 ease-linear"
            style={{
              width: `${
                ((initialCountdown - count) /
                  initialCountdown) *
                100
              }%`,
              backgroundColor: '#22C55E',
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row
        items-center justify-center gap-3">

          <Button
            onClick={handleGoNow}
            className="text-white font-semibold
            px-8 py-5 rounded-xl transition-all
            duration-300 hover:opacity-90
            hover:scale-105"
            style={{ backgroundColor: '#22C55E' }}
          >
            Go to Dashboard Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Button
            onClick={handleStay}
            variant="outline"
            className="border-2 border-white/30
            text-white bg-transparent px-8 py-5
            rounded-xl transition-all duration-300
            hover:bg-white/10 hover:border-white/50"
          >
                        <X className="w-4 h-4 mr-2" />
            Continue From Where You Stopped
          </Button>

        </div>

        <p className="text-xs text-blue-400 mt-6">
          You can always access your dashboard from
          the menu.
        </p>

      </div>
    </div>
  )
}